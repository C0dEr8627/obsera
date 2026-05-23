import FileTreeSidebar from '@/components/FileTreeSidebar'
import MonacoWorkspaceContainer from '@/components/MonacoWorkspaceContainer'
import {
  useAppStore,
  useFileTree,
  type FileTreeNode as FileTreeItem,
} from '@/store'

const findFileNodeById = (
  items: FileTreeItem[],
  fileId: string | null,
): FileTreeItem | null => {
  if (!fileId) {
    return null
  }

  for (const item of items) {
    if (item.type === 'file' && item.id === fileId) {
      return item
    }

    if (item.type === 'folder') {
      const childMatch = findFileNodeById(item.children, fileId)

      if (childMatch) {
        return childMatch
      }
    }
  }

  return null
}

const CodeViewLayout = () => {
  const { fileTree, activeFileId, setActiveFileId } = useFileTree()
  const zipFileName = useAppStore((state) => state.zipFileName)

  const activeFile = findFileNodeById(fileTree, activeFileId)
  const activeFilePath = activeFile?.path ?? 'No file selected'
  const activeFileName = activeFile?.name ?? 'No file selected'
  const activeFileSource =
    activeFile?.type === 'file' && typeof activeFile.content === 'string'
      ? activeFile.content
      : null
  const editorEmptyMessage = activeFile
    ? 'This file is selected, but no readable text content is available for preview.'
    : 'Select a source file from the file tree to preview its contents.'

  return (
    <main className="flex min-h-0 flex-1 overflow-auto px-3 py-3 sm:px-5 sm:py-4">
      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
        <FileTreeSidebar
          title={zipFileName || 'File Explorer'}
          items={fileTree}
          activeFileId={activeFileId}
          onSelectFile={setActiveFileId}
        />

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#1E293B] bg-[#111827] shadow-[0_24px_50px_-30px_rgba(0,0,0,0.7)]">
          <div className="shrink-0 border-b border-[#1E293B] px-4 py-3 sm:px-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Editor Workspace
                </p>
                <p className="text-xs text-[#94A3B8]">
                  Read-only source inspection
                </p>
              </div>
              <span className="mt-2 inline-flex items-center rounded bg-[#1E293B] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#A6B0CF] sm:mt-0">
                Read-only preview
              </span>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 overflow-hidden p-3 sm:p-5">
            <MonacoWorkspaceContainer
              fileName={activeFileName}
              filePath={activeFilePath}
              source={activeFileSource}
              emptyMessage={editorEmptyMessage}
            />
          </div>
        </section>
      </div>
    </main>
  )
}

export default CodeViewLayout
