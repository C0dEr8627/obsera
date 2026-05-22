import { useDependencyGraph } from '@/store'

const VisualViewLayout = () => {
  const { graphNodes, graphEdges, selectedGraphNodeId, setSelectedGraphNodeId } = useDependencyGraph()
  const selectedNode = graphNodes.find((node) => node.id === selectedGraphNodeId)

  return (
    <main className="flex min-h-0 flex-1 overflow-hidden px-3 py-3 sm:px-5 sm:py-4">
      <section className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-[#1E293B] bg-[#0B1020] shadow-[0_24px_50px_-30px_rgba(0,0,0,0.7)]">
        <div className="shrink-0 border-b border-[#1E293B] bg-[#111827] px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">Visual Workspace</p>
              <p className="truncate text-xs text-[#94A3B8]">Project structure and dependency map</p>
            </div>
            <span className="mt-2 inline-flex items-center rounded bg-[#1E293B] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#A6B0CF] sm:mt-0">
              {graphNodes.length} nodes / {graphEdges.length} edges
            </span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden p-3 sm:p-5">
          <div
            className="relative min-h-[420px] w-full flex-1 overflow-hidden rounded-lg border border-[#1E293B] bg-[#080E1C]"
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

            <div className="absolute left-4 top-4 rounded border border-[#1E293B] bg-[#0F172A]/90 px-3 py-2 text-xs text-[#A6B0CF]">
              {selectedNode ? selectedNode.label : 'Dependency graph workspace'}
            </div>

            {graphNodes.length > 0 ? (
              <div className="absolute inset-x-6 top-1/2 mx-auto flex max-w-lg -translate-y-1/2 flex-wrap justify-center gap-3">
                {graphNodes.map((node) => {
                  const isSelected = node.id === selectedGraphNodeId

                  return (
                    <button
                      key={node.id}
                      type="button"
                      className={`rounded border px-3 py-2 text-xs font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
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
            ) : (
              <div className="absolute inset-x-6 top-1/2 mx-auto max-w-sm -translate-y-1/2 text-center">
                <p className="text-sm font-medium text-[#E6EAF5]">No project graph loaded</p>
                <p className="mt-1 text-xs leading-5 text-[#7E8CAF]">
                  The visualization canvas is ready for generated structure and dependency data.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default VisualViewLayout
