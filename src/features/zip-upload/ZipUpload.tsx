import { type ChangeEvent, type DragEvent, useRef } from 'react'
import { useAppStore } from '@/store'

const acceptedZipMimeTypes = new Set([
  'application/zip',
  'application/x-zip-compressed',
  'multipart/x-zip',
])

const formatFileSize = (sizeInBytes: number | null) => {
  if (sizeInBytes === null) {
    return ''
  }

  const sizeInMb = sizeInBytes / 1024 / 1024
  return `${sizeInMb.toFixed(sizeInMb >= 10 ? 0 : 1)} MB`
}

const isZipFile = (file: File) => {
  const hasZipName = file.name.toLowerCase().endsWith('.zip')
  const hasZipType = file.type === '' || acceptedZipMimeTypes.has(file.type)

  return hasZipName && hasZipType
}

interface ZipUploadProps {
  compact?: boolean
}

const ZipUpload = ({ compact = false }: ZipUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const zipFileName = useAppStore((state) => state.zipFileName)
  const zipFileSize = useAppStore((state) => state.zipFileSize)
  const zipUploadStatus = useAppStore((state) => state.zipUploadStatus)
  const zipUploadError = useAppStore((state) => state.zipUploadError)
  const acceptZipFile = useAppStore((state) => state.acceptZipFile)
  const rejectZipFile = useAppStore((state) => state.rejectZipFile)
  const setZipUploadDragging = useAppStore(
    (state) => state.setZipUploadDragging,
  )
  const setZipUploadIdle = useAppStore((state) => state.setZipUploadIdle)

  const uploadStatusText =
    zipUploadStatus === 'ready' && zipFileName
      ? `${zipFileName}${zipFileSize ? ` - ${formatFileSize(zipFileSize)}` : ''}`
      : zipUploadStatus === 'error'
        ? zipUploadError
        : zipUploadStatus === 'dragging'
          ? 'Release to select ZIP file'
          : 'No ZIP selected'

  const handleFile = (file: File | undefined) => {
    if (!file) {
      return
    }

    if (!isZipFile(file)) {
      rejectZipFile('Only .zip files are supported.')
      return
    }

    acceptZipFile(file)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0])
    event.target.value = ''
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    handleFile(event.dataTransfer.files[0])
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setZipUploadDragging()
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return
    }

    setZipUploadIdle()
  }

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  if (compact) {
    return (
      <div
        className="shrink-0 border-b border-[#1E293B] bg-[#0E162A] px-4 py-2 sm:px-6"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8EA1C3]">
              Project ZIP
            </p>
            <p
              className={`mt-0.5 truncate text-sm ${
                zipUploadStatus === 'error' ? 'text-rose-300' : 'text-[#E6EAF5]'
              }`}
            >
              {uploadStatusText}
            </p>
          </div>

          <button
            type="button"
            className="h-9 rounded-md border border-[#2D3A8C] bg-[#17203A] px-3 text-sm font-medium text-[#D7DEEC] transition-colors duration-150 hover:border-cyan-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            onClick={openFilePicker}
          >
            Replace ZIP
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".zip,application/zip"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    )
  }

  const isDragging = zipUploadStatus === 'dragging'
  const hasError = zipUploadStatus === 'error'

  return (
    <main className="flex min-h-0 flex-1 items-center justify-center overflow-auto px-4 py-6 sm:px-6">
      <section
        className={`flex w-full max-w-2xl flex-col items-center rounded-lg border border-dashed px-5 py-10 text-center transition-colors duration-150 sm:px-8 ${
          isDragging
            ? 'border-cyan-300 bg-[#10243A]'
            : hasError
              ? 'border-rose-400 bg-[#1B1322]'
              : 'border-[#2B3A55] bg-[#0F172A]'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-[#2B3A55] bg-[#121A33] text-[#22D3EE]">
          <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 16V4m0 0 4 4m-4-4-4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.75 14.75v2.5A2.75 2.75 0 0 0 7.5 20h9a2.75 2.75 0 0 0 2.75-2.75v-2.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="mt-5">
          <h2 className="text-xl font-semibold text-white">
            Upload project ZIP
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#A6B0CF]">
            Select a local ZIP file or drop it here to start exploring the
            project.
          </p>
        </div>

        <button
          type="button"
          className="mt-6 h-10 rounded-md bg-[#2D3A8C] px-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#3648AD] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0F172A]"
          onClick={openFilePicker}
        >
          Select ZIP
        </button>

        <p
          className={`mt-4 min-h-5 text-sm ${
            hasError
              ? 'text-rose-300'
              : isDragging
                ? 'text-cyan-200'
                : 'text-[#8EA1C3]'
          }`}
          role={hasError ? 'alert' : 'status'}
        >
          {uploadStatusText}
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".zip,application/zip"
          className="hidden"
          onChange={handleInputChange}
        />
      </section>
    </main>
  )
}

export default ZipUpload
