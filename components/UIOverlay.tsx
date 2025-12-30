import React, { useState } from 'react';
import { CelestialBody } from '../types';
import { 
  X, Play, Pause, FastForward, Info, Thermometer, Ruler, Orbit, 
  Compass, Layers, List 
} from 'lucide-react';

interface UIOverlayProps {
  selectedBody: CelestialBody | null;
  onClosePanel: () => void;
  timeSpeed: number;
  setTimeSpeed: (speed: number) => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ 
  selectedBody, 
  onClosePanel, 
  timeSpeed, 
  setTimeSpeed
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'facts'>('overview');

  if (!selectedBody) {
    return (
      <div className="absolute top-1/2 left-10 -translate-y-1/2 flex flex-col gap-4 z-10 pointer-events-none">
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4 animate-in fade-in slide-in-from-left-10 duration-1000">
          <h1 className="text-4xl font-black italic text-white/90 tracking-tighter uppercase leading-none">
            Solar<br/><span className="text-blue-500">System</span>
          </h1>
          <p className="text-sm text-gray-400 max-w-xs font-medium">
            Интерактивный 3D атлас планет и спутников. <br/>
            Нажмите на любой объект для детального изучения.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 w-[420px] bg-[#0d0d12]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[92vh] text-white z-20 overflow-hidden animate-in slide-in-from-right-20 duration-500">
      {/* Header */}
      <div className="relative p-8 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: selectedBody.color }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                {selectedBody.type === 'star' ? 'Главная Звезда' : selectedBody.type === 'planet' ? 'Планета' : 'Спутник / Объект'}
              </span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-white">
              {selectedBody.nameRu}
            </h2>
          </div>
          <button 
            onClick={onClosePanel} 
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="px-8 flex gap-4 border-b border-white/5 overflow-x-auto custom-scrollbar no-scrollbar">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'overview' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'}`}
        >
          Обзор
        </button>
        <button 
          onClick={() => setActiveTab('data')}
          className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'data' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500'}`}
        >
          Данные
        </button>
        <button 
          onClick={() => setActiveTab('facts')}
          className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'facts' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-500'}`}
        >
          Факты
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-6 space-y-6">
        
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <p className="text-lg font-medium leading-relaxed text-gray-200">
              {selectedBody.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-1">
                 <Ruler size={16} className="text-blue-400 mb-2"/>
                 <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Радиус</span>
                 <span className="text-lg font-black">{selectedBody.realRadius.toLocaleString()} км</span>
               </div>
               <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-1">
                 <Thermometer size={16} className="text-red-400 mb-2"/>
                 <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Температура</span>
                 <span className="text-sm font-bold truncate">{selectedBody.temperature || 'Неизвестно'}</span>
               </div>
            </div>

            {selectedBody.moons && selectedBody.moons.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                  <List size={12}/> Основные Спутники
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBody.moons.map(m => (
                    <span key={m.name} className="px-3 py-1.5 bg-white/5 rounded-full text-xs font-bold text-gray-300 border border-white/5">
                      {m.nameRu}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {[
              { label: 'Масса', value: selectedBody.mass, icon: Layers },
              { label: 'Гравитация', value: selectedBody.gravity, icon: Compass },
              { label: 'Период вращения', value: selectedBody.rotationPeriod, icon: Orbit },
              { label: 'Орбитальный период', value: selectedBody.orbitalPeriod, icon: Orbit },
            ].map((item, idx) => item.value && (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <item.icon size={16} className="text-purple-400" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                </div>
                <span className="text-sm font-black">{item.value}</span>
              </div>
            ))}

            {selectedBody.composition && (
              <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Состав</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBody.composition.map((c, i) => (
                    <span key={i} className="text-xs font-bold text-gray-300 bg-white/5 px-2 py-1 rounded-md">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'facts' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-4">
              {selectedBody.interestingFacts?.map((fact, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-amber-500/50" />
                  <p className="text-sm font-medium text-gray-300 leading-relaxed italic">{fact}</p>
                </div>
              ))}
            </div>
            {!selectedBody.interestingFacts && (
              <p className="text-sm text-gray-500 text-center py-10 italic">Интересные факты скоро появятся...</p>
            )}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-8 bg-black/40 border-t border-white/5 flex items-center justify-between">
         <div className="flex gap-2">
            <button 
              onClick={() => setTimeSpeed(timeSpeed === 0 ? 1 : 0)}
              className={`p-3 rounded-2xl transition-all ${timeSpeed === 0 ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              {timeSpeed === 0 ? <Play size={20}/> : <Pause size={20}/>}
            </button>
            <div className="flex gap-1 p-1 bg-white/5 rounded-2xl">
               {[0.1, 1, 10, 100].map(s => (
                 <button 
                   key={s}
                   onClick={() => setTimeSpeed(s)}
                   className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${timeSpeed === s ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}
                 >
                   {s}x
                 </button>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default UIOverlay;