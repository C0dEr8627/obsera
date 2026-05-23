import { useState } from 'react'
import { useDependencyGraph } from '@/store'

const VisualViewLayout = () => {
  const { graphNodes, graphEdges, selectedGraphNodeId, setSelectedGraphNodeId } = useDependencyGraph()
  const [scale, setScale] = useState(1)
  const selectedNode = graphNodes.find((node) => node.id === selectedGraphNodeId)

  const zoomIn = () => setScale((current) => Math.min(current + 0.1, 2))
  const zoomOut = () => setScale((current) => Math.max(current - 0.1, 0.5))
  const resetZoom = () => setScale(1)

  return (
    <main className="flex min-h-0 flex-1 overflow-hidden px-3 py-3 sm:px-5 sm:py-4">
      <section className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-[#1E293B] bg-[#0B1020] shadow-[0_24px_50px_-30px_rgba(0,0,0,0.7)]">
        <div className="shrink-0 border-b border-[#1E293B] bg-[#111827] px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">Visual Workspace</p>
              <p className="truncate text-xs text-[#94A3B8]">Project structure and dependency map</p>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-0">
              <span className="inline-flex items-center rounded bg-[#1E293B] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#A6B0CF]">
                {graphNodes.length} nodes / {graphEdges.length} edges
              </span>
              <div className="inline-flex items-center gap-2 rounded border border-[#2B3A55] bg-[#081E33] px-2 py-1">
                <button
                  type="button"
                  className="rounded border border-transparent bg-[#142B47] px-2 py-1 text-xs font-medium text-[#D7DEEC] transition hover:border-cyan-400 hover:text-white"
                  onClick={zoomOut}
                >
                  -
                </button>
                <button
                  type="button"
                  className="rounded border border-transparent bg-[#142B47] px-2 py-1 text-xs font-medium text-[#D7DEEC] transition hover:border-cyan-400 hover:text-white"
                  onClick={resetZoom}
                >
                  {Math.round(scale * 100)}%
                </button>
                <button
                  type="button"
                  className="rounded border border-transparent bg-[#142B47] px-2 py-1 text-xs font-medium text-[#D7DEEC] transition hover:border-cyan-400 hover:text-white"
                  onClick={zoomIn}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden p-3 sm:p-5">
          <div
            className="relative min-h-[420px] w-full flex-1 overflow-auto rounded-lg border border-[#1E293B] bg-[#080E1C] p-4"
            data-graph-container="dependency-map"
            aria-label="Dependency graph workspace"
          >
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(34, 211, 238, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.08) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,58,140,0.18),transparent_55%)]" />

            <div className="absolute left-4 top-4 rounded border border-[#1E293B] bg-[#0F172A]/90 px-3 py-2 text-xs text-[#A6B0CF] z-10">
              {selectedNode ? selectedNode.label : 'Dependency graph workspace'}
            </div>

            {graphNodes.length > 0 ? (
              <div className="relative h-full w-full overflow-auto pt-10">
                <div
                  className="relative min-h-full min-w-full"
                  style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
                >
                  <div className="grid gap-3 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                    {graphNodes.map((node) => {
                      const isSelected = node.id === selectedGraphNodeId

                      return (
                        <button
                          key={node.id}
                          type="button"
                          className={`w-full rounded border px-3 py-2 text-left text-xs font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                            isSelected
                              ? 'border-cyan-300 bg-cyan-300 text-[#08111F]'
                              : 'border-[#2B3A55] bg-[#0F172A] text-[#D7DEEC] hover:border-cyan-400'
                          }`}
                          onClick={() => setSelectedGraphNodeId(node.id)}
                        >
                          {node.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative flex h-full items-center justify-center">
                <div className="max-w-sm rounded border border-[#1E293B] bg-[#0F172A]/90 p-6 text-center">
                  <p className="text-sm font-medium text-[#E6EAF5]">No project graph loaded</p>
                  <p className="mt-1 text-xs leading-5 text-[#7E8CAF]">
                    The visualization canvas is ready for generated structure and dependency data.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default VisualViewLayout
