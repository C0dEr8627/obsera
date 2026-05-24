import type { ProcessingStage as ProcessingStageKey } from '@/features/processing/types'

interface ProcessingStageProps {
  stage: ProcessingStageKey
}

const stageLabels: Record<ProcessingStageKey, string> = {
  idle: 'Idle',
  uploading: 'Uploading ZIP...',
  extracting: 'Extracting project files...',
  parsing: 'Parsing source files...',
  generatingGraph: 'Generating dependency graph...',
  detectingTechStack: 'Detecting technologies...',
  completed: 'Analysis complete',
  error: 'Processing error',
}

const ProcessingStageView = ({ stage }: ProcessingStageProps) => {
  return (
    <div key={stage} className="obsera-panel-in text-center">
      <p className="text-sm font-semibold text-white">
        {stageLabels[stage] ?? stage}
      </p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#64748B]">
        Project analysis pipeline
      </p>
    </div>
  )
}

export default ProcessingStageView
