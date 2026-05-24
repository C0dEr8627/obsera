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
      <div className="absolute inset-0 bg-black/60" />

      <div className="pointer-events-auto z-10 w-[min(92%,560px)] rounded-2xl border border-[#1E293B] bg-[#071021] p-5 shadow-lg">
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
                  className="mt-1 w-fit rounded border border-[#334155] bg-[#0F172A] px-3 py-2 text-xs font-semibold text-[#D7DEEC] transition hover:bg-[#162033] focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
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
