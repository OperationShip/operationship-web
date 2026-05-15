import { useMemo } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import { Settings, Sparkles, Send, Target, Zap } from 'lucide-react';
import OperationNode from './components/OperationNode';
import { useStore } from './store/useStore';

export default function App() {
  // Connect directly to the centralized Brain
  const { 
    nodes, edges, onNodesChange, onEdgesChange,
    chatInput, setChatInput,
    isAiPanelOpen, toggleAiPanel,
    isUnitEconomicsOn, toggleUnitEconomics,
    isGenerating, submitCommand
  } = useStore();

  const nodeTypes = useMemo(() => ({ operationNode: OperationNode }), []);

  return (
    <div className="relative w-screen h-screen">
      
      <div className="absolute inset-0 z-0">
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes} 
          fitView
        >
          <Background color="#262626" gap={24} size={2} />
          <Controls className="!bg-operation-panel !border-operation-border !fill-white shadow-xl" />
        </ReactFlow>
      </div>

      {/* MENU BAR */}
      <div className="absolute top-6 right-6 z-10 flex gap-4">
        <button 
          onClick={toggleUnitEconomics}
          className={`flex items-center gap-3 bg-operation-glass backdrop-blur-glass border border-operation-border px-4 py-2 rounded-full shadow-lg transition-all ${
            isUnitEconomicsOn ? 'border-operation-accent/50 bg-operation-accent/10' : 'hover:bg-operation-panel'
          }`}
        >
          <span className="text-xs font-bold tracking-wider text-gray-400">UNIT ECONOMICS</span>
          <div className={`w-8 h-4 rounded-full relative transition-colors ${isUnitEconomicsOn ? 'bg-operation-accent' : 'bg-gray-700'}`}>
            <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isUnitEconomicsOn ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </button>
        <button className="bg-operation-glass backdrop-blur-glass border border-operation-border p-2.5 rounded-full hover:bg-operation-panel transition text-gray-300 shadow-lg">
          <Settings size={18} />
        </button>
      </div>

      {/* LEFT PANEL TOGGLE */}
      <button 
        onClick={toggleAiPanel}
        className="absolute top-6 left-6 z-10 bg-operation-glass backdrop-blur-glass border border-operation-border px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-operation-panel transition shadow-lg group"
      >
        <Sparkles size={18} className="text-operation-accent group-hover:animate-pulse" />
        <span className="text-sm font-semibold tracking-wide">System Insights</span>
      </button>

      {/* LEFT PANEL */}
      {isAiPanelOpen && (
        <div className="absolute top-20 left-6 z-10 w-80 max-h-[calc(100vh-160px)] bg-operation-glass backdrop-blur-glass border border-operation-border rounded-xl shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-left-4 fade-in duration-200">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-yellow-400" />
            <h2 className="text-sm font-bold tracking-wide uppercase text-gray-200">Operational Reality</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            Waiting for system generation... Enter a business idea below to begin architectural simulation.
          </p>
        </div>
      )}

      {/* CHAT BAR */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-2xl">
        <div className="bg-operation-glass backdrop-blur-glass border border-operation-border rounded-2xl shadow-2xl p-2 flex flex-col gap-2 transition-all focus-within:border-operation-accent/50 focus-within:ring-1 focus-within:ring-operation-accent/50">
          <div className="flex items-center gap-3 px-3">
            <button className="text-gray-400 hover:text-operation-accent transition p-1" title="Target specific node">
              <Target size={20} />
            </button>
            <input 
              type="text" 
              placeholder={isGenerating ? "Architect is simulating..." : "E.g., Design a subscription model for local coffee beans..."}
              className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 py-3 disabled:opacity-50"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitCommand();
              }}
              disabled={isGenerating}
            />
            <button 
              onClick={() => submitCommand()}
              disabled={isGenerating}
              className="bg-white text-black p-2.5 rounded-xl hover:bg-gray-200 transition flex items-center justify-center disabled:opacity-50"
            >
              <Send size={18} className={isGenerating ? "animate-pulse" : ""} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
