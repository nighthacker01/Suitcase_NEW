export type MaterialType = 'PU' | 'WOOD' | 'METAL';
export type WheelMaterialType = 'SMA' | 'RUBBER' | 'PLASTIC';

export interface MaterialProperties {
  name: string;
  youngsModulus: number; // Pa (N/m^2)
  yieldStrength: number; // Pa (N/m^2)
  shearModulus: number; // Pa (N/m^2)
  density: number; // kg/m^3
  rollingResistance?: number; // Added for wheels
}

export const MATERIALS: Record<MaterialType, MaterialProperties> = {
  PU: {
    name: '自修復聚氨酯彈性體',
    youngsModulus: 0.1 * 1e9,
    yieldStrength: 15 * 1e6,
    shearModulus: 0.04 * 1e9,
    density: 1200,
  },
  WOOD: {
    name: '高級木材',
    youngsModulus: 12 * 1e9,
    yieldStrength: 40 * 1e6,
    shearModulus: 1 * 1e9,
    density: 750,
  },
  METAL: {
    name: '鋁合金 T6',
    youngsModulus: 70 * 1e9,
    yieldStrength: 240 * 1e6,
    shearModulus: 26 * 1e9,
    density: 2700,
  }
};

export const WHEEL_MATERIALS: Record<WheelMaterialType, MaterialProperties> = {
  SMA: {
    name: '形狀記憶合金 (NiTi)',
    youngsModulus: 50 * 1e9,
    yieldStrength: 500 * 1e6,
    shearModulus: 20 * 1e9,
    density: 6450,
    rollingResistance: 0.01,
  },
  RUBBER: {
    name: '工業橡膠',
    youngsModulus: 0.05 * 1e9,
    yieldStrength: 20 * 1e6,
    shearModulus: 0.02 * 1e9,
    density: 1100,
    rollingResistance: 0.08,
  },
  PLASTIC: {
    name: '強化工程塑料',
    youngsModulus: 2.3 * 1e9,
    yieldStrength: 40 * 1e6,
    shearModulus: 0.8 * 1e9,
    density: 1040,
    rollingResistance: 0.05,
  }
};

export type ScenarioType = 'SMOOTH' | 'RUGGED' | 'BUMPY' | 'STAIRS';

export interface Scenario {
  name: string;
  impactFactor: number;
}

export const SCENARIOS: Record<ScenarioType, Scenario> = {
  SMOOTH: { name: '平滑路面', impactFactor: 1.0 },
  RUGGED: { name: '崎嶇路面', impactFactor: 1.5 },
  BUMPY: { name: '顛簸路面', impactFactor: 2.2 },
  STAIRS: { name: '上下樓梯', impactFactor: 3.5 },
};

export type ForceMode = 'PULL_UP' | 'PUSH_DOWN' | 'SIDE_PUSH';

export interface CalculationResult {
  pressure: number; // 壓力
  tension: number;  // 拉力
  shear: number;    // 剪力
  bending: number;  // 彎曲力
  torque: number;   // 扭矩力
  impact: number;   // 衝擊力
  safetyFactor: number;
  status: 'SAFE' | 'WARNING' | 'DANGER';
  criticalPart: string;
  ergonomicScore: number; // 0-100
  ergonomicStatus: 'OPTIMAL' | 'ACCEPTABLE' | 'POOR';
  leverageRatio: number; // 槓桿比
  wheelStress: number; // 輪子壓力
  rollingResistanceForce: number; // 滾動阻力
}
