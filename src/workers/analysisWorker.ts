import type { WorkerRequest, WorkerResponse } from './types/workerMessages'
import { buildDependencyGraph } from '@/utils/dependencyGraphGenerator'
import { detectTechStack } from '@/features/tech-stack/utils/detectTechStack'

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
