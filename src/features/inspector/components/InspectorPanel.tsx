import { useMemo } from 'react'
import { useDependencyGraph, useFileTree, useAppStore } from '@/store'
import type { FileTreeNode } from '@/types/fileNode'
import type { InspectorModuleInfo } from '../types'
import { generateModuleSummary } from '@/features/module-summary/utils/generateModuleSummary'
import InspectorSection from './InspectorSection'
import TechStackPanel from '@/features/tech-stack/components/TechStackPanel'

const findFileNodeById = (
  nodes: FileTreeNode[],
  fileId: string | null,
): FileTreeNode | null => {
  if (!fileId) {
    return null
  }

  for (const node of nodes) {
    if (node.type === 'file' && node.id === fileId) {
      return node
    }

    if (node.type === 'folder') {
      const match = findFileNodeById(node.children, fileId)
      if (match) {
        return match
      }
    }
  }

  return null
}

const getExtension = (path: string | undefined) =>
  path?.split('.').pop()?.toUpperCase() ?? 'UNKNOWN'

const buildInspectorModule = (
  selectedGraphNode: { id: string; label: string; filePath: string } | null,
  activeGraphNode: { id: string; label: string; filePath: string } | null,
  activeFile: FileTreeNode | null,
  graphEdges: { source: string; target: string }[],
): InspectorModuleInfo | null => {
  const activePath = activeFile?.path

  const moduleNode = selectedGraphNode
    ? selectedGraphNode
    : activeGraphNode
      ? activeGraphNode
      : activeFile?.type === 'file' && activePath
        ? { id: activeFile.id, label: activeFile.name, filePath: activePath }
        : null

  if (!moduleNode) {
    return null
  }

  const incoming = graphEdges.filter((edge) => edge.target === moduleNode.id)
  const outgoing = graphEdges.filter((edge) => edge.source === moduleNode.id)
  const importedModules = outgoing.map((edge) => edge.target)
  const importedByModules = incoming.map((edge) => edge.source)

  const summary = generateModuleSummary({
    fileName: moduleNode.label,
    filePath: moduleNode.filePath,
    importCount: outgoing.length,
    exportCount: incoming.length,
    importedModules,
    importedByModules,
    sourceCode:
      activeFile?.type === 'file' ? (activeFile.content ?? null) : null,
  })

  return {
    id: moduleNode.id,
    name: moduleNode.label,
    path: moduleNode.filePath,
    fileType: getExtension(moduleNode.filePath),
    importCount: outgoing.length,
    exportCount: incoming.length,
    importedModules,
    importedByModules,
    summary,
    source: selectedGraphNode ? 'graph' : 'file',
  }
}

const InspectorPanel = () => {
  const { graphNodes, graphEdges, selectedGraphNodeId } = useDependencyGraph()
  const { fileTree, activeFileId } = useFileTree()

  const activeFile = useMemo(
    () => findFileNodeById(fileTree, activeFileId),
    [fileTree, activeFileId],
  )

  const selectedGraphNode = useMemo(
    () => graphNodes.find((node) => node.id === selectedGraphNodeId) ?? null,
    [graphNodes, selectedGraphNodeId],
  )

  const activeGraphNode = useMemo(
    () =>
      activeFile
        ? (graphNodes.find((node) => node.filePath === activeFile.path) ?? null)
        : null,
    [graphNodes, activeFile],
  )

  const moduleInfo = useMemo(
    () =>
      buildInspectorModule(
        selectedGraphNode,
        activeGraphNode,
        activeFile,
        graphEdges,
      ),
    [selectedGraphNode, activeGraphNode, activeFile, graphEdges],
  )

  const zipTechStack = useAppStore((state) => state.zipTechStack)

  return (
    <aside className="flex min-h-0 w-full flex-col overflow-hidden rounded-3xl border border-[#1E293B] bg-[#0B1020] shadow-[0_24px_50px_-30px_rgba(0,0,0,0.7)] transition-colors duration-200">
      <div className="border-b border-[#1E293B] bg-[#111827] px-5 py-4">
        <p className="text-sm font-semibold text-white">Module Inspector</p>
        <p className="mt-1 text-xs text-[#94A3B8]">
          View metadata for the currently selected module or file.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-auto p-4 sm:p-5">
        {!moduleInfo ? (
          <div className="mx-auto flex w-full max-w-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#334155] bg-[#111827] p-6 text-center">
            <p className="text-sm font-semibold text-white">
              No module selected
            </p>
            <p className="mt-2 text-xs text-[#94A3B8]">
              Select a graph node or source file to see summary details and
              dependency metadata.
            </p>
          </div>
        ) : (
          <div key={moduleInfo.id} className="obsera-panel-in space-y-4">
            <InspectorSection
              title="Overview"
              description="Basic module metadata and selection source."
            >
              <div className="space-y-2">
                <div className="rounded-2xl bg-[#0F172A] p-3">
                  <p className="text-sm font-semibold text-white">
                    {moduleInfo.name}
                  </p>
                  <p className="truncate text-xs text-[#94A3B8]">
                    {moduleInfo.path}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#0F172A] p-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#94A3B8]">
                      File type
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {moduleInfo.fileType}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#0F172A] p-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#94A3B8]">
                      Source
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {moduleInfo.source === 'graph'
                        ? 'Dependency graph'
                        : 'File selection'}
                    </p>
                  </div>
                </div>
              </div>
            </InspectorSection>

            <InspectorSection
              title="Imports"
              description="Modules imported by the selected module."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#0F172A] p-3">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#94A3B8]">
                    Import count
                  </p>
                  <p className="mt-2 text-lg font-semibold text-cyan-300">
                    {moduleInfo.importCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#0F172A] p-3">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#94A3B8]">
                    Imported by
                  </p>
                  <p className="mt-2 text-lg font-semibold text-cyan-300">
                    {moduleInfo.exportCount}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Imported modules
                </p>
                {moduleInfo.importedModules.length > 0 ? (
                  <ul className="space-y-2">
                    {moduleInfo.importedModules.map((item) => (
                      <li
                        key={item}
                        className="rounded-2xl bg-[#0F172A] px-3 py-2 text-sm text-[#E2E8F0]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#94A3B8]">
                    No outgoing dependency records found.
                  </p>
                )}
              </div>
            </InspectorSection>

            <InspectorSection
              title="Dependencies"
              description="Modules that depend on the selected module."
            >
              {moduleInfo.importedByModules.length > 0 ? (
                <ul className="space-y-2">
                  {moduleInfo.importedByModules.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl bg-[#0F172A] px-3 py-2 text-sm text-[#E2E8F0]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[#94A3B8]">
                  No incoming dependency records found.
                </p>
              )}
            </InspectorSection>
            <InspectorSection
              title="Tech Stack"
              description="Detected technologies from package.json files."
            >
              <TechStackPanel items={zipTechStack} />
            </InspectorSection>

            <InspectorSection
              title="Summary"
              description="Lightweight note for the selected module."
            >
              <p className="rounded-2xl bg-[#0F172A] p-3 text-sm text-[#CBD5E1]">
                {moduleInfo.summary}
              </p>
            </InspectorSection>
          </div>
        )}
      </div>
    </aside>
  )
}

export default InspectorPanel
