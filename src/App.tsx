import React from 'react';
import { Handle, Position } from 'reactflow';
import { Lock, Target, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper to merge Tailwind classes cleanly
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function OperationNode({ data, id }: any) {
  const isGhost = data.status === 'ghost';
  // Simulate Stripe check: if node needs 'pro', lock it (we'll assume free tier for now)
  const isLocked = data.tierRequired === 'pro'; 
  const hasMetrics = !!data.metrics;

  return (
    <div className={cn(
      "relative min-w-[280px] max-w-[320px] rounded-xl border p-4 backdrop-blur-glass transition-all duration-300",
      isGhost ? "bg-operation-ghost border-operation-border/50 border-dashed" : "bg-operation-panel border-operation-border shadow-xl",
      data.isSelected ? "ring-2 ring-operation-accent shadow-[0_0_20px_rgba(59,130,246,0.2)]" : ""
    )}>
      
      {/* Top Connection Point */}
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-600 border-2 border-operation-dark" />

      {/* Header Area */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {isLocked ? (
            <Lock size={14} className="text-gray-500" />
          ) : (
            <div className={cn("w-2 h-2 rounded-full", isGhost ? "bg-gray-600" : "bg-operation-accent")} />
          )}
          <h3 className={cn("font-bold text-sm tracking-wide", isGhost ? "text-gray-400" : "text-white")}>
            {data.title}
          </h3>
        </div>

        {/* @Mention Target Button */}
        <button 
          className={cn(
            "p-1.5 rounded-lg transition-colors cursor-pointer z-10",
            data.isSelected ? "bg-operation-accent text-white" : "bg-operation-dark border border-operation-border text-gray-400 hover:text-white"
          )}
          title="Target node for @mention edit"
        >
          <Target size={14} />
        </button>
      </div>

      {/* Main Paragraph */}
      <p className={cn("text-xs leading-relaxed", isGhost ? "text-gray-500" : "text-gray-400")}>
        {isLocked ? "Upgrade to Pro to view operational mechanics, hidden costs, and automation strategies." : data.description}
      </p>

      {/* Unit Economics Dropdown (Appears only if Toggle is ON and Data exists) */}
      {hasMetrics && !isLocked && (
        <div className="mt-4 pt-3 border-t border-operation-border flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-0.5">Monthly Cost</span>
            <span className="text-sm text-white font-mono">${data.metrics.monthlyCost.toLocaleString()}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-0.5">Risk Score</span>
            <span className={cn(
              "text-sm font-mono font-bold",
              data.metrics.riskScore > 7 ? "text-operation-danger" : "text-emerald-400"
            )}>
              {data.metrics.riskScore}/10
            </span>
          </div>
        </div>
      )}

      {/* Ghost Node Reject Button (Top Right Floating) */}
      {isGhost && (
        <button className="absolute -top-3 -right-3 bg-operation-dark border border-operation-border text-gray-400 hover:text-operation-danger rounded-full p-1.5 shadow-lg transition-colors z-10">
          <Plus size={14} className="rotate-45" />
        </button>
      )}

      {/* Bottom Connection Point */}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-operation-accent border-2 border-operation-dark" />
    </div>
  );
}
      {/* 2. THE COMMAND MENU (Top Right) */}
      <div className="absolute top-6 right-6 z-10 flex gap-4">
        {/* Unit Economics Toggle */}
        <button 
          onClick={() => setIsUnitEconomicsOn(!isUnitEconomicsOn)}
          className={`flex items-center gap-3 bg-operation-glass backdrop-blur-glass border border-operation-border px-4 py-2 rounded-full shadow-lg transition-all ${
            isUnitEconomicsOn ? 'border-operation-accent/50 bg-operation-accent/10' : 'hover:bg-operation-panel'
          }`}
        >
          <span className="text-xs font-bold tracking-wider text-gray-400">UNIT ECONOMICS</span>
          <div className={`w-8 h-4 rounded-full relative transition-colors ${
            isUnitEconomicsOn ? 'bg-operation-accent' : 'bg-gray-700'
          }`}>
            <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
              isUnitEconomicsOn ? 'translate-x-4' : 'translate-x-0'
            }`} />
          </div>
        </button>
        
        {/* Settings / Location / Flexibility */}
        <button className="bg-operation-glass backdrop-blur-glass border border-operation-border p-2.5 rounded-full hover:bg-operation-panel transition text-gray-300 shadow-lg">
          <Settings size={18} />
        </button>
      </div>

      {/* 3. AI STRATEGY TOGGLE (Top Left) */}
      <button 
        onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
        className="absolute top-6 left-6 z-10 bg-operation-glass backdrop-blur-glass border border-operation-border px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-operation-panel transition shadow-lg group"
      >
        <Sparkles size={18} className="text-operation-accent group-hover:animate-pulse" />
        <span className="text-sm font-semibold tracking-wide">System Insights</span>
      </button>

      {/* 4. AI INSIGHTS SIDEBAR */}
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

      {/* 5. THE AI CHAT BAR (Bottom Center) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-2xl">
        <div className="bg-operation-glass backdrop-blur-glass border border-operation-border rounded-2xl shadow-2xl p-2 flex flex-col gap-2 transition-all focus-within:border-operation-accent/50 focus-within:ring-1 focus-within:ring-operation-accent/50">
          
          <div className="flex items-center gap-3 px-3">
            <button className="text-gray-400 hover:text-operation-accent transition p-1" title="Target specific node">
              <Target size={20} />
            </button>
            <input 
              type="text" 
              placeholder="E.g., Design a subscription model for local coffee beans..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 py-3"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button className="bg-white text-black p-2.5 rounded-xl hover:bg-gray-200 transition flex items-center justify-center">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
