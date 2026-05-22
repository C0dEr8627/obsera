export { useAppStore, type AppStore } from './appStore'
export { useFileTree, type FileTreeNode, type FileTreeState } from './fileTreeStore'
export { WorkspaceViewProvider } from './WorkspaceViewProvider'
export {
  createFileTreeSlice,
  initialActiveFileId,
  initialFileTree,
  type FileTreeBaseNode,
  type FileTreeFileNode,
  type FileTreeFolderNode,
  type FileTreeSlice,
} from './slices/fileTreeSlice'
export {
  createSampleSlice,
  type SampleSlice,
} from './slices/sampleSlice'
export {
  createWorkspaceViewSlice,
  type WorkspaceViewSlice,
} from './slices/workspaceViewSlice'
export { useWorkspaceView, type WorkspaceView, type WorkspaceViewState } from './workspaceViewStore'
