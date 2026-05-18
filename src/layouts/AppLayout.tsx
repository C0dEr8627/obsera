const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#0B1020] text-[#E6EAF5]">
      <header className="h-14 border-b border-[#1E293B] bg-[#121A33] px-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-wide">
          Obsera
        </h1>

        <div className="flex items-center gap-2">
          <button className="px-4 py-1.5 rounded-md bg-[#2D3A8C] text-sm">
            Code View
          </button>

          <button className="px-4 py-1.5 rounded-md bg-[#1A2448] text-sm text-[#A6B0CF]">
            Visual View
          </button>
        </div>
      </header>

      <main className="h-[calc(100vh-56px)] flex items-center justify-center">
        <div className="text-[#6B7390] text-sm">
          Workspace will be implemented in Epic 2
        </div>
      </main>
    </div>
  )
}

export default AppLayout