import React, { useState } from 'react';
import SolarSystem from './components/SolarSystem';
import UIOverlay from './components/UIOverlay';
import { INITIAL_BODIES } from './constants';
import { CelestialBody } from './types';

const App: React.FC = () => {
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [timeSpeed, setTimeSpeed] = useState<number>(1);
  const [customTextures, setCustomTextures] = useState<Record<string, string>>({});

  const handleTextureUpdate = (name: string, url: string) => {
    setCustomTextures(prev => ({
      ...prev,
      [name]: url
    }));
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      <SolarSystem 
        bodies={INITIAL_BODIES} 
        timeSpeed={timeSpeed}
        selectedBody={selectedBody}
        onSelectBody={setSelectedBody}
        customTextures={customTextures}
      />
      
      {/* Title Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-500 tracking-widest uppercase">
          Solar System AI
        </h1>
        <p className="text-xs text-gray-400 mt-1">Powered by Google Gemini 3</p>
      </div>

      <UIOverlay 
        selectedBody={selectedBody} 
        onClosePanel={() => setSelectedBody(null)} 
        timeSpeed={timeSpeed}
        setTimeSpeed={setTimeSpeed}
        onTextureUpdate={handleTextureUpdate}
      />
    </div>
  );
};

export default App;
