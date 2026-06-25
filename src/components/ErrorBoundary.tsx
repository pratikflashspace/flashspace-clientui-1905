import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.fallback) {
        return this.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-8">
              We encountered an unexpected error. Don't worry, our team has been notified.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 bg-[#2D3F33] text-white font-semibold py-3 px-6 rounded-2xl hover:bg-[#344C3D] transition-all shadow-md active:scale-95"
              >
                <RefreshCcw className="w-5 h-5" />
                Reload Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold py-3 px-6 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
              >
                <Home className="w-5 h-5" />
                Go to Homepage
              </button>
            </div>

            {this.state.error && (
              <div className="mt-6 text-left">
                <details className="bg-gray-100 p-4 rounded-xl text-sm overflow-auto">
                  <summary className="font-semibold text-gray-800 cursor-pointer">View Error Details</summary>
                  <pre className="mt-2 text-red-600 whitespace-pre-wrap break-words">
                    {this.state.error.toString()}
                  </pre>
                </details>
              </div>
            )}

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
