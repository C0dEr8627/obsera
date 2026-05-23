export interface ModuleSummaryInput {
  fileName: string
  filePath: string
  importCount: number
  exportCount: number
  importedModules: string[]
  importedByModules: string[]
  sourceCode?: string | null
}

export interface ModuleSummaryResult {
  summary: string
}
