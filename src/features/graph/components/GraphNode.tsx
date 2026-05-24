import type { FC } from 'react'
import { Handle, Position } from 'reactflow'
import type { NodeProps } from 'reactflow'
import type { GraphNodeData } from '../types'

const GraphNode: FC<NodeProps<GraphNodeData>> = ({ data, selected }) => {
  const fileType =
    data.fileType ?? data.path.split('.').pop()?.toUpperCase() ?? 'FILE'

  return (
    <div
      className={`min-h-[110px] min-w-[240px] max-w-[320px] rounded-lg border-2 p-4 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.9)] transition-all duration-150 flex flex-col justify-between ${
        data.isIsolated
          ? 'bg-gradient-to-br from-[#071026] to-[#06121A] border-dashed border-slate-600 opacity-90 scale-95'
          : 'bg-gradient-to-br from-[#111827] to-[#0F172A]'
      } ${
        selected
          ? 'border-cyan-400 shadow-[0_0_0_2px_#070E1C,0_0_0_4px_rgba(34,211,238,0.4)]'
          : 'border-[#334155] hover:border-cyan-400/70'
      }`}
    >
      {/* Input handle (from dependencies) */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="!bg-cyan-400/40 !border-cyan-400 !w-3 !h-3"
      />

      {/* Node label and file type */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold text-cyan-100">
            {data.label}
          </div>
          <div className="truncate text-xs text-slate-400 mt-1">{data.path}</div>
        </div>
        <span className="shrink-0 rounded-md border border-slate-600 bg-slate-900/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300 whitespace-nowrap">
          {fileType}
        </span>
      </div>

      {/* Optional metadata */}
      {data.metadata ? (
        <div className="mt-2 rounded-md border border-[#1E293B] bg-[#0F172A]/60 px-2 py-1 text-[11px] text-slate-400">
          {Object.entries(data.metadata)
            .slice(0, 1)
            .map(([key, value]) => (
              <div key={key} className="flex items-center gap-1">
                <span className="font-semibold text-slate-300">{key}:</span>
                <span className="truncate text-slate-400">{String(value).slice(0, 30)}</span>
              </div>
            ))}
        </div>
      ) : null}

      {/* Output handle (to dependents) */}
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="!bg-cyan-400/40 !border-cyan-400 !w-3 !h-3"
      />
    </div>
  )
}

export default GraphNode
