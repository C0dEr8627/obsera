/**
 * Layout algorithms for graph visualization
 */

import type { LayoutResult, LayoutAlgorithm, GraphData, Position, LayoutOptions } from '../types/layouts'

/**
 * Force-directed (spring-based) layout algorithm
 * Simulates spring forces between connected nodes and repulsive forces between all nodes
 */
export const forceDirectedLayout: LayoutAlgorithm = (graph, options = {}) => {
  const {
    canvasWidth = 1200,
    canvasHeight = 800,
    iterations = 100,
    charge = -500,
    linkDistance = 150,
    centerX = canvasWidth / 2,
    centerY = canvasHeight / 2,
    seed = 42,
  } = options

  const nodes = JSON.parse(JSON.stringify(graph.nodes)) as typeof graph.nodes

  // Seeded random function for reproducibility
  const seededRandom = (() => {
    let x = Math.sin(seed) * 10000
    return () => {
      x = Math.sin(x) * 10000
      return x - Math.floor(x)
    }
  })()

  // Initialize positions randomly around center if not already set
  nodes.forEach((node) => {
    if (!node.position || node.position.x === 0) {
      const angle = seededRandom() * Math.PI * 2
      const distance = 100 + seededRandom() * 50
      node.position = {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
      }
    }
  })

  // Calculate velocities
  const velocities = new Map<string, Position>(
    nodes.map((node) => [node.id, { x: 0, y: 0 }]),
  )

  // Build adjacency list for quick edge lookup
  const adjacencyList = new Map<string, string[]>()
  nodes.forEach((node) => {
    adjacencyList.set(node.id, [])
  })
  graph.edges.forEach((edge) => {
    const neighbors = adjacencyList.get(edge.source) || []
    neighbors.push(edge.target)
    adjacencyList.set(edge.source, neighbors)

    const reverseNeighbors = adjacencyList.get(edge.target) || []
    reverseNeighbors.push(edge.source)
    adjacencyList.set(edge.target, reverseNeighbors)
  })

  // Simulation iterations
  const friction = 0.95
  const cooldown = 1

  for (let iter = 0; iter < iterations; iter++) {
    // Reset forces
    const forces = new Map<string, Position>(
      nodes.map((node) => [node.id, { x: 0, y: 0 }]),
    )

    // Apply repulsive forces between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i]
        const node2 = nodes[j]

        const dx = node2.position.x - node1.position.x
        const dy = node2.position.y - node1.position.y
        const distance = Math.sqrt(dx * dx + dy * dy) || 1

        const repulsiveForce = (charge * 500) / (distance * distance)

        forces.get(node1.id)!.x -= (dx / distance) * repulsiveForce
        forces.get(node1.id)!.y -= (dy / distance) * repulsiveForce
        forces.get(node2.id)!.x += (dx / distance) * repulsiveForce
        forces.get(node2.id)!.y += (dy / distance) * repulsiveForce
      }
    }

    // Apply attractive forces between connected nodes
    graph.edges.forEach((edge) => {
      const source = nodes.find((n) => n.id === edge.source)
      const target = nodes.find((n) => n.id === edge.target)

      if (!source || !target) return

      const dx = target.position.x - source.position.x
      const dy = target.position.y - source.position.y
      const distance = Math.sqrt(dx * dx + dy * dy) || 1

      const attractiveForce = ((distance - linkDistance) / distance) * 0.1

      forces.get(source.id)!.x += dx * attractiveForce
      forces.get(source.id)!.y += dy * attractiveForce
      forces.get(target.id)!.x -= dx * attractiveForce
      forces.get(target.id)!.y -= dy * attractiveForce
    })

    // Apply spring force towards center
    nodes.forEach((node) => {
      const dx = centerX - node.position.x
      const dy = centerY - node.position.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const centerForce = distance * 0.001

      forces.get(node.id)!.x += dx * centerForce
      forces.get(node.id)!.y += dy * centerForce
    })

    // Update velocities and positions
    nodes.forEach((node) => {
      const velocity = velocities.get(node.id)!
      const force = forces.get(node.id)!

      velocity.x = (velocity.x + force.x) * friction
      velocity.y = (velocity.y + force.y) * friction

      node.position.x += velocity.x * cooldown
      node.position.y += velocity.y * cooldown
    })
  }

  // Normalize positions to canvas bounds with padding
  const padding = 80
  let minX = Infinity,
    maxX = -Infinity
  let minY = Infinity,
    maxY = -Infinity

  nodes.forEach((node) => {
    minX = Math.min(minX, node.position.x)
    maxX = Math.max(maxX, node.position.x)
    minY = Math.min(minY, node.position.y)
    maxY = Math.max(maxY, node.position.y)
  })

  const width = maxX - minX || 1
  const height = maxY - minY || 1
  const scaleX = (canvasWidth - padding * 2) / width
  const scaleY = (canvasHeight - padding * 2) / height
  const scale = Math.min(scaleX, scaleY, 1)

  nodes.forEach((node) => {
    node.position.x = (node.position.x - minX) * scale + padding
    node.position.y = (node.position.y - minY) * scale + padding
  })

  return {
    nodes,
    success: true,
  }
}

/**
 * Circular layout - arranges nodes in a circle
 */
export const circularLayout: LayoutAlgorithm = (graph, options = {}) => {
  const {
    canvasWidth = 1200,
    canvasHeight = 800,
    radius = Math.min(canvasWidth, canvasHeight) / 3 - 80,
  } = options

  const nodes = JSON.parse(JSON.stringify(graph.nodes)) as typeof graph.nodes
  const centerX = canvasWidth / 2
  const centerY = canvasHeight / 2

  nodes.forEach((node, index) => {
    const angle = (index / nodes.length) * Math.PI * 2
    node.position = {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    }
  })

  return {
    nodes,
    success: true,
  }
}

/**
 * Radial/snowflake layout - arranges nodes in concentric circles based on hierarchy
 */
export const radialLayout: LayoutAlgorithm = (graph, options = {}) => {
  const {
    canvasWidth = 1200,
    canvasHeight = 800,
    nodeSpacing = 120,
  } = options

  const centerX = canvasWidth / 2
  const centerY = canvasHeight / 2
  const nodes = JSON.parse(JSON.stringify(graph.nodes)) as typeof graph.nodes

  // Calculate node depth based on connections (BFS-like)
  const depths = new Map<string, number>()

  // Find root nodes (nodes with no incoming edges or minimum connections)
  const incomingCount = new Map<string, number>()
  nodes.forEach((node) => {
    incomingCount.set(node.id, 0)
  })

  graph.edges.forEach((edge) => {
    incomingCount.set(edge.target, (incomingCount.get(edge.target) || 0) + 1)
  })

  const roots = nodes.filter((node) => (incomingCount.get(node.id) || 0) === 0)

  // BFS to calculate depths
  const queue: Array<{ id: string; depth: number }> = roots.map((root) => ({
    id: root.id,
    depth: 0,
  }))
  const visited = new Set<string>()

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!

    if (visited.has(id)) continue
    visited.add(id)

    depths.set(id, depth)

    // Find children
    const children = graph.edges
      .filter((edge) => edge.source === id && !visited.has(edge.target))
      .map((edge) => edge.target)

    children.forEach((childId) => {
      queue.push({ id: childId, depth: depth + 1 })
    })
  }

  // Assign unvisited nodes to depth 0
  nodes.forEach((node) => {
    if (!depths.has(node.id)) {
      depths.set(node.id, 0)
    }
  })

  // Group nodes by depth
  const depthGroups = new Map<number, string[]>()
  nodes.forEach((node) => {
    const depth = depths.get(node.id) || 0
    if (!depthGroups.has(depth)) {
      depthGroups.set(depth, [])
    }
    depthGroups.get(depth)!.push(node.id)
  })

  // Position nodes in concentric circles
  depthGroups.forEach((nodeIds, depth) => {
    const radius = Math.max(100, nodeSpacing * (depth + 1))
    const angleStep = (Math.PI * 2) / Math.max(nodeIds.length, 1)

    nodeIds.forEach((nodeId, index) => {
      const node = nodes.find((n) => n.id === nodeId)!
      const angle = angleStep * index
      node.position = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      }
    })
  })

  return {
    nodes,
    success: true,
  }
}

/**
 * Grid layout - arranges nodes in a grid pattern
 */
export const gridLayout: LayoutAlgorithm = (graph, options = {}) => {
  const { canvasWidth = 1200, nodeSpacing = 200 } = options

  const nodes = JSON.parse(JSON.stringify(graph.nodes)) as typeof graph.nodes
  const cols = Math.ceil(Math.sqrt(nodes.length))

  const padding = 80
  const availableWidth = canvasWidth - padding * 2
  const colWidth = availableWidth / cols
  const rowHeight = nodeSpacing

  nodes.forEach((node, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)

    node.position = {
      x: padding + colWidth * (col + 0.5),
      y: padding + rowHeight * (row + 0.5),
    }
  })

  return {
    nodes,
    success: true,
  }
}

/**
 * Hierarchical layout - arranges nodes in layers based on dependency tree
 */
export const hierarchicalLayout: LayoutAlgorithm = (graph, options = {}) => {
  const { canvasWidth = 1200, canvasHeight = 800 } = options

  const nodes = JSON.parse(JSON.stringify(graph.nodes)) as typeof graph.nodes

  // Calculate layers based on dependency depth
  const layers = new Map<number, string[]>()
  const layerMap = new Map<string, number>()

  // Topological sort to determine layers
  const inDegree = new Map<string, number>()
  nodes.forEach((node) => {
    inDegree.set(node.id, 0)
  })

  graph.edges.forEach((edge) => {
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1)
  })

  // Process nodes in topological order
  let currentLayer = 0
  const processed = new Set<string>()

  while (processed.size < nodes.length) {
    const currentLayerNodes = nodes.filter(
      (node) => !processed.has(node.id) && (inDegree.get(node.id) || 0) === 0,
    )

    if (currentLayerNodes.length === 0) break

    currentLayerNodes.forEach((node) => {
      layerMap.set(node.id, currentLayer)
      if (!layers.has(currentLayer)) {
        layers.set(currentLayer, [])
      }
      layers.get(currentLayer)!.push(node.id)
      processed.add(node.id)
    })

    // Reduce in-degree for affected nodes
    currentLayerNodes.forEach((node) => {
      graph.edges.forEach((edge) => {
        if (edge.source === node.id) {
          inDegree.set(edge.target, (inDegree.get(edge.target) || 1) - 1)
        }
      })
    })

    currentLayer++
  }

  // Position nodes based on layers
  const layerHeight = Math.max(150, canvasHeight / (currentLayer + 1))
  const padding = 60

  layers.forEach((nodeIds, layer) => {
    const layerY = padding + layer * layerHeight
    const layerWidth = canvasWidth - padding * 2
    const xStep = layerWidth / (nodeIds.length + 1)

    nodeIds.forEach((nodeId, index) => {
      const node = nodes.find((n) => n.id === nodeId)!
      node.position = {
        x: padding + xStep * (index + 1),
        y: layerY,
      }
    })
  })

  return {
    nodes,
    success: true,
  }
}

/**
 * Get all available layout algorithms
 */
export const layoutAlgorithms = {
  'force-directed': forceDirectedLayout,
  circular: circularLayout,
  radial: radialLayout,
  grid: gridLayout,
  hierarchical: hierarchicalLayout,
}

/**
 * Apply a layout algorithm to graph data
 */
export const applyLayout = (
  layoutType: keyof typeof layoutAlgorithms,
  graph: GraphData,
  options?: LayoutOptions,
): LayoutResult => {
  const algorithm = layoutAlgorithms[layoutType]
  if (!algorithm) {
    return {
      nodes: graph.nodes,
      success: false,
      message: `Unknown layout type: ${layoutType}`,
    }
  }

  try {
    return algorithm(graph, options ?? {})
  } catch (error) {
    return {
      nodes: graph.nodes,
      success: false,
      message: `Layout calculation failed: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}
