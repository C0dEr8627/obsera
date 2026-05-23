import { useMemo, useRef, useCallback } from 'react'
import ReactFlow, {
  Background,
  ReactFlowProvider,
  type EdgeTypes,
  type NodeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'
import GraphEdge from './GraphEdge'
import GraphNode from './GraphNode'
import { createSampleGraph, mapDependencyGraphToReactFlow } from '../utils/graphUtils'
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

const GraphCanvas = ({ graphNodes = [], graphEdges = [] }: GraphCanvasProps) => {
  const graphData = useMemo(() => {
    if (graphNodes.length === 0) {
      return sampleGraph
    }

    return mapDependencyGraphToReactFlow(graphNodes, graphEdges)
  }, [graphNodes, graphEdges])

  const rfInstance = useRef<any | null>(null)

  const onInit = useCallback((instance: any) => {
    rfInstance.current = instance
    instance.fitView({ padding: 0.14 })
  }, [])

  const handleZoomIn = useCallback(() => rfInstance.current?.zoomIn?.(), [])
  const handleZoomOut = useCallback(() => rfInstance.current?.zoomOut?.(), [])
  const handleFitView = useCallback(() => rfInstance.current?.fitView?.({ padding: 0.14 }), [])

  return (
    <ReactFlowProvider>
      <div className="h-full w-full overflow-hidden rounded-3xl border border-[#1B2A41] bg-[#08101F] shadow-[inset_0_0_0_1px_rgba(148,163,184,0.08)] relative">
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
            className="rounded border border-[#213045] bg-[#0F172A]/80 px-2 py-1 text-xs font-medium text-[#D7DEEC] hover:bg-[#142B47]"
          >
            +
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={handleZoomOut}
            className="rounded border border-[#213045] bg-[#0F172A]/80 px-2 py-1 text-xs font-medium text-[#D7DEEC] hover:bg-[#142B47]"
          >
            −
          </button>
          <button
            type="button"
            aria-label="Fit view"
            onClick={handleFitView}
            className="rounded border border-[#213045] bg-[#0F172A]/80 px-2 py-1 text-xs font-medium text-[#D7DEEC] hover:bg-[#142B47]"
          >
            ⤢
          </button>
        </div>
      </div>
    </ReactFlowProvider>
  )
}

export default GraphCanvas
