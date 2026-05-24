import type { ProcessingProgress } from '@/features/processing/types'

interface ProcessingLoaderProps {
  progress?: ProcessingProgress
  status?: 'idle' | 'running' | 'done' | 'error'
}

const ProcessingLoader = ({
  progress,
  status = 'running',
}: ProcessingLoaderProps) => {
  const percent = Math.max(0, Math.min(100, progress?.percent ?? 0))
  const isRunning = status === 'running'

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <div className="relative flex h-12 w-12 items-center justify-center">
        {isRunning ? (
          <>
            <div className="obsera-pulse-ring absolute inset-0 rounded-full border border-cyan-300/30 bg-cyan-300/5" />
            <div className="h-9 w-9 animate-spin rounded-full border border-[#243044] border-t-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.16)]" />
            <div className="absolute h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.72)]" />
          </>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-500/15 text-sm font-semibold text-cyan-100">
            OK
          </div>
        )}
      </div>

      <div className="w-full">
        <div className="flex items-center justify-between gap-4">
          <p className="min-h-4 truncate text-xs text-[#94A3B8] transition-opacity duration-150">
            {progress?.message ??
              (status === 'done' ? 'Complete' : 'Processing...')}
          </p>
          <p className="text-xs font-semibold tabular-nums text-white transition-colors duration-150">
            {percent}%
          </p>
        </div>

        <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-[#1E293B] bg-[#0B1020]">
          <div
            className="obsera-progress-sheen relative h-full overflow-hidden rounded-full bg-gradient-to-r from-[#2D3A8C] via-cyan-400 to-[#6EA8FF] transition-[width] duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default ProcessingLoader
