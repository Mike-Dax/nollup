'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

// import './Counter.css'
class Counter extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            count: 0
        };
    }
    componentDidMount() {
        this.interval = window.setInterval(() => {
            this.setState({
                count: this.state.count + 1
            });
        }, 200);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        return React.createElement("div", { className: "Counter" },
            "Counter: ",
            this.state.count);
    }
}

const Internal = () => (React.createElement("div", null,
    React.createElement(Counter, null)));

// import './Switch.css'
class Switch extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: true
        };
        this.onClick = () => {
            this.setState({
                value: !this.state.value
            });
        };
    }
    render() {
        return (React.createElement("div", { className: "Switch", "data-active": this.state.value, onClick: this.onClick }, this.state.value ? 'On' : 'Off'));
    }
}

var HotManager = {
    register: function (moduleId) {
        this._moduleId = moduleId;
    },
    getRegistered: function () {
        return this._moduleId;
    }
};

//#endif
const App = () => (React.createElement("div", { className: "App" },
    React.createElement("h1", null, "Hello World"),
    React.createElement(Internal, null),
    React.createElement(Counter, null),
    React.createElement(Switch, null)));
//#if _DEBUG
HotManager.register(module.id);

let root = document.createElement('div');
document.body.appendChild(root);
let el = ReactDOM.render(React.createElement(App, null), root);
//#if _DEBUG
module.hot.accept(() => {
    let App$$1 = require(HotManager.getRegistered()).default;
    el = ReactDOM.render(React.createElement(App$$1, null), root);
});
//#endif
