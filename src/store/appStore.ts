import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSampleSlice, type SampleSlice } from './slices/sampleSlice'
import { createWorkspaceViewSlice, type WorkspaceViewSlice } from './slices/workspaceViewSlice'

export type AppStore = WorkspaceViewSlice & SampleSlice

export const useAppStore = create<AppStore>()(
  persist(
    (...store) => ({
      ...createWorkspaceViewSlice(...store),
      ...createSampleSlice(...store),
    }),
    {
      name: 'obsera.app-store',
      partialize: (state) => ({
        activeView: state.activeView,
      }),
    },
  ),
)
