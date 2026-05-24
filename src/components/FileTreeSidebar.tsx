import { useMemo, useState } from 'react'
import type { FileNode } from '@/types/fileNode'

interface FileTreeSidebarProps {
  title: string
  items: FileNode[]
  activeFileId: string | null
  onSelectFile: (id: string) => void
}

interface FileTreeNodeProps {
  item: FileNode
  depth: number
  activeFileId: string | null
  expandedFolders: Set<string>
  onSelectFile: (id: string) => void
  onToggleFolder: (id: string, isExpanded: boolean) => void
}

const FolderIcon = () => (
  <svg
    className="h-4 w-4 shrink-0 text-[#6EA8FF]"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M1.75 4.25A1.25 1.25 0 0 1 3 3h3.1l1.2 1.25H13A1.25 1.25 0 0 1 14.25 5.5v6A1.25 1.25 0 0 1 13 12.75H3a1.25 1.25 0 0 1-1.25-1.25V4.25Z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
  </svg>
)

const FileIcon = () => (
  <svg
    className="h-4 w-4 shrink-0 text-[#9AA8C7]"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4.25 2.25h5L12.75 6v7.75h-8.5V2.25Z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
    <path
      d="M9.25 2.5V6h3.25"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
  </svg>
)

const getAllFolderIds = (items: FileNode[]): string[] => {
  const folderIds: string[] = []

  const traverse = (nodes: FileNode[]) => {
    for (const node of nodes) {
      if (node.type === 'folder') {
        folderIds.push(node.id)
        traverse(node.children)
      }
    }
  }

  traverse(items)
  return folderIds
}

const getActiveFileAncestorIds = (
  items: FileNode[],
  activeFileId: string | null,
) => {
  if (!activeFileId) {
    return []
  }

  const traverse = (
    nodes: FileNode[],
    ancestors: string[],
  ): string[] | null => {
    for (const node of nodes) {
      if (node.type === 'file' && node.id === activeFileId) {
        return ancestors
      }

      if (node.type === 'folder') {
        const match = traverse(node.children, [...ancestors, node.id])

        if (match) {
          return match
        }
      }
    }

    return null
  }

  return traverse(items, []) ?? []
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
      onToggleFolder(item.id, isExpanded)
      return
    }

    onSelectFile(item.id)
  }

  return (
    <li>
      <button
        type="button"
        className={`obsera-focus-ring flex h-7 w-full items-center gap-1.5 rounded-md px-2 text-left text-[13px] transition duration-150 hover:bg-[#17203A] hover:text-white ${
          isActive
            ? 'bg-[#1D2B4F] text-white'
            : isFolder
              ? 'text-[#B6C5E6]'
              : 'text-[#D7DEEC]'
        }`}
        style={{ paddingLeft: `${0.5 + depth * 0.875}rem` }}
        aria-current={isActive ? 'page' : undefined}
        aria-expanded={isFolder ? isExpanded : undefined}
        onClick={handleClick}
      >
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center text-[10px] text-[#7E8CAF] transition-transform duration-150 ${
            isFolder && isExpanded ? 'rotate-90' : ''
          }`}
        >
          {isFolder ? '>' : ''}
        </span>
        {isFolder ? <FolderIcon /> : <FileIcon />}
        <span className="min-w-0 truncate">{item.name}</span>
      </button>

      {isFolder && isExpanded && (
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

const FileTreeSidebar = ({
  title,
  items,
  activeFileId,
  onSelectFile,
}: FileTreeSidebarProps) => {
  const activeAncestorIds = useMemo(
    () => getActiveFileAncestorIds(items, activeFileId),
    [activeFileId, items],
  )
  const allFolderIds = useMemo(() => getAllFolderIds(items), [items])
  const [expandedFolders, setExpandedFolders] = useState(
    () => new Set(activeAncestorIds),
  )
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(
    () => new Set(),
  )
  const visibleExpandedFolders = useMemo(() => {
    const nextFolders = new Set(expandedFolders)

    activeAncestorIds.forEach((id) => nextFolders.add(id))
    collapsedFolders.forEach((id) => nextFolders.delete(id))

    return nextFolders
  }, [activeAncestorIds, collapsedFolders, expandedFolders])

  const allFoldersCollapsed =
    allFolderIds.length === 0 ||
    allFolderIds.every((id) => !visibleExpandedFolders.has(id))

  const toggleFolder = (id: string, isExpanded: boolean) => {
    setExpandedFolders((currentFolders) => {
      const nextFolders = new Set(currentFolders)

      if (isExpanded) {
        nextFolders.delete(id)
      } else {
        nextFolders.add(id)
      }

      return nextFolders
    })
    setCollapsedFolders((currentFolders) => {
      const nextFolders = new Set(currentFolders)

      if (isExpanded) {
        nextFolders.add(id)
      } else {
        nextFolders.delete(id)
      }

      return nextFolders
    })
  }

  const toggleAllFolders = () => {
    setExpandedFolders(allFoldersCollapsed ? new Set(allFolderIds) : new Set())
    setCollapsedFolders(allFoldersCollapsed ? new Set() : new Set(allFolderIds))
  }

  return (
    <aside className="obsera-panel-in obsera-surface flex max-h-72 w-full shrink-0 flex-col overflow-hidden transition-colors duration-200 lg:max-h-none lg:w-64">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 px-3 py-3">
          <p className="truncate text-sm font-semibold uppercase tracking-[0.24em] text-[#A6B0CF]">
            {title}
          </p>
          <p className="mt-1 text-xs text-[#8EA1C3]">Repository source tree</p>
        </div>
        <div className="mr-3 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleAllFolders}
            className="obsera-focus-ring rounded-md bg-[#1E293B] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A6B0CF] transition-colors duration-150 hover:bg-[#2D3E52] hover:text-[#CBD5E1]"
            title={
              allFoldersCollapsed
                ? 'Expand all folders'
                : 'Collapse all folders'
            }
          >
            {allFoldersCollapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto border-t border-[var(--obsera-border)] bg-[var(--obsera-bg)] px-2 py-2">
        {items.length > 0 ? (
          <ul className="space-y-0.5 text-sm text-[#A6B0CF]">
            {items.map((item) => (
              <FileTreeNode
                key={item.id}
                item={item}
                depth={0}
                activeFileId={activeFileId}
                expandedFolders={visibleExpandedFolders}
                onSelectFile={onSelectFile}
                onToggleFolder={toggleFolder}
              />
            ))}
          </ul>
        ) : (
          <div className="px-2 py-3 text-xs leading-5 text-[#7E8CAF]">
            No files loaded.
          </div>
        )}
      </div>
    </aside>
  )
}

export default FileTreeSidebar
