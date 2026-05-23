import type { ProcessingProgress } from '@/features/processing/types'

interface ProcessingLoaderProps {
  progress?: ProcessingProgress
  status?: 'idle' | 'running' | 'done' | 'error'
}

const ProcessingLoader = ({ progress, status = 'running' }: ProcessingLoaderProps) => {
  const percent = Math.max(0, Math.min(100, progress?.percent ?? 0))

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <div className="flex items-center justify-center">
        {status === 'running' ? (
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-t-cyan-300 border-slate-700" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-white">
            ✓
          </div>
        )}
      </div>

      <div className="w-full">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#94A3B8]">{progress?.message ?? (status === 'done' ? 'Complete' : 'Processing…')}</p>
          <p className="text-xs font-semibold text-white">{percent}%</p>
        </div>

        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#0B1020]">
          <div
            className="h-2 bg-cyan-400 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default ProcessingLoader
