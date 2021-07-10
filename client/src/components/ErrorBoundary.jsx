import React, { Component } from 'react';
import { add_error } from '../actions/ErrorAction';
import { connect } from 'react-redux';

class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      this.props.add_error(error.message);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong.</h1>;
      }
  
      return this.props.children; 
    }
}

const mapDispatchToProps = {
    add_error
}

export default connect(null, mapDispatchToProps)(ErrorBoundary);