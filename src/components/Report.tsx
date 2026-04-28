import React from 'react';
import { CalculationResult, MaterialProperties, Scenario, ForceMode } from '../types.ts';
import { FileText, Calculator, AlertTriangle, CheckCircle2, XCircle, UserCheck, Wind } from 'lucide-react';
import { motion } from 'motion/react';

interface ReportProps {
  result: CalculationResult;
  material: MaterialProperties;
  scenario: Scenario;
  forceMode: ForceMode;
  length: number;
  width: number;
}

export default function Report({ result, material, scenario, forceMode, length, width }: ReportProps) {
  const statusColor = result.status === 'SAFE' ? 'text-green-400' : result.status === 'WARNING' ? 'text-yellow-400' : 'text-red-500';
  const Icon = result.status === 'SAFE' ? CheckCircle2 : result.status === 'WARNING' ? AlertTriangle : XCircle;

  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-neutral-800/50 p-6 border-b border-neutral-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">最終力學分析報告</h2>
            <p className="text-xs text-neutral-500 font-mono">報告編號: LAB-LUGGAGE-2024-X{Math.floor(Math.random()*1000)}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statusColor.replace('text', 'border')} ${statusColor} bg-neutral-950`}>
          <Icon className="w-5 h-5" />
          <span className="text-sm font-black tracking-widest uppercase">
            {result.status === 'SAFE' ? '安全 (SAFE)' : result.status === 'WARNING' ? '警告 (WARNING)' : '危險 (DANGER)'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-neutral-800">
        <div className="bg-neutral-900 p-8 space-y-8">
          {/* Executive Summary */}
          <section>
            <h3 className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-4">分析摘要</h3>
            <div className="space-y-4">
              <p className="text-neutral-300 text-sm leading-relaxed">
                在 <strong className="text-white">{scenario.name}</strong> 情境下，系統承受的總動態作用力為 
                <span className="text-white font-bold"> {result.impact.toFixed(1)} N</span>。
                最關鍵的潛在失效點位於：<span className="text-amber-400 font-bold uppercase">{
                  result.criticalPart === 'Handle Connector' ? '拉桿連接處' :
                  result.criticalPart === 'Wheel Hub / Bearing' ? '輪殼/軸承系統' :
                  result.criticalPart === 'Vertical Support Base' ? '垂直支撐基座' :
                  result.criticalPart === 'Horizontal Grip Center' ? '握把中心區域' :
                  result.criticalPart === 'Ergonomic Pivot Limit (Leverage)' ? '人體工學轉向極限' : result.criticalPart
                }</span>。
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase mb-1">安全係數 (Safety Factor)</div>
                  <div className={`text-2xl font-black ${statusColor}`}>{result.safetyFactor.toFixed(2)}</div>
                </div>
                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase mb-1">峰值應力 (Peak Stress)</div>
                  <div className="text-2xl font-black text-white">
                    {((result.tension + result.bending + result.pressure) / 1e6).toFixed(2)} <span className="text-xs">MPa</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Formulas and Math */}
          <section>
            <h3 className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-4">物理模型與計算公式</h3>
            <div className="space-y-4 font-mono text-[11px] text-neutral-400 bg-black/40 p-4 rounded-xl">
              <div className="pb-3 border-b border-neutral-800">
                <div className="text-white mb-1">1. 作用力 (F)</div>
                <div className="text-blue-500">F = (m × g) × κ</div>
                <div>F = (21.0kg × 9.81m/s²) × {scenario.impactFactor} = {result.impact.toFixed(2)}N</div>
              </div>
              <div className="pb-3 border-b border-neutral-800">
                <div className="text-white mb-1">2. 拉伸/壓縮應力 (σ_t)</div>
                <div className="text-blue-500">σ_t = F / A</div>
                <div>A = π × (r)² = {(Math.PI * Math.pow(width/200, 2)).toExponential(3)} m²</div>
                <div>σ_t = {(result.tension / 1e6).toFixed(2)} MPa</div>
              </div>
              <div className="pb-3 border-b border-neutral-800">
                <div className="text-white mb-1">3. 彎曲應力 (σ_b)</div>
                <div className="text-blue-500">σ_b = M × y / I</div>
                <div>I = (π × r⁴) / 4 = {(Math.PI * Math.pow(width/200, 4) / 4).toExponential(3)} m⁴</div>
                <div>σ_b = {(result.bending / 1e6).toFixed(2)} MPa</div>
              </div>
            </div>
          </section>
        </div>

        <div className="bg-neutral-900 p-8">
           <h3 className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-6">即時力學監測反應</h3>
           <div className="space-y-4">
             {[
               { label: '拉力 (Tension)', value: result.tension, icon: '↑' },
               { label: '壓力 (Compression)', value: result.pressure, icon: '↓' },
               { label: '剪力 (Shear)', value: result.shear, icon: '⇅' },
               { label: '彎曲力 (Bending)', value: result.bending, icon: '⤴' },
               { label: '扭矩力 (Torque)', value: result.torque, icon: '↻' },
               { label: '衝擊力 (Impact)', value: result.impact, icon: '💥', isForce: true },
               { label: '輪子接觸壓力', value: result.wheelStress, icon: '🔘' },
               { label: '滾動阻力', value: result.rollingResistanceForce, icon: '↝', isForce: true },
             ].filter(f => f.value > 0).map((force, i) => (
               <div key={i} className="space-y-2">
                 <div className="flex justify-between text-xs">
                   <span className="text-neutral-500 uppercase tracking-tighter flex items-center gap-2">
                     <span className="w-5 h-5 flex items-center justify-center bg-neutral-800 rounded border border-neutral-700 text-blue-400 font-bold">{force.icon}</span>
                     {force.label}
                   </span>
                   <span className="text-white font-mono">
                     {force.isForce ? `${force.value.toFixed(1)} N` : `${(force.value / 1e6).toFixed(3)} MPa`}
                   </span>
                 </div>
                 <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, force.isForce ? (force.value / 1000) * 100 : (force.value / material.yieldStrength) * 100)}%` }}
                    className={`h-full ${force.value > (force.isForce ? 800 : material.yieldStrength * 0.8) ? 'bg-red-500' : 'bg-blue-500'}`}
                   />
                 </div>
               </div>
             ))}
           </div>

           <div className="mt-8 p-4 bg-blue-600/10 border border-blue-500/30 rounded-xl">
             <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase mb-2">
               <Calculator className="w-4 h-4" /> 材質工程見解
             </div>
             <p className="text-[11px] text-neutral-400 leading-normal">
               選用材質 <span className="text-white">{material.name}</span> 的屈服強度為 <span className="text-white font-bold">{(material.yieldStrength / 1e6).toFixed(0)} MPa</span>。
               {result.status === 'SAFE' 
                 ? " 當前結構設計能有效維持彈性形變範圍內，長期使用穩定性高。" 
                 : result.status === 'WARNING' 
                   ? " 警告：材質應力已接近塑性變形極限，建議減輕載重或縮短拉桿長度。"
                   : " 關鍵危險：材質即將超過屈服點，可能發生結構性斷裂或永久損毀。"
               }
             </p>
           </div>

           {/* Ergonomics Insight */}
           <div className="mt-6 p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase">
                  <UserCheck className="w-4 h-4" /> 人體工學與機動性分析
                </div>
                <div className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                  result.ergonomicStatus === 'OPTIMAL' ? 'bg-green-500/20 text-green-400' : 
                  result.ergonomicStatus === 'ACCEPTABLE' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {result.ergonomicStatus === 'OPTIMAL' ? '優異 (OPTIMAL)' : 
                   result.ergonomicStatus === 'ACCEPTABLE' ? '理想 (ACCEPTABLE)' : '較差 (POOR)'}
                </div>
             </div>
             
             <div className="space-y-3">
               <div>
                 <div className="flex justify-between text-[10px] text-neutral-500 uppercase mb-1">
                   <span>拉桿槓桿係數 (Leverage Factor)</span>
                   <span className="text-white">{result.leverageRatio.toFixed(2)}x</span>
                 </div>
                 <div className="h-1 bg-neutral-800 rounded-full">
                   <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, result.leverageRatio * 40)}%` }} />
                 </div>
               </div>

               <p className="text-[10px] text-neutral-500 italic leading-relaxed">
                 {length > 80 ? (
                   <span className="text-red-400">
                     ⚠️ <strong>嚴重的操控風險：</strong> 過長的拉桿 ({length}cm) 產生過大槓桿力，轉向時手腕需承受極大負擔，且轉向半徑過大。
                   </span>
                 ) : length > 65 ? (
                   <span className="text-yellow-400">
                     中度槓桿不平衡。轉向靈敏度略低，建議在寬敞空間使用。
                   </span>
                 ) : (
                   <span className="text-green-400">
                     優異的操控平衡。槓桿比處於符合人體工學的理想安全區間。
                   </span>
                 )}
               </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
