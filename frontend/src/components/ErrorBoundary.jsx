import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ color: '#ef4444' }}>Oops! Terjadi Kesalahan</h1>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            Aplikasi mengalami error. Silakan refresh halaman atau hubungi administrator.
          </p>
          
          <details style={{ 
            background: '#f3f4f6', 
            padding: '20px', 
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
              Detail Error (untuk developer)
            </summary>
            <pre style={{ 
              overflow: 'auto', 
              fontSize: '12px',
              background: '#1f2937',
              color: '#f9fafb',
              padding: '15px',
              borderRadius: '4px',
              marginTop: '10px'
            }}>
              {this.state.error && this.state.error.toString()}
              {'\n\n'}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>

          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#4b5563',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Refresh Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
