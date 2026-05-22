import type { StateCreator } from 'zustand'

export type ZipUploadStatus = 'idle' | 'dragging' | 'ready' | 'error'

export interface ZipUploadSlice {
  zipFileName: string | null
  zipFileSize: number | null
  zipUploadStatus: ZipUploadStatus
  zipUploadError: string | null
  setZipUploadDragging: () => void
  setZipUploadIdle: () => void
  acceptZipFile: (file: File) => void
  rejectZipFile: (message: string) => void
  resetZipUpload: () => void
}

export const createZipUploadSlice: StateCreator<
  ZipUploadSlice,
  [],
  [],
  ZipUploadSlice
> = (set) => ({
  zipFileName: null,
  zipFileSize: null,
  zipUploadStatus: 'idle',
  zipUploadError: null,
  setZipUploadDragging: () =>
    set({
      zipUploadStatus: 'dragging',
      zipUploadError: null,
    }),
  setZipUploadIdle: () =>
    set((state) => ({
      zipUploadStatus: state.zipFileName ? 'ready' : 'idle',
    })),
  acceptZipFile: (file) =>
    set({
      zipFileName: file.name,
      zipFileSize: file.size,
      zipUploadStatus: 'ready',
      zipUploadError: null,
    }),
  rejectZipFile: (message) =>
    set({
      zipFileName: null,
      zipFileSize: null,
      zipUploadStatus: 'error',
      zipUploadError: message,
    }),
  resetZipUpload: () =>
    set({
      zipFileName: null,
      zipFileSize: null,
      zipUploadStatus: 'idle',
      zipUploadError: null,
    }),
})
