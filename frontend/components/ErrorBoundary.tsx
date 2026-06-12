import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
  stack?: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
    stack: '',
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Frontend render xatoligi:', error);
    this.setState({
      errorMessage: error?.message || 'Nomaʼlum xatolik',
      stack: errorInfo?.componentStack || error?.stack || '',
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
          <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">
            <h1 className="mb-3 text-2xl font-black text-slate-900">
              Sahifa yuklanmadi
            </h1>
            <p className="text-slate-600">
              Frontend render vaqtida xatolik yuz berdi. Sahifani yangilang.
              Muammo saqlansa, konsolda chiqqan xatoni tekshiring.
            </p>
            {this.state.errorMessage && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-left text-sm text-red-700">
                <p className="font-bold">Xatolik:</p>
                <p className="mt-2 break-words">{this.state.errorMessage}</p>
                {this.state.stack && (
                  <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-white p-3 text-xs text-slate-700">
                    {this.state.stack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
