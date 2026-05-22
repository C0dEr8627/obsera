import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createDependencyGraphSlice,
  type DependencyGraphSlice,
} from './slices/dependencyGraphSlice'
import { createFileTreeSlice, type FileTreeSlice } from './slices/fileTreeSlice'
import { createSampleSlice, type SampleSlice } from './slices/sampleSlice'
import {
  createWorkspaceViewSlice,
  type WorkspaceViewSlice,
} from './slices/workspaceViewSlice'
import {
  createZipUploadSlice,
  type ZipUploadSlice,
} from './slices/zipUploadSlice'

export type AppStore = WorkspaceViewSlice &
  SampleSlice &
  FileTreeSlice &
  DependencyGraphSlice &
  ZipUploadSlice

export const useAppStore = create<AppStore>()(
  persist(
    (...store) => ({
      ...createWorkspaceViewSlice(...store),
      ...createSampleSlice(...store),
      ...createFileTreeSlice(...store),
      ...createDependencyGraphSlice(...store),
      ...createZipUploadSlice(...store),
    }),
    {
      name: 'obsera.app-store',
      partialize: (state) => ({
        activeView: state.activeView,
      }),
    },
  ),
)
