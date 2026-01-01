
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
  showLabels?: boolean;
}

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
    x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x); const v = fade(y);
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
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const noise = createNoise();
    const fbm = (x: number, y: number, oct = 6) => {
      let v = 0, a = 0.5, f = 1;
      for (let i = 0; i < oct; i++) { v += a * noise(x * f, y * f); f *= 2; a *= 0.5; }
      return v;
    };

    const imgData = ctx.createImageData(size, size);
    const d = imgData.data;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const nx = x / 60, ny = y / 60;
        let r = 0, g = 0, b = 0;

        if (data.name === 'Earth') {
          const n = fbm(nx, ny, 8);
          const lat = Math.abs((y / size) - 0.5) * 2;
          if (lat > 0.88 + n * 0.05) { r = 245; g = 245; b = 255; } // Ice
          else if (n > 0.04) { r = 40 + n * 60; g = 100 - n * 30; b = 60 - n * 30; } // Land
          else { r = 26 + n * 20; g = 95 + n * 40; b = 180 + n * 50; } // Sea
        } else if (data.name === 'Mars') {
          const n = fbm(nx, ny, 6);
          const lat = Math.abs((y / size) - 0.5) * 2;
          if (lat > 0.94) { r = 255; g = 245; b = 245; }
          else { const base = 180 + n * 70; r = base; g = base * 0.45; b = base * 0.4; }
        } else if (data.name === 'Jupiter' || data.name === 'Saturn') {
          const bands = data.name === 'Jupiter' ? 12 : 6;
          const bandValue = Math.sin(y / size * Math.PI * bands + fbm(nx, ny, 2) * 5);
          if (data.name === 'Jupiter') {
            r = 200 + bandValue * 30; g = 150 + bandValue * 20; b = 110 + bandValue * 15;
            const spotX = (x - size * 0.75) / (size * 0.1), spotY = (y - size * 0.65) / (size * 0.05);
            if (spotX * spotX + spotY * spotY < 1) { r = 180; g = 60; b = 50; }
          } else { r = 240 + bandValue * 10; g = 215 + bandValue * 8; b = 165 + bandValue * 5; }
        } else {
          const n = fbm(nx, ny, 4);
          const c = new THREE.Color(data.color);
          r = c.r * 255 + n * 30; g = c.g * 255 + n * 30; b = c.b * 255 + n * 30;
        }
        d[idx] = r; d[idx+1] = g; d[idx+2] = b; d[idx+3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  }, [data.name, data.color]);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += 0.05 * delta * (timeSpeed > 0 ? 1 : 0);
  });

  return (
    /* @ts-ignore */
    <mesh ref={meshRef} name={data.name} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); onSelect(data); }}>
      {/* @ts-ignore */}
      <sphereGeometry args={[data.radius, 64, 64]} />
      {/* @ts-ignore */}
      <meshStandardMaterial map={texture || undefined} color={data.type === 'star' ? '#fff' : data.color} roughness={0.9} metalness={0.05} emissive={data.type === 'star' ? data.color : '#000'} emissiveIntensity={data.type === 'star' ? 1.5 : 0} />
    </mesh>
  );
};

const CloudLayer: React.FC<{ radius: number, timeSpeed: number }> = ({ radius, timeSpeed }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const noise = createNoise();
    const imgData = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const n = noise(x / 30, y / 30) + noise(x / 10, y / 10) * 0.3;
        const idx = (y * size + x) * 4;
        const alpha = n > 0.15 ? n * 220 : 0;
        imgData.data[idx] = 255; imgData.data[idx+1] = 255; imgData.data[idx+2] = 255; imgData.data[idx+3] = alpha;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.07 * delta * (timeSpeed > 0 ? 1 : 0);
      meshRef.current.rotation.x += 0.02 * delta * (timeSpeed > 0 ? 1 : 0);
    }
  });

  return (
    /* @ts-ignore */
    <mesh ref={meshRef} scale={[1.025, 1.025, 1.025]}>
      {/* @ts-ignore */}
      <sphereGeometry args={[radius, 64, 64]} />
      {/* @ts-ignore */}
      <meshStandardMaterial map={texture || undefined} transparent opacity={0.6} depthWrite={false} />
    </mesh>
  );
};

/**
 * Atmospheric glow using custom ShaderMaterial for volumetric appearance
 * and realistic edge scattering.
 */
const Atmosphere: React.FC<{ 
  radius: number; 
  color: string; 
  scale: number; 
  coefficient: number; 
  power: number; 
}> = ({ radius, color, scale, coefficient, power }) => {
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uCoefficient: { value: coefficient },
    uPower: { value: power },
  }), [color, coefficient, power]);

  return (
    /* @ts-ignore */
    <mesh scale={[scale, scale, scale]}>
      {/* @ts-ignore */}
      <sphereGeometry args={[radius, 64, 64]} />
      {/* @ts-ignore */}
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uCoefficient;
          uniform float uPower;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vec3 viewDir = normalize(-vPosition);
            float dotProduct = dot(vNormal, viewDir);
            float intensity = pow(uCoefficient + dotProduct, uPower);
            gl_FragColor = vec4(uColor, intensity);
          }
        `}
      />
    </mesh>
  );
};

const Planet: React.FC<PlanetProps> = ({ data, timeSpeed, selectedBodyName, onSelect, showLabels = true }) => {
  const orbitRef = useRef<THREE.Group>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const isSelected = selectedBodyName === data.name;

  useFrame((_, delta) => {
    if (orbitRef.current && data.type !== 'star') {
      angleRef.current += delta * timeSpeed * data.speed * 0.1;
      orbitRef.current.position.set(Math.cos(angleRef.current) * data.distance, 0, Math.sin(angleRef.current) * data.distance);
    }
  });

  const atmosphereParams = useMemo(() => {
    if (data.name === 'Earth') return { color: '#4dabff', scale: 1.12, coefficient: 0.1, power: 3.5 };
    if (data.name === 'Venus') return { color: '#e3bb76', scale: 1.18, coefficient: 0.3, power: 1.8 };
    if (data.name === 'Mars') return { color: '#ff7b4d', scale: 1.06, coefficient: 0.05, power: 6.0 };
    if (data.name === 'Neptune') return { color: '#4169E1', scale: 1.15, coefficient: 0.1, power: 4.0 };
    return null;
  }, [data.name]);

  return (
    /* @ts-ignore */
    <group>
      {data.distance > 0 && (
        /* @ts-ignore */
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          {/* @ts-ignore */}
          <ringGeometry args={[data.distance - 0.1, data.distance + 0.1, 128]} />
          {/* @ts-ignore */}
          <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* @ts-ignore */}
      <group ref={orbitRef}>
        <ProceduralTextureMesh data={data} timeSpeed={timeSpeed} onSelect={onSelect} />
        {data.name === 'Earth' && <CloudLayer radius={data.radius} timeSpeed={timeSpeed} />}
        
        {atmosphereParams && (
          <Atmosphere 
            radius={data.radius} 
            color={atmosphereParams.color} 
            scale={atmosphereParams.scale} 
            coefficient={atmosphereParams.coefficient} 
            power={atmosphereParams.power} 
          />
        )}

        {data.ringConfig && (
          /* @ts-ignore */
          <mesh rotation={[-Math.PI / 2.5, 0.05, 0]}>
            {/* @ts-ignore */}
            <ringGeometry args={[data.ringConfig.innerRadius, data.ringConfig.outerRadius, 64]} />
            {/* @ts-ignore */}
            <meshStandardMaterial color={data.ringConfig.color || "#fff"} transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        )}
        {data.moons?.map(m => <Planet key={m.name} data={m} timeSpeed={timeSpeed} selectedBodyName={selectedBodyName} onSelect={onSelect} showLabels={showLabels} />)}
        {showLabels && (
          <Html position={[0, data.radius + 4, 0]} center distanceFactor={25}>
            <div className={`px-2 py-0.5 rounded-full border backdrop-blur-md transition-all ${isSelected ? 'border-blue-500 bg-blue-500/20 shadow-[0_0_10px_blue]' : 'border-white/10 bg-black/40 text-white/70'} text-[9px] uppercase font-black whitespace-nowrap`}>
              {data.nameRu}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};

export default Planet;
