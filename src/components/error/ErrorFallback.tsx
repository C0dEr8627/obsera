interface ErrorFallbackProps {
  title?: string
  message?: string
  actionLabel?: string
  onRetry?: () => void
  showReload?: boolean
  className?: string
}

const ErrorFallback = ({
  title = 'Something went wrong while rendering the workspace.',
  message = 'Try reloading the project.',
  actionLabel = 'Try again',
  onRetry,
  showReload = true,
  className = '',
}: ErrorFallbackProps) => (
  <div
    role="alert"
    className={`flex min-h-[220px] w-full flex-1 items-center justify-center rounded-lg border border-[#243044] bg-[var(--obsera-bg)] p-5 text-[var(--obsera-text)] shadow-inner shadow-black/30 ${className}`}
  >
    <div className="obsera-surface-muted w-full max-w-md p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-rose-500/30 bg-rose-500/10 text-sm font-semibold text-rose-200">
          !
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 text-xs leading-5 text-[#94A3B8]">{message}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="obsera-focus-ring rounded-md border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
          >
            {actionLabel}
          </button>
        ) : null}
        {showReload ? (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="obsera-focus-ring rounded-md border border-[#334155] bg-[#0F172A] px-3 py-2 text-xs font-semibold text-[#D7DEEC] transition hover:bg-[#162033]"
          >
            Reload project
          </button>
        ) : null}
      </div>
    </div>
  </div>
)

export default ErrorFallback
