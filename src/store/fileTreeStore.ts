import { useAppStore } from './appStore'
import type { FileTreeNode } from '@/types/fileNode'
import type { FileTreeSlice as FileTreeState } from './slices/fileTreeSlice'

export const useFileTree = (): FileTreeState => ({
  fileTree: useAppStore((state) => state.fileTree),
  activeFileId: useAppStore((state) => state.activeFileId),
  setFileTree: useAppStore((state) => state.setFileTree),
  setActiveFileId: useAppStore((state) => state.setActiveFileId),
  resetFileTree: useAppStore((state) => state.resetFileTree),
})

export type { FileTreeNode, FileTreeState }
