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

// Simple Noise Implementation for procedural generation
const createNoise = () => {
  const p = new Uint8Array(512);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 256; i++) p[256 + i] = p[i];

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t: number, a: number, b: number) => a + t * (b - a);
  const grad = (hash: number, x: number, y: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return (x: number, y: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const a = p[X] + Y, aa = p[a], ab = p[a + 1], b = p[X + 1] + Y, ba = p[b], bb = p[b + 1];
    return lerp(v, lerp(u, grad(p[aa], x, y), grad(p[ba], x - 1, y)),
                   lerp(u, grad(p[ab], x, y - 1), grad(p[bb], x - 1, y - 1)));
  };
};

const ProceduralTextureMesh: React.FC<{
  data: CelestialBody;
  timeSpeed: number;
  onSelect: (data: CelestialBody) => void;
}> = ({ data, timeSpeed, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const noise = createNoise();
    const fbm = (x: number, y: number, octaves: number) => {
      let v = 0, a = 0.5, f = 1;
      for (let i = 0; i < octaves; i++) {
        v += a * noise(x * f, y * f);
        f *= 2; a *= 0.5;
      }
      return v;
    };

    const imgData = ctx.createImageData(size, size);
    const d = imgData.data;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const nx = x / 50;
        const ny = y / 50;
        let r = 0, g = 0, b = 0;

        if (data.name === 'Earth') {
          const n = fbm(nx, ny, 6);
          const lat = Math.abs((y / size) - 0.5) * 2; // 0 at equator, 1 at poles
          
          if (lat > 0.85 + n * 0.1) { // Polar Ice
            r = 240; g = 240; b = 255;
          } else if (n > 0.05) { // Land
            r = 74 + n * 30; g = 124 - n * 20; b = 89 - n * 30; // Greenish
            if (n > 0.3) { r += 40; g -= 20; b -= 20; } // Mountainous brown
          } else { // Ocean
            r = 26 + n * 20; g = 95 + n * 40; b = 180 + n * 50;
          }
        } else if (data.name === 'Mars') {
          const n = fbm(nx * 1.5, ny * 1.5, 6);
          const lat = Math.abs((y / size) - 0.5) * 2;
          if (lat > 0.92 + n * 0.05) { // Polar caps
            r = 255; g = 240; b = 240;
          } else {
            const base = 205 + n * 50;
            r = base; g = base * 0.4; b = base * 0.3;
            if (n < -0.2) { r -= 40; g -= 10; b -= 10; } // Darker spots
          }
        } else if (data.name === 'Jupiter' || data.name === 'Saturn') {
          const bandFrequency = data.name === 'Jupiter' ? 15 : 8;
          const n = noise(nx * 0.5, ny * bandFrequency);
          const turbulence = fbm(nx * 2, ny * 2, 4) * 0.2;
          const bandValue = Math.sin(y / size * Math.PI * bandFrequency + turbulence * 10);
          
          if (data.name === 'Jupiter') {
            r = 200 + bandValue * 40; g = 140 + bandValue * 20; b = 100 + bandValue * 20;
            // Great Red Spot Area (approximate)
            const dx = (x - size * 0.7) / (size * 0.1);
            const dy = (y - size * 0.65) / (size * 0.05);
            if (dx * dx + dy * dy < 1) {
              r = 180; g = 60; b = 50;
            }
          } else {
             r = 240 + bandValue * 15; g = 210 + bandValue * 10; b = 160 + bandValue * 10;
          }
        } else if (data.type === 'star') {
          const n = fbm(nx * 4, ny * 4, 4);
          r = 253 + n * 40; g = 184 + n * 60; b = 19 + n * 20;
        } else {
          // Generic rocky
          const n = fbm(nx, ny, 4);
          const baseColor = new THREE.Color(data.color);
          r = baseColor.r * 255 + n * 30;
          g = baseColor.g * 255 + n * 30;
          b = baseColor.b * 255 + n * 30;
        }

        d[idx] = r; d[idx + 1] = g; d[idx + 2] = b; d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, [data.color, data.type, data.name]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.05 * delta * (timeSpeed > 0 ? 1 : 0);
    }
  });

  return (
    <mesh
      ref={meshRef}
      name={data.name}
      castShadow
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        onSelect(data);
      }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <sphereGeometry args={[data.radius, 64, 64]} />
      {data.type === 'star' ? (
        <meshBasicMaterial map={texture || undefined} color={data.color} />
      ) : (
        <meshStandardMaterial 
          map={texture || undefined} 
          color={data.color} 
          roughness={0.9} 
          metalness={0.05} 
        />
      )}
    </mesh>
  );
};

// Earth Cloud Layer
const CloudLayer: React.FC<{ radius: number, timeSpeed: number }> = ({ radius, timeSpeed }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const noise = createNoise();
    const imgData = ctx.createImageData(size, size);
    const d = imgData.data;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const n = noise(x / 30, y / 30) + noise(x / 15, y / 15) * 0.5;
        const idx = (y * size + x) * 4;
        const alpha = n > 0.1 ? n * 200 : 0;
        d[idx] = 255; d[idx+1] = 255; d[idx+2] = 255; d[idx+3] = alpha;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.08 * delta * (timeSpeed > 0 ? 1 : 0);
      meshRef.current.rotation.x += 0.01 * delta * (timeSpeed > 0 ? 1 : 0);
    }
  });

  return (
    <mesh ref={meshRef} scale={[1.02, 1.02, 1.02]}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial map={texture || undefined} transparent opacity={0.4} depthWrite={false} />
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
      gradient.addColorStop(0.2, 'rgba(180,180,180,0.1)');
      gradient.addColorStop(0.3, config.color || 'rgba(255,255,255,0.4)');
      if (config.hasGaps) {
        gradient.addColorStop(0.55, 'rgba(0,0,0,0.8)'); 
        gradient.addColorStop(0.6, 'rgba(0,0,0,0)');
      }
      gradient.addColorStop(0.7, config.color || 'rgba(255,255,255,0.4)');
      gradient.addColorStop(0.9, 'rgba(150,150,150,0.1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 1);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }, [config.color, config.hasGaps]);

  return (
    <mesh rotation={new THREE.Euler(...(config.rotation || [-Math.PI / 2, 0, 0]))} castShadow receiveShadow>
      <ringGeometry args={[config.innerRadius, config.outerRadius, 128]} />
      <meshStandardMaterial 
        map={ringTexture} 
        color="#ffffff" 
        side={THREE.DoubleSide} 
        transparent 
        opacity={0.85} 
        roughness={1}
      />
    </mesh>
  );
};

const Atmosphere: React.FC<{ color: string; radius: number }> = ({ color, radius }) => {
  return (
    <mesh scale={[1.15, 1.15, 1.15]}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={0.12} 
        blending={THREE.AdditiveBlending} 
        side={THREE.BackSide} 
      />
    </mesh>
  );
};

const Planet: React.FC<PlanetProps> = ({ data, timeSpeed, selectedBodyName, onSelect }) => {
  const orbitRef = useRef<THREE.Group>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  const sunEffects = useMemo(() => {
    const textures = [];
    for (let i = 0; i < 2; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        if (i === 0) {
          gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
          gradient.addColorStop(0.2, 'rgba(255, 200, 50, 0.6)');
          gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
          gradient.addColorStop(0.5, 'rgba(255, 150, 0, 0.1)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
      }
      textures.push(new THREE.CanvasTexture(canvas));
    }
    return textures;
  }, []);

  const isSelected = selectedBodyName === data.name;

  useFrame((state, delta) => {
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
          <ringGeometry args={[data.distance - 0.15, data.distance + 0.15, 128]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.06} side={THREE.DoubleSide} />
        </mesh>
      )}

      <group ref={orbitRef}>
        {data.type === 'star' && (
          <>
            <sprite scale={[data.radius * 4, data.radius * 4, 1]}>
              <spriteMaterial map={sunEffects[0]} blending={THREE.AdditiveBlending} transparent opacity={0.9} depthWrite={false} />
            </sprite>
            <sprite scale={[data.radius * 8, data.radius * 8, 1]}>
              <spriteMaterial map={sunEffects[1]} blending={THREE.AdditiveBlending} transparent opacity={0.4} depthWrite={false} />
            </sprite>
          </>
        )}

        <ProceduralTextureMesh data={data} timeSpeed={timeSpeed} onSelect={onSelect} />

        {data.name === 'Earth' && <CloudLayer radius={data.radius} timeSpeed={timeSpeed} />}

        {['Earth', 'Venus', 'Mars', 'Neptune', 'Uranus'].includes(data.name) && (
          <Atmosphere color={data.color} radius={data.radius} />
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
          position={[0, data.radius + (data.ringConfig ? 10 : 4), 0]} 
          center 
          distanceFactor={25} 
          style={{ pointerEvents: 'none' }}
        >
          <div
            className={`transition-all duration-700 text-[9px] px-2 py-0.5 rounded-full backdrop-blur-md text-white/90 whitespace-nowrap border ${
              isSelected ? 'border-blue-400 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'border-white/10 bg-black/40'
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
