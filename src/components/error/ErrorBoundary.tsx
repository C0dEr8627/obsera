import { Component, type ErrorInfo, type ReactNode } from 'react'
import ErrorFallback from './ErrorFallback'

interface ErrorBoundaryProps {
  children: ReactNode
  boundaryName?: string
  fallbackTitle?: string
  fallbackMessage?: string
  className?: string
  showReload?: boolean
  onError?: (error: Error, errorInfo: ErrorInfo, boundaryName: string) => void
}

interface ErrorBoundaryState {
  error: Error | null
}

const logErrorToDiagnostics = (
  error: Error,
  errorInfo: ErrorInfo,
  boundaryName: string,
) => {
  if (import.meta.env.DEV) {
    console.error(
      `[Obsera:${boundaryName}] rendering failure`,
      error,
      errorInfo,
    )
  }

  // Future hook: analytics logging, worker error tracing, and crash diagnostics.
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null,
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const boundaryName = this.props.boundaryName ?? 'workspace'

    logErrorToDiagnostics(error, errorInfo, boundaryName)
    this.props.onError?.(error, errorInfo, boundaryName)
  }

  handleRetry = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorFallback
          title={this.props.fallbackTitle}
          message={this.props.fallbackMessage}
          onRetry={this.handleRetry}
          showReload={this.props.showReload}
          className={this.props.className}
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
