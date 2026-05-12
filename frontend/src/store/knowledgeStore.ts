import type { KnowledgeGraphData, KnowledgePoint } from "@/types";
import { create } from "zustand";

interface KnowledgeState {
  nodes: KnowledgePoint[];
  graphData: KnowledgeGraphData | null;
  selectedNode: KnowledgePoint | null;
  loading: boolean;
  setNodes: (nodes: KnowledgePoint[]) => void;
  setGraphData: (data: KnowledgeGraphData) => void;
  setSelectedNode: (node: KnowledgePoint | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useKnowledgeStore = create<KnowledgeState>((set) => ({
  nodes: [],
  graphData: null,
  selectedNode: null,
  loading: false,
  setNodes: (nodes) => set({ nodes }),
  setGraphData: (data) => set({ graphData: data }),
  setSelectedNode: (node) => set({ selectedNode: node }),
  setLoading: (loading) => set({ loading }),
}));
