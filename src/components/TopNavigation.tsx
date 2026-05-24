import { type MouseEventHandler } from 'react'

export type WorkspaceView = 'code' | 'visual'

interface TopNavigationProps {
  activeView: WorkspaceView
  onChange: (view: WorkspaceView) => void
}

const viewOptions: { id: WorkspaceView; label: string }[] = [
  { id: 'code', label: 'Code View' },
  { id: 'visual', label: 'Visual View' },
]

const TopNavigation = ({ activeView, onChange }: TopNavigationProps) => {
  const buttonClasses = (isActive: boolean) =>
    `obsera-focus-ring min-w-[110px] rounded-md px-4 py-1.5 text-sm font-medium transition duration-150 ${
      isActive
        ? 'bg-[#2D3A8C] text-white shadow-sm shadow-cyan-500/10'
        : 'bg-[#1A2448] text-[#A6B0CF] hover:bg-[#232f5c] hover:text-white'
    }`

  const handleClick =
    (view: WorkspaceView): MouseEventHandler<HTMLButtonElement> =>
    () =>
      onChange(view)

  return (
    <nav className="flex flex-col gap-2 sm:flex-row sm:gap-2">
      {viewOptions.map((option) => {
        const isActive = option.id === activeView
        return (
          <button
            key={option.id}
            type="button"
            className={buttonClasses(isActive)}
            aria-pressed={isActive}
            onClick={handleClick(option.id)}
          >
            {option.label}
          </button>
        )
      })}
    </nav>
  )
}

export default TopNavigation
