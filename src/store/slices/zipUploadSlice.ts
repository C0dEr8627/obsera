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
  zipIgnoredFileCount: number | null
  zipSampleFileName: string | null
  zipUploadStatus: ZipUploadStatus
  zipUploadError: string | null
  setZipUploadDragging: () => void
  setZipUploadIdle: () => void
  setZipUploadValidating: (file: File) => void
  acceptZipFile: (
    file: File,
    fileCount: number,
    ignoredFileCount: number,
    sampleFileName: string | null,
  ) => void
  rejectZipFile: (
    message: string,
    previousUpload?: ZipUploadSnapshot | null,
  ) => void
  resetZipUpload: () => void
}

export interface ZipUploadSnapshot {
  zipFileName: string | null
  zipFileSize: number | null
  zipFileCount: number | null
  zipIgnoredFileCount: number | null
  zipSampleFileName: string | null
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
  zipIgnoredFileCount: null,
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
      zipIgnoredFileCount: null,
      zipSampleFileName: null,
      zipUploadStatus: 'validating',
      zipUploadError: null,
    }),
  acceptZipFile: (file, fileCount, ignoredFileCount, sampleFileName) =>
    set({
      zipFileName: file.name,
      zipFileSize: file.size,
      zipFileCount: fileCount,
      zipIgnoredFileCount: ignoredFileCount,
      zipSampleFileName: sampleFileName,
      zipUploadStatus: 'ready',
      zipUploadError: null,
    }),
  rejectZipFile: (message, previousUpload) =>
    set({
      zipFileName: previousUpload?.zipFileName ?? null,
      zipFileSize: previousUpload?.zipFileSize ?? null,
      zipFileCount: previousUpload?.zipFileCount ?? null,
      zipIgnoredFileCount: previousUpload?.zipIgnoredFileCount ?? null,
      zipSampleFileName: previousUpload?.zipSampleFileName ?? null,
      zipUploadStatus: 'error',
      zipUploadError: message,
    }),
  resetZipUpload: () =>
    set({
      zipFileName: null,
      zipFileSize: null,
      zipFileCount: null,
      zipIgnoredFileCount: null,
      zipSampleFileName: null,
      zipUploadStatus: 'idle',
      zipUploadError: null,
    }),
})
