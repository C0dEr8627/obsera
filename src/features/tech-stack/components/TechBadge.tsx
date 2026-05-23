import type { TechStackItem } from '@/features/tech-stack/types'

interface TechBadgeProps {
  item: TechStackItem
}

const categoryClasses: Record<string, string> = {
  frontend: 'bg-indigo-700 text-indigo-50 border-indigo-600',
  backend: 'bg-cyan-800 text-cyan-50 border-cyan-600',
  language: 'bg-violet-700 text-violet-50 border-violet-600',
  tooling: 'bg-slate-800 text-slate-100 border-slate-600',
}

const TechBadge = ({ item }: TechBadgeProps) => {
  const cls = categoryClasses[item.category] ?? categoryClasses.tooling

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs font-medium ${cls}`}
      title={item.version ? `${item.name} ${item.version}` : item.name}
      aria-label={`${item.name} (${item.category})`}
    >
      <span className="truncate">{item.name}</span>
      {item.version && (
        <span className="ml-1 text-[10px] opacity-80">{item.version.replace(/^\^|~|>=?/, '')}</span>
      )}
    </div>
  )
}

export default TechBadge
