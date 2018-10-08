let node_resolve = require('rollup-plugin-node-resolve');
let style_link = require('./rollup-plugin-style-link');
let jscc = require('rollup-plugin-jscc');
let alias = require('rollup-plugin-alias');
let replace = require('rollup-plugin-replace');
let commonjs = require('rollup-plugin-commonjs');
let path = require('path');
let typescript = require('rollup-plugin-typescript');
// let buble = require('rollup-plugin-buble');

module.exports = {
    input: './src/main.tsx',
    experimentalCodeSplitting: true, // needed for asset emission
    output: {
        file: 'app._hash_.js',
        format: 'iife',
        assetFileNames: '[name][extname]'
    },
    plugins: [
        typescript(),
        commonjs(),
        alias({
            react: path.resolve(
                process.cwd(),
                'node_modules/react/cjs/react.development.js',
            ),
            "react-dom": path.resolve(
                process.cwd(),
                'node_modules/react-dom/cjs/react-dom.development.js',
            ),
        }),
        jscc({
            values: {
                _DEBUG: (process.env.NODE_ENV !== 'production')
            }
        }),
        replace({
          'process.env.NODE_ENV': JSON.stringify('development'),
          'commonjsHelpers.commonjsRequire': 'require',
        }),
        style_link(),
        /* buble({
            target: { node: 10 }
        }), */
        node_resolve()
    ]
}