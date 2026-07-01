import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-container" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
              <AlertCircle size={36} />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Something went wrong
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                An unexpected application error occurred. We have logged the error details, and you can try reloading the app.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-left max-h-40 overflow-y-auto">
                <p className="font-mono text-xs text-red-600 break-all whitespace-pre-wrap">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                id="reload-app-button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 bg-slate-900 text-white font-medium text-sm px-6 py-3 rounded-lg hover:bg-slate-800 active:scale-[0.98] transition"
              >
                <RefreshCw size={16} />
                Reload Application
              </button>
              
              <button
                id="go-home-button"
                onClick={() => {
                  window.location.href = "/";
                }}
                className="text-slate-500 border border-slate-200 font-medium text-sm px-6 py-3 rounded-lg hover:bg-slate-50 transition"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default ErrorBoundary;
