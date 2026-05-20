import AppLayout from '@/layouts/AppLayout'
import { WorkspaceViewProvider } from '@/store'

function App() {
  return (
    <WorkspaceViewProvider>
      <AppLayout />
    </WorkspaceViewProvider>
  )
}

export default App