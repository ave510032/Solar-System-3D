
import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars as StarsDrei } from '@react-three/drei';
import * as THREE from 'three';
import Planet from './Planet';
import { CelestialBody } from '../types';

interface SolarSystemProps {
  bodies: CelestialBody[];
  timeSpeed: number;
  selectedBody: CelestialBody | null;
  onSelectBody: (body: CelestialBody) => void;
  showOrbits: boolean;
  showLabels: boolean;
}

const AsteroidBelt = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 3000;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 75 + Math.random() * 10;
      const y = (Math.random() - 0.5) * 2;
      dummy.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      dummy.rotation.set(Math.random(), Math.random(), Math.random());
      const s = 0.1 + Math.random() * 0.2;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y += 0.0002;
  });

  return (
    /* @ts-ignore */
    <instancedMesh ref={meshRef} args={[new THREE.DodecahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: '#555' }), count]} />
  );
};

const CameraController = ({ selectedBody }: { selectedBody: CelestialBody | null }) => {
  const { camera, controls, scene } = useThree();
  const targetWorldPos = new THREE.Vector3();
  const goalPosition = new THREE.Vector3();

  useFrame(() => {
    if (!controls) return;
    const ctrl = controls as any;
    if (selectedBody) {
      const targetObj = scene.getObjectByName(selectedBody.name);
      if (targetObj) {
        targetObj.getWorldPosition(targetWorldPos);
        ctrl.target.lerp(targetWorldPos, 0.1);
        const dist = selectedBody.radius * 4 + 8;
        const dir = new THREE.Vector3().subVectors(camera.position, targetWorldPos).normalize();
        goalPosition.copy(targetWorldPos).add(dir.multiplyScalar(dist));
        camera.position.lerp(goalPosition, 0.05);
      }
    } else if (ctrl.target.length() > 0.5) {
      ctrl.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
    }
    ctrl.update();
  });
  return null;
};

const SolarSystem: React.FC<SolarSystemProps> = ({ bodies, timeSpeed, selectedBody, onSelectBody, showOrbits, showLabels }) => {
  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas shadows camera={{ position: [0, 150, 300], fov: 45 }}>
        {/* @ts-ignore */}
        <color attach="background" args={['#010103']} />
        {/* @ts-ignore */}
        <ambientLight intensity={0.5} />
        {/* @ts-ignore */}
        <pointLight position={[0,0,0]} intensity={8} decay={0} distance={1000} castShadow />
        <StarsDrei radius={500} depth={50} count={20000} factor={4} saturation={0} fade speed={1} />
        <AsteroidBelt />
        <React.Suspense fallback={null}>
          {bodies.map(b => <Planet key={b.name} data={b} timeSpeed={timeSpeed} selectedBodyName={selectedBody?.name} onSelect={onSelectBody} showLabels={showLabels} />)}
        </React.Suspense>
        <OrbitControls makeDefault minDistance={2} maxDistance={3000} />
        <CameraController selectedBody={selectedBody} />
      </Canvas>
    </div>
  );
};

export default SolarSystem;
