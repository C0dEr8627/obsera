import type { StateCreator } from 'zustand'
import type { TechStackItem } from '@/features/tech-stack/types'

export interface TechStackSlice {
  zipTechStack: TechStackItem[]
  setZipTechStack: (items: TechStackItem[]) => void
  resetZipTechStack: () => void
}

export const createTechStackSlice: StateCreator<
  TechStackSlice,
  [],
  [],
  TechStackSlice
> = (set) => ({
  zipTechStack: [],
  setZipTechStack: (items) => set({ zipTechStack: items }),
  resetZipTechStack: () => set({ zipTechStack: [] }),
})
