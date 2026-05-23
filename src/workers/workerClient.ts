import type { WorkerRequest, WorkerResponse } from './types/workerMessages'

type Pending = {
  resolve: (value: any) => void
  reject: (reason?: any) => void
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
    // resolve progress notifications by calling resolve with partial? We'll pass progress updates via a callback in analyzeFiles
    // For now, attach to payload for caller polling by awaiting promise that resolves on complete
    // No-op here
    return
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

export const analyzeFiles = (files: Array<{ path: string; content?: string }>) => {
  return new Promise<{
    dependencyGraph: any
    techStack: any
  }>((resolve, reject) => {
    const id = `w_${idCounter++}`
    pending.set(id, {
      resolve: (msg: WorkerResponse) => {
        resolve(msg.payload as any)
      },
      reject,
    })

    const request: WorkerRequest = {
      id,
      type: 'START_ANALYSIS',
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
