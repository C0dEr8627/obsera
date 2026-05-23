import type { TechStackItem, TechStackCategory, TechStackSource } from '@/features/tech-stack/types'

interface PackageJsonRecord {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

interface PackageJsonFile {
  path: string
  content?: string
}

const createTechStackItem = (
  name: string,
  category: TechStackCategory,
  source: TechStackSource,
  version?: string,
): TechStackItem => ({
  name,
  category,
  source,
  version,
})

const dependencyEvidence = [
  {
    name: 'React',
    category: 'frontend' as const,
    packages: ['react', 'react-dom'],
  },
  {
    name: 'Next.js',
    category: 'frontend' as const,
    packages: ['next'],
  },
  {
    name: 'Vue',
    category: 'frontend' as const,
    packages: ['vue'],
  },
  {
    name: 'Angular',
    category: 'frontend' as const,
    packages: ['@angular/core'],
  },
  {
    name: 'Vite',
    category: 'frontend' as const,
    packages: ['vite'],
  },
  {
    name: 'TailwindCSS',
    category: 'frontend' as const,
    packages: ['tailwindcss'],
  },
  {
    name: 'Express',
    category: 'backend' as const,
    packages: ['express'],
  },
  {
    name: 'NestJS',
    category: 'backend' as const,
    packages: ['@nestjs/core'],
  },
  {
    name: 'Fastify',
    category: 'backend' as const,
    packages: ['fastify'],
  },
  {
    name: 'TypeScript',
    category: 'language' as const,
    packages: ['typescript'],
  },
  {
    name: 'Webpack',
    category: 'tooling' as const,
    packages: ['webpack'],
  },
  {
    name: 'ESLint',
    category: 'tooling' as const,
    packages: ['eslint'],
  },
  {
    name: 'Prettier',
    category: 'tooling' as const,
    packages: ['prettier'],
  },
]

const isDependencyObject = (
  value: unknown,
): value is Record<string, string> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const toDependencies = (
  rawDependencies: unknown,
): Record<string, string> | undefined => {
  if (!isDependencyObject(rawDependencies)) {
    return undefined
  }

  return Object.entries(rawDependencies).reduce<Record<string, string>>(
    (dependencies, [packageName, packageValue]) => {
      if (typeof packageValue === 'string') {
        dependencies[packageName] = packageValue
      }
      return dependencies
    },
    {},
  )
}

const normalizePackageJsonPath = (path: string) =>
  path.replace(/\\/g, '/').toLowerCase()

const isPackageJsonPath = (path: string) =>
  normalizePackageJsonPath(path).endsWith('/package.json') ||
  normalizePackageJsonPath(path) === 'package.json'

const getSource = (
  packageName: string,
  dependencies: Record<string, string> | undefined,
  devDependencies: Record<string, string> | undefined,
): TechStackSource => {
  const hasDependency = dependencies?.hasOwnProperty(packageName)
  const hasDevDependency = devDependencies?.hasOwnProperty(packageName)

  if (hasDependency && hasDevDependency) {
    return 'both'
  }

  return hasDependency ? 'dependencies' : 'devDependencies'
}

const getVersion = (
  packageName: string,
  dependencies: Record<string, string> | undefined,
  devDependencies: Record<string, string> | undefined,
): string | undefined => {
  return dependencies?.[packageName] ?? devDependencies?.[packageName]
}

const mergeTechnology = (
  existing: TechStackItem,
  incoming: TechStackItem,
): TechStackItem => ({
  name: existing.name,
  category: existing.category,
  source:
    existing.source === incoming.source
      ? existing.source
      : existing.source === 'both' || incoming.source === 'both'
      ? 'both'
      : 'both',
  version: existing.version || incoming.version,
})

export const detectTechStack = (
  files: Array<PackageJsonFile>,
): TechStackItem[] => {
  const normalizedTechStack = new Map<string, TechStackItem>()

  for (const file of files) {
    if (!file.content || !isPackageJsonPath(file.path)) {
      continue
    }

    let parsed: unknown

    try {
      parsed = JSON.parse(file.content)
    } catch {
      continue
    }

    if (typeof parsed !== 'object' || parsed === null) {
      continue
    }

    const dependencies = toDependencies((parsed as PackageJsonRecord).dependencies)
    const devDependencies = toDependencies(
      (parsed as PackageJsonRecord).devDependencies,
    )

    if (!dependencies && !devDependencies) {
      continue
    }

    for (const rule of dependencyEvidence) {
      for (const packageName of rule.packages) {
        if (
          dependencies?.hasOwnProperty(packageName) ||
          devDependencies?.hasOwnProperty(packageName)
        ) {
          const source = getSource(packageName, dependencies, devDependencies)
          const version = getVersion(packageName, dependencies, devDependencies)
          const techStackItem = createTechStackItem(
            rule.name,
            rule.category,
            source,
            version,
          )

          const existing = normalizedTechStack.get(rule.name)

          if (existing) {
            normalizedTechStack.set(rule.name, mergeTechnology(existing, techStackItem))
          } else {
            normalizedTechStack.set(rule.name, techStackItem)
          }

          break
        }
      }
    }
  }

  return Array.from(normalizedTechStack.values()).sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category)
    }
    return a.name.localeCompare(b.name)
  })
}
