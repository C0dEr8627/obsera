import type { ModuleSummaryInput } from '../types'

const normalizeName = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-.]/g, ' ')
    .trim()
    .toLowerCase()
    .split(/\s+/)

const formatToken = (token: string) => token.replace(/([A-Z])/g, ' $1').trim().toLowerCase()

const getComponentName = (sourceCode?: string | null) => {
  if (!sourceCode) {
    return null
  }

  const patterns = [
    /export\s+default\s+function\s+([A-Z][A-Za-z0-9_]*)/,
    /function\s+([A-Z][A-Za-z0-9_]*)\s*\(/,
    /export\s+default\s+class\s+([A-Z][A-Za-z0-9_]*)/,
    /class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+(React\.|Component)/,
    /const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*(?:\(|React\.forwardRef|memo|forwardRef)/,
    /export\s+const\s+([A-Z][A-Za-z0-9_]*)\s*=/,
  ]

  for (const pattern of patterns) {
    const match = sourceCode.match(pattern)
    if (match?.[1]) {
      return match[1]
    }
  }

  return null
}

const hasReactImport = (sourceCode?: string | null) =>
  !!sourceCode?.match(/from\s+['"]react['"]/)

const getPrioritySummary = (words: string[], fileType: string) => {
  const has = (term: string) => words.includes(term)

  if (has('navbar') || (has('nav') && has('bar'))) {
    return 'React component responsible for application navigation UI.'
  }
  if (has('navigation')) {
    return 'React component responsible for application navigation UI.'
  }
  if (has('sidebar')) {
    return 'React component rendering a sidebar navigation panel.'
  }
  if (has('header')) {
    return 'React component rendering the application header.'
  }
  if (has('footer')) {
    return 'React component rendering the page footer.'
  }
  if (has('modal')) {
    return 'React component rendering a modal dialog.'
  }
  if (has('toast')) {
    return 'React component handling toast notifications.'
  }
  if (has('form')) {
    return 'React component managing form UI and inputs.'
  }
  if (has('page') || has('screen')) {
    return 'React page component for a route-level view.'
  }
  if (has('api') || has('client')) {
    return 'Utility module handling API requests and network communication.'
  }
  if (has('service')) {
    return 'Utility module providing service functions and external interaction helpers.'
  }
  if (has('router')) {
    return 'Routing module defining application route configuration.'
  }
  if (has('store')) {
    return 'State management module exposing shared application state.'
  }
  if (has('types') || has('interfaces')) {
    return 'Type definition module describing application data structures.'
  }
  if (has('config')) {
    return 'Configuration module defining application settings.'
  }
  if (has('util') || has('helper') || has('helpers')) {
    return 'Utility module with reusable helper functions.'
  }
  if (has('hook')) {
    return 'Custom React hook module encapsulating reusable logic.'
  }
  if (has('context')) {
    return 'React context module exposing shared application data.'
  }
  if (has('theme') || has('style') || has('styles')) {
    return 'Theme module defining visual style tokens and design settings.'
  }
  if (has('schema')) {
    return 'Schema module defining data validation or structure.'
  }
  if (has('constants') || has('const')) {
    return 'Constants module defining shared static values.'
  }

  if (fileType === 'TSX' || fileType === 'JSX') {
    return 'React component module rendering UI.'
  }

  return null
}

const getGenericSummary = (
  fileName: string,
  fileType: string,
  importCount: number,
  exportCount: number,
) => {
  if (fileType === 'TSX' || fileType === 'JSX') {
    return 'React component module rendering UI.'
  }

  if (exportCount > 0 && importCount > 0) {
    return 'Module exporting shared functionality and importing dependencies.'
  }

  if (exportCount > 0) {
    return 'Module exporting functionality for use across the application.'
  }

  if (importCount > 0) {
    return 'Module importing dependencies and providing helper logic.'
  }

  return `Module representing application code for ${fileName}.`
}

export const generateModuleSummary = ({
  fileName,
  importCount,
  exportCount,
  sourceCode,
}: ModuleSummaryInput): string => {
  const fileType = fileName.split('.').pop()?.toUpperCase() ?? 'UNKNOWN'
  const baseName = fileName.split('.').slice(0, -1).join('.') || fileName
  const words = normalizeName(baseName)
  const candidate = getPrioritySummary(words, fileType)

  if (candidate) {
    return candidate
  }

  const componentName = getComponentName(sourceCode)
  if (componentName && (fileType === 'TSX' || fileType === 'JSX')) {
    return `React component rendering ${formatToken(componentName)}.`
  }

  if (sourceCode && hasReactImport(sourceCode) && (fileType === 'TSX' || fileType === 'JSX')) {
    return 'React component module rendering UI.'
  }

  return getGenericSummary(baseName, fileType, importCount, exportCount)
}
