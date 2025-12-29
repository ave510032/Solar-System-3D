import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialBody } from '../types';

interface PlanetProps {
  data: CelestialBody;
  timeSpeed: number;
  selectedBodyName: string | undefined;
  onSelect: (data: CelestialBody) => void;
  customTextures: Record<string, string>;
}

// Error Boundary for Texture Loading to prevent app crash
class TextureErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Fallback component when texture fails
const FallbackBodyMesh: React.FC<{
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
        <meshStandardMaterial color={data.color} roughness={0.5} metalness={0.1} />
      )}
    </mesh>
  );
};

// Component that loads texture
const TexturedBodyMesh: React.FC<{
  data: CelestialBody;
  textureUrl: string;
  timeSpeed: number;
  onSelect: (data: CelestialBody) => void;
}> = ({ data, textureUrl, timeSpeed, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const map = useLoader(THREE.TextureLoader, textureUrl);

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
        <meshBasicMaterial map={map} color="#ffffff" />
      ) : (
        <meshStandardMaterial map={map} color="#ffffff" roughness={0.5} metalness={0.1} />
      )}
    </mesh>
  );
};

// Ring Component with Texture Safety
const Ring: React.FC<{ config: NonNullable<CelestialBody['ringConfig']> }> = ({ config }) => {
  const TextureRing = () => {
    const map = useLoader(THREE.TextureLoader, config.textureUrl!);
    return (
      <mesh rotation={new THREE.Euler(...(config.rotation || [-Math.PI / 2, 0, 0]))} onClick={(e) => e.stopPropagation()}>
        <ringGeometry args={[config.innerRadius, config.outerRadius, 64]} />
        <meshStandardMaterial map={map} color={config.color || '#ffffff'} side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
    );
  };

  const ColorRing = () => (
    <mesh rotation={new THREE.Euler(...(config.rotation || [-Math.PI / 2, 0, 0]))} onClick={(e) => e.stopPropagation()}>
      <ringGeometry args={[config.innerRadius, config.outerRadius, 64]} />
      <meshStandardMaterial color={config.color || '#ffffff'} side={THREE.DoubleSide} transparent opacity={0.8} />
    </mesh>
  );

  return (
    <TextureErrorBoundary fallback={<ColorRing />}>
      <React.Suspense fallback={<ColorRing />}>
         {config.textureUrl ? <TextureRing /> : <ColorRing />}
      </React.Suspense>
    </TextureErrorBoundary>
  );
};

const Planet: React.FC<PlanetProps> = ({ data, timeSpeed, selectedBodyName, onSelect, customTextures }) => {
  const orbitRef = useRef<THREE.Group>(null);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  // Generate glow texture programmatically
  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);
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

  const activeTextureUrl = customTextures[data.name] || data.textureUrl;
  const Fallback = () => <FallbackBodyMesh data={data} timeSpeed={timeSpeed} onSelect={onSelect} />;

  return (
    <>
      {/* Orbit Path */}
      {data.distance > 0 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.distance - 0.1, data.distance + 0.1, 128]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Planet Group */}
      <group ref={orbitRef}>
        {/* Sun Glow */}
        {data.type === 'star' && (
          <sprite scale={[data.radius * 6, data.radius * 6, 1]}>
            <spriteMaterial map={glowTexture} color={data.color} blending={THREE.AdditiveBlending} transparent opacity={0.6} depthWrite={false} />
          </sprite>
        )}

        {/* Body Mesh with Safe Loading */}
        <TextureErrorBoundary fallback={<Fallback />}>
          <React.Suspense fallback={<Fallback />}>
            {activeTextureUrl ? (
              <TexturedBodyMesh 
                data={data} 
                textureUrl={activeTextureUrl} 
                timeSpeed={timeSpeed} 
                onSelect={onSelect} 
              />
            ) : (
              <Fallback />
            )}
          </React.Suspense>
        </TextureErrorBoundary>

        {/* Atmosphere for Earth/Venus */}
        {(data.name === 'Earth' || data.name === 'Venus') && (
          <mesh scale={[1.02, 1.02, 1.02]} onClick={(e) => e.stopPropagation()}>
            <sphereGeometry args={[data.radius, 32, 32]} />
            <meshBasicMaterial color={data.name === 'Earth' ? '#4b9bd4' : '#d4b44b'} transparent opacity={0.2} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
          </mesh>
        )}

        {/* Rings */}
        {data.ringConfig && <Ring config={data.ringConfig} />}

        {/* Moons */}
        {data.moons?.map((moon) => (
          <Planet
            key={moon.name}
            data={moon}
            timeSpeed={timeSpeed}
            selectedBodyName={selectedBodyName}
            onSelect={onSelect}
            customTextures={customTextures}
          />
        ))}

        {/* Label */}
        <Html position={[0, data.radius + (data.ringConfig ? 5 : 2), 0]} center distanceFactor={20} style={{ pointerEvents: 'none' }}>
          <div
            className={`transition-all duration-300 text-xs px-2 py-1 rounded bg-black/60 backdrop-blur-md text-white whitespace-nowrap border ${isSelected ? 'border-blue-500 scale-110' : 'border-gray-700/50'}`}
          >
            {data.nameRu}
          </div>
        </Html>
      </group>
    </>
  );
};

export default Planet;