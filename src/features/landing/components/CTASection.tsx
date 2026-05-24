interface CTASectionProps {
  onUploadClick: () => void
}

const workflowItems = [
  ['Upload', 'Drop a local ZIP archive into Obsera.'],
  ['Analyze', 'Parse files and generate dependency structure.'],
  ['Explore', 'Move between source, graph, and module context.'],
]

const CTASection = ({ onUploadClick }: CTASectionProps) => (
  <section
    id="workflow"
    className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-12 sm:px-6 lg:grid-cols-[1fr_360px]"
  >
    <div className="obsera-surface p-5 sm:p-6">
      <p className="text-sm font-semibold text-white">Analysis workflow</p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {workflowItems.map(([title, description]) => (
          <div
            key={title}
            className="rounded-lg border border-[#1E293B] bg-[#0B1020] p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
              {title}
            </p>
            <p className="mt-3 text-sm leading-6 text-[#A6B0CF]">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>

    <div id="privacy" className="obsera-surface p-5 sm:p-6">
      <p className="text-sm font-semibold text-white">Start privately</p>
      <p className="mt-3 text-sm leading-6 text-[#A6B0CF]">
        Upload a ZIP from your machine and begin exploring structure, imports,
        and relationships in the same browser session.
      </p>
      <button
        type="button"
        onClick={onUploadClick}
        className="obsera-focus-ring mt-5 h-10 rounded-md border border-cyan-300/30 bg-cyan-300/10 px-4 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-300/16 hover:text-white"
      >
        Open Upload Flow
      </button>
    </div>
  </section>
)

export default CTASection
