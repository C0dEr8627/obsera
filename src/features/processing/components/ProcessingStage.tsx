import type { ProcessingStage } from '@/features/processing/types'

interface ProcessingStageProps {
  stage: ProcessingStage
}

const stageLabels: Record<ProcessingStage, string> = {
  idle: 'Idle',
  uploading: 'Uploading ZIP...',
  extracting: 'Extracting project files...',
  parsing: 'Parsing source files...',
  generatingGraph: 'Generating dependency graph...',
  detectingTechStack: 'Detecting technologies...',
  completed: 'Analysis complete',
  error: 'Processing error',
}

const ProcessingStage = ({ stage }: ProcessingStageProps) => {
  return (
    <div className="text-center">
      <p className="text-sm font-semibold text-white">{stageLabels[stage] ?? stage}</p>
    </div>
  )
}

export default ProcessingStage
