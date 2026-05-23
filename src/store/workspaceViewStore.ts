import { useAppStore } from '@/store/appStore'
import type {
  WorkspaceView,
  WorkspaceViewSlice as WorkspaceViewState,
} from '@/store/slices/workspaceViewSlice'

export const useWorkspaceView = (): WorkspaceViewState => ({
  activeView: useAppStore((state) => state.activeView),
  setActiveView: useAppStore((state) => state.setActiveView),
  toggleView: useAppStore((state) => state.toggleView),
})

export type { WorkspaceView, WorkspaceViewState }
