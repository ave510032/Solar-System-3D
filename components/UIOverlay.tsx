import React, { useState, useMemo } from 'react';
import { CelestialBody, QuizQuestion, Achievement } from '../types';
import { 
  X, Play, Pause, FastForward, Info, Thermometer, Ruler, Orbit, 
  Compass, Layers, List, Search, Map, Award, HelpCircle, 
  ArrowRight, Globe, TrendingUp, Zap, ChevronRight, Share2, Camera
} from 'lucide-react';
import { QUIZ_QUESTIONS, TOURS } from '../constants';

interface UIOverlayProps {
  selectedBody: CelestialBody | null;
  onClosePanel: () => void;
  timeSpeed: number;
  setTimeSpeed: (speed: number) => void;
  allBodies: CelestialBody[];
  onSelectBody: (body: CelestialBody) => void;
  showOrbits: boolean;
  setShowOrbits: (v: boolean) => void;
  showLabels: boolean;
  setShowLabels: (v: boolean) => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ 
  selectedBody, onClosePanel, timeSpeed, setTimeSpeed, allBodies, onSelectBody,
  showOrbits, setShowOrbits, showLabels, setShowLabels
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'facts' | 'history'>('overview');
  const [mode, setMode] = useState<'main' | 'quiz' | 'tours' | 'compare' | 'settings'>('main');
  const [search, setSearch] = useState('');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  const filteredBodies = useMemo(() => 
    allBodies.filter(b => b.nameRu.toLowerCase().includes(search.toLowerCase()) || b.name.toLowerCase().includes(search.toLowerCase()))
  , [search, allBodies]);

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `SpaceExplorer_${selectedBody?.name || 'SolarSystem'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const currentQuiz = QUIZ_QUESTIONS[quizIndex];

  return (
    <div className="absolute inset-0 z-10 pointer-events-none p-4 flex flex-col justify-between">
      {/* Top Bar - Search & Navigation */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="flex flex-col gap-2">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center gap-3 w-80 shadow-2xl">
            <Search size={18} className="text-gray-500 ml-2" />
            <input 
              className="bg-transparent border-none outline-none text-sm text-white w-full py-2"
              placeholder="Поиск планет и спутников..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <div className="absolute top-16 left-0 w-full bg-black/90 border border-white/10 rounded-2xl overflow-hidden max-h-60 overflow-y-auto z-50">
                {filteredBodies.map(b => (
                  <button key={b.name} onClick={() => { onSelectBody(b); setSearch(''); }} className="w-full px-4 py-3 text-left hover:bg-white/10 text-xs flex justify-between">
                    <span>{b.nameRu}</span>
                    <span className="text-gray-500 uppercase text-[9px]">{b.type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => setMode('tours')} className="bg-white/5 hover:bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-bold border border-white/10 uppercase flex items-center gap-2"><Map size={12}/> Экскурсии</button>
            <button onClick={() => setMode('quiz')} className="bg-white/5 hover:bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-bold border border-white/10 uppercase flex items-center gap-2"><Award size={12}/> Викторина</button>
            <button onClick={() => setMode('settings')} className="bg-white/5 hover:bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-bold border border-white/10 uppercase flex items-center gap-2"><Layers size={12}/> Слои</button>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
           <button onClick={handleScreenshot} className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10"><Camera size={20}/></button>
           <div className="bg-black/60 px-4 py-2 rounded-xl border border-white/5 text-[10px] text-gray-400 font-mono">FPS: 60</div>
        </div>
      </div>

      {/* Main Content Modal (Right Side) */}
      {selectedBody && (
        <div className="absolute top-4 right-4 w-[420px] bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] text-white z-20 overflow-hidden pointer-events-auto animate-in slide-in-from-right-20">
          <div className="p-8 pb-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedBody.color }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">{selectedBody.type}</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter">{selectedBody.nameRu}</h2>
            </div>
            <button onClick={onClosePanel} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5"><X size={20}/></button>
          </div>

          <div className="px-8 flex gap-4 border-b border-white/5 no-scrollbar overflow-x-auto">
            {['overview', 'data', 'facts', 'history'].map(t => (
              <button key={t} onClick={() => setActiveTab(t as any)} className={`pb-4 text-[10px] font-black uppercase tracking-widest ${activeTab === t ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'}`}>
                {t === 'overview' ? 'Обзор' : t === 'data' ? 'Данные' : t === 'facts' ? 'Факты' : 'История'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-6 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in">
                <p className="text-lg font-medium leading-relaxed">{selectedBody.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
                    <Ruler size={14} className="text-blue-400 mb-1"/><span className="text-[9px] uppercase font-bold text-gray-500">Радиус</span><span className="text-lg font-black">{selectedBody.realRadius} км</span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
                    <Thermometer size={14} className="text-red-400 mb-1"/><span className="text-[9px] uppercase font-bold text-gray-500">Температура</span><span className="text-sm font-bold">{selectedBody.temperature || '—'}</span>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'facts' && (
              <div className="space-y-4">
                {selectedBody.interestingFacts?.map((f, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <Zap size={16} className="text-amber-400 flex-shrink-0" />
                    <p className="text-sm text-gray-300 italic">{f}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'data' && (
              <div className="space-y-2">
                 {[
                   { l: 'Масса', v: selectedBody.mass },
                   { l: 'Гравитация', v: selectedBody.gravity },
                   { l: 'Сутки', v: selectedBody.rotationPeriod },
                   { l: 'Орбита', v: selectedBody.orbitalPeriod }
                 ].map((it, i) => it.v && (
                   <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                     <span className="text-[10px] uppercase font-bold text-gray-500">{it.l}</span>
                     <span className="text-xs font-black">{it.v}</span>
                   </div>
                 ))}
              </div>
            )}
            {activeTab === 'history' && (
               <div className="space-y-4">
                 {selectedBody.explorationHistory?.map((h, i) => (
                   <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 relative overflow-hidden">
                     <div className="text-[10px] font-bold text-blue-400 mb-1">{h.year} — {h.mission}</div>
                     <div className="text-sm text-gray-200">{h.detail}</div>
                   </div>
                 ))}
                 {!selectedBody.explorationHistory && <div className="text-center text-xs text-gray-500 py-10">История исследований недоступна</div>}
               </div>
            )}
          </div>
          <div className="p-8 bg-black/40 border-t border-white/5 flex justify-between items-center">
             <button onClick={() => setMode('compare')} className="text-[10px] font-black uppercase text-blue-400 hover:underline">Сравнить планету</button>
             <button onClick={() => onSelectBody(allBodies[Math.floor(Math.random() * allBodies.length)])} className="text-[10px] font-black uppercase text-gray-400">Случайный объект</button>
          </div>
        </div>
      )}

      {/* Special Modes Overlay (Quiz / Tour / Settings) */}
      {mode !== 'main' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center pointer-events-auto">
          <div className="bg-black border border-white/10 rounded-[3rem] w-[500px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-widest">{mode === 'quiz' ? 'Космическая Викторина' : mode === 'tours' ? 'Экскурсии' : 'Настройки'}</h3>
              <button onClick={() => setMode('main')} className="p-2 hover:bg-white/10 rounded-xl"><X /></button>
            </div>
            <div className="p-8">
              {mode === 'quiz' && currentQuiz && (
                <div className="space-y-6">
                  <div className="text-lg font-bold">{currentQuiz.question}</div>
                  <div className="grid gap-2">
                    {currentQuiz.options.map((opt, i) => (
                      <button key={i} onClick={() => { if(i === currentQuiz.correct) setQuizScore(quizScore+1); if(quizIndex < QUIZ_QUESTIONS.length-1) setQuizIndex(quizIndex+1); else { alert(`Викторина окончена! Ваш счет: ${quizScore+1}`); setQuizIndex(0); setQuizScore(0); setMode('main'); } }} className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 text-left text-sm font-bold flex justify-between">
                        {opt} <ChevronRight size={16} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {mode === 'tours' && (
                <div className="space-y-4">
                  {TOURS.map(t => (
                    <button key={t.id} onClick={() => { onSelectBody(allBodies.find(b => b.name === t.targets[0])!); setMode('main'); }} className="w-full p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/5 text-left flex justify-between items-center group">
                      <div>
                        <div className="text-lg font-black">{t.name}</div>
                        <div className="text-xs text-gray-500 uppercase">{t.targets.length} объектов</div>
                      </div>
                      <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  ))}
                </div>
              )}
              {mode === 'settings' && (
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                     <span className="text-sm font-bold">Орбиты планет</span>
                     <button onClick={() => setShowOrbits(!showOrbits)} className={`w-12 h-6 rounded-full transition-all flex items-center p-1 ${showOrbits ? 'bg-blue-600' : 'bg-gray-800'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${showOrbits ? 'translate-x-6' : 'translate-x-0'}`} />
                     </button>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-sm font-bold">Ярлыки названий</span>
                     <button onClick={() => setShowLabels(!showLabels)} className={`w-12 h-6 rounded-full transition-all flex items-center p-1 ${showLabels ? 'bg-blue-600' : 'bg-gray-800'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${showLabels ? 'translate-x-6' : 'translate-x-0'}`} />
                     </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar - Time Controls */}
      <div className="flex justify-center pointer-events-auto">
        <div className="bg-black/80 backdrop-blur-2xl px-8 py-4 rounded-[2rem] border border-white/10 flex items-center gap-6 shadow-2xl">
          <div className="flex items-center gap-2">
            <button onClick={() => setTimeSpeed(timeSpeed === 0 ? 1 : 0)} className={`p-4 rounded-2xl transition-all ${timeSpeed === 0 ? 'bg-red-500 text-white shadow-[0_0_20px_red]' : 'bg-white/10 hover:bg-white/20'}`}>
              {timeSpeed === 0 ? <Play size={20}/> : <Pause size={20}/>}
            </button>
          </div>
          <div className="h-8 w-[1px] bg-white/10 mx-2" />
          <div className="flex gap-1">
             {[0.1, 1, 10, 100, 1000].map(s => (
               <button key={s} onClick={() => setTimeSpeed(s)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${timeSpeed === s ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                 {s}x
               </button>
             ))}
          </div>
          <div className="h-8 w-[1px] bg-white/10 mx-2" />
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-gray-500 uppercase font-black">Текущая дата</span>
            <span className="text-xs font-mono text-white/80">{(new Date()).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIOverlay;
