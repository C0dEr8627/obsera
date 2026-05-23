import type { GraphFlowEdge, GraphFlowNode } from '../types'
import type { DependencyGraphEdge, DependencyGraphNode } from '@/store'

const sampleGraphNodes: GraphFlowNode[] = [
  {
    id: 'App.tsx',
    type: 'graphNode',
    position: { x: 0, y: 0 },
    data: {
      label: 'App.tsx',
      filePath: 'src/App.tsx',
    },
  },
  {
    id: 'Home.tsx',
    type: 'graphNode',
    position: { x: 280, y: 120 },
    data: {
      label: 'Home.tsx',
      filePath: 'src/features/home/Home.tsx',
    },
  },
  {
    id: 'ProductCard.tsx',
    type: 'graphNode',
    position: { x: 560, y: 240 },
    data: {
      label: 'ProductCard.tsx',
      filePath: 'src/components/ProductCard.tsx',
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
      label: node.label,
      filePath: node.filePath,
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
