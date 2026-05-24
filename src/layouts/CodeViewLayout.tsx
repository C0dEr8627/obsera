import FileTreeSidebar from '@/components/FileTreeSidebar'
import MonacoWorkspaceContainer from '@/components/MonacoWorkspaceContainer'
import ErrorBoundary from '@/components/error/ErrorBoundary'
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
    <main className="obsera-fade-in w-full px-3 py-3 sm:px-5 sm:py-4">
      <div className="flex w-full flex-col gap-3 xl:gap-4 lg:flex-row">
        <FileTreeSidebar
          title={zipFileName || 'File Explorer'}
          items={fileTree}
          activeFileId={activeFileId}
          onSelectFile={setActiveFileId}
        />

        <section className="obsera-panel-in obsera-surface flex min-h-0 flex-1 flex-col overflow-hidden transition-colors duration-200">
          <div className="obsera-panel-header shrink-0 px-4 py-3 sm:px-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Editor Workspace
                </p>
                <p className="text-xs text-[#94A3B8]">
                  Read-only source inspection
                </p>
              </div>
              <span className="obsera-chip mt-2 sm:mt-0">
                Read-only preview
              </span>
            </div>
          </div>

          <div className="flex flex-1 p-3 sm:p-5">
            <ErrorBoundary
              key={activeFileId ?? 'empty-editor'}
              boundaryName="code-viewer"
              fallbackMessage="Try selecting the file again or reloading the project."
              className="min-h-[360px]"
            >
              <MonacoWorkspaceContainer
                fileName={activeFileName}
                filePath={activeFilePath}
                source={activeFileSource}
                emptyMessage={editorEmptyMessage}
              />
            </ErrorBoundary>
          </div>
        </section>
      </div>
    </main>
  )
}

export default CodeViewLayout
