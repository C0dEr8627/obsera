interface CTASectionProps {
  onUploadClick: () => void
}

const workflowItems = [
  ['Upload', 'Drop a local ZIP archive into Obsera.'],
  ['Analyze', 'Parse files and generate dependency structure.'],
  ['Explore', 'Move between source, graph, and module context.'],
]

const CTASection = ({ onUploadClick }: CTASectionProps) => (
  <section className="flex h-full min-h-[320px] items-center lg:min-h-[calc(100svh-10rem)]">
    <div className="w-full rounded-3xl border border-white/10 bg-[#07111F]/90 p-6 shadow-[0_24px_60px_-36px_rgba(14,165,233,0.45)] backdrop-blur sm:p-8">
      <p className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
        Start privately
      </p>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-[1.9rem]">
        Upload a ZIP and begin in the browser.
      </h2>
      <p className="mt-4 max-w-md text-base leading-7 text-[#A6B0CF]">
        Use your local project archive to explore structure, imports, and
        relationships without sending code to a remote service.
      </p>
      <button
        type="button"
        onClick={onUploadClick}
        className="obsera-focus-ring mt-6 inline-flex h-12 items-center rounded-md bg-[#2D3A8C] px-5 text-sm font-semibold text-white transition duration-150 hover:bg-[#3648AD] hover:shadow-[0_0_26px_rgba(34,211,238,0.16)]"
      >
        Upload ZIP File
      </button>
    </div>
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
