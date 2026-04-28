import { MaterialProperties, ForceMode, Scenario, CalculationResult } from './types';

const GRAVITY = 9.81;
const WEIGHT_KG = 21;
const LOAD_FORCE = WEIGHT_KG * GRAVITY; // ~206N

export function calculateMechanics(
  length: number, // cm
  width: number, // cm (handle tube thickness)
  material: MaterialProperties,
  wheelRadius: number, // cm
  wheelWidth: number, // cm
  wheelMaterial: MaterialProperties,
  mode: ForceMode,
  scenario: Scenario
): CalculationResult {
  // Convert units to SI
  const L = length / 100;
  const w = width / 100;
  const rWheel = wheelRadius / 100;
  const wWheel = wheelWidth / 100;

  const AreaHandle = Math.PI * Math.pow(w / 2, 2);
  const I = (Math.PI * Math.pow(w / 2, 4)) / 4;
  const J = (Math.PI * Math.pow(w / 2, 4)) / 2;

  const impactForce = LOAD_FORCE * scenario.impactFactor;
  
  let tension = 0;
  let pressure = 0;
  let shear = 0;
  let bending = 0;
  let torque = 0;

  // Handle Stress
  if (mode === 'PULL_UP') {
    tension = impactForce / AreaHandle;
    bending = (impactForce * (L / 2) * (w / 2)) / I;
  } else if (mode === 'PUSH_DOWN') {
    pressure = impactForce / AreaHandle;
    bending = (impactForce * 0.05 * (w / 2)) / I;
  } else if (mode === 'SIDE_PUSH') {
    shear = impactForce / AreaHandle;
    bending = (impactForce * L * (w / 2)) / I;
    torque = (impactForce * 0.1 * (w / 2)) / J;
  }

  // Wheel Stress (Contact Pressure)
  // Divide force by 4 wheels. Assumed contact area proportional to width and radius
  const contactArea = wWheel * Math.sqrt(rWheel * 0.01); // Simplified Hertzian contact
  const wheelStress = (impactForce / 4) / (contactArea || 0.001);
  
  // Rolling resistance force
  const rollingResistanceForce = (impactForce * (wheelMaterial.rollingResistance || 0.05)) / (rWheel * 10);

  // Structural Safety Factor (Handle)
  const maxNormalStress = Math.max(tension, pressure) + bending;
  const handleSafety = material.yieldStrength / (maxNormalStress || 1);
  const wheelSafety = wheelMaterial.yieldStrength / (wheelStress || 1);
  
  const safetyFactor = Math.min(handleSafety, wheelSafety);

  let status: 'SAFE' | 'WARNING' | 'DANGER' = 'SAFE';
  
  if (safetyFactor < 1.2) status = 'DANGER';
  else if (safetyFactor < 2.5) status = 'WARNING';

  // Ergonomic Safety Check
  if (length > 80) status = 'DANGER'; 
  else if (length > 65 && status === 'SAFE') status = 'WARNING';

  // Wheel specific status checks
  if (wheelRadius < 2 && scenario.impactFactor > 1.5) status = 'DANGER'; // Tiny wheels on rough terrain

  let criticalPart = "Handle Connector";
  if (wheelSafety < handleSafety) criticalPart = "Wheel Hub / Bearing";
  else if (mode === 'SIDE_PUSH') criticalPart = "Vertical Support Base";
  else if (mode === 'PULL_UP') criticalPart = "Horizontal Grip Center";
  if (length > 80) criticalPart = "Ergonomic Pivot Limit (Leverage)";

  // --- Ergonomics Calculation ---
  let ergonomicScore = 100;
  
  // Handle length penalty
  if (length > 55) ergonomicScore -= (length - 55) * 1.5;
  if (length < 35) ergonomicScore -= (35 - length) * 1.2;
  
  // Wheel radius benefit
  const optimalWheelRadius = 4; // cm
  if (wheelRadius < optimalWheelRadius) {
    ergonomicScore -= (optimalWheelRadius - wheelRadius) * 8;
  } else {
    ergonomicScore += (wheelRadius - optimalWheelRadius) * 2;
  }

  // Material benefit (SMA is best)
  if (wheelMaterial.name.includes('Shape Memory')) ergonomicScore += 10;
  if (wheelMaterial.name.includes('Plastic')) ergonomicScore -= 10;

  const leverageRatio = length / 45;

  let ergonomicStatus: 'OPTIMAL' | 'ACCEPTABLE' | 'POOR' = 'OPTIMAL';
  if (ergonomicScore < 55) ergonomicStatus = 'POOR';
  else if (ergonomicScore < 80) ergonomicStatus = 'ACCEPTABLE';

  return {
    pressure,
    tension,
    shear,
    bending,
    torque,
    impact: impactForce,
    safetyFactor,
    status,
    criticalPart,
    ergonomicScore: Math.max(0, Math.min(100, ergonomicScore)),
    ergonomicStatus,
    leverageRatio,
    wheelStress,
    rollingResistanceForce,
  };
}
