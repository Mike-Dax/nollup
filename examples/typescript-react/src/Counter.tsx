import * as React from 'react'

// import './Counter.css'

export default class Counter extends React.Component {
    state = {
        count: 0 
    };
    interval: number | undefined;

    componentDidMount() {
        this.interval = window.setInterval(() => {
            this.setState({
                count: this.state.count + 1
            })
        }, 200);
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        return <div className="Counter">Counter: {this.state.count}</div>
    }
}