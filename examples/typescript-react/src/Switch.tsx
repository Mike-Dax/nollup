import * as React from 'react'

import './Switch.css'

export default class Switch extends React.Component {
    state = {
        value: true
    };

    onClick = () => {
        this.setState({
            value: !this.state.value
        });
    }

    render() {
        return (
            <div className="Switch" data-active={this.state.value} onClick={this.onClick}>
                {this.state.value? 'On' : 'Off'}
            </div>
        );

    }
}