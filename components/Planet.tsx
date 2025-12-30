import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialBody } from '../types';

interface PlanetProps {
  data: CelestialBody;
  timeSpeed: number;
  selectedBodyName: string | undefined;
  onSelect: (data: CelestialBody) => void;
}

const PlanetMesh: React.FC<{
  data: CelestialBody;
  timeSpeed: number;
  onSelect: (data: CelestialBody) => void;
}> = ({ data, timeSpeed, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.05 * delta * (timeSpeed > 0 ? 1 : 0);
    }
  });

  return (
    <mesh
      ref={meshRef}
      name={data.name}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(data);
      }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <sphereGeometry args={[data.radius, 64, 64]} />
      {data.type === 'star' ? (
        <meshBasicMaterial color={data.color} />
      ) : (
        <meshStandardMaterial color={data.color} roughness={0.7} metalness={0.1} />
      )}
    </mesh>
  );
};

const Ring: React.FC<{ config: NonNullable<CelestialBody['ringConfig']> }> = ({ config }) => {
  const ringTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 128, 0);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(0.2, config.color || 'rgba(255,255,255,0.5)');
      gradient.addColorStop(0.5, config.color || 'rgba(255,255,255,0.8)');
      gradient.addColorStop(0.8, config.color || 'rgba(255,255,255,0.5)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 1);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }, [config.color]);

  return (
    <mesh rotation={new THREE.Euler(...(config.rotation || [-Math.PI / 2, 0, 0]))} onClick={(e) => e.stopPropagation()}>
      <ringGeometry args={[config.innerRadius, config.outerRadius, 128]} />
      <meshStandardMaterial 
        map={ringTexture} 
        color="#ffffff" 
        side={THREE.DoubleSide} 
        transparent 
        opacity={0.7} 
        roughness={1}
      />
    </mesh>
  );
};

const Planet: React.FC<PlanetProps> = ({ data, timeSpeed, selectedBodyName, onSelect }) => {
  const orbitRef = useRef<THREE.Group>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.4)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const isSelected = selectedBodyName === data.name;

  useFrame((_, delta) => {
    if (orbitRef.current && data.type !== 'star') {
      angleRef.current += delta * timeSpeed * data.speed * 0.1;
      const x = Math.cos(angleRef.current) * data.distance;
      const z = Math.sin(angleRef.current) * data.distance;
      orbitRef.current.position.set(x, 0, z);
    }
  });

  return (
    <>
      {data.distance > 0 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.distance - 0.1, data.distance + 0.1, 128]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      )}

      <group ref={orbitRef}>
        {data.type === 'star' && (
          <sprite scale={[data.radius * 6, data.radius * 6, 1]}>
            <spriteMaterial 
              map={glowTexture} 
              color={data.color} 
              blending={THREE.AdditiveBlending} 
              transparent 
              opacity={0.6} 
              depthWrite={false} 
            />
          </sprite>
        )}

        <PlanetMesh data={data} timeSpeed={timeSpeed} onSelect={onSelect} />

        {(data.name === 'Earth' || data.name === 'Venus' || data.name === 'Neptune') && (
          <mesh scale={[1.03, 1.03, 1.03]} onClick={(e) => e.stopPropagation()}>
            <sphereGeometry args={[data.radius, 32, 32]} />
            <meshBasicMaterial 
              color={data.name === 'Earth' ? '#4169E1' : data.name === 'Venus' ? '#FFC649' : '#4166F5'} 
              transparent 
              opacity={0.15} 
              blending={THREE.AdditiveBlending} 
              side={THREE.BackSide} 
            />
          </mesh>
        )}

        {data.ringConfig && <Ring config={data.ringConfig} />}

        {data.moons?.map((moon) => (
          <Planet
            key={moon.name}
            data={moon}
            timeSpeed={timeSpeed}
            selectedBodyName={selectedBodyName}
            onSelect={onSelect}
          />
        ))}

        <Html 
          position={[0, data.radius + (data.ringConfig ? 8 : 3), 0]} 
          center 
          distanceFactor={20} 
          style={{ pointerEvents: 'none' }}
        >
          <div
            className={`transition-all duration-500 text-xs px-2 py-1 rounded bg-black/70 backdrop-blur-lg text-white whitespace-nowrap border shadow-lg ${
              isSelected ? 'border-blue-400 scale-110 ring-2 ring-blue-500/20' : 'border-white/10 opacity-80'
            }`}
          >
            {data.nameRu}
          </div>
        </Html>
      </group>
    </>
  );
};

export default Planet;
