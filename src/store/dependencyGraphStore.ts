import { useAppStore } from '@/store/appStore'
import type {
  DependencyGraphEdge,
  DependencyGraphNode,
  DependencyGraphSlice as DependencyGraphState,
} from '@/store/slices/dependencyGraphSlice'

export const useDependencyGraph = (): DependencyGraphState =>
  ({
    graphNodes: useAppStore((state) => state.graphNodes),
    graphEdges: useAppStore((state) => state.graphEdges),
    selectedGraphNodeId: useAppStore((state) => state.selectedGraphNodeId),
    setGraphNodes: useAppStore((state) => state.setGraphNodes),
    setGraphEdges: useAppStore((state) => state.setGraphEdges),
    setDependencyGraph: useAppStore((state) => state.setDependencyGraph),
    setSelectedGraphNodeId: useAppStore((state) => state.setSelectedGraphNodeId),
    resetDependencyGraph: useAppStore((state) => state.resetDependencyGraph),
  })

export type { DependencyGraphEdge, DependencyGraphNode, DependencyGraphState }
