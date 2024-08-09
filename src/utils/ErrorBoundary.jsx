import { Component } from 'react';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false }
    }

    static getDerivedStateFromErrors(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('An Error Occured: ', error, ', Error info: ', errorInfo);
    }

    render() {
        if(this.state.hasError) {
            return <h1>An Error Occured! Please try again later or try to refresh the page.</h1>
        }
        return this.props.children;
    }
}