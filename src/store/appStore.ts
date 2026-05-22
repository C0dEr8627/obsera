import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createFileTreeSlice, type FileTreeSlice } from './slices/fileTreeSlice'
import { createSampleSlice, type SampleSlice } from './slices/sampleSlice'
import { createWorkspaceViewSlice, type WorkspaceViewSlice } from './slices/workspaceViewSlice'

export type AppStore = WorkspaceViewSlice & SampleSlice & FileTreeSlice

export const useAppStore = create<AppStore>()(
  persist(
    (...store) => ({
      ...createWorkspaceViewSlice(...store),
      ...createSampleSlice(...store),
      ...createFileTreeSlice(...store),
    }),
    {
      name: 'obsera.app-store',
      partialize: (state) => ({
        activeView: state.activeView,
      }),
    },
  ),
)
