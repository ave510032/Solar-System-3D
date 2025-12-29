import React, { useState } from 'react';
import SolarSystem from './components/SolarSystem';
import UIOverlay from './components/UIOverlay';
import { INITIAL_BODIES, DEFAULT_BACKGROUND_URL } from './constants';
import { CelestialBody } from './types';
import { generateSpaceImage } from './services/geminiService';
import { Sparkles, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [timeSpeed, setTimeSpeed] = useState<number>(1);
  const [customTextures, setCustomTextures] = useState<Record<string, string>>({});
  const [backgroundUrl, setBackgroundUrl] = useState<string>(DEFAULT_BACKGROUND_URL);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleTextureUpdate = (name: string, url: string) => {
    setCustomTextures(prev => ({
      ...prev,
      [name]: url
    }));
  };

  const enhanceTextures = async () => {
    setIsEnhancing(true);
    
    // Prompts designed to generate textures suitable for spherical mapping (Equirectangular)
    const targets = [
      {
        name: 'Earth',
        prompt: 'Satellite view equirectangular projection texture map of Earth, high detail continents, deep blue oceans, white cloud swirls, realistic 8k, seamless edges, scientific accuracy'
      },
      {
        name: 'Mars',
        prompt: 'Satellite view equirectangular projection texture map of Mars, red dusty surface, Valles Marineris, Olympus Mons, high detail, realistic 8k, seamless'
      },
      {
        name: 'Jupiter',
        prompt: 'Equirectangular projection texture map of Jupiter, gas giant surface, distinct brown and beige cloud bands, Great Red Spot, turbulent storms, realistic 8k'
      }
    ];

    try {
      // 1. Generate Planets
      const promises = targets.map(async (target) => {
        try {
          // Using 16:9 as the widest standard aspect ratio available to approximate a map projection
          const url = await generateSpaceImage(target.prompt, "16:9", "2K");
          return { name: target.name, url };
        } catch (e) {
          console.error(`Failed to generate texture for ${target.name}`, e);
          return null;
        }
      });

      // 2. Generate Background (Parallel)
      const bgPromise = generateSpaceImage(
        "Panoramic view of the Milky Way galaxy, deep space, colorful nebula, bright stars, high contrast, 8k resolution, photorealistic",
        "16:9",
        "2K"
      );

      const [results, newBgUrl] = await Promise.all([
        Promise.all(promises),
        bgPromise.catch(e => { console.error("BG Gen failed", e); return null; })
      ]);
      
      const newTextures: Record<string, string> = {};
      results.forEach(res => {
        if (res && res.url) {
          newTextures[res.name] = res.url;
        }
      });

      setCustomTextures(prev => ({ ...prev, ...newTextures }));
      if (newBgUrl) {
        setBackgroundUrl(newBgUrl);
      }

    } catch (error) {
      console.error("Global enhancement error", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      <SolarSystem 
        bodies={INITIAL_BODIES} 
        timeSpeed={timeSpeed}
        selectedBody={selectedBody}
        onSelectBody={setSelectedBody}
        customTextures={customTextures}
        backgroundTextureUrl={backgroundUrl}
      />
      
      {/* Title Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-500 tracking-widest uppercase">
          Solar System AI
        </h1>
        <p className="text-xs text-gray-400 mt-1">Powered by Google Gemini 3</p>
      </div>

      {/* AI Enhance Button */}
      <div className="absolute bottom-4 left-4 z-10">
        <button
          onClick={enhanceTextures}
          disabled={isEnhancing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-md transition-all ${
            isEnhancing 
              ? 'bg-gray-800/80 border-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-indigo-900/60 border-indigo-500/50 text-indigo-100 hover:bg-indigo-800/80 hover:scale-105 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
          }`}
        >
          {isEnhancing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm font-medium">Generating Cosmos...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-sm font-medium">AI Enhance System</span>
            </>
          )}
        </button>
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