import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  // FIX: Refactored to use a constructor for state initialization and method binding
  // to resolve issues where 'this.props' and 'this.setState' were inaccessible.
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
    this.handleReset = this.handleReset.bind(this);
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset() {
    if (this.props.onReset) {
      this.props.onReset();
      this.setState({ hasError: false });
    } else {
      window.location.reload();
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 bg-gray-800/50 border border-dashed border-red-500/50 rounded-lg my-8">
            <h3 className="text-xl font-semibold text-red-400">Something Went Wrong</h3>
            <p className="text-gray-400 max-w-sm">
                An unexpected error occurred during rendering.
            </p>
            <button
                onClick={this.handleReset}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors"
            >
                {this.props.onReset ? 'Start Over' : 'Reload Page'}
            </button>
        </div>
      );
    }

    return this.props.children;
  }
}
