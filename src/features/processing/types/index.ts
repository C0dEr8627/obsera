export type ProcessingStage =
  | 'idle'
  | 'uploading'
  | 'extracting'
  | 'parsing'
  | 'generatingGraph'
  | 'detectingTechStack'
  | 'completed'
  | 'error'

export type ProcessingStatus = 'idle' | 'running' | 'done' | 'error'

export interface ProcessingProgress {
  percent?: number // 0-100
  message?: string | null
}

export interface ProcessingState {
  stage: ProcessingStage
  status: ProcessingStatus
  progress?: ProcessingProgress
  error?: string | null
}
