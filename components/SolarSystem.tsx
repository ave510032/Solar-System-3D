import React, { useRef, useEffect } from 'react';
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
  customTextures: Record<string, string>;
}

// Internal component to handle camera animation
const CameraController = ({ selectedBody, timeSpeed }: { selectedBody: CelestialBody | null, timeSpeed: number }) => {
  const { controls, scene } = useThree();
  const targetWorldPos = new THREE.Vector3();

  useEffect(() => {
    if (controls) {
      // We know we are using OrbitControls from drei which has standard properties
      const ctrl = controls as unknown as { enableDamping: boolean; dampingFactor: number; target: THREE.Vector3 };
      ctrl.enableDamping = true;
      ctrl.dampingFactor = 0.05;
    }
  }, [controls]);

  useFrame(({ clock }, delta) => {
    // If a body is selected, we want to smoothly follow it
    if (selectedBody && selectedBody.name !== 'Sun') {
       const targetObj = scene.getObjectByName(selectedBody.name);
       
       if (targetObj) {
         // Get the absolute world position of the planet/moon
         targetObj.getWorldPosition(targetWorldPos);
         
         if (controls) {
            // Smoothly update the OrbitControls target to look at the moving body
            const ctrl = controls as unknown as { target: THREE.Vector3 };
            ctrl.target.lerp(targetWorldPos, 0.1);
         }
       }
    } 
    
    // Smoothly interpolate orbit controls target back to 0,0,0 if nothing selected
    if (!selectedBody && controls) {
       const ctrl = controls as unknown as { target: THREE.Vector3 };
       ctrl.target.lerp(new THREE.Vector3(0, 0, 0), delta * 2);
    }
  });

  return null;
};

const SolarSystem: React.FC<SolarSystemProps> = ({ 
  bodies, 
  timeSpeed, 
  selectedBody, 
  onSelectBody,
  customTextures
}) => {
  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 60, 120], fov: 45 }}>
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} /> {/* Low ambient to make shadows visible */}
        <pointLight position={[0, 0, 0]} intensity={3} decay={0} distance={2000} color="#fffaed" />
        
        <Stars radius={300} depth={50} count={7000} factor={4} saturation={0} fade speed={0.5} />

        <React.Suspense fallback={null}>
          {bodies.map((body) => (
            <Planet 
              key={body.name} 
              data={body} 
              timeSpeed={timeSpeed} 
              selectedBodyName={selectedBody?.name}
              onSelect={onSelectBody}
              customTextures={customTextures}
            />
          ))}
        </React.Suspense>

        <OrbitControls 
          makeDefault
          enablePan={true} 
          enableZoom={true} 
          minDistance={2} 
          maxDistance={800}
          enableDamping={true}
          dampingFactor={0.05}
        />
        
        <CameraController selectedBody={selectedBody} timeSpeed={timeSpeed} />
      </Canvas>
    </div>
  );
};

export default SolarSystem;