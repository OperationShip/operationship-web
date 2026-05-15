import { create } from 'zustand';
import { Node, Edge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from 'reactflow';

// THE NERVOUS SYSTEM CONNECTION
const API_URL = 'https://operationship-api.vercel.app/api/generate';

interface OperationState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  chatInput: string;
  setChatInput: (input: string) => void;
  isAiPanelOpen: boolean;
  toggleAiPanel: () => void;
  isUnitEconomicsOn: boolean;
  toggleUnitEconomics: () => void;
  targetNode: (nodeId: string) => void;
  
  // NEW: AI Execution Logic
  isGenerating: boolean;
  submitCommand: () => Promise<void>;
}

const initialNodes: Node[] = [
  { 
    id: 'node_start', type: 'operationNode',
    position: { x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 100 }, 
    data: { 
      title: 'Awaiting Commands...',
      description: 'System online. Enter a business concept below to initialize architecture.',
      status: 'active', tierRequired: 'free', isSelected: false,
    } 
  }
];

export const useStore = create<OperationState>((set, get) => ({
  nodes: initialNodes,
  edges: [],
  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  chatInput: '',
  setChatInput: (input) => set({ chatInput: input }),
  isAiPanelOpen: false,
  toggleAiPanel: () => set({ isAiPanelOpen: !get().isAiPanelOpen }),
  isUnitEconomicsOn: false,
  toggleUnitEconomics: () => set({ isUnitEconomicsOn: !get().isUnitEconomicsOn }),
  targetNode: (nodeId) => {
    const { nodes, chatInput } = get();
    const updatedNodes = nodes.map(node => ({
      ...node,
      data: { ...node.data, isSelected: node.id === nodeId }
    }));
    const tag = `@${nodeId} `;
    const newChatInput = chatInput.includes(tag) ? chatInput : `${chatInput} ${tag}`.trim();
    set({ nodes: updatedNodes, chatInput: newChatInput });
  },

  // NEW: The Core Execution Engine
  isGenerating: false,
  submitCommand: async () => {
    const { chatInput, nodes, edges } = get();
    if (!chatInput.trim()) return;

    set({ isGenerating: true });

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: chatInput,
          currentGraph: { nodes, edges }
        })
      });

      if (!response.ok) throw new Error("Architect API unreachable");

      const aiGraph = await response.json();
      
      // Merge AI response into the UI
      set({ 
        nodes: aiGraph.nodes || nodes, 
        edges: aiGraph.edges || edges,
        chatInput: '', // Clear the bar after success
        isGenerating: false
      });

    } catch (error) {
      console.error("System Failure:", error);
      set({ isGenerating: false });
      alert("Error: The Architect failed to process the request. Check API logs.");
    }
  }
}));
