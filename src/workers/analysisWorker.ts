import type { WorkerRequest, WorkerResponse } from './types/workerMessages'
import { buildDependencyGraph } from '@/utils/dependencyGraphGenerator'
import { detectTechStack } from '@/features/tech-stack/utils/detectTechStack'
import { scanImports } from '@/utils/importScanner'

type FileItem = { path: string; content?: string }

const post = (msg: WorkerResponse) => {
  // @ts-ignore - self is WorkerGlobalScope
  self.postMessage(msg)
}

// handle incoming messages
// keep handlers small and robust; return structured responses
// NOTE: heavy lifting runs inside the worker to avoid UI thread blocking
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(self as any).onmessage = async (ev: MessageEvent<WorkerRequest>) => {
  const message = ev.data

  try {
    switch (message.type) {
      case 'START_DEPENDENCY_SCAN': {
        const files = (message.payload?.files ?? []) as FileItem[]

        post({ id: message.id, type: 'PROGRESS', payload: { percent: 10, message: 'Worker: received files for scanning' } })

        const scanResults = [] as Array<{ filePath: string; references: any[] }>

        for (let i = 0; i < files.length; i++) {
          const f = files[i]
          try {
            const res = scanImports(f.path, f.content ?? '')
            scanResults.push(res)
          } catch (err) {
            scanResults.push({ filePath: f.path, references: [] })
          }

          const pct = Math.round(10 + ((i + 1) / Math.max(1, files.length)) * 40) // up to 50%
          post({ id: message.id, type: 'PROGRESS', payload: { percent: pct, message: `Worker: scanning imports (${i + 1}/${files.length})` } })
        }

        post({ id: message.id, type: 'DEPENDENCY_SCAN_COMPLETE', payload: { scanResults } })
        break
      }

      case 'START_GRAPH_GENERATION': {
        const files = (message.payload?.files ?? []) as FileItem[]

        post({ id: message.id, type: 'PROGRESS', payload: { percent: 55, message: 'Worker: generating graph' } })

        const dependencyGraph = buildDependencyGraph(
          files.map((f) => ({ path: f.path, content: f.content ?? '' })),
        )

        post({ id: message.id, type: 'GRAPH_GENERATION_COMPLETE', payload: { dependencyGraph } })
        break
      }

      case 'START_ANALYSIS': {
        const files = (message.payload?.files ?? []) as FileItem[]

        post({ id: message.id, type: 'PROGRESS', payload: { percent: 10, message: 'Worker: received files' } })

        // Build dependency graph
        post({ id: message.id, type: 'PROGRESS', payload: { percent: 40, message: 'Worker: building graph' } })
        const dependencyGraph = buildDependencyGraph(
          files.map((f) => ({ path: f.path, content: f.content ?? '' })),
        )

        post({ id: message.id, type: 'PROGRESS', payload: { percent: 70, message: 'Worker: detecting tech stack' } })
        const techStack = detectTechStack(files as any)

        post({
          id: message.id,
          type: 'ANALYSIS_COMPLETE',
          payload: { dependencyGraph, techStack },
        })

        break
      }

      default:
        post({ id: message.id, type: 'ERROR', error: `Unhandled message type ${message.type}` })
        break
    }
  } catch (err) {
    post({ id: message.id, type: 'ERROR', error: String(err ?? 'Unknown worker error') })
  }
}
