import type { FC } from 'react'
import type { GraphFlowNodeData } from '../types'

interface GraphNodeProps {
  data: GraphFlowNodeData
}

const GraphNode: FC<GraphNodeProps> = ({ data }) => (
  <div className="rounded-3xl border border-[#334155] bg-[#111827] p-4 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.9)]">
    <div className="text-sm font-semibold text-cyan-200">{data.label}</div>
    <div className="mt-1 text-xs text-slate-400">{data.filePath}</div>
  </div>
)

export default GraphNode
