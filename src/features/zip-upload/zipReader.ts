import JSZip from 'jszip'

export interface ZipReadSummary {
  fileCount: number
  sampleFileName: string | null
  sampleFileContent: string | null
}

export const readZipSummary = async (file: File): Promise<ZipReadSummary> => {
  const archive = await JSZip.loadAsync(file)
  const files = Object.values(archive.files).filter((entry) => !entry.dir)
  const sampleFile = files[0] ?? null

  return {
    fileCount: files.length,
    sampleFileName: sampleFile?.name ?? null,
    sampleFileContent: sampleFile ? await sampleFile.async('string') : null,
  }
}
