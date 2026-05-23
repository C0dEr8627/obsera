import { useMemo } from 'react'
import ReactFlow, { Background, ReactFlowProvider, type NodeTypes } from 'reactflow'
import 'reactflow/dist/style.css'
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

const GraphCanvas = ({ graphNodes = [], graphEdges = [] }: GraphCanvasProps) => {
  const graphData = useMemo(() => {
    if (graphNodes.length === 0) {
      return sampleGraph
    }

    return mapDependencyGraphToReactFlow(graphNodes, graphEdges)
  }, [graphNodes, graphEdges])

  return (
    <ReactFlowProvider>
      <div className="h-full w-full overflow-hidden rounded-3xl border border-[#1B2A41] bg-[#08101F] shadow-[inset_0_0_0_1px_rgba(148,163,184,0.08)]">
        <ReactFlow
          nodes={graphData.nodes}
          edges={graphData.edges}
          nodeTypes={nodeTypes}
          fitView
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          panOnDrag
          minZoom={0.6}
          maxZoom={1.8}
          style={{ backgroundColor: '#070E1C' }}
          onInit={(instance) => instance.fitView({ padding: 0.14 })}
          attributionPosition="bottom-left"
        >
          <Background gap={24} size={1} color="rgba(148, 163, 184, 0.12)" />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  )
}

export default GraphCanvas
