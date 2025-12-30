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

        const focusDistance = selectedBody.radius * 4 + 5;
        const dir = new THREE.Vector3().subVectors(camera.position, targetWorldPos).normalize();
        goalPosition.copy(targetWorldPos).add(dir.multiplyScalar(focusDistance));
        camera.position.lerp(goalPosition, 0.05);
      }
    } else {
      if (ctrl.target.length() > 0.1) {
        ctrl.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
      }
    }
    ctrl.update();
  });

  return null;
};

const SolarSystem: React.FC<SolarSystemProps> = ({ 
  bodies, 
  timeSpeed, 
  selectedBody, 
  onSelectBody
}) => {
  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 60, 120], fov: 45, far: 5000 }}>
        <color attach="background" args={['#000000']} />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 0, 0]} intensity={3} decay={0} distance={2000} color="#fffaed" />
        
        <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />

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
          enablePan={true} 
          enableZoom={true} 
          minDistance={2} 
          maxDistance={1500}
        />
        
        <CameraController selectedBody={selectedBody} />
      </Canvas>
    </div>
  );
};

export default SolarSystem;
