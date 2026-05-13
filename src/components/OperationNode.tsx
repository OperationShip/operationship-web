import { Handle, Position } from 'reactflow';
import { Lock, Target, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useStore } from '../store/useStore'; 

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function OperationNode({ data, id }: any) {
  const targetNode = useStore((state) => state.targetNode); 
  const isGhost = data.status === 'ghost';
  const isLocked = data.tierRequired === 'pro'; 
  const hasMetrics = !!data.metrics;
  const isUnitEconomicsOn = useStore((state) => state.isUnitEconomicsOn);

  return (
    <div className={cn(
      "relative min-w-[280px] max-w-[320px] rounded-2xl p-5 transition-all duration-500 group",
      // True Glassmorphism: Semi-transparent dark background, strong blur, subtle white inner border
      isGhost 
        ? "bg-white/[0.02] border border-white/10 border-dashed backdrop-blur-xl" 
        : "bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
      // Glowing selection state
      data.isSelected && "ring-1 ring-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] border-blue-500/30"
    )}>
      
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-gray-500 border-none rounded-full top-[-4px]" />

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2.5">
          {isLocked ? (
            <Lock size={14} className="text-gray-500" />
          ) : (
            <div className={cn(
              "w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]", 
              isGhost ? "bg-gray-500 text-gray-500" : "bg-blue-500 text-blue-500"
            )} />
          )}
          <h3 className={cn(
            "font-semibold text-[13px] tracking-wide", 
            isGhost ? "text-gray-400" : "text-gray-100"
          )}>
            {data.title}
          </h3>
        </div>

        <button 
          onClick={() => targetNode(id)}
          className={cn(
            "p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10",
            data.isSelected ? "opacity-100 bg-blue-500/20 text-blue-400" : "hover:bg-white/10 text-gray-400 hover:text-white"
          )}
          title="Target node"
        >
          <Target size={14} />
        </button>
      </div>

      <p className={cn(
        "text-[12px] leading-relaxed font-light", 
        isGhost ? "text-gray-500" : "text-gray-400"
      )}>
        {isLocked ? "Upgrade to Pro to view operational mechanics and automation strategies." : data.description}
      </p>

      {hasMetrics && !isLocked && isUnitEconomicsOn && (
        <div className="mt-4 pt-4 border-t border-white/[0.05] flex justify-between items-center">
          <div>
            <span className="text-[9px] font-medium tracking-[0.1em] text-gray-500 block mb-1">MONTHLY COST</span>
            <span className="text-sm text-gray-200 font-mono tracking-tight">${data.metrics.monthlyCost.toLocaleString()}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-medium tracking-[0.1em] text-gray-500 block mb-1">RISK SCORE</span>
            <span className={cn(
              "text-sm font-mono tracking-tight font-medium",
              data.metrics.riskScore > 7 ? "text-red-400" : "text-emerald-400"
            )}>
              {data.metrics.riskScore}/10
            </span>
          </div>
        </div>
      )}

      {isGhost && (
        <button className="absolute -top-3 -right-3 bg-[#1A1A1A] border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30 rounded-full p-1 shadow-xl transition-all z-10">
          <Plus size={14} className="rotate-45" />
        </button>
      )}

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-blue-500 border-none rounded-full bottom-[-4px]" />
    </div>
  );
}
