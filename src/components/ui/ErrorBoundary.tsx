import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.fallback) {
        return this.fallback;
      }
      return (
        <div className="p-4 m-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex flex-col gap-2">
          <span className="font-bold">An unexpected error occurred</span>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="self-start px-2 py-1 bg-red-600 text-white rounded text-xs font-semibold cursor-pointer"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }

  private get fallback(): ReactNode {
    return this.props.fallback;
  }
}
