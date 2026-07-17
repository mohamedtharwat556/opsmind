import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Error Boundary Component
 * يمسك الأخطاء غير المتوقعة ويعرضها بشكل آمن
 */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState(prev => ({
      error,
      errorInfo,
      errorCount: prev.errorCount + 1
    }));

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // يمكن إرسال الخطأ إلى خدمة تتبع الأخطاء
    this.reportError(error, errorInfo);
  }

  reportError = (error, errorInfo) => {
    // في المستقبل يمكنك إرسال هذا إلى Sentry أو خدمة مشابهة
    console.log('Reporting error:', {
      message: error.toString(),
      stack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
          padding: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '3rem 2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(220, 38, 38, 0.15)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <AlertTriangle size={32} color="#DC2626" />
            </div>

            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#7F1D1D',
              margin: '0 0 0.75rem'
            }}>
              حدث خطأ غير متوقع
            </h1>

            <p style={{
              color: '#991B1B',
              fontSize: '0.9375rem',
              margin: '0 0 1.5rem',
              lineHeight: 1.6
            }}>
              عذراً، حدث مشكلة أثناء محاولتنا تحميل هذه الصفحة. يرجى المحاولة مرة أخرى.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'right',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                <p style={{
                  fontWeight: 700,
                  color: '#991B1B',
                  fontSize: '0.875rem',
                  margin: '0 0 0.5rem'
                }}>
                  التفاصيل (وضع التطوير فقط):
                </p>
                <pre style={{
                  color: '#7F1D1D',
                  fontSize: '0.75rem',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexDirection: 'column'
            }}>
              <button
                onClick={this.handleReset}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '10px',
                  background: '#DC2626',
                  color: 'white',
                  border: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#B91C1C';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#DC2626';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <RefreshCw size={16} />
                محاولة مرة أخرى
              </button>

              <button
                onClick={this.handleReload}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '10px',
                  background: 'white',
                  color: '#DC2626',
                  border: '1px solid #FECACA',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#FEF2F2';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                <RefreshCw size={16} />
                إعادة تحميل الصفحة
              </button>

              <a
                href="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '10px',
                  background: '#F3F4F6',
                  color: '#374151',
                  textDecoration: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: 'none'
                }}
              >
                <Home size={16} />
                العودة للرئيسية
              </a>
            </div>

            <p style={{
              marginTop: '1.5rem',
              fontSize: '0.8rem',
              color: '#9CA3AF'
            }}>
              إذا استمرت المشكلة، يرجى الاتصال بفريق الدعم.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
