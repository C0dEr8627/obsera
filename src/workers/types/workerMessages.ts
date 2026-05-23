export type WorkerRequestType =
  | 'START_ANALYSIS'
  | 'START_EXTRACTION'
  | 'START_GRAPH_GENERATION'

export type WorkerResponseType =
  | 'ANALYSIS_COMPLETE'
  | 'EXTRACTION_COMPLETE'
  | 'GRAPH_GENERATION_COMPLETE'
  | 'PROGRESS'
  | 'ERROR'

export interface WorkerRequest<T = any> {
  id: string
  type: WorkerRequestType
  payload?: T
}

export interface WorkerResponse<T = any> {
  id: string
  type: WorkerResponseType
  payload?: T
  error?: string
}
