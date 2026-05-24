import TopNavigation from '@/components/TopNavigation'
import ZipUpload from '@/features/zip-upload/ZipUpload'
import { useAppStore, useWorkspaceView } from '@/store'
import CodeViewLayout from '@/layouts/CodeViewLayout'
import VisualViewLayout from '@/layouts/VisualViewLayout'
import ProcessingOverlay from '@/features/processing/components/ProcessingOverlay'
import TechStackCard from '@/features/tech-stack/components/TechStackCard'

const AppLayout = () => {
  const { activeView, setActiveView } = useWorkspaceView()
  const isZipReady = useAppStore((state) => state.zipUploadStatus === 'ready')

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0B1020] text-[#E6EAF5]">
      <header className="flex shrink-0 flex-col gap-2 border-b border-[#1E293B] bg-[#121A33] px-4 py-3 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0">
        <h1 className="text-lg font-semibold tracking-wide">Obsera</h1>

        <TopNavigation activeView={activeView} onChange={setActiveView} />
      </header>

      <ProcessingOverlay />

      {isZipReady ? (
        <>
          <ZipUpload compact />
          <TechStackCard />
          {activeView === 'code' ? <CodeViewLayout /> : <VisualViewLayout />}
        </>
      ) : (
        <ZipUpload />
      )}
    </div>
  )
}

export default AppLayout
