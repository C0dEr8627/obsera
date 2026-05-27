interface CTASectionProps {
  onUploadClick: () => void
}

const workflowItems = [
  ['Upload', 'Drop a local ZIP archive into Obsera.'],
  ['Analyze', 'Parse files and generate dependency structure.'],
  ['Explore', 'Move between source, graph, and module context.'],
]

const CTASection = ({ onUploadClick }: CTASectionProps) => (
  <section className="obsera-surface p-5 sm:p-6">
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
      Upload ZIP File
    </button>
  </section>
)

export const WorkflowSection = () => (
  <section
    id="workflow"
    className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6"
  >
    <div className="relative overflow-hidden rounded-3xl border border-[#1F2A44] bg-[#07101F]/80 p-6 shadow-[0_0_60px_rgba(15,23,42,0.3)]">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-cyan-400/20 via-transparent to-indigo-400/20" />
      <div className="relative">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
              Analysis workflow
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#A6B0CF]">
              Follow the flow from upload to analysis to interactive exploration
              in a single browser-native experience.
            </p>
          </div>
          <div className="hidden md:block text-sm uppercase tracking-[0.18em] text-[#8EA1C3]">
            Flow-oriented code understanding
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {workflowItems.map(([title, description]) => (
            <div
              key={title}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#091625] p-5 text-white shadow-[0_15px_50px_-30px_rgba(14,165,233,0.5)]"
            >
              <div className="absolute -left-4 top-1/2 h-24 w-24 rounded-full bg-cyan-300/10 blur-2xl" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                {title}
              </p>
              <p className="relative mt-3 text-sm leading-6 text-[#A6B0CF]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

export default CTASection
