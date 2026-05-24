import { useState } from 'react'
import AppLayout from '@/layouts/AppLayout'
import ErrorBoundary from '@/components/error/ErrorBoundary'
import LandingPage from '@/features/landing/pages/LandingPage'
import { WorkspaceViewProvider } from '@/store'

function App() {
  const [hasEnteredApp, setHasEnteredApp] = useState(false)

  return (
    <WorkspaceViewProvider>
      <ErrorBoundary
        boundaryName="app-shell"
        fallbackMessage="Try reloading the project."
        className="min-h-screen rounded-none"
      >
        {hasEnteredApp ? (
          <AppLayout />
        ) : (
          <LandingPage onStartUpload={() => setHasEnteredApp(true)} />
        )}
      </ErrorBoundary>
    </WorkspaceViewProvider>
  )
}

export default App
