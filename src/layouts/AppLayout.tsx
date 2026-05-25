import TopNavigation from '@/components/TopNavigation'
import ZipUpload from '@/features/zip-upload/ZipUpload'
import { useAppStore, useWorkspaceView } from '@/store'
import CodeViewLayout from '@/layouts/CodeViewLayout'
import VisualViewLayout from '@/layouts/VisualViewLayout'
import ProcessingOverlay from '@/features/processing/components/ProcessingOverlay'
import TechStackCard from '@/features/tech-stack/components/TechStackCard'
import ErrorBoundary from '@/components/error/ErrorBoundary'

const AppLayout = () => {
  const { activeView, setActiveView } = useWorkspaceView()
  const isZipReady = useAppStore(
    (state) =>
      state.zipUploadStatus === 'ready' ||
      (state.zipUploadStatus === 'error' && state.zipFileCount !== null),
  )

  return (
    <div className="flex min-h-screen flex-col bg-[var(--obsera-bg)] text-[var(--obsera-text)]">
      <header className="flex shrink-0 flex-col gap-2 border-b border-[var(--obsera-border)] bg-[#121A33] px-4 py-3 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0">
        <h1 className="text-lg font-semibold tracking-wide">Obsera</h1>

        {isZipReady && (
          <TopNavigation activeView={activeView} onChange={setActiveView} />
        )}
      </header>

      <ProcessingOverlay />

      {isZipReady ? (
        <>
          <ZipUpload compact />
          <TechStackCard />
          <ErrorBoundary
            key={activeView}
            boundaryName={`${activeView}-workspace-layout`}
            fallbackMessage="Try reloading the project."
            className="rounded-none"
          >
            {activeView === 'code' ? <CodeViewLayout /> : <VisualViewLayout />}
          </ErrorBoundary>
        </>
      ) : (
        <ZipUpload />
      )}
    </div>
  )
}

export default AppLayout
