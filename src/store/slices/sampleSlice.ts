import type { StateCreator } from 'zustand'

export interface SampleSlice {
  sampleCount: number
  incrementSampleCount: () => void
  resetSampleCount: () => void
}

export const createSampleSlice: StateCreator<SampleSlice, [], [], SampleSlice> = (set) => ({
  sampleCount: 0,
  incrementSampleCount: () => set((state) => ({ sampleCount: state.sampleCount + 1 })),
  resetSampleCount: () => set({ sampleCount: 0 }),
})
