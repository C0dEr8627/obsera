export { useAppStore, type AppStore } from './appStore'
export {
  useDependencyGraph,
  type DependencyGraphEdge,
  type DependencyGraphNode,
  type DependencyGraphState,
} from './dependencyGraphStore'
export {
  useFileTree,
  type FileTreeNode,
  type FileTreeState,
} from './fileTreeStore'
export type {
  FileNode,
  FileNodeBase,
  FileNodeFile,
  FileNodeFolder,
  FileNodeMetadata,
  FileNodeType,
} from '@/types/fileNode'
export { WorkspaceViewProvider } from './WorkspaceViewProvider'
export {
  createDependencyGraphSlice,
  initialGraphEdges,
  initialGraphNodes,
  type DependencyGraphPosition,
  type DependencyGraphSlice,
} from './slices/dependencyGraphSlice'
export {
  createFileTreeSlice,
  initialActiveFileId,
  initialFileTree,
  type FileTreeBaseNode,
  type FileTreeFileNode,
  type FileTreeFolderNode,
  type FileTreeSlice,
} from './slices/fileTreeSlice'
export { createSampleSlice, type SampleSlice } from './slices/sampleSlice'
export {
  createWorkspaceViewSlice,
  type WorkspaceViewSlice,
} from './slices/workspaceViewSlice'
export {
  useWorkspaceView,
  type WorkspaceView,
  type WorkspaceViewState,
} from './workspaceViewStore'
export {
  createZipUploadSlice,
  type ZipUploadSlice,
  type ZipUploadStatus,
} from './slices/zipUploadSlice'
