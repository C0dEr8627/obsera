interface HeroSectionProps {
  onUploadClick: () => void
}

const graphNodes = [
  'left-[12%] top-[24%]',
  'left-[24%] top-[58%]',
  'left-[43%] top-[31%]',
  'left-[58%] top-[66%]',
  'left-[74%] top-[38%]',
  'left-[86%] top-[60%]',
]

const HeroGraphScene = () => (
  <div
    className="pointer-events-none absolute inset-0 overflow-hidden"
    aria-hidden="true"
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(45,58,140,0.34),transparent_34%),radial-gradient(circle_at_72%_42%,rgba(34,211,238,0.12),transparent_32%)]" />
    <div
      className="absolute inset-0 opacity-50"
      style={{
        backgroundImage:
          'linear-gradient(rgba(148, 163, 184, 0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.055) 1px, transparent 1px)',
        backgroundSize: '42px 42px',
      }}
    />
    <div className="absolute left-[13%] top-[30%] h-px w-[34%] rotate-[17deg] bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
    <div className="absolute left-[29%] top-[60%] h-px w-[32%] -rotate-[22deg] bg-gradient-to-r from-transparent via-indigo-300/45 to-transparent" />
    <div className="absolute left-[48%] top-[39%] h-px w-[31%] rotate-[28deg] bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />
    <div className="absolute left-[61%] top-[62%] h-px w-[25%] -rotate-[24deg] bg-gradient-to-r from-transparent via-indigo-200/40 to-transparent" />
    {graphNodes.map((position, index) => (
      <span
        key={position}
        className={`absolute ${position} h-3 w-3 rounded-full border border-cyan-200/55 bg-[#0B1020] shadow-[0_0_24px_rgba(34,211,238,0.35)]`}
        style={{ animationDelay: `${index * 130}ms` }}
      />
    ))}
  </div>
)

const HeroSection = ({ onUploadClick }: HeroSectionProps) => (
  <section className="relative isolate flex min-h-[calc(100svh-10rem)] items-center overflow-hidden px-4 py-16 sm:px-6 sm:py-20">
    <HeroGraphScene />
    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--obsera-bg)] to-transparent" />

    <div className="relative z-10 mx-auto w-full max-w-7xl">
      <div className="max-w-3xl">
        <p className="mb-4 inline-flex rounded-md border border-cyan-300/20 bg-cyan-300/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
          Browser-native codebase exploration
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
          Visualize and understand codebases directly in the browser.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#A6B0CF] sm:text-lg">
          Obsera turns a local project ZIP into a source tree, dependency graph,
          and focused module insight without sending your code away.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onUploadClick}
            className="obsera-focus-ring h-11 rounded-md bg-[#2D3A8C] px-5 text-sm font-semibold text-white transition duration-150 hover:bg-[#3648AD] hover:shadow-[0_0_26px_rgba(34,211,238,0.16)]"
          >
            Upload ZIP File
          </button>
          <p className="text-sm text-[#8EA1C3]">
            Local-first analysis for private repositories and prototypes.
          </p>
        </div>
      </div>
    </div>
  </section>
)

export default HeroSection
