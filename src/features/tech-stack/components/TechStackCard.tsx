import TechBadge from './TechBadge'
import { useAppStore } from '@/store'
import type { TechStackItem } from '@/features/tech-stack/types'

const categoryOrder: Array<{ key: string; label: string }> = [
  { key: 'frontend', label: 'Frontend' },
  { key: 'language', label: 'Language' },
  { key: 'tooling', label: 'Tooling' },
  { key: 'backend', label: 'Backend' },
]

const TechStackCard = () => {
  const zipTechStack = useAppStore((s) => s.zipTechStack)
  const zipStatus = useAppStore((s) => s.zipUploadStatus)

  if (zipStatus !== 'ready') return null

  const byCategory = categoryOrder.reduce<Record<string, TechStackItem[]>>(
    (acc, cat) => {
      acc[cat.key] = []
      return acc
    },
    {},
  )

  for (const item of zipTechStack ?? []) {
    const list = byCategory[item.category] ?? []
    if (!list.find((x) => x.name === item.name)) {
      list.push(item)
    }
    byCategory[item.category] = list
  }

  return (
    <div className="mx-auto w-full px-3 py-3 sm:px-5">
      <div className="obsera-surface obsera-panel-in p-4">
        <p className="text-sm font-semibold text-white">Tech Stack</p>
        <p className="mt-1 text-xs text-[#94A3B8]">
          Detected technologies from the uploaded project
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          {categoryOrder.map((cat) => {
            const list = byCategory[cat.key] ?? []
            return (
              <div
                key={cat.key}
                className="rounded-lg border border-[#1E293B] bg-[#0B1020] p-3"
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#94A3B8]">
                  {cat.label}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {list.length > 0 ? (
                    list.map((item) => (
                      <TechBadge key={item.name} item={item} />
                    ))
                  ) : (
                    <p className="text-xs text-[#94A3B8]">None detected</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TechStackCard
