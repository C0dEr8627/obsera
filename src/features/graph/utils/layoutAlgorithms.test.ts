/**
 * Layout algorithms test suite
 * Validates that all layout algorithms produce valid outputs
 */

import { applyLayout } from '@/features/graph/utils/layoutAlgorithms'
import type { GraphData, LayoutOptions } from '@/features/graph/types/layouts'

// Sample test graph
const sampleGraph: GraphData = {
  nodes: [
    { id: 'App', position: { x: 0, y: 0 } },
    { id: 'Home', position: { x: 0, y: 0 } },
    { id: 'About', position: { x: 0, y: 0 } },
    { id: 'Nav', position: { x: 0, y: 0 } },
    { id: 'Button', position: { x: 0, y: 0 } },
    { id: 'Input', position: { x: 0, y: 0 } },
  ],
  edges: [
    { source: 'App', target: 'Home' },
    { source: 'App', target: 'About' },
    { source: 'Home', target: 'Nav' },
    { source: 'About', target: 'Nav' },
    { source: 'Nav', target: 'Button' },
    { source: 'Home', target: 'Input' },
  ],
}

interface ValidationResult {
  name: string
  success: boolean
  errors: string[]
  warnings: string[]
  stats: {
    nodeCount: number
    minX: number
    maxX: number
    minY: number
    maxY: number
    spread: number
  }
}

function validateLayout(
  layoutName: string,
  result: any,
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check basic structure
  if (!result || !result.nodes) {
    errors.push('Result missing nodes')
    return {
      name: layoutName,
      success: false,
      errors,
      warnings,
      stats: {
        nodeCount: 0,
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
        spread: 0,
      },
    }
  }

  // Check all nodes have positions
  result.nodes.forEach((node: any) => {
    if (!node.position) {
      errors.push(`Node ${node.id} missing position`)
    } else if (typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
      errors.push(`Node ${node.id} has invalid position coordinates`)
    }
  })

  // Calculate statistics
  let minX = Infinity,
    maxX = -Infinity
  let minY = Infinity,
    maxY = -Infinity

  result.nodes.forEach((node: any) => {
    if (node.position) {
      minX = Math.min(minX, node.position.x)
      maxX = Math.max(maxX, node.position.x)
      minY = Math.min(minY, node.position.y)
      maxY = Math.max(maxY, node.position.y)
    }
  })

  const spread = Math.max(maxX - minX, maxY - minY)

  // Warnings
  if (spread < 100) {
    warnings.push(`Low spread (${spread.toFixed(0)}px) - nodes may overlap`)
  }

  const nodeCount = result.nodes.length
  const expectedCount = sampleGraph.nodes.length
  if (nodeCount !== expectedCount) {
    errors.push(`Expected ${expectedCount} nodes, got ${nodeCount}`)
  }

  return {
    name: layoutName,
    success: errors.length === 0,
    errors,
    warnings,
    stats: {
      nodeCount,
      minX: minX === Infinity ? 0 : minX,
      maxX: maxX === -Infinity ? 0 : maxX,
      minY: minY === Infinity ? 0 : minY,
      maxY: maxY === -Infinity ? 0 : maxY,
      spread,
    },
  }
}

function testLayouts() {
  console.log('🧪 Starting layout algorithm tests...\n')

  const options: LayoutOptions = {
    canvasWidth: 1200,
    canvasHeight: 800,
    iterations: 50, // Fewer for testing speed
  }

  const layouts = ['force-directed', 'circular', 'radial', 'grid', 'hierarchical'] as const
  const results: ValidationResult[] = []

  layouts.forEach((layoutType) => {
    console.log(`Testing ${layoutType} layout...`)
    const startTime = performance.now()

    const layoutResult = applyLayout(layoutType, sampleGraph, options)
    const endTime = performance.now()

    const validation = validateLayout(layoutType, layoutResult)
    validation.stats = {
      ...validation.stats,
      ...layoutResult, // Include any additional stats
    } as any

    results.push(validation)

    const status = validation.success ? '✅' : '❌'
    console.log(`${status} ${layoutType} (${(endTime - startTime).toFixed(2)}ms)`)

    if (validation.errors.length > 0) {
      validation.errors.forEach((error) => console.log(`   ❌ ${error}`))
    }

    if (validation.warnings.length > 0) {
      validation.warnings.forEach((warning) => console.log(`   ⚠️  ${warning}`))
    }

    console.log(`   📊 Spread: ${validation.stats.spread.toFixed(0)}px`)
    console.log(`   📐 Bounds: (${validation.stats.minX.toFixed(0)}, ${validation.stats.minY.toFixed(0)}) to (${validation.stats.maxX.toFixed(0)}, ${validation.stats.maxY.toFixed(0)})`)
    console.log()
  })

  // Summary
  const passedCount = results.filter((r) => r.success).length
  const totalCount = results.length

  console.log(`\n📋 Test Summary`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Passed: ${passedCount}/${totalCount}`)
  console.log()

  results.forEach((result) => {
    const status = result.success ? '✅' : '❌'
    console.log(`${status} ${result.name}`)
    if (!result.success) {
      result.errors.forEach((error: string) => console.log(`   • ${error}`))
    }
  })

  const allPassed = passedCount === totalCount
  console.log(`\n${allPassed ? '🎉 All tests passed!' : '⚠️  Some tests failed'}`)

  // Calculate statistics
  let minX = Infinity,
    maxX = -Infinity
  let minY = Infinity,
    maxY = -Infinity

  results.forEach((result: any) => {
    if (result.stats) {
      minX = Math.min(minX, result.stats.minX)
      maxX = Math.max(maxX, result.stats.maxX)
      minY = Math.min(minY, result.stats.minY)
      maxY = Math.max(maxY, result.stats.maxY)
    }
  })

  return {
    passed: passedCount,
    total: totalCount,
    results,
  }
}

// Run tests if this module is executed
if (typeof window !== 'undefined') {
  ;(window as any).__layoutTests = {
    testLayouts,
    sampleGraph,
  }

  console.log(
    'Layout tests available at window.__layoutTests.testLayouts(). Run it to validate all algorithms.',
  )
}

export { testLayouts, validateLayout }
export type { ValidationResult }
