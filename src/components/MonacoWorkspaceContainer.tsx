interface MonacoWorkspaceContainerProps {
  fileName: string
  filePath: string
  source: string
}

const MonacoWorkspaceContainer = ({ fileName, filePath, source }: MonacoWorkspaceContainerProps) => (
  <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-[#1E293B] bg-[#0B1020] shadow-inner shadow-black/40">
    <div className="flex h-10 shrink-0 items-center justify-between gap-4 border-b border-[#1E293B] bg-[#131D33] px-4 text-sm text-[#E6EAF5]">
      <div className="min-w-0">
        <p className="truncate font-medium">{fileName}</p>
        <p className="truncate text-[11px] text-[#7E8CAF]">{filePath}</p>
      </div>
      <span className="shrink-0 rounded bg-[#1E293B] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A6B0CF]">
        Preview
      </span>
    </div>

    <div
      className="relative min-h-[360px] flex-1 overflow-hidden bg-[#09101F]"
      data-editor-container="monaco"
      aria-label={`${fileName} editor preview`}
    >
      <div className="absolute inset-0 overflow-auto p-4 font-mono text-sm leading-6 text-[#CBD5E1]">
        <pre className="whitespace-pre-wrap break-words">{source}</pre>
      </div>
    </div>
  </div>
)

export default MonacoWorkspaceContainer
