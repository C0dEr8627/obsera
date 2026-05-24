import AppLayout from '@/layouts/AppLayout'
import ErrorBoundary from '@/components/error/ErrorBoundary'
import { WorkspaceViewProvider } from '@/store'

function App() {
  return (
    <WorkspaceViewProvider>
      <ErrorBoundary
        boundaryName="app-shell"
        fallbackMessage="Try reloading the project."
        className="min-h-screen rounded-none"
      >
        <AppLayout />
      </ErrorBoundary>
    </WorkspaceViewProvider>
  )
}

export default App
