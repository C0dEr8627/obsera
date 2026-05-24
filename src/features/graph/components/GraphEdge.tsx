import { memo } from 'react'
import {
  getBezierPath,
  getMarkerEnd,
  MarkerType,
  type EdgeProps,
} from 'reactflow'
import type { GraphEdgeData } from '../types'

const GraphEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  selected,
  animated,
}: EdgeProps<GraphEdgeData>) => {
  /**
   * Use Bezier curves with emphasis on clean orthogonal-style routing
   * Designed for hierarchical/DAG layouts with clear directional flow
   */
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const markerEndId = getMarkerEnd(MarkerType.ArrowClosed, `dependency-edge-arrow-${id}`)

  // Calculate edge properties for visual emphasis
  const dx = targetX - sourceX
  const dy = targetY - sourceY
  const distance = Math.sqrt(dx * dx + dy * dy)
  const isLongEdge = distance > 300

  return (
    <>
      {/* Background glow for selected edges */}
      {selected && (
        <path
          id={`${id}-glow`}
          className="react-flow__edge-path"
          d={edgePath}
          style={{
            stroke: 'rgba(34, 211, 238, 0.25)',
            strokeWidth: 10,
            opacity: 0.4,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Primary edge stroke */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEndId}
        style={{
          ...style,
          stroke: '#22d3ee',
          strokeWidth: selected ? 3 : 2,
          opacity: selected ? 1 : isLongEdge ? 0.7 : 0.85,
          filter: selected
            ? 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.5))'
            : 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.2))',
          transition: 'filter 120ms ease, opacity 120ms ease, stroke-width 120ms ease',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeDasharray: animated ? '6 4' : undefined,
          strokeDashoffset: animated ? '10' : undefined,
        }}
      />

      {/* Directional accent on very long edges */}
      {isLongEdge && !selected && (
        <path
          id={`${id}-accent`}
          className="react-flow__edge-path"
          d={edgePath}
          style={{
            stroke: 'rgba(34, 211, 238, 0.3)',
            strokeWidth: 1,
            opacity: 0.5,
            pointerEvents: 'none',
            strokeDasharray: '10 5',
          }}
        />
      )}
    </>
  )
}

export default memo(GraphEdge)
