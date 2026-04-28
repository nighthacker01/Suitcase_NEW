import React, { useState } from 'react';
import { MaterialType, WheelMaterialType, ForceMode, ScenarioType, MATERIALS, WHEEL_MATERIALS, SCENARIOS } from '../types.ts';
import { Ruler, Activity, Mountain, Settings2, Info, CircleDot, GripHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

interface ControlsProps {
  length: number;
  setLength: (v: number) => void;
  width: number;
  setWidth: (v: number) => void;
  material: MaterialType;
  setMaterial: (m: MaterialType) => void;
  wheelRadius: number;
  setWheelRadius: (v: number) => void;
  wheelWidth: number;
  setWheelWidth: (v: number) => void;
  wheelMaterial: WheelMaterialType;
  setWheelMaterial: (m: WheelMaterialType) => void;
  mode: ForceMode;
  setMode: (m: ForceMode) => void;
  scenario: ScenarioType;
  setScenario: (s: ScenarioType) => void;
}

export default function Controls({
  length, setLength,
  width, setWidth,
  material, setMaterial,
  wheelRadius, setWheelRadius,
  wheelWidth, setWheelWidth,
  wheelMaterial, setWheelMaterial,
  mode, setMode,
  scenario, setScenario
}: ControlsProps) {
  const [activeTab, setActiveTab] = useState<'HANDLE' | 'WHEELS'>('HANDLE');

  return (
    <div className="flex flex-col gap-6 p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold tracking-tight text-white uppercase italic">力學模擬配置</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-neutral-800 p-1 rounded-xl">
        <button 
          onClick={() => setActiveTab('HANDLE')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all",
            activeTab === 'HANDLE' ? "bg-neutral-700 text-white shadow-lg" : "text-neutral-500 hover:text-neutral-300"
          )}
        >
          <GripHorizontal className="w-4 h-4" /> 拉桿 (Handle)
        </button>
        <button 
          onClick={() => setActiveTab('WHEELS')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all",
            activeTab === 'WHEELS' ? "bg-neutral-700 text-white shadow-lg" : "text-neutral-500 hover:text-neutral-300"
          )}
        >
          <CircleDot className="w-4 h-4" /> 輪子 (Wheels)
        </button>
      </div>

      <div className="space-y-6">
        {activeTab === 'HANDLE' ? (
          <>
            {/* Dimensions */}
            <section className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                <Ruler className="w-3 h-3" /> 拉桿幾何構造
              </label>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-500">伸展長度</span>
                    <span className="text-white font-mono">{length} cm</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" value={length} 
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-[9px] text-neutral-600 mt-1 uppercase font-mono px-1">
                    <span>緊湊</span>
                    <span className="text-blue-500/50">最優 (35-55)</span>
                    <span>笨重</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-500">管材直徑</span>
                    <span className="text-white font-mono">{width} cm</span>
                  </div>
                  <input 
                    type="range" min="0.5" max="5" step="0.1" value={width} 
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Material */}
            <section className="space-y-3">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">拉桿結構材質</label>
              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(MATERIALS) as MaterialType[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMaterial(m)}
                    className={cn(
                      "px-4 py-3 rounded-lg text-left text-sm transition-all border",
                      material === m 
                        ? "bg-blue-600/20 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                        : "bg-neutral-800/50 border-neutral-700 text-neutral-400 hover:border-neutral-500"
                    )}
                  >
                    <div className="font-bold">{MATERIALS[m].name}</div>
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Wheel Dimensions */}
            <section className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                <CircleDot className="w-3 h-3" /> 輪子幾何構造
              </label>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-500">輪子半徑</span>
                    <span className="text-white font-mono">{wheelRadius} cm</span>
                  </div>
                  <input 
                    type="range" min="1" max="10" step="0.5" value={wheelRadius} 
                    onChange={(e) => setWheelRadius(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-500">輪子寬度</span>
                    <span className="text-white font-mono">{wheelWidth} cm</span>
                  </div>
                  <input 
                    type="range" min="0.5" max="5" step="0.1" value={wheelWidth} 
                    onChange={(e) => setWheelWidth(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </section>

            {/* Wheel Material */}
            <section className="space-y-3">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">輪子材質</label>
              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(WHEEL_MATERIALS) as WheelMaterialType[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setWheelMaterial(m)}
                    className={cn(
                      "px-4 py-3 rounded-lg text-left text-sm transition-all border",
                      wheelMaterial === m 
                        ? "bg-amber-600/20 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]" 
                        : "bg-neutral-800/50 border-neutral-700 text-neutral-400 hover:border-neutral-500"
                    )}
                  >
                    <div className="font-bold">{WHEEL_MATERIALS[m].name}</div>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Global Selectors */}
        <div className="pt-6 border-t border-neutral-800 space-y-6">
           {/* Interaction Mode */}
           <section className="space-y-3">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3" /> 外部施力方向
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['PULL_UP', 'PUSH_DOWN', 'SIDE_PUSH'] as ForceMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "py-2 px-1 rounded text-[10px] font-bold text-center border uppercase tracking-wider",
                    mode === m 
                      ? "bg-white text-black border-white" 
                      : "bg-neutral-800 text-neutral-500 border-neutral-700 hover:border-neutral-500"
                  )}
                >
                  {m === 'PULL_UP' ? '向上拉' : m === 'PUSH_DOWN' ? '向下壓' : '側面推'}
                </button>
              ))}
            </div>
          </section>

          {/* Scenario Selection */}
          <section className="space-y-3">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <Mountain className="w-3 h-3" /> 模擬路面情境
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SCENARIOS) as ScenarioType[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setScenario(s)}
                  className={cn(
                    "py-2 px-2 rounded text-[11px] font-medium border text-left flex items-center justify-between",
                    scenario === s 
                      ? "bg-amber-600/20 border-amber-500 text-amber-200" 
                      : "bg-neutral-800 text-neutral-400 border-neutral-700 hover:border-neutral-500"
                  )}
                >
                  {SCENARIOS[s].name}
                  <span className="text-[9px] opacity-50">x{SCENARIOS[s].impactFactor}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-4 p-3 bg-neutral-950 border border-neutral-800 rounded-lg flex gap-3 text-xs text-neutral-500 italic">
        <Info className="w-6 h-6 text-blue-500 shrink-0" />
        <p>固定行李箱重量: <strong className="text-white">21.0 kg</strong>。材質特性會同時影響結構完整性與人體工學的移動便利性。</p>
      </div>
    </div>
  );
}
