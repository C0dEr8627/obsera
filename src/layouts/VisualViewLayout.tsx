import { useDependencyGraph } from '@/store'
import GraphCanvas from '@/features/graph/components/GraphCanvas'
import InspectorPanel from '@/features/inspector/components/InspectorPanel'
import ErrorBoundary from '@/components/error/ErrorBoundary'

const VisualViewLayout = () => {
  const { graphNodes, graphEdges, selectedGraphNodeId } = useDependencyGraph()
  const selectedNode = graphNodes.find(
    (node) => node.id === selectedGraphNodeId,
  )
  const nodeCount = graphNodes.length > 0 ? graphNodes.length : 3
  const edgeCount = graphEdges.length > 0 ? graphEdges.length : 2

  return (
    <main className="obsera-fade-in flex min-h-0 flex-1 overflow-auto px-3 py-3 sm:px-5 sm:py-4">
      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
        <section className="obsera-panel-in flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#1E293B] bg-[#0B1020] shadow-[0_24px_50px_-30px_rgba(0,0,0,0.7)] transition-colors duration-200">
          <div className="shrink-0 border-b border-[#1E293B] bg-[#111827] px-4 py-3 sm:px-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">
                  Visual Workspace
                </p>
                <p className="truncate text-xs text-[#94A3B8]">
                  Project structure and dependency map
                </p>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-0">
                <span className="inline-flex items-center rounded bg-[#1E293B] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#A6B0CF]">
                  {nodeCount} nodes / {edgeCount} edges
                </span>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 overflow-hidden p-3 sm:p-5">
            <div
              className="relative min-h-[420px] w-full flex-1 overflow-auto rounded-lg border border-[#1E293B] bg-[#080E1C] p-4 transition-colors duration-200"
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
                {selectedNode
                  ? selectedNode.label
                  : 'Dependency graph workspace'}
              </div>

              <div className="obsera-panel-in relative h-full w-full pt-10">
                <ErrorBoundary
                  key={`${graphNodes.length}-${graphEdges.length}`}
                  boundaryName="graph-workspace"
                  fallbackMessage="Try reloading the project."
                  className="min-h-[360px]"
                >
                  <GraphCanvas
                    graphNodes={graphNodes}
                    graphEdges={graphEdges}
                  />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </section>

        <div className="obsera-panel-in min-h-0 w-full max-w-sm shrink-0 lg:w-[360px]">
          <ErrorBoundary
            key={selectedGraphNodeId ?? 'file-inspector'}
            boundaryName="inspector-panel"
            fallbackMessage="Try selecting another module or reloading the project."
            className="min-h-[420px]"
          >
            <InspectorPanel />
          </ErrorBoundary>
        </div>
      </div>
    </main>
  )
}

export default VisualViewLayout
