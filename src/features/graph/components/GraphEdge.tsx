import { memo } from 'react'
import {
  getSmoothStepPath,
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
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const markerEndId = getMarkerEnd(MarkerType.ArrowClosed, `dependency-edge-arrow-${id}`)

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEndId}
      style={{
        ...style,
        stroke: '#22d3ee',
        strokeWidth: 2.2,
        opacity: selected ? 1 : 0.92,
        filter: selected
          ? 'drop-shadow(0 0 18px rgba(34, 211, 238, 0.35))'
          : 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.18))',
        transition: 'filter 150ms ease, opacity 150ms ease',
        strokeDasharray: animated ? '8 6' : undefined,
      }}
    />
  )
}

export default memo(GraphEdge)
