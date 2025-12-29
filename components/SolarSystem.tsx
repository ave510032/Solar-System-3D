import React, { useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Planet from './Planet';
import { CelestialBody } from '../types';

interface SolarSystemProps {
  bodies: CelestialBody[];
  timeSpeed: number;
  selectedBody: CelestialBody | null;
  onSelectBody: (body: CelestialBody) => void;
  customTextures: Record<string, string>;
  backgroundTextureUrl: string;
}

// Error Boundary for Background
class BackgroundErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
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

// Background Component
const StarBackground = ({ url }: { url: string }) => {
  const texture = useLoader(THREE.TextureLoader, url);
  
  return (
    <mesh>
      <sphereGeometry args={[2000, 64, 64]} />
      <meshBasicMaterial 
        map={texture} 
        side={THREE.BackSide} 
        toneMapped={false}
      />
    </mesh>
  );
};

// Fallback if texture fails
const FallbackBackground = () => (
    <mesh>
      <sphereGeometry args={[2000, 64, 64]} />
      <meshBasicMaterial color="#050505" side={THREE.BackSide} />
    </mesh>
);

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
  customTextures,
  backgroundTextureUrl
}) => {
  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 60, 120], fov: 45, far: 5000 }}>
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} /> {/* Low ambient to make shadows visible */}
        <pointLight position={[0, 0, 0]} intensity={3} decay={0} distance={2000} color="#fffaed" />
        
        {/* Background with Error Boundary */}
        <BackgroundErrorBoundary fallback={<FallbackBackground />}>
            <React.Suspense fallback={<FallbackBackground />}>
               <StarBackground url={backgroundTextureUrl} />
            </React.Suspense>
        </BackgroundErrorBoundary>

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
          maxDistance={1500}
          enableDamping={true}
          dampingFactor={0.05}
        />
        
        <CameraController selectedBody={selectedBody} timeSpeed={timeSpeed} />
      </Canvas>
    </div>
  );
};

export default SolarSystem;