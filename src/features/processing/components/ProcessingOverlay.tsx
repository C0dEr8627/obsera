import ProcessingLoader from './ProcessingLoader'
import ProcessingStageView from './ProcessingStageView'
import { useAppStore } from '@/store'

const ProcessingOverlay = () => {
  const stage = useAppStore((s) => s.stage)
  const status = useAppStore((s) => s.status)
  const progress = useAppStore((s) => s.progress)
  const error = useAppStore((s) => s.error)
  const resetProcessing = useAppStore((s) => s.resetProcessing)

  if (status === 'idle' || status === 'done') return null

  const isError = status === 'error' || stage === 'error'

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <div className="obsera-fade-in absolute inset-0 bg-black/55 backdrop-blur-[2px]" />

      <div className="obsera-panel-in pointer-events-auto z-10 w-[min(92%,560px)] rounded-lg border border-[#1E293B] bg-[#071021]/95 p-5 shadow-[0_24px_80px_-45px_rgba(0,0,0,0.95)] transition-shadow duration-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex w-full flex-col gap-3">
            <ProcessingStageView stage={stage} />
            {isError ? (
              <>
                <p className="text-xs text-rose-300">
                  {error ?? 'An error occurred during processing.'}
                </p>
                <button
                  type="button"
                  onClick={resetProcessing}
                  className="obsera-focus-ring mt-1 w-fit rounded-md border border-[#334155] bg-[#0F172A] px-3 py-2 text-xs font-semibold text-[#D7DEEC] transition duration-150 hover:border-cyan-400/40 hover:bg-[#162033] hover:text-white"
                >
                  Dismiss
                </button>
              </>
            ) : (
              <ProcessingLoader progress={progress} status={status} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProcessingOverlay
