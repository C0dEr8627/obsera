import type { StateCreator } from 'zustand'
import type { ProcessingStage, ProcessingProgress } from '@/features/processing/types'

export interface ProcessingSlice {
  stage: ProcessingStage
  status: 'idle' | 'running' | 'done' | 'error'
  progress?: ProcessingProgress
  error?: string | null
  setStage: (stage: ProcessingStage, progress?: ProcessingProgress) => void
  setProgress: (progress: ProcessingProgress) => void
  setError: (message: string) => void
  resetProcessing: () => void
}

export const createProcessingSlice: StateCreator<
  ProcessingSlice,
  [],
  [],
  ProcessingSlice
> = (set) => ({
  stage: 'idle',
  status: 'idle',
  progress: undefined,
  error: null,
  setStage: (stage, progress) =>
    set((state) => ({
      stage,
      status: stage === 'idle' ? 'idle' : stage === 'completed' ? 'done' : stage === 'error' ? 'error' : 'running',
      progress: progress ?? state.progress,
      error: stage === 'error' ? state.error : null,
    })),
  setProgress: (progress) => set({ progress }),
  setError: (message) =>
    set({
      stage: 'error',
      status: 'error',
      error: message,
    }),
  resetProcessing: () =>
    set({
      stage: 'idle',
      status: 'idle',
      progress: undefined,
      error: null,
    }),
})
