type FileTreeItem = {
  label: string
  depth: number
  type: 'folder' | 'file'
  isOpen?: boolean
  isActive?: boolean
}

const fileTree: FileTreeItem[] = [
  { label: 'src', depth: 0, type: 'folder', isOpen: true },
  { label: 'components', depth: 1, type: 'folder', isOpen: true },
  { label: 'TopNavigation.tsx', depth: 2, type: 'file' },
  { label: 'layouts', depth: 1, type: 'folder', isOpen: true },
  { label: 'AppLayout.tsx', depth: 2, type: 'file' },
  { label: 'CodeViewLayout.tsx', depth: 2, type: 'file', isActive: true },
  { label: 'App.tsx', depth: 1, type: 'file' },
]

const FolderIcon = () => (
  <svg className="h-4 w-4 shrink-0 text-[#6EA8FF]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M1.75 4.25A1.25 1.25 0 0 1 3 3h3.1l1.2 1.25H13A1.25 1.25 0 0 1 14.25 5.5v6A1.25 1.25 0 0 1 13 12.75H3a1.25 1.25 0 0 1-1.25-1.25V4.25Z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
  </svg>
)

const FileIcon = () => (
  <svg className="h-4 w-4 shrink-0 text-[#9AA8C7]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M4.25 2.25h5L12.75 6v7.75h-8.5V2.25Z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
    <path d="M9.25 2.5V6h3.25" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
  </svg>
)

const CodeViewLayout = () => (
  <main className="flex min-h-0 flex-1 overflow-hidden px-3 py-3 sm:px-5 sm:py-4">
    <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
      <aside className="flex min-h-0 max-h-48 w-full shrink-0 flex-col rounded-lg border border-[#1E293B] bg-[#0F172A] shadow-[0_20px_45px_-30px_rgba(15,23,42,0.9)] lg:max-h-none lg:w-64">
        <div className="flex items-center justify-between gap-3">
          <div className="px-3 py-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#A6B0CF]">File Explorer</p>
            <p className="mt-1 text-xs text-[#8EA1C3]">Repository source tree</p>
          </div>
          <span className="mr-3 rounded bg-[#1E293B] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A6B0CF]">
            Code
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-auto border-t border-[#1E293B] bg-[#0B1020] px-2 py-2">
          <div className="space-y-0.5 text-sm text-[#A6B0CF]">
            {fileTree.map((item) => (
              <div
                key={`${item.label}-${item.depth}`}
                className={`flex h-7 items-center gap-1.5 rounded px-2 text-[13px] transition-colors duration-150 hover:bg-[#17203A] ${
                  item.isActive
                    ? 'bg-[#1D2B4F] text-white'
                    : item.type === 'folder'
                      ? 'text-[#B6C5E6]'
                      : 'text-[#D7DEEC]'
                }`}
                style={{ paddingLeft: `${0.5 + item.depth * 0.875}rem` }}
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[10px] text-[#7E8CAF]">
                  {item.type === 'folder' ? (item.isOpen ? 'v' : '>') : ''}
                </span>
                {item.type === 'folder' ? <FolderIcon /> : <FileIcon />}
                <span className="min-w-0 truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#1E293B] bg-[#111827] shadow-[0_24px_50px_-30px_rgba(0,0,0,0.7)]">
        <div className="shrink-0 border-b border-[#1E293B] px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Editor Workspace</p>
              <p className="text-xs text-[#94A3B8]">Read-only source inspection</p>
            </div>
            <span className="mt-2 inline-flex items-center rounded bg-[#1E293B] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#A6B0CF] sm:mt-0">
              Read-only preview
            </span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden p-3 sm:p-5">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#1E293B] bg-[#0B1020] shadow-inner shadow-black/40">
            <div className="flex h-10 shrink-0 items-center border-b border-[#1E293B] bg-[#131D33] px-4 text-sm text-[#E6EAF5]">
              <span className="font-medium">README.md</span>
            </div>

            <div className="min-h-0 flex-1 overflow-auto bg-[#09101F] p-4 text-sm leading-6 text-[#CBD5E1]">
              <pre className="whitespace-pre-wrap break-words">
{`// Obsera Code View
// Inspect project files and understand source structure in context.

function helloWorld() {
  console.log('Welcome to Obsera')
}

export default helloWorld
`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
)

export default CodeViewLayout
