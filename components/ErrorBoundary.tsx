import { Component, type ReactNode } from 'react';

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Catches render-time errors so a single broken component never blanks the
 * whole screen. Shows a friendly message instead of a black screen.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Unknown error' };
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="boot" style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, background: '#060a13' }}>
          <p style={{ margin: 0, fontSize: 13, letterSpacing: '.15em', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600 }}>
            إدارتنا الشاملة
          </p>
          <div style={{ color: '#fca5a5', fontSize: 13, maxWidth: 420, textAlign: 'center', lineHeight: 1.6, padding: '0 20px', fontFamily: 'system-ui, monospace' }}>
            حدث خطأ غير متوقع:<br />
            {this.state.message}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 8, padding: '8px 20px', borderRadius: 12, border: '1px solid rgba(201,169,106,.2)', background: 'rgba(201,169,106,.06)', color: '#c9a96a', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            إعادة المحاولة
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
