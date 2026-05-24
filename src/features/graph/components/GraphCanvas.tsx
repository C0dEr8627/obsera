import { useCallback, useMemo, useRef } from 'react'
import ReactFlow, {
  Background,
  ReactFlowProvider,
  type EdgeTypes,
  type NodeMouseHandler,
  type NodeTypes,
  type ReactFlowInstance,
} from 'reactflow'
import 'reactflow/dist/style.css'
import GraphEdge from './GraphEdge'
import GraphNode from './GraphNode'
import {
  createSampleGraph,
  mapDependencyGraphToReactFlow,
} from '../utils/graphUtils'
import { useDependencyGraph } from '@/store'
import type { DependencyGraphEdge, DependencyGraphNode } from '@/store'

const sampleGraph = createSampleGraph()

interface GraphCanvasProps {
  graphNodes?: DependencyGraphNode[]
  graphEdges?: DependencyGraphEdge[]
}

const nodeTypes: NodeTypes = {
  graphNode: GraphNode,
}

const edgeTypes: EdgeTypes = {
  dependencyEdge: GraphEdge,
}

const GraphCanvas = ({
  graphNodes = [],
  graphEdges = [],
}: GraphCanvasProps) => {
  const graphData = useMemo(() => {
    if (graphNodes.length === 0) {
      return sampleGraph
    }

    return mapDependencyGraphToReactFlow(graphNodes, graphEdges)
  }, [graphNodes, graphEdges])

  const { setSelectedGraphNodeId } = useDependencyGraph()
  const rfInstance = useRef<ReactFlowInstance | null>(null)

  const onInit = useCallback((instance: ReactFlowInstance) => {
    rfInstance.current = instance
    instance.fitView({ padding: 0.14 })
  }, [])

  const handleZoomIn = useCallback(() => rfInstance.current?.zoomIn?.(), [])
  const handleZoomOut = useCallback(() => rfInstance.current?.zoomOut?.(), [])
  const handleFitView = useCallback(
    () => rfInstance.current?.fitView?.({ padding: 0.14 }),
    [],
  )
  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_event, node) => {
      setSelectedGraphNodeId(node.id)
    },
    [setSelectedGraphNodeId],
  )

  const handlePaneClick = useCallback(() => {
    setSelectedGraphNodeId(null)
  }, [setSelectedGraphNodeId])

  return (
    <ReactFlowProvider>
      <div className="obsera-panel-in relative h-full w-full overflow-hidden rounded-lg border border-[#1B2A41] bg-[#08101F] shadow-[inset_0_0_0_1px_rgba(148,163,184,0.08)] transition-colors duration-200">
        <ReactFlow
          nodes={graphData.nodes}
          edges={graphData.edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          panOnScroll={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          panOnDrag={true}
          minZoom={0.25}
          maxZoom={2.5}
          style={{ backgroundColor: '#070E1C' }}
          onInit={onInit}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          attributionPosition="bottom-left"
          defaultEdgeOptions={{
            animated: true,
            type: 'dependencyEdge',
            style: { stroke: '#22d3ee', strokeWidth: 2 },
          }}
        >
          <Background gap={24} size={1} color="rgba(148, 163, 184, 0.12)" />
        </ReactFlow>

        <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
          <button
            type="button"
            aria-label="Zoom in"
            onClick={handleZoomIn}
            className="obsera-focus-ring rounded-md border border-[#213045] bg-[#0F172A]/80 px-2 py-1 text-xs font-medium text-[#D7DEEC] transition duration-150 hover:border-cyan-400/40 hover:bg-[#142B47] hover:text-white"
          >
            +
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={handleZoomOut}
            className="obsera-focus-ring rounded-md border border-[#213045] bg-[#0F172A]/80 px-2 py-1 text-xs font-medium text-[#D7DEEC] transition duration-150 hover:border-cyan-400/40 hover:bg-[#142B47] hover:text-white"
          >
            -
          </button>
          <button
            type="button"
            aria-label="Fit view"
            onClick={handleFitView}
            className="obsera-focus-ring rounded-md border border-[#213045] bg-[#0F172A]/80 px-2 py-1 text-xs font-medium text-[#D7DEEC] transition duration-150 hover:border-cyan-400/40 hover:bg-[#142B47] hover:text-white"
          >
            Fit
          </button>
        </div>
      </div>
    </ReactFlowProvider>
  )
}

export default GraphCanvas
