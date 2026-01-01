import React, { useState } from 'react';
import SolarSystem from './components/SolarSystem';
import UIOverlay from './components/UIOverlay';
import { INITIAL_BODIES } from './constants';
import { CelestialBody } from './types';

const App: React.FC = () => {
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [timeSpeed, setTimeSpeed] = useState<number>(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      <SolarSystem 
        bodies={INITIAL_BODIES} 
        timeSpeed={timeSpeed}
        selectedBody={selectedBody}
        onSelectBody={setSelectedBody}
        showOrbits={showOrbits}
        showLabels={showLabels}
      />
      
      {/* Branding */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 tracking-tighter uppercase leading-none">
          Solar System<br/><span className="text-white/20">Encyclopedia</span>
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[9px] text-gray-400 uppercase tracking-[0.4em] font-bold">v2.5 Hyper-Detail Engine</p>
        </div>
      </div>

      <UIOverlay 
        allBodies={INITIAL_BODIES}
        selectedBody={selectedBody} 
        onClosePanel={() => setSelectedBody(null)} 
        onSelectBody={setSelectedBody}
        timeSpeed={timeSpeed}
        setTimeSpeed={setTimeSpeed}
        showOrbits={showOrbits}
        setShowOrbits={setShowOrbits}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
      />
    </div>
  );
};

export default App;
