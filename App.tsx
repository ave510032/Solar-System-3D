import React, { useState } from 'react';
import SolarSystem from './components/SolarSystem';
import UIOverlay from './components/UIOverlay';
import { INITIAL_BODIES } from './constants';
import { CelestialBody } from './types';

const App: React.FC = () => {
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [timeSpeed, setTimeSpeed] = useState<number>(1);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      <SolarSystem 
        bodies={INITIAL_BODIES} 
        timeSpeed={timeSpeed}
        selectedBody={selectedBody}
        onSelectBody={setSelectedBody}
      />
      
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tighter uppercase leading-none">
          Solar System<br/><span className="text-white/20">Explorer</span>
        </h1>
        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-[0.3em] font-bold">Offline Visualization Engine</p>
      </div>

      <UIOverlay 
        selectedBody={selectedBody} 
        onClosePanel={() => setSelectedBody(null)} 
        timeSpeed={timeSpeed}
        setTimeSpeed={setTimeSpeed}
      />
    </div>
  );
};

export default App;