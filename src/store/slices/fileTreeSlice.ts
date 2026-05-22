import type { StateCreator } from 'zustand'
import type { FileNode } from '@/types/fileNode'

export interface FileTreeSlice {
  fileTree: FileNode[]
  activeFileId: string | null
  setFileTree: (fileTree: FileNode[]) => void
  setActiveFileId: (fileId: string | null) => void
  resetFileTree: () => void
}

export const initialFileTree: FileNode[] = [
  {
    id: 'src',
    name: 'src',
    path: 'src',
    type: 'folder',
    children: [
      {
        id: 'src/components',
        name: 'components',
        path: 'src/components',
        type: 'folder',
        children: [
          {
            id: 'src/components/TopNavigation.tsx',
            name: 'TopNavigation.tsx',
            path: 'src/components/TopNavigation.tsx',
            type: 'file',
          },
        ],
      },
      {
        id: 'src/layouts',
        name: 'layouts',
        path: 'src/layouts',
        type: 'folder',
        children: [
          {
            id: 'src/layouts/AppLayout.tsx',
            name: 'AppLayout.tsx',
            path: 'src/layouts/AppLayout.tsx',
            type: 'file',
          },
          {
            id: 'src/layouts/CodeViewLayout.tsx',
            name: 'CodeViewLayout.tsx',
            path: 'src/layouts/CodeViewLayout.tsx',
            type: 'file',
          },
        ],
      },
      {
        id: 'src/store',
        name: 'store',
        path: 'src/store',
        type: 'folder',
        children: [
          {
            id: 'src/store/appStore.ts',
            name: 'appStore.ts',
            path: 'src/store/appStore.ts',
            type: 'file',
          },
          {
            id: 'src/store/index.ts',
            name: 'index.ts',
            path: 'src/store/index.ts',
            type: 'file',
          },
          {
            id: 'src/store/workspaceViewStore.ts',
            name: 'workspaceViewStore.ts',
            path: 'src/store/workspaceViewStore.ts',
            type: 'file',
          },
        ],
      },
      {
        id: 'src/App.tsx',
        name: 'App.tsx',
        path: 'src/App.tsx',
        type: 'file',
      },
      {
        id: 'src/main.tsx',
        name: 'main.tsx',
        path: 'src/main.tsx',
        type: 'file',
      },
    ],
  },
  {
    id: 'docs',
    name: 'docs',
    path: 'docs',
    type: 'folder',
    children: [
      {
        id: 'docs/design.md',
        name: 'design.md',
        path: 'docs/design.md',
        type: 'file',
      },
      {
        id: 'docs/requirements.md',
        name: 'requirements.md',
        path: 'docs/requirements.md',
        type: 'file',
      },
      {
        id: 'docs/workflow.md',
        name: 'workflow.md',
        path: 'docs/workflow.md',
        type: 'file',
      },
    ],
  },
  {
    id: 'package.json',
    name: 'package.json',
    path: 'package.json',
    type: 'file',
  },
]

export const initialActiveFileId = 'src/layouts/CodeViewLayout.tsx'

const includesFileNode = (nodes: FileNode[], fileId: string): boolean =>
  nodes.some((node) => {
    if (node.type === 'file') {
      return node.id === fileId
    }

    return includesFileNode(node.children, fileId)
  })

const findFirstFileId = (nodes: FileNode[]): string | null => {
  for (const node of nodes) {
    if (node.type === 'file') {
      return node.id
    }

    const childFileId = findFirstFileId(node.children)

    if (childFileId) {
      return childFileId
    }
  }

  return null
}

export const createFileTreeSlice: StateCreator<
  FileTreeSlice,
  [],
  [],
  FileTreeSlice
> = (set) => ({
  fileTree: initialFileTree,
  activeFileId: initialActiveFileId,
  setFileTree: (fileTree) =>
    set((state) => ({
      fileTree,
      activeFileId:
        state.activeFileId && includesFileNode(fileTree, state.activeFileId)
          ? state.activeFileId
          : findFirstFileId(fileTree),
    })),
  setActiveFileId: (fileId) =>
    set((state) => ({
      activeFileId:
        fileId && includesFileNode(state.fileTree, fileId) ? fileId : null,
    })),
  resetFileTree: () =>
    set({
      fileTree: initialFileTree,
      activeFileId: initialActiveFileId,
    }),
})

export type {
  FileTreeBaseNode,
  FileTreeFileNode,
  FileTreeFolderNode,
  FileTreeNode,
} from '@/types/fileNode'
