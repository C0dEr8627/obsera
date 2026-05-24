interface MonacoWorkspaceContainerProps {
  fileName: string
  filePath: string
  source: string | null
  emptyMessage: string
}

const MonacoWorkspaceContainer = ({
  fileName,
  filePath,
  source,
  emptyMessage,
}: MonacoWorkspaceContainerProps) => (
  <div className="obsera-panel-in flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-[var(--obsera-border)] bg-[var(--obsera-bg)] shadow-inner shadow-black/40 transition-colors duration-200">
    <div className="flex h-11 shrink-0 items-center justify-between gap-4 border-b border-[var(--obsera-border)] bg-[#131D33] px-4 text-sm text-[var(--obsera-text)]">
      <div className="min-w-0">
        <p className="truncate font-medium">{fileName}</p>
        <p className="truncate text-[11px] text-[#7E8CAF]">{filePath}</p>
      </div>
      <span className="obsera-chip shrink-0">Preview</span>
    </div>

    <div
      key={filePath}
      className="relative min-h-[360px] flex-1 overflow-hidden bg-[#09101F]"
      data-editor-container="monaco"
      aria-label={`${fileName} editor preview`}
    >
      {source !== null ? (
        <div className="obsera-fade-in absolute inset-0 overflow-auto p-4 font-mono text-sm leading-6 text-[#CBD5E1]">
          <pre className="whitespace-pre">{source}</pre>
        </div>
      ) : (
        <div className="obsera-fade-in absolute inset-0 flex items-center justify-center px-6 text-center">
          <p className="max-w-sm text-sm leading-6 text-[#8EA1C3]">
            {emptyMessage}
          </p>
        </div>
      )}
    </div>
  </div>
)

export default MonacoWorkspaceContainer
