import { useCallback, useEffect, useRef, useState } from 'react'
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
  canvasSize?: { width: number; height: number }
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
  canvasSize = { width: 1600, height: 1000 },
}: GraphCanvasProps) => {
  const [isLayouting, setIsLayouting] = useState(false)
  const [graphData, setGraphData] = useState(sampleGraph)
  const { setSelectedGraphNodeId } = useDependencyGraph()
  const rfInstance = useRef<ReactFlowInstance | null>(null)

  // Calculate layout when nodes/edges change
  useEffect(() => {
    const calculateLayout = async () => {
      if (graphNodes.length === 0) {
        setGraphData(sampleGraph)
        return
      }

      setIsLayouting(true)
      try {
        const layoutedData = await mapDependencyGraphToReactFlow(
          graphNodes,
          graphEdges,
          canvasSize,
        )
        setGraphData(layoutedData)
      } catch (error) {
        console.error('Failed to calculate layout:', error)
      } finally {
        setIsLayouting(false)
      }
    }

    calculateLayout()
  }, [graphNodes, graphEdges, canvasSize?.width, canvasSize?.height])

  const onInit = useCallback((instance: ReactFlowInstance) => {
    rfInstance.current = instance
    // Delay fit view to allow for proper rendering
    setTimeout(() => {
      instance.fitView({ padding: 0.1 })
    }, 100)
  }, [])

  const handleZoomIn = useCallback(() => rfInstance.current?.zoomIn?.(), [])
  const handleZoomOut = useCallback(() => rfInstance.current?.zoomOut?.(), [])

  const handleResetView = useCallback(
    () => rfInstance.current?.fitView?.({ padding: 0.1 }),
    [],
  )

  const handleRelayout = useCallback(() => {
    setIsLayouting(true)
    // Trigger a re-layout by changing state
    setTimeout(() => {
      setIsLayouting(false)
      rfInstance.current?.fitView?.({ padding: 0.1 })
    }, 300)
  }, [])

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
        {/* Loading indicator */}
        {isLayouting && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-400" />
              <p className="text-sm text-cyan-300">Calculating layout...</p>
            </div>
          </div>
        )}

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
          minZoom={0.1}
          maxZoom={3}
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
          <Background gap={32} size={1} color="rgba(148, 163, 184, 0.08)" />
        </ReactFlow>

        {/* Graph controls */}
        <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
          {/* Relayout button */}
          <button
            type="button"
            aria-label="Relayout graph"
            onClick={handleRelayout}
            disabled={isLayouting}
            className="obsera-focus-ring rounded-md border border-[#213045] bg-[#0F172A]/80 px-3 py-1.5 text-xs font-medium text-[#D7DEEC] transition duration-150 hover:border-cyan-400/40 hover:bg-[#142B47] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            title="Recalculate graph layout"
          >
            <svg className="inline-block w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M21 12a9 9 0 10-2.6 6.06" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Relayout</span>
          </button>

          {/* Reset view button */}
          <button
            type="button"
            aria-label="Reset view"
            onClick={handleResetView}
            className="obsera-focus-ring rounded-md border border-[#213045] bg-[#0F172A]/80 px-3 py-1.5 text-xs font-medium text-[#D7DEEC] transition duration-150 hover:border-cyan-400/40 hover:bg-[#142B47] hover:text-white"
            title="Reset to fit all nodes"
          >
            <svg className="inline-block w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M3 11.5L12 4l9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Home</span>
          </button>

          {/* Zoom controls */}
          <button
            type="button"
            aria-label="Zoom in"
            onClick={handleZoomIn}
            className="obsera-focus-ring rounded-md border border-[#213045] bg-[#0F172A]/80 px-2 py-1 text-xs font-medium text-[#D7DEEC] transition duration-150 hover:border-cyan-400/40 hover:bg-[#142B47] hover:text-white"
          >
            <svg className="inline-block w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={handleZoomOut}
            className="obsera-focus-ring rounded-md border border-[#213045] bg-[#0F172A]/80 px-2 py-1 text-xs font-medium text-[#D7DEEC] transition duration-150 hover:border-cyan-400/40 hover:bg-[#142B47] hover:text-white"
          >
            <svg className="inline-block w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </ReactFlowProvider>
  )
}

export default GraphCanvas
