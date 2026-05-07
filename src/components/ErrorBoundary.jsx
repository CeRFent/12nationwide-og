import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D Scene Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-[#0F2A33] p-10 text-center">
          <h2 className="font-display text-4xl text-white mb-4">Something went wrong</h2>
          <p className="font-mono text-sm text-[#6E7C80] uppercase tracking-widest mb-8">
            The application encountered an unexpected error
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 border border-[#C4C9CC] text-[#F2F4F5] font-mono text-sm uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
