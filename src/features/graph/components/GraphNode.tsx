import type { FC } from 'react'
import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'
import type { GraphNodeData } from '../types'

const GraphNode: FC<NodeProps<GraphNodeData>> = ({ data, selected }) => {
  const fileType =
    data.fileType ?? data.path.split('.').pop()?.toUpperCase() ?? 'FILE'

  return (
    <div
      className={`min-h-[84px] min-w-[200px] max-w-[280px] rounded-lg border bg-[#111827] p-4 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.9)] transition-all duration-150 ${
        selected
          ? 'border-cyan-400/80 shadow-[0_0_0_8px_rgba(34,211,238,0.18)]'
          : 'border-[#334155] hover:border-cyan-400/60'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="!bg-transparent"
      />
      <div className="flex items-center justify-between gap-3 text-left">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-cyan-100">
            {data.label}
          </div>
          <div className="truncate text-xs text-slate-400">{data.path}</div>
        </div>
        <span className="shrink-0 rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
          {fileType}
        </span>
      </div>
      {data.metadata ? (
        <div className="mt-3 rounded-lg border border-[#1E293B] bg-[#0F172A]/80 px-3 py-2 text-xs text-slate-400">
          {Object.entries(data.metadata)
            .slice(0, 2)
            .map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="font-semibold text-slate-300">{key}:</span>
                <span className="truncate text-slate-400">{String(value)}</span>
              </div>
            ))}
        </div>
      ) : null}
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="!bg-transparent"
      />
    </div>
  )
}

export default GraphNode
