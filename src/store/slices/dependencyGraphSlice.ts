import type { StateCreator } from 'zustand'

export interface DependencyGraphPosition {
  x: number
  y: number
}

export interface DependencyGraphNode {
  id: string
  label: string
  filePath: string
  position?: DependencyGraphPosition
}

export interface DependencyGraphEdge {
  id: string
  source: string
  target: string
}

export interface DependencyGraphSlice {
  graphNodes: DependencyGraphNode[]
  graphEdges: DependencyGraphEdge[]
  selectedGraphNodeId: string | null
  setGraphNodes: (nodes: DependencyGraphNode[]) => void
  setGraphEdges: (edges: DependencyGraphEdge[]) => void
  setDependencyGraph: (nodes: DependencyGraphNode[], edges: DependencyGraphEdge[]) => void
  setSelectedGraphNodeId: (nodeId: string | null) => void
  resetDependencyGraph: () => void
}

export const initialGraphNodes: DependencyGraphNode[] = []
export const initialGraphEdges: DependencyGraphEdge[] = []

const includesGraphNode = (nodes: DependencyGraphNode[], nodeId: string): boolean =>
  nodes.some((node) => node.id === nodeId)

const filterEdgesForNodes = (
  edges: DependencyGraphEdge[],
  nodes: DependencyGraphNode[],
): DependencyGraphEdge[] =>
  edges.filter((edge) => includesGraphNode(nodes, edge.source) && includesGraphNode(nodes, edge.target))

export const createDependencyGraphSlice: StateCreator<
  DependencyGraphSlice,
  [],
  [],
  DependencyGraphSlice
> = (set) => ({
  graphNodes: initialGraphNodes,
  graphEdges: initialGraphEdges,
  selectedGraphNodeId: null,
  setGraphNodes: (nodes) =>
    set((state) => ({
      graphNodes: nodes,
      graphEdges: filterEdgesForNodes(state.graphEdges, nodes),
      selectedGraphNodeId:
        state.selectedGraphNodeId && includesGraphNode(nodes, state.selectedGraphNodeId)
          ? state.selectedGraphNodeId
          : null,
    })),
  setGraphEdges: (edges) =>
    set((state) => ({
      graphEdges: filterEdgesForNodes(edges, state.graphNodes),
    })),
  setDependencyGraph: (nodes, edges) =>
    set((state) => ({
      graphNodes: nodes,
      graphEdges: filterEdgesForNodes(edges, nodes),
      selectedGraphNodeId:
        state.selectedGraphNodeId && includesGraphNode(nodes, state.selectedGraphNodeId)
          ? state.selectedGraphNodeId
          : null,
    })),
  setSelectedGraphNodeId: (nodeId) =>
    set((state) => ({
      selectedGraphNodeId: nodeId && includesGraphNode(state.graphNodes, nodeId) ? nodeId : null,
    })),
  resetDependencyGraph: () =>
    set({
      graphNodes: initialGraphNodes,
      graphEdges: initialGraphEdges,
      selectedGraphNodeId: null,
    }),
})
