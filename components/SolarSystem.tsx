import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Planet from './Planet';
import { CelestialBody } from '../types';

interface SolarSystemProps {
  bodies: CelestialBody[];
  timeSpeed: number;
  selectedBody: CelestialBody | null;
  onSelectBody: (body: CelestialBody) => void;
}

const CameraController = ({ selectedBody }: { selectedBody: CelestialBody | null }) => {
  const { camera, controls, scene } = useThree();
  const targetWorldPos = new THREE.Vector3();
  const goalPosition = new THREE.Vector3();

  useEffect(() => {
    if (controls) {
      const ctrl = controls as any;
      ctrl.enableDamping = true;
      ctrl.dampingFactor = 0.05;
      ctrl.rotateSpeed = 0.5;
    }
  }, [controls]);

  useFrame(() => {
    if (!controls) return;
    const ctrl = controls as any;

    if (selectedBody) {
      const targetObj = scene.getObjectByName(selectedBody.name);
      if (targetObj) {
        targetObj.getWorldPosition(targetWorldPos);
        ctrl.target.lerp(targetWorldPos, 0.1);

        const focusDistance = selectedBody.radius * 4.5 + 5;
        const dir = new THREE.Vector3().subVectors(camera.position, targetWorldPos).normalize();
        
        goalPosition.copy(targetWorldPos).add(dir.multiplyScalar(focusDistance));
        camera.position.lerp(goalPosition, 0.05);
      }
    } else {
      if (ctrl.target.length() > 0.5) {
        ctrl.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
      }
    }
    ctrl.update();
  });

  return null;
};

// Realistic Starfield with Depth and Nebula
const GalacticBackground = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const nebulaRef = useRef<THREE.Group>(null);
  
  const points = useMemo(() => {
    const count = 12000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const r = 600 + Math.random() * 400;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Star types: Blue-white, Yellow-white, Reddish
      const type = Math.random();
      if (type > 0.8) { // Red
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 0.8;
      } else if (type > 0.4) { // Blue
        colors[i * 3] = 0.8; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1;
      } else { // White
        colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1;
      }
      
      sizes[i] = Math.random() * 1.5;
    }
    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y += 0.0001;
      nebulaRef.current.rotation.z += 0.00005;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={points.positions.length / 3} array={points.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={points.colors.length / 3} array={points.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={1.2} vertexColors transparent opacity={0.8} sizeAttenuation={true} />
      </points>
      
      {/* Subtle nebulae glow using larger translucent points */}
      <group ref={nebulaRef}>
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 400,
            (Math.random() - 0.5) * 400
          ]}>
            <sphereGeometry args={[100 + Math.random() * 100, 16, 16]} />
            <meshBasicMaterial 
              color={i % 2 === 0 ? "#1a0f30" : "#0f1a30"} 
              transparent 
              opacity={0.05} 
              side={THREE.BackSide} 
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// Procedural sun rays
const SunRays = () => {
  const rayRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (rayRef.current) {
      rayRef.current.rotation.z += 0.001;
    }
  });

  return (
    <group ref={rayRef}>
      {[...Array(8)].map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
          <planeGeometry args={[120, 0.5]} />
          <meshBasicMaterial 
            color="#FDB813" 
            transparent 
            opacity={0.03} 
            blending={THREE.AdditiveBlending} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      ))}
    </group>
  );
};

const SolarSystem: React.FC<SolarSystemProps> = ({ 
  bodies, 
  timeSpeed, 
  selectedBody, 
  onSelectBody
}) => {
  return (
    <div className="w-full h-full absolute inset-0 z-0 bg-[#010103]">
      <Canvas 
        shadows 
        camera={{ position: [0, 100, 200], fov: 45, far: 5000 }}
        gl={{ antialias: true, alpha: false, stencil: false }}
      >
        <color attach="background" args={['#010103']} />
        
        <ambientLight intensity={0.4} />
        <pointLight 
          position={[0, 0, 0]} 
          intensity={6} 
          decay={0} 
          distance={4000} 
          color="#fff5e6" 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048}
        />
        
        <GalacticBackground />
        <SunRays />

        <React.Suspense fallback={null}>
          {bodies.map((body) => (
            <Planet 
              key={body.name} 
              data={body} 
              timeSpeed={timeSpeed} 
              selectedBodyName={selectedBody?.name}
              onSelect={onSelectBody}
            />
          ))}
        </React.Suspense>

        <OrbitControls 
          makeDefault 
          minDistance={2} 
          maxDistance={2500}
        />
        
        <CameraController selectedBody={selectedBody} />
      </Canvas>
    </div>
  );
};

export default SolarSystem;