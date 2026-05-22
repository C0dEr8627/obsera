import type { StateCreator } from 'zustand'

export type ZipUploadStatus =
  | 'idle'
  | 'dragging'
  | 'validating'
  | 'ready'
  | 'error'

export interface ZipUploadSlice {
  zipFileName: string | null
  zipFileSize: number | null
  zipFileCount: number | null
  zipSampleFileName: string | null
  zipUploadStatus: ZipUploadStatus
  zipUploadError: string | null
  setZipUploadDragging: () => void
  setZipUploadIdle: () => void
  setZipUploadValidating: (file: File) => void
  acceptZipFile: (
    file: File,
    fileCount: number,
    sampleFileName: string | null,
  ) => void
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
  zipFileCount: null,
  zipSampleFileName: null,
  zipUploadStatus: 'idle',
  zipUploadError: null,
  setZipUploadDragging: () =>
    set({
      zipUploadStatus: 'dragging',
      zipUploadError: null,
    }),
  setZipUploadIdle: () =>
    set((state) => ({
      zipUploadStatus: state.zipFileName ? state.zipUploadStatus : 'idle',
    })),
  setZipUploadValidating: (file) =>
    set({
      zipFileName: file.name,
      zipFileSize: file.size,
      zipFileCount: null,
      zipSampleFileName: null,
      zipUploadStatus: 'validating',
      zipUploadError: null,
    }),
  acceptZipFile: (file, fileCount, sampleFileName) =>
    set({
      zipFileName: file.name,
      zipFileSize: file.size,
      zipFileCount: fileCount,
      zipSampleFileName: sampleFileName,
      zipUploadStatus: 'ready',
      zipUploadError: null,
    }),
  rejectZipFile: (message) =>
    set({
      zipFileName: null,
      zipFileSize: null,
      zipFileCount: null,
      zipSampleFileName: null,
      zipUploadStatus: 'error',
      zipUploadError: message,
    }),
  resetZipUpload: () =>
    set({
      zipFileName: null,
      zipFileSize: null,
      zipFileCount: null,
      zipSampleFileName: null,
      zipUploadStatus: 'idle',
      zipUploadError: null,
    }),
})
