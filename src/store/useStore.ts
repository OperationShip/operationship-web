import { create } from 'zustand';
import { Node, Edge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from 'reactflow';

interface OperationState {
  // 1. Graph State
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;

  // 2. UI State
  chatInput: string;
  setChatInput: (input: string) => void;
  isAiPanelOpen: boolean;
  toggleAiPanel: () => void;
  isUnitEconomicsOn: boolean;
  toggleUnitEconomics: () => void;

  // 3. The @Mention System
  targetNode: (nodeId: string) => void;
}

// Initial Data moved out of the UI and into the logic layer
const initialNodes: Node[] = [
  { 
    id: 'node_1', type: 'operationNode',
    position: { x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 100 }, 
    data: { 
      title: 'Local Leather Supplier',
      description: 'Provides raw materials via JIT logistics.',
      status: 'active', tierRequired: 'free', isSelected: false,
      metrics: { monthlyCost: 4500, riskScore: 8 }
    } 
  },
  { 
    id: 'node_2', type: 'operationNode',
    position: { x: window.innerWidth / 2 + 50, y: window.innerHeight / 2 - 50 }, 
    data: { 
      title: 'AI Tax Optimization',
      description: 'Automated legal structuring to reduce tariffs.',
      status: 'ghost', tierRequired: 'pro', isSelected: false,
    } 
  },
];

export const useStore = create<OperationState>((set, get) => ({
  nodes: initialNodes,
  edges: [],
  
  // Required by React Flow to allow dragging and dropping nodes
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  chatInput: '',
  setChatInput: (input) => set({ chatInput: input }),
  
  isAiPanelOpen: false,
  toggleAiPanel: () => set({ isAiPanelOpen: !get().isAiPanelOpen }),
  
  isUnitEconomicsOn: false,
  toggleUnitEconomics: () => set({ isUnitEconomicsOn: !get().isUnitEconomicsOn }),

  // The @Mention Logic: Selects the node and injects it into the chat bar
  targetNode: (nodeId) => {
    const { nodes, chatInput } = get();
    
    // Update the visual glow ring on the nodes
    const updatedNodes = nodes.map(node => ({
      ...node,
      data: { ...node.data, isSelected: node.id === nodeId }
    }));

    // Inject the tag into the chat box cleanly
    const tag = `@${nodeId} `;
    const newChatInput = chatInput.includes(tag) ? chatInput : `${chatInput} ${tag}`.trim();

    set({ nodes: updatedNodes, chatInput: newChatInput });
  }
}));
