import "@/styles/globals.css";
import React from 'react';
import { AuthProvider } from '@/lib/auth-context';

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

export default function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ErrorBoundary>
  );
}
