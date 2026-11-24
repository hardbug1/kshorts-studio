import React, { Component, type ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[React Fatal Error Caught]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white p-6 font-sans select-none">
          <div className="max-w-md w-full bg-slate-800 border border-red-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <span className="text-2xl">⚠️</span>
              <h2 className="text-lg font-bold">화면 렌더링 중 오류가 발생했습니다</h2>
            </div>
            <p className="text-xs text-slate-300">
              일시적인 컴포넌트 로드 오류입니다. 아래 버튼을 눌러 화면을 즉시 새로고침해주세요.
            </p>
            <div className="p-3 bg-black/50 rounded-xl text-[11px] font-mono text-red-300 max-h-36 overflow-y-auto break-all border border-red-900/30">
              {this.state.error?.message || '알 수 없는 오류'}
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-95"
              >
                🔄 화면 즉시 새로고침
              </button>
              <button
                onClick={() => {
                  // 실제 저장 키(kshorts_user 는 쓰이지 않는 키라 초기화가 아무 일도 안 했다)
                  localStorage.removeItem('kshorts_auth');
                  localStorage.removeItem('kshorts_tokens');
                  window.location.reload();
                }}
                className="py-2.5 px-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-medium text-slate-300 transition-all"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
