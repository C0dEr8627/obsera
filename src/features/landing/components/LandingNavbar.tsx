const LandingNavbar = () => (
  <header className="relative z-20 border-b border-white/10 bg-[#08101F]/82 backdrop-blur">
    <nav
      className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6"
      aria-label="Landing navigation"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-sm font-bold text-cyan-100">
          O
        </span>
        <div>
          <p className="text-base font-semibold tracking-wide text-white">
            Obsera
          </p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#8EA1C3]">
            Local code visibility
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-6 text-sm text-[#A6B0CF] sm:flex">
        <a className="transition hover:text-white" href="#workflow">
          Workflow
        </a>
        <a className="transition hover:text-white" href="#privacy">
          Privacy
        </a>
      </div>
    </nav>
  </header>
)

export default LandingNavbar
