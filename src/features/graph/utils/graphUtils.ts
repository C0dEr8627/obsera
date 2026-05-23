import type { GraphFlowEdge, GraphFlowNode } from '../types'
import type { DependencyGraphEdge, DependencyGraphNode } from '@/store'

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
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#22d3ee', strokeWidth: 2 },
  },
  {
    id: 'e-Home-ProductCard',
    source: 'Home.tsx',
    target: 'ProductCard.tsx',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#22d3ee', strokeWidth: 2 },
  },
]

export const createSampleGraph = () => ({
  nodes: sampleGraphNodes,
  edges: sampleGraphEdges,
})

export const mapDependencyGraphToReactFlow = (
  nodes: DependencyGraphNode[],
  edges: DependencyGraphEdge[],
): {
  nodes: GraphFlowNode[]
  edges: GraphFlowEdge[]
} => {
  const validIds = nodes.map((node) => node.id)

  const flowNodes: GraphFlowNode[] = nodes.map((node, index) => ({
    id: node.id,
    type: 'graphNode',
    data: {
      id: node.id,
      label: node.label,
      path: node.filePath,
      fileType: node.filePath.split('.').pop()?.toUpperCase(),
      metadata: node.position ? { x: node.position.x, y: node.position.y } : undefined,
    },
    position: node.position ?? { x: index * 260, y: (index % 2) * 140 },
  }))

  const flowEdges: GraphFlowEdge[] = edges
    .filter((edge) => validIds.includes(edge.source) && validIds.includes(edge.target))
    .map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#22d3ee', strokeWidth: 2 },
    }))

  return {
    nodes: flowNodes,
    edges: flowEdges,
  }
}
