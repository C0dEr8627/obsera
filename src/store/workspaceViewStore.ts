import { useAppStore } from './appStore'
import type { WorkspaceView, WorkspaceViewSlice as WorkspaceViewState } from './slices/workspaceViewSlice'

export const useWorkspaceView = (): WorkspaceViewState =>
  ({
    activeView: useAppStore((state) => state.activeView),
    setActiveView: useAppStore((state) => state.setActiveView),
    toggleView: useAppStore((state) => state.toggleView),
    zipFileName: useAppStore((state) => state.zipFileName),
    setZipFileName: useAppStore((state) => state.setZipFileName),
  })

export type { WorkspaceView, WorkspaceViewState }
