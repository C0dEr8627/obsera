import { useState } from 'react'
import MonacoWorkspaceContainer from '@/components/MonacoWorkspaceContainer'

type FileTreeItem = {
  id: string
  label: string
  type: 'folder' | 'file'
  children?: FileTreeItem[]
}

const fileTree: FileTreeItem[] = [
  {
    id: 'src',
    label: 'src',
    type: 'folder',
    children: [
      {
        id: 'src/components',
        label: 'components',
        type: 'folder',
        children: [{ id: 'src/components/TopNavigation.tsx', label: 'TopNavigation.tsx', type: 'file' }],
      },
      {
        id: 'src/layouts',
        label: 'layouts',
        type: 'folder',
        children: [
          { id: 'src/layouts/AppLayout.tsx', label: 'AppLayout.tsx', type: 'file' },
          { id: 'src/layouts/CodeViewLayout.tsx', label: 'CodeViewLayout.tsx', type: 'file' },
        ],
      },
      {
        id: 'src/store',
        label: 'store',
        type: 'folder',
        children: [
          { id: 'src/store/index.ts', label: 'index.ts', type: 'file' },
          { id: 'src/store/workspaceViewStore.tsx', label: 'workspaceViewStore.tsx', type: 'file' },
        ],
      },
      { id: 'src/App.tsx', label: 'App.tsx', type: 'file' },
      { id: 'src/main.tsx', label: 'main.tsx', type: 'file' },
    ],
  },
  {
    id: 'docs',
    label: 'docs',
    type: 'folder',
    children: [
      { id: 'docs/design.md', label: 'design.md', type: 'file' },
      { id: 'docs/requirements.md', label: 'requirements.md', type: 'file' },
      { id: 'docs/workflow.md', label: 'workflow.md', type: 'file' },
    ],
  },
  { id: 'package.json', label: 'package.json', type: 'file' },
]

const initialExpandedFolders = new Set(['src', 'src/components', 'src/layouts'])

const editorPreviewSource = `// Obsera Code View
// Inspect project files and understand source structure in context.

function helloWorld() {
  console.log('Welcome to Obsera')
}

export default helloWorld
`

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

interface FileTreeNodeProps {
  item: FileTreeItem
  depth: number
  activeFileId: string
  expandedFolders: Set<string>
  onSelectFile: (id: string) => void
  onToggleFolder: (id: string) => void
}

const FileTreeNode = ({
  item,
  depth,
  activeFileId,
  expandedFolders,
  onSelectFile,
  onToggleFolder,
}: FileTreeNodeProps) => {
  const isFolder = item.type === 'folder'
  const isExpanded = expandedFolders.has(item.id)
  const isActive = item.id === activeFileId

  const handleClick = () => {
    if (isFolder) {
      onToggleFolder(item.id)
      return
    }

    onSelectFile(item.id)
  }

  return (
    <li>
      <button
        type="button"
        className={`flex h-7 w-full items-center gap-1.5 rounded px-2 text-left text-[13px] transition-colors duration-150 hover:bg-[#17203A] focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
          isActive ? 'bg-[#1D2B4F] text-white' : isFolder ? 'text-[#B6C5E6]' : 'text-[#D7DEEC]'
        }`}
        style={{ paddingLeft: `${0.5 + depth * 0.875}rem` }}
        aria-expanded={isFolder ? isExpanded : undefined}
        onClick={handleClick}
      >
        <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[10px] text-[#7E8CAF]">
          {isFolder ? (isExpanded ? 'v' : '>') : ''}
        </span>
        {isFolder ? <FolderIcon /> : <FileIcon />}
        <span className="min-w-0 truncate">{item.label}</span>
      </button>

      {isFolder && isExpanded && item.children && (
        <ul className="mt-0.5 space-y-0.5">
          {item.children.map((child) => (
            <FileTreeNode
              key={child.id}
              item={child}
              depth={depth + 1}
              activeFileId={activeFileId}
              expandedFolders={expandedFolders}
              onSelectFile={onSelectFile}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

// Helper function to recursively get all folder IDs from the file tree
const getAllFolderIds = (items: FileTreeItem[]): string[] => {
  const folderIds: string[] = []

  const traverse = (items: FileTreeItem[]) => {
    for (const item of items) {
      if (item.type === 'folder') {
        folderIds.push(item.id)
        if (item.children) {
          traverse(item.children)
        }
      }
    }
  }

  traverse(items)
  return folderIds
}

const CodeViewLayout = () => {
  const [expandedFolders, setExpandedFolders] = useState(initialExpandedFolders)
  const [activeFileId, setActiveFileId] = useState('src/layouts/CodeViewLayout.tsx')

  const activeFileName = activeFileId.split('/').at(-1) ?? activeFileId

  const toggleFolder = (id: string) => {
    setExpandedFolders((currentFolders) => {
      const nextFolders = new Set(currentFolders)

      if (nextFolders.has(id)) {
        nextFolders.delete(id)
      } else {
        nextFolders.add(id)
      }

      return nextFolders
    })
  }

  // Get all folder IDs and determine if all are collapsed
  const allFolderIds = getAllFolderIds(fileTree)
  const allFoldersCollapsed = allFolderIds.length === 0 || allFolderIds.every((id) => !expandedFolders.has(id))

  const expandAll = () => {
    const allFolders = new Set(allFolderIds)
    setExpandedFolders(allFolders)
  }

  const collapseAll = () => {
    setExpandedFolders(new Set())
  }

  const toggleAllFolders = () => {
    if (allFoldersCollapsed) {
      expandAll()
    } else {
      collapseAll()
    }
  }

  return (
    <main className="flex min-h-0 flex-1 overflow-hidden px-3 py-3 sm:px-5 sm:py-4">
      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
        <aside className="flex min-h-0 max-h-48 w-full shrink-0 flex-col rounded-lg border border-[#1E293B] bg-[#0F172A] shadow-[0_20px_45px_-30px_rgba(15,23,42,0.9)] lg:max-h-none lg:w-64">
          <div className="flex items-center justify-between gap-3">
            <div className="px-3 py-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#A6B0CF]">File Explorer</p>
              <p className="mt-1 text-xs text-[#8EA1C3]">Repository source tree</p>
            </div>
            <div className="mr-3 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleAllFolders}
                className="rounded bg-[#1E293B] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A6B0CF] transition-colors duration-150 hover:bg-[#2D3E52] hover:text-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-cyan-400"
                title={allFoldersCollapsed ? 'Expand all folders' : 'Collapse all folders'}
              >
                {allFoldersCollapsed ? 'Expand' : 'Collapse'}
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto border-t border-[#1E293B] bg-[#0B1020] px-2 py-2">
            <ul className="space-y-0.5 text-sm text-[#A6B0CF]">
              {fileTree.map((item) => (
                <FileTreeNode
                  key={item.id}
                  item={item}
                  depth={0}
                  activeFileId={activeFileId}
                  expandedFolders={expandedFolders}
                  onSelectFile={setActiveFileId}
                  onToggleFolder={toggleFolder}
                />
              ))}
            </ul>
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
            <MonacoWorkspaceContainer
              fileName={activeFileName}
              filePath={activeFileId}
              source={editorPreviewSource}
            />
          </div>
        </section>
      </div>
    </main>
  )
}

export default CodeViewLayout
