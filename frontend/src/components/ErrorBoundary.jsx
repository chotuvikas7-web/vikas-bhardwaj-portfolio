import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="container-pad py-10">
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
            <h1 className="text-xl font-bold">Frontend error</h1>
            <p className="mt-2">{this.state.error.message}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
