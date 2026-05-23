export type TechStackCategory = 'frontend' | 'backend' | 'language' | 'tooling'

export type TechStackSource = 'dependencies' | 'devDependencies' | 'both'

export interface TechStackItem {
  name: string
  category: TechStackCategory
  source: TechStackSource
  version?: string
}
