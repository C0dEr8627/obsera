import type { StateCreator } from 'zustand'

export type WorkspaceView = 'code' | 'visual'

export interface WorkspaceViewSlice {
  activeView: WorkspaceView
  setActiveView: (view: WorkspaceView) => void
  toggleView: () => void
  zipFileName: string | null
  setZipFileName: (fileName: string | null) => void
}

export const createWorkspaceViewSlice: StateCreator<WorkspaceViewSlice, [], [], WorkspaceViewSlice> = (set) => ({
  activeView: 'code',
  setActiveView: (view) => set({ activeView: view }),
  toggleView: () =>
    set((state) => ({
      activeView: state.activeView === 'code' ? 'visual' : 'code',
    })),
  zipFileName: null,
  setZipFileName: (fileName) => set({ zipFileName: fileName }),
})
