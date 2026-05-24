import type { WorkerRequest, WorkerResponse } from './types/workerMessages'

type Pending = {
  resolve: (value: any) => void
  reject: (reason?: any) => void
  onProgress?: (payload: any) => void
  expectTypes?: string[]
}

const createWorker = () => {
  // Vite-compatible worker creation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Worker(new URL('./analysisWorker.ts', import.meta.url), { type: 'module' }) as Worker
}

const worker = createWorker()
const pending = new Map<string, Pending>()
let idCounter = 1

worker.onmessage = (ev: MessageEvent<WorkerResponse>) => {
  const msg = ev.data
  const p = pending.get(msg.id)
  if (!p) return

  if (msg.type === 'ERROR') {
    p.reject(msg.error ?? 'Worker error')
    pending.delete(msg.id)
    return
  }

  if (msg.type === 'PROGRESS') {
    if (p.onProgress) {
      p.onProgress(msg.payload)
    }
    return
  }

  // if expectTypes provided, only resolve when matching
  if (p.expectTypes && p.expectTypes.length > 0) {
    if (!p.expectTypes.includes(msg.type)) {
      return
    }
  }

  p.resolve(msg)
  pending.delete(msg.id)
}

worker.onerror = (err) => {
  // reject all pending
  for (const [, p] of pending.entries()) {
    p.reject(err)
  }
  pending.clear()
}

export const analyzeFiles = (
  files: Array<{ path: string; content?: string }>,
  onProgress?: (payload: any) => void,
) => {
  return new Promise<{ dependencyGraph: any; techStack: any }>((resolve, reject) => {
    const id = `w_${idCounter++}`
    pending.set(id, {
      resolve: (msg: WorkerResponse) => {
        resolve(msg.payload as any)
      },
      reject,
      onProgress,
      expectTypes: ['ANALYSIS_COMPLETE'],
    })

    const request: WorkerRequest = {
      id,
      type: 'START_ANALYSIS',
      payload: { files },
    }

    worker.postMessage(request)
  })
}

export const dependencyScan = (
  files: Array<{ path: string; content?: string }>,
  onProgress?: (payload: any) => void,
) => {
  return new Promise<{ scanResults: any[] }>((resolve, reject) => {
    const id = `w_${idCounter++}`
    pending.set(id, {
      resolve: (msg: WorkerResponse) => {
        resolve(msg.payload as any)
      },
      reject,
      onProgress,
      expectTypes: ['DEPENDENCY_SCAN_COMPLETE'],
    })

    const request: WorkerRequest = {
      id,
      type: 'START_DEPENDENCY_SCAN',
      payload: { files },
    }

    worker.postMessage(request)
  })
}

export const generateGraph = (
  files: Array<{ path: string; content?: string }>,
  onProgress?: (payload: any) => void,
) => {
  return new Promise<{ dependencyGraph: any }>((resolve, reject) => {
    const id = `w_${idCounter++}`
    pending.set(id, {
      resolve: (msg: WorkerResponse) => {
        resolve(msg.payload as any)
      },
      reject,
      onProgress,
      expectTypes: ['GRAPH_GENERATION_COMPLETE'],
    })

    const request: WorkerRequest = {
      id,
      type: 'START_GRAPH_GENERATION',
      payload: { files },
    }

    worker.postMessage(request)
  })
}

export const terminateWorker = () => {
  try {
    worker.terminate()
  } catch {}
}
