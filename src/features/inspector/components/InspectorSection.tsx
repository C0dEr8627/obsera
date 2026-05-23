import type { ReactNode } from 'react'

interface InspectorSectionProps {
  title: string
  description?: string
  children: ReactNode
}

const InspectorSection = ({ title, description, children }: InspectorSectionProps) => (
  <section className="space-y-3 rounded-2xl border border-[#1E293B] bg-[#111827]/80 p-4">
    <div className="space-y-1">
      <p className="text-sm font-semibold text-white">{title}</p>
      {description ? <p className="text-xs text-[#94A3B8]">{description}</p> : null}
    </div>
    <div className="space-y-3 text-sm text-[#CBD5E1]">{children}</div>
  </section>
)

export default InspectorSection
