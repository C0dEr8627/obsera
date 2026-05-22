import { createContext, useCallback, useContext, useEffect, useState, type PropsWithChildren } from 'react'

export type WorkspaceView = 'code' | 'visual'

export interface WorkspaceViewState {
  activeView: WorkspaceView
  setActiveView: (view: WorkspaceView) => void
  toggleView: () => void
  zipFileName: string | null
  setZipFileName: (fileName: string | null) => void
}

const STORAGE_KEY = 'obsera.activeWorkspaceView'

const isWorkspaceView = (value: unknown): value is WorkspaceView =>
  value === 'code' || value === 'visual'

const getInitialWorkspaceView = (): WorkspaceView => {
  if (typeof window === 'undefined') {
    return 'code'
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY)
  return isWorkspaceView(storedValue) ? storedValue : 'code'
}

const WorkspaceViewContext = createContext<WorkspaceViewState | undefined>(undefined)

export const WorkspaceViewProvider = ({ children }: PropsWithChildren) => {
  const [activeView, setActiveViewState] = useState<WorkspaceView>(getInitialWorkspaceView)
  const [zipFileName, setZipFileNameState] = useState<string | null>(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, activeView)
    } catch {
      // Ignore localStorage failures in private mode or restricted environments
    }
  }, [activeView])

  const setActiveView = useCallback((view: WorkspaceView) => {
    setActiveViewState(view)
  }, [])

  const toggleView = useCallback(() => {
    setActiveViewState((current) => (current === 'code' ? 'visual' : 'code'))
  }, [])

  const setZipFileName = useCallback((fileName: string | null) => {
    setZipFileNameState(fileName)
  }, [])

  return (
    <WorkspaceViewContext.Provider value={{ activeView, setActiveView, toggleView, zipFileName, setZipFileName }}>
      {children}
    </WorkspaceViewContext.Provider>
  )
}

export const useWorkspaceView = (): WorkspaceViewState => {
  const context = useContext(WorkspaceViewContext)
  if (!context) {
    throw new Error('useWorkspaceView must be used within WorkspaceViewProvider')
  }
  return context
}
