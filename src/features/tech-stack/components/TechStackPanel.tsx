import { useMemo } from 'react'
import type { TechStackItem } from '@/features/tech-stack/types'
import TechBadge from './TechBadge'

interface TechStackPanelProps {
  items?: TechStackItem[] | null
}

const categoryOrder: Array<{ key: string; label: string }> = [
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'language', label: 'Language' },
  { key: 'tooling', label: 'Tooling' },
]

const TechStackPanel = ({ items }: TechStackPanelProps) => {
  const safeItems = items ?? []

  const byCategory = useMemo(() => {
    const map = new Map<string, TechStackItem[]>()

    for (const it of safeItems) {
      const arr = map.get(it.category) ?? []
      // de-duplicate by name
      if (!arr.find((x) => x.name === it.name)) {
        arr.push(it)
      }
      map.set(it.category, arr)
    }

    return map
  }, [safeItems])

  if (safeItems.length === 0) {
    return (
      <div className="rounded-2xl bg-[#0F172A] p-3 text-sm text-[#94A3B8]">
        No detected technologies found in package.json files.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {categoryOrder.map((cat) => {
        const list = byCategory.get(cat.key) ?? []
        if (list.length === 0) return null

        return (
          <div key={cat.key}>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#94A3B8]">{cat.label}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {list.map((item) => (
                <TechBadge key={item.name} item={item} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TechStackPanel
