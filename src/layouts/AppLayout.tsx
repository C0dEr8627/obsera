import TopNavigation from '@/components/TopNavigation'
import { useWorkspaceView } from '@/store'
import CodeViewLayout from './CodeViewLayout'
import VisualViewLayout from './VisualViewLayout'

const AppLayout = () => {
  const { activeView, setActiveView } = useWorkspaceView()

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0B1020] text-[#E6EAF5]">
      <header className="flex shrink-0 flex-col gap-2 border-b border-[#1E293B] bg-[#121A33] px-4 py-3 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0">
        <h1 className="text-lg font-semibold tracking-wide">
          Obsera
        </h1>

        <TopNavigation activeView={activeView} onChange={setActiveView} />
      </header>

      {activeView === 'code' ? (
        <CodeViewLayout />
      ) : (
        <VisualViewLayout />
      )}
    </div>
  )
}

export default AppLayout
