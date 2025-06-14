import "@/styles/globals.css";
import React from 'react';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    return this.state.hasError ? (
      <div>Map failed to load</div>
    ) : this.props.children;
  }
}