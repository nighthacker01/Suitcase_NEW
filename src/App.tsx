import React, { useState, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { MaterialType, WheelMaterialType, ForceMode, ScenarioType, MATERIALS, WHEEL_MATERIALS, SCENARIOS } from './types.ts';
import { calculateMechanics } from './mechanics.ts';
import SuitcaseModel from './components/SuitcaseModel.tsx';
import Controls from './components/Controls.tsx';
import Report from './components/Report.tsx';
import { Box, Wrench, HardHat, Cpu, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [length, setLength] = useState(60); // cm
  const [width, setWidth] = useState(2.5); // cm
  const [materialType, setMaterialType] = useState<MaterialType>('METAL');
  const [wheelRadius, setWheelRadius] = useState(4); // cm
  const [wheelWidth, setWheelWidth] = useState(2); // cm
  const [wheelMaterialType, setWheelMaterialType] = useState<WheelMaterialType>('RUBBER');
  const [forceMode, setForceMode] = useState<ForceMode>('PULL_UP');
  const [scenarioType, setScenarioType] = useState<ScenarioType>('SMOOTH');

  const result = useMemo(() => {
    return calculateMechanics(
      length,
      width,
      MATERIALS[materialType],
      wheelRadius,
      wheelWidth,
      WHEEL_MATERIALS[wheelMaterialType],
      forceMode,
      SCENARIOS[scenarioType]
    );
  }, [length, width, materialType, wheelRadius, wheelWidth, wheelMaterialType, forceMode, scenarioType]);

  return (
    <div className="min-h-screen bg-black text-neutral-200 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tighter leading-none italic">
                Luggage <span className="text-blue-500">Engage</span>
              </h1>
              <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-[0.2em] mt-1">MechLAB Simulator v2.4.0</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[10px] uppercase font-bold tracking-widest text-neutral-500">
            <span className="flex items-center gap-1.5"><Box className="w-3 h-3" /> CAD 已啟動</span>
            <span className="flex items-center gap-1.5"><Wrench className="w-3 h-3" /> 物理引擎運作中</span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <HardHat className="w-3 h-3" /> 
              工程師就緒
            </span>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left: 3D Visualization */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="relative h-[600px] w-full bg-neutral-950 rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden group">
            <Suspense fallback={
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-neutral-500 bg-neutral-950">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="text-xs font-mono uppercase tracking-widest animate-pulse">初始化 CAD 模擬空間...</p>
              </div>
            }>
              <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }} style={{ background: '#050505' }}>
                <SuitcaseModel 
                  length={length} 
                  width={width} 
                  wheelRadius={wheelRadius}
                  wheelWidth={wheelWidth}
                  result={result} 
                />
              </Canvas>
            </Suspense>

            {/* Viewport Overlays */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded border border-neutral-800 text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                視角: 透視 // 3D-CAD
              </div>
              <div className={`px-3 py-1.5 bg-black/60 backdrop-blur-md rounded border border-neutral-800 text-[10px] font-mono uppercase tracking-widest ${
                result.status === 'SAFE' ? 'text-green-400' : result.status === 'WARNING' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                完整性評估: {result.status === 'SAFE' ? '安全' : result.status === 'WARNING' ? '警告' : '危險'}
              </div>
            </div>

            <div className="absolute bottom-6 right-6 px-4 py-2 bg-neutral-900/80 backdrop-blur rounded-xl border border-neutral-800 flex items-center gap-4">
              <div className="text-right">
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest leading-none mb-1">最大組件載重</p>
                <p className="text-sm font-black text-white font-mono">{(result.impact / 9.81).toFixed(1)} <span className="text-[10px] text-neutral-400 font-normal">kg_等效</span></p>
              </div>
              <div className="w-px h-8 bg-neutral-800" />
              <div className="text-right">
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest leading-none mb-1">安全餘裕</p>
                <p className={`text-sm font-black font-mono ${
                  result.safetyFactor > 2 ? 'text-green-400' : 'text-amber-400'
                }`}>{(result.safetyFactor * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${length}-${width}-${materialType}-${forceMode}-${scenarioType}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Report 
                result={result} 
                material={MATERIALS[materialType]} 
                scenario={SCENARIOS[scenarioType]}
                forceMode={forceMode}
                length={length}
                width={width}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Controls */}
        <div className="xl:col-span-4 h-fit xl:sticky xl:top-24">
          <Controls 
            length={length} setLength={setLength}
            width={width} setWidth={setWidth}
            material={materialType} setMaterial={setMaterialType}
            wheelRadius={wheelRadius} setWheelRadius={setWheelRadius}
            wheelWidth={wheelWidth} setWheelWidth={setWheelWidth}
            wheelMaterial={wheelMaterialType} setWheelMaterial={setWheelMaterialType}
            mode={forceMode} setMode={setForceMode}
            scenario={scenarioType} setScenario={setScenarioType}
          />
          
          <div className="mt-6 p-6 bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl">
            <h3 className="text-xs font-black uppercase text-neutral-500 tracking-[0.2em] mb-4">工程師筆記 (Engineer's Notebook)</h3>
            <ul className="space-y-3 text-[11px] text-neutral-400 list-disc pl-4 italic">
              <li>材質特性會同時影響結構完整性與人體工學的移動便利性。</li>
              <li>形狀記憶合金 (SMA) 輪子可提供最佳的恢復性與最小的滾動阻力。</li>
              <li>穩定性計算為槓桿長度（拉桿）與旋轉直徑（輪子）的函數。</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="py-12 border-t border-neutral-900 bg-neutral-950 text-center">
        <p className="text-[10px] text-neutral-600 font-mono uppercase tracking-[0.4em]">
          模擬結束 // 協定 AIS-99 // 2026 高保真實驗室
        </p>
      </footer>
    </div>
  );
}
