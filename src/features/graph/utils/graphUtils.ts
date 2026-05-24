import type { GraphFlowEdge, GraphFlowNode } from '../types'
import type { DependencyGraphEdge, DependencyGraphNode } from '@/store'
import { applyElkLayout, getRecommendedNodeSize } from './elkLayout'

const sampleGraphNodes: GraphFlowNode[] = [
  {
    id: 'App.tsx',
    type: 'graphNode',
    position: { x: 0, y: 0 },
    data: {
      id: 'App.tsx',
      label: 'App.tsx',
      path: 'src/App.tsx',
      fileType: 'TSX',
    },
  },
  {
    id: 'Home.tsx',
    type: 'graphNode',
    position: { x: 280, y: 120 },
    data: {
      id: 'Home.tsx',
      label: 'Home.tsx',
      path: 'src/features/home/Home.tsx',
      fileType: 'TSX',
    },
  },
  {
    id: 'ProductCard.tsx',
    type: 'graphNode',
    position: { x: 560, y: 240 },
    data: {
      id: 'ProductCard.tsx',
      label: 'ProductCard.tsx',
      path: 'src/components/ProductCard.tsx',
      fileType: 'TSX',
    },
  },
]

const sampleGraphEdges: GraphFlowEdge[] = [
  {
    id: 'e-App-Home',
    source: 'App.tsx',
    target: 'Home.tsx',
    type: 'dependencyEdge',
    animated: true,
    data: { label: 'imports Home', metadata: { relation: 'import' } },
    style: { stroke: '#22d3ee', strokeWidth: 2 },
  },
  {
    id: 'e-Home-ProductCard',
    source: 'Home.tsx',
    target: 'ProductCard.tsx',
    type: 'dependencyEdge',
    animated: true,
    data: { label: 'imports ProductCard', metadata: { relation: 'import' } },
    style: { stroke: '#22d3ee', strokeWidth: 2 },
  },
]

const dedupeEdges = (edges: GraphFlowEdge[]): GraphFlowEdge[] => {
  const seen = new Set<string>()

  return edges.filter((edge) => {
    const key = `${edge.source}->${edge.target}`
    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

export const createSampleGraph = () => ({
  nodes: sampleGraphNodes,
  edges: dedupeEdges(sampleGraphEdges),
})

/**
 * Map dependency graph nodes and edges to React Flow format with ELK layout
 * Uses hierarchical DAG layout optimized for software architecture visualization
 */
export async function mapDependencyGraphToReactFlow(
  nodes: DependencyGraphNode[],
  edges: DependencyGraphEdge[],
  canvasSize?: { width: number; height: number },
): Promise<{
  nodes: GraphFlowNode[]
  edges: GraphFlowEdge[]
}> {
  const validIds = nodes.map((node) => node.id)

  // Deduplicate edges
  const deduplicatedEdges = dedupeEdges(
    edges
      .filter((edge) => validIds.includes(edge.source) && validIds.includes(edge.target))
      .map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'dependencyEdge',
        animated: true,
        data: { label: 'import relationship', metadata: { source: edge.source, target: edge.target } },
        style: { stroke: '#22d3ee', strokeWidth: 2 },
      })),
  )

  // Prepare nodes with recommended sizes
  const elkNodes = nodes.map((node) => {
    const size = getRecommendedNodeSize(node.label)
    return {
      id: node.id,
      label: node.label,
      path: node.filePath,
      width: size.width,
      height: size.height,
    }
  })

  // Prepare edges for ELK
  const elkEdges = deduplicatedEdges.map((edge) => ({
    source: edge.source,
    target: edge.target,
    id: edge.id,
  }))

  // Determine isolated nodes (no incoming/outgoing edges) so we can mark them visually
  const edgeSet = new Set<string>()
  elkEdges.forEach((e) => {
    edgeSet.add(e.source)
    edgeSet.add(e.target)
  })
  const isolatedIds = new Set(nodes.filter((n) => !edgeSet.has(n.id)).map((n) => n.id))

  // Apply ELK layout
  try {
    const layoutResult = await applyElkLayout(elkNodes, elkEdges, {
      canvasWidth: canvasSize?.width ?? 1600,
      canvasHeight: canvasSize?.height ?? 1000,
      nodeWidth: 220,
      nodeHeight: 100,
      minNodeSpacing: 160,
      edgeRouting: 'ORTHOGONAL',
    })

    // Create React Flow nodes with positioned layout
    const flowNodes: GraphFlowNode[] = nodes.map((node) => {
      const positionedNode = layoutResult.nodes.find((n) => n.id === node.id)
      return {
        id: node.id,
        type: 'graphNode',
        data: {
          id: node.id,
          label: node.label,
          path: node.filePath,
          fileType: node.filePath.split('.').pop()?.toUpperCase(),
          isIsolated: isolatedIds.has(node.id),
        },
        position: positionedNode
          ? { x: positionedNode.x, y: positionedNode.y }
          : { x: 0, y: 0 },
      }
    })

    return {
      nodes: flowNodes,
      edges: deduplicatedEdges,
    }
  } catch (error) {
    console.warn('ELK layout failed:', error)
    // Fallback to grid layout on error
    const cols = Math.ceil(Math.sqrt(nodes.length))
    const flowNodes: GraphFlowNode[] = nodes.map((node, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      return {
        id: node.id,
        type: 'graphNode',
        data: {
          id: node.id,
          label: node.label,
          path: node.filePath,
          fileType: node.filePath.split('.').pop()?.toUpperCase(),
        },
        position: { x: col * 280, y: row * 150 },
      }
    })

    return {
      nodes: flowNodes,
      edges: deduplicatedEdges,
    }
  }
}
