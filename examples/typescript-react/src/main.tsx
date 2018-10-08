import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import HotManager from './HotManager';

type thing = number

let root = document.createElement('div');
document.body.appendChild(root);
let el = ReactDOM.render(<App />, root);


//#if _DEBUG
(module as Module).hot!.accept(() => {
    let App = require(HotManager.getRegistered()).default;
    el = ReactDOM.render(<App />, root);
});
//#endif
