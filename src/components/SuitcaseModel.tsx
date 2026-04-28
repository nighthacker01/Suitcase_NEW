import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, PerspectiveCamera, OrbitControls, Environment, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { CalculationResult, MaterialType } from '../types.ts';

interface SuitcaseModelProps {
  length: number;
  width: number;
  wheelRadius: number;
  wheelWidth: number;
  result: CalculationResult;
}

export default function SuitcaseModel({ length, width, wheelRadius, wheelWidth, result }: SuitcaseModelProps) {
  const handleColor = result.status === 'SAFE' ? '#22c55e' : result.status === 'WARNING' ? '#eab308' : '#ef4444';
  const wheelColor = result.wheelStress > 1e7 ? (result.status === 'DANGER' ? '#ef4444' : '#eab308') : '#444';
  
  // Real-world handle height is roughly 'length'
  const handleHeight = length / 40; 
  const tubeRadius = Math.max(0.02, width / 100); 

  // Wheel scaling
  const wRadius = wheelRadius / 15; // Scale for visual representation
  const wWidth = wheelWidth / 10;

  return (
    <>
      <PerspectiveCamera makeDefault position={[4, 4, 8]} fov={45} />
      <OrbitControls enablePan={false} maxDistance={15} minDistance={2} target={[0, 0, 0]} />
      
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      
      <group position={[0, -1.5, 0]}>
        {/* Wheels */}
        <group position={[0, 0, 0]}>
          {/* Front Left */}
          <Cylinder args={[wRadius, wRadius, wWidth, 16]} position={[-0.9, -wRadius, 0.5]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color={wheelColor} metalness={0.6} roughness={0.4} />
          </Cylinder>
          {/* Front Right */}
          <Cylinder args={[wRadius, wRadius, wWidth, 16]} position={[0.9, -wRadius, 0.5]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color={wheelColor} metalness={0.6} roughness={0.4} />
          </Cylinder>
          {/* Back Left */}
          <Cylinder args={[wRadius, wRadius, wWidth, 16]} position={[-0.9, -wRadius, -0.5]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color={wheelColor} metalness={0.6} roughness={0.4} />
          </Cylinder>
          {/* Back Right */}
          <Cylinder args={[wRadius, wRadius, wWidth, 16]} position={[0.9, -wRadius, -0.5]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color={wheelColor} metalness={0.6} roughness={0.4} />
          </Cylinder>
        </group>

        {/* Main Case */}
        <Box args={[2.5, 3.5, 1.5]} position={[0, 1.75, 0]}>
          <meshStandardMaterial color="#f0f0f0" roughness={0.3} metalness={0.1} />
        </Box>

        {/* Handle System */}
        <group position={[0, 3.5, -0.6]}>
          <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
            <group>
              {/* Left Rail */}
              <Cylinder args={[tubeRadius, tubeRadius, handleHeight, 16]} position={[-0.8, handleHeight / 2, 0]}>
                <meshStandardMaterial color={handleColor} metalness={0.8} roughness={0.1} />
              </Cylinder>
              
              {/* Right Rail */}
              <Cylinder args={[tubeRadius, tubeRadius, handleHeight, 16]} position={[0.8, handleHeight / 2, 0]}>
                <meshStandardMaterial color={handleColor} metalness={0.8} roughness={0.1} />
              </Cylinder>

              {/* Top Grip */}
              <Cylinder args={[tubeRadius * 1.3, tubeRadius * 1.3, 1.8, 16]} position={[0, handleHeight, 0]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#0a0a0a" roughness={0.5} />
              </Cylinder>
            </group>
          </Float>
        </group>
      </group>

      <Sparkles count={40} scale={8} size={1} speed={0.2} opacity={0.3} />
      <gridHelper args={[20, 20, '#333', '#111']} position={[0, -1.51, 0]} />
    </>
  );
}
