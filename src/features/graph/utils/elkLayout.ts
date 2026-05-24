/**
 * Hierarchical DAG (Directed Acyclic Graph) layout engine
 * Optimized for software architecture visualization with structured, predictable layouts
 * Pure TypeScript implementation - no external dependencies
 */

export interface LayoutConfig {
  canvasWidth?: number
  canvasHeight?: number
  nodeWidth?: number
  nodeHeight?: number
  minNodeSpacing?: number
  edgeRouting?: 'ORTHOGONAL' | 'POLYLINE' | 'SPLINE'
}

interface Layer {
  nodes: Array<{ id: string; order: number }>
  nodeIds: Set<string>
}

interface NodePos {
  id: string
  x: number
  y: number
  width: number
  height: number
}

/**
 * Calculate hierarchical/layered layout for DAGs
 * Optimized for dependency visualization with minimal edge crossings
 */
export async function applyElkLayout(
  nodes: Array<{ id: string; label: string; path?: string; width?: number; height?: number }>,
  edges: Array<{ source: string; target: string; id?: string }>,
  config: LayoutConfig = {},
): Promise<{
  nodes: Array<{ id: string; x: number; y: number; width: number; height: number }>
  edges: Array<{ id: string; path: Array<{ x: number; y: number }>; sections?: any }>
}> {
  const {
    canvasWidth = 1600,
    canvasHeight = 1000,
    nodeWidth = 220,
    nodeHeight = 100,
    minNodeSpacing = 120,
  } = config

  // Create node map for reference
  const nodeWidths = new Map(
    nodes.map((n) => [n.id, n.width || getRecommendedNodeSize(n.label).width]),
  )
  const nodeHeights = new Map(
    nodes.map((n) => [n.id, n.height || nodeHeight]),
  )

  // Calculate in-degree for topological sort
  const inDegree = new Map<string, number>()
  const outgoing = new Map<string, string[]>()
  const incoming = new Map<string, string[]>()

  nodes.forEach((node) => {
    inDegree.set(node.id, 0)
    outgoing.set(node.id, [])
    incoming.set(node.id, [])
  })

  edges.forEach((edge) => {
    outgoing.set(edge.source, [...(outgoing.get(edge.source) || []), edge.target])
    incoming.set(edge.target, [...(incoming.get(edge.target) || []), edge.source])
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1)
  })

  // Detect isolated nodes (no incoming and no outgoing)
  const isolatedIds = new Set<string>()
  nodes.forEach((n) => {
    const hasOut = (outgoing.get(n.id) || []).length > 0
    const hasIn = (incoming.get(n.id) || []).length > 0
    if (!hasOut && !hasIn) isolatedIds.add(n.id)
  })

  // Work on connected nodes for layering; isolated nodes will be positioned separately
  const connectedNodes = nodes.filter((n) => !isolatedIds.has(n.id))

  // Assign nodes to layers using topological sort
  const layers: Layer[] = []
  const processedNodes = new Set<string>()
  const nodeLayer = new Map<string, number>()

  while (processedNodes.size < connectedNodes.length) {
    const currentLayerNodes = connectedNodes.filter(
      (n) => !processedNodes.has(n.id) && (inDegree.get(n.id) || 0) === 0,
    )

    if (currentLayerNodes.length === 0) {
      // Handle cycles by breaking them
      const unprocessed = nodes.filter((n) => !processedNodes.has(n.id))
      if (unprocessed.length > 0) {
        currentLayerNodes.push(unprocessed[0])
      }
    }

    const layer: Layer = {
      nodes: currentLayerNodes.map((n, i) => ({ id: n.id, order: i })),
      nodeIds: new Set(currentLayerNodes.map((n) => n.id)),
    }

    currentLayerNodes.forEach((node) => {
      nodeLayer.set(node.id, layers.length)
      processedNodes.add(node.id)

      // Reduce in-degree for targets
      ;(outgoing.get(node.id) || []).forEach((target) => {
        inDegree.set(target, (inDegree.get(target) || 1) - 1)
      })
    })

    layers.push(layer)
  }

  // Position nodes in layers
  const positionedNodes: NodePos[] = []
  const padding = 60
  const layerHeight = Math.max(
    (canvasHeight - padding * 2) / Math.max(layers.length, 1),
    nodeHeight + minNodeSpacing,
  )

  layers.forEach((layer, layerIndex) => {
    const layerY = padding + layerIndex * layerHeight + layerHeight / 2

    // Calculate total width needed for this layer
    const nodeWidthsInLayer = Array.from(layer.nodeIds).map(
      (id) => nodeWidths.get(id) || nodeWidth,
    )
    const totalWidth = nodeWidthsInLayer.reduce((a, b) => a + b, 0)
    const spacingBetweenNodes = Math.max(
      minNodeSpacing,
      (canvasWidth - padding * 2 - totalWidth) / (nodeWidthsInLayer.length + 1),
    )

    let currentX = padding + spacingBetweenNodes

    Array.from(layer.nodeIds).forEach((nodeId) => {
      const width = nodeWidths.get(nodeId) || nodeWidth
      const height = nodeHeights.get(nodeId) || nodeHeight

      positionedNodes.push({
        id: nodeId,
        x: currentX,
        y: layerY - height / 2,
        width,
        height,
      })

      currentX += width + spacingBetweenNodes
    })
  })

  // Position isolated nodes in a dedicated column on the right side
  if (isolatedIds.size > 0) {
    const isolatedList = Array.from(isolatedIds)
    const isoPadding = 40
    const isoColX = canvasWidth - padding - (nodeWidth || 220) - isoPadding
    const isoSpacing = Math.max(minNodeSpacing, 40)
    let currentY = padding + isoSpacing

    isolatedList.forEach((id) => {
      const width = nodeWidths.get(id) || nodeWidth
      const height = nodeHeights.get(id) || nodeHeight

      positionedNodes.push({
        id,
        x: isoColX,
        y: currentY,
        width,
        height,
      })

      currentY += height + isoSpacing
    })
  }

  // Create edge paths (simplified routing)
  const positionMap = new Map(positionedNodes.map((n) => [n.id, n]))
  const positionedEdges = edges.map((edge) => {
    const source = positionMap.get(edge.source)
    const target = positionMap.get(edge.target)

    const path = source && target
      ? [
          { x: source.x + source.width / 2, y: source.y + source.height },
          { x: target.x + target.width / 2, y: target.y },
        ]
      : []

    return {
      id: edge.id || `e-${edge.source}-${edge.target}`,
      path,
    }
  })

  return {
    nodes: positionedNodes,
    edges: positionedEdges,
  }
}

/**
 * Get recommended node size for label
 */
export function getRecommendedNodeSize(label: string): { width: number; height: number } {
  const charWidth = 7.5
  const baseWidth = Math.max(label.length * charWidth + 40, 160)
  const width = Math.min(baseWidth, 280)

  return {
    width: Math.ceil(width / 10) * 10,
    height: 100,
  }
}

/**
 * Create path string for SVG from points
 */
export function createPathFromPoints(points: Array<{ x: number; y: number }>): string {
  if (points.length < 2) return ''
  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`
  }
  return path
}
