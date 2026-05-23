export interface InspectorModuleInfo {
  id: string
  name: string
  path: string
  fileType: string
  importCount: number
  exportCount: number
  importedModules: string[]
  importedByModules: string[]
  summary: string
  source: 'graph' | 'file'
}

export interface InspectorPanelProps {
  module: InspectorModuleInfo | null
}
