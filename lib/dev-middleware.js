let nollup = require('./index');
let chokidar = require('chokidar');
let expressws = require('express-ws');
let fs = require('fs');
let url = require('url');

const MIME_TYPES = {
    'mjs': 'application/javascript',
    'js': 'application/javascript',
    'css': 'text/css'
};

module.exports = function (app, config, options) {
    expressws(app);
    let files = {};
    let sockets = [];

    if (options.hot) {
        nollup.__bundleHooks.add('module-init', function (instance) {
            instance.hot = {
                accept: function (callback) {
                    this._accept = callback;
                },

                dispose: function (callback) {
                    this._dispose = callback;
                }
            };
        });

        nollup.__bundleHooks.add('init', function (modules, instances) {
            var ws = new WebSocket('ws://' + window.location.host + '/__hmr');

            function invalidateParents (id) {
                return Object.keys(instances).filter(instancesId => {
                    return instances[instancesId].dependencies.indexOf(id) > -1;
                }).map(id => {
                    instances[id].invalidate = true;
                    return parseInt(id);
                });
            }

            function hmrDisposeCallback (id) {
                if (instances[id]) {
                    if (instances[id].hot._dispose) {
                        instances[id].hot._dispose();
                    }
                }
            }

            function hmrAcceptCallback (id) {
                if (instances[id]) {
                    instances[id].invalidate = true;

                    if (instances[id].hot._accept) {
                        instances[id].hot._accept();
                        return true;
                    }

                    return invalidateParents(id).some(id => {
                        return hmrAcceptCallback(id);
                    });
                }
            }

            ws.onmessage = function (e) {            
                let hot = JSON.parse(e.data);
                
                hot.changes.forEach(change => {
                    hmrDisposeCallback(change.id);

                    if (!change.removed) {
                        modules[change.id] = eval('(' + change.code + ')');
                        hmrAcceptCallback(change.id);
                    }
                });
            };
        });

        app.ws('/__hmr', (ws, req) => {
            sockets.push(ws);

            ws.on('close', () => {
                sockets.splice(sockets.indexOf(ws), 1);
            });
        });
    }

    function handleGeneratedBundle (response) {
        if (config.experimentalCodeSplitting) {
            let output = response.output;
            Object.keys(output).forEach(file => {
                files[file] = typeof output[file] === 'string'? output[file] : output[file].code;
            });
        } else {
            files[config.output.file] = response.code;
        }
        
        if (options.hot) {
            sockets.forEach(socket => {
                socket.send(JSON.stringify({ changes: response.changes }));
            });
        }

        console.log('\x1b[32m%s\x1b[0m', `Compiled in ${response.stats.time}ms.`);
    }

    async function compiler () {
        let bundle = await nollup(config);
        let watcher = chokidar.watch(options.watch);
        let watcherTimeout;

        const onChange = async (path) => {
            if (fs.lstatSync(path).isFile()) {
                files = {};
                bundle.invalidate(path);

                if (watcherTimeout) {
                    clearTimeout(watcherTimeout);
                }

                watcherTimeout = setTimeout(async () => {
                    handleGeneratedBundle(await bundle.generate());
                }, 100);
            }
        };

        watcher.on('add', onChange);
        watcher.on('change', onChange);

        handleGeneratedBundle(await bundle.generate());
    };

    compiler();

    return function (req, res, next) {
        let impl = () => {
            if (Object.keys(files).length === 0) {
                return setTimeout(impl, 1000);
            }

            let filename = url.parse(req.url).pathname.replace('/', '');
            if (files[filename]) {
                res.writeHead(200, {
                    'Content-Type': MIME_TYPES[filename.substring(filename.lastIndexOf('.') + 1)]
                });

                res.write(files[filename]);
                res.end();
            } else {
                next();
            }
        }

        impl();
    }
};