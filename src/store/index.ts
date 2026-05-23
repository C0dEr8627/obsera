export { useAppStore, type AppStore } from '@/store/appStore'
export {
  useDependencyGraph,
  type DependencyGraphEdge,
  type DependencyGraphNode,
  type DependencyGraphState,
} from '@/store/dependencyGraphStore'
export {
  useFileTree,
  type FileTreeNode,
  type FileTreeState,
} from '@/store/fileTreeStore'
export type {
  FileNode,
  FileNodeBase,
  FileNodeFile,
  FileNodeFolder,
  FileNodeMetadata,
  FileNodeType,
} from '@/types/fileNode'
export { WorkspaceViewProvider } from '@/store/WorkspaceViewProvider'
export {
  createDependencyGraphSlice,
  initialGraphEdges,
  initialGraphNodes,
  type DependencyGraphPosition,
  type DependencyGraphSlice,
} from '@/store/slices/dependencyGraphSlice'
export {
  createFileTreeSlice,
  initialActiveFileId,
  initialFileTree,
  type FileTreeBaseNode,
  type FileTreeFileNode,
  type FileTreeFolderNode,
  type FileTreeSlice,
} from '@/store/slices/fileTreeSlice'
export { createSampleSlice, type SampleSlice } from '@/store/slices/sampleSlice'
export {
  createWorkspaceViewSlice,
  type WorkspaceViewSlice,
} from '@/store/slices/workspaceViewSlice'
export {
  useWorkspaceView,
  type WorkspaceView,
  type WorkspaceViewState,
} from '@/store/workspaceViewStore'
export {
  createZipUploadSlice,
  type ZipUploadSlice,
  type ZipUploadStatus,
} from '@/store/slices/zipUploadSlice'
