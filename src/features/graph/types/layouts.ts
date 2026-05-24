/**
 * Layout system types and interfaces for graph visualization
 */

export type LayoutType = 'force-directed' | 'circular' | 'radial' | 'grid' | 'hierarchical'

export interface Position {
  x: number
  y: number
}

export interface Node {
  id: string
  position: Position
  width?: number
  height?: number
}

export interface Edge {
  source: string
  target: string
}

export interface GraphData {
  nodes: Node[]
  edges: Edge[]
}

export interface LayoutOptions {
  canvasWidth?: number
  canvasHeight?: number
  nodeSpacing?: number
  iterations?: number
  seed?: number
  charge?: number
  linkDistance?: number
  centerX?: number
  centerY?: number
  radius?: number
}

export interface LayoutResult {
  nodes: Node[]
  success: boolean
  message?: string
}

export type LayoutAlgorithm = (
  graph: GraphData,
  options: LayoutOptions,
) => LayoutResult
