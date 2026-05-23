import type { Edge, Node } from 'reactflow'

export interface GraphNodeData {
  id: string
  label: string
  path: string
  fileType?: string
  metadata?: Record<string, unknown>
}

export type GraphFlowNode = Node<GraphNodeData>
export type GraphFlowEdge = Edge
