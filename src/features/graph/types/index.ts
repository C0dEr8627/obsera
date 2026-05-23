import type { Edge, Node } from 'reactflow'

export interface GraphFlowNodeData {
  label: string
  filePath: string
}

export type GraphFlowNode = Node<GraphFlowNodeData>
export type GraphFlowEdge = Edge
