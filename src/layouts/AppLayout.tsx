import { useState } from 'react'
import TopNavigation, { type WorkspaceView } from '@/components/TopNavigation'

const AppLayout = () => {
  const [activeView, setActiveView] = useState<WorkspaceView>('code')

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#E6EAF5]">
      <header className="h-14 border-b border-[#1E293B] bg-[#121A33] px-6 flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold tracking-wide">
          Obsera
        </h1>

        <TopNavigation activeView={activeView} onChange={setActiveView} />
      </header>

      <main className="h-[calc(100vh-56px)] flex items-center justify-center px-6">
        <div className="text-[#6B7390] text-sm text-center max-w-xl">
          {activeView === 'code' ? 'Code View is currently active.' : 'Visual View is currently active.'}
        </div>
      </main>
    </div>
  )
}

export default AppLayout