import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createDependencyGraphSlice,
  type DependencyGraphSlice,
} from '@/store/slices/dependencyGraphSlice'
import { createFileTreeSlice, type FileTreeSlice } from '@/store/slices/fileTreeSlice'
import { createSampleSlice, type SampleSlice } from '@/store/slices/sampleSlice'
import {
  createWorkspaceViewSlice,
  type WorkspaceViewSlice,
} from '@/store/slices/workspaceViewSlice'
import {
  createZipUploadSlice,
  type ZipUploadSlice,
} from '@/store/slices/zipUploadSlice'

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
