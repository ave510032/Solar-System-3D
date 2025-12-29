import React, { useState } from 'react';
import { CelestialBody, AspectRatio, ImageSize, ChatMessage, GroundingChunk } from '../types';
import { Search, MapPin, Image as ImageIcon, BrainCircuit, X, Send, Loader2, Play, Pause, FastForward } from 'lucide-react';
import { getPlanetInfo, findObservatories, generateSpaceImage, askAstronomer } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface UIOverlayProps {
  selectedBody: CelestialBody | null;
  onClosePanel: () => void;
  timeSpeed: number;
  setTimeSpeed: (speed: number) => void;
  onTextureUpdate: (name: string, url: string) => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ 
  selectedBody, 
  onClosePanel, 
  timeSpeed, 
  setTimeSpeed,
  onTextureUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'chat' | 'generate' | 'maps'>('info');
  const [loading, setLoading] = useState(false);
  
  // Info State
  const [planetInfo, setPlanetInfo] = useState<string>('');
  const [infoLinks, setInfoLinks] = useState<GroundingChunk[]>([]);
  
  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  
  // Maps State
  const [mapsResult, setMapsResult] = useState<{text: string, chunks: any[] | undefined} | null>(null);

  // Image Gen State
  const [imagePrompt, setImagePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleFetchInfo = async () => {
    if (!selectedBody) return;
    setLoading(true);
    try {
      const data = await getPlanetInfo(selectedBody.nameRu);
      setPlanetInfo(data.text || 'Информация не найдена.');
      setInfoLinks(data.groundingChunks || []);
    } catch (e) {
      setPlanetInfo('Ошибка получения данных.');
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await askAstronomer(`Контекст: ${selectedBody?.nameRu || 'Космос'}. Вопрос: ${userMsg}`);
      setChatHistory(prev => [...prev, { role: 'model', text: response || '' }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'model', text: 'Ошибка при обдумывании ответа.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleMaps = async () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await findObservatories(position.coords.latitude, position.coords.longitude);
          setMapsResult({ text: res.text || '', chunks: res.groundingChunks });
        } catch (e) {
          setMapsResult({ text: 'Ошибка поиска на карте.', chunks: [] });
        } finally {
          setLoading(false);
        }
      });
    } else {
      setMapsResult({ text: 'Геолокация недоступна.', chunks: [] });
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `Realistic texture or artistic view of ${selectedBody?.nameRu}. ${imagePrompt}`;
      const url = await generateSpaceImage(prompt, aspectRatio, imageSize);
      if (url) {
        setGeneratedImage(url);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const applyTexture = () => {
    if (selectedBody && generatedImage) {
      onTextureUpdate(selectedBody.name, generatedImage);
    }
  };

  if (!selectedBody) {
    return (
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button 
          onClick={() => {
              setActiveTab('maps');
              alert("Для поиска обсерваторий выберите сначала любую планету (например, Землю), чтобы открыть панель управления.");
          }}
          className="bg-gray-900/80 text-white p-2 rounded-lg border border-gray-700 hover:bg-gray-800 backdrop-blur-md transition"
          title="Найти обсерваторию"
        >
          <MapPin size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 w-96 bg-gray-900/90 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] text-white z-20 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-950/50">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {selectedBody.nameRu}
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-wider">{selectedBody.type}</p>
        </div>
        <button onClick={onClosePanel} className="text-gray-400 hover:text-white transition">
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button 
          onClick={() => setActiveTab('info')} 
          className={`flex-1 p-3 flex justify-center hover:bg-white/5 transition ${activeTab === 'info' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
        >
          <Search size={18} />
        </button>
        <button 
          onClick={() => setActiveTab('chat')} 
          className={`flex-1 p-3 flex justify-center hover:bg-white/5 transition ${activeTab === 'chat' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}
        >
          <BrainCircuit size={18} />
        </button>
        <button 
          onClick={() => setActiveTab('generate')} 
          className={`flex-1 p-3 flex justify-center hover:bg-white/5 transition ${activeTab === 'generate' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}
        >
          <ImageIcon size={18} />
        </button>
        <button 
          onClick={() => setActiveTab('maps')} 
          className={`flex-1 p-3 flex justify-center hover:bg-white/5 transition ${activeTab === 'maps' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400'}`}
        >
          <MapPin size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* INFO TAB */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-300">{selectedBody.description}</p>
            <button 
              onClick={handleFetchInfo} 
              disabled={loading}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
              Найти актуальные факты (Gemini Flash)
            </button>
            
            {planetInfo && (
              <div className="bg-black/40 p-3 rounded-lg text-sm border border-gray-800">
                <div className="prose prose-invert prose-sm max-w-none">
                   <ReactMarkdown>{planetInfo}</ReactMarkdown>
                </div>
                {infoLinks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-500 mb-1">Источники:</p>
                    {infoLinks.map((chunk, idx) => (
                      <a 
                        key={idx} 
                        href={chunk.web?.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="block text-xs text-blue-400 hover:underline truncate"
                      >
                        {chunk.web?.title || chunk.web?.uri}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-[400px]">
            <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2">
              {chatHistory.length === 0 && (
                <p className="text-gray-500 text-sm text-center mt-10">
                  Спросите астронома о {selectedBody.nameRu}. <br/>
                  <span className="text-xs opacity-70">Использует Gemini 3 Pro (Thinking)</span>
                </p>
              )}
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-purple-900/50 ml-8' : 'bg-gray-800 mr-8'}`}>
                  {msg.role === 'model' ? (
                     <div className="prose prose-invert prose-sm max-w-none">
                       <ReactMarkdown>{msg.text}</ReactMarkdown>
                     </div>
                  ) : msg.text}
                </div>
              ))}
              {loading && <div className="text-gray-500 text-xs animate-pulse">Думаю...</div>}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Задай сложный вопрос..."
                className="flex-1 bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
              <button 
                onClick={handleChat}
                disabled={loading}
                className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}

        {/* GENERATE TAB */}
        {activeTab === 'generate' && (
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-2">
               <div>
                  <label className="text-xs text-gray-400">Aspect Ratio</label>
                  <select 
                    value={aspectRatio} 
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                    className="w-full bg-black/30 border border-gray-700 rounded p-1 text-xs mt-1"
                  >
                    {["1:1", "4:3", "16:9"].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
               </div>
               <div>
                  <label className="text-xs text-gray-400">Size</label>
                  <select 
                    value={imageSize} 
                    onChange={(e) => setImageSize(e.target.value as ImageSize)}
                    className="w-full bg-black/30 border border-gray-700 rounded p-1 text-xs mt-1"
                  >
                    <option value="1K">1K</option>
                    <option value="2K">2K</option>
                    <option value="4K">4K</option>
                  </select>
               </div>
             </div>
             
             <textarea 
               value={imagePrompt} 
               onChange={(e) => setImagePrompt(e.target.value)}
               placeholder="Опишите текстуру поверхности (лед, лава, кратеры)..."
               className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-sm h-24 focus:border-green-500 outline-none"
             />
             
             <button 
               onClick={handleGenerate}
               disabled={loading}
               className="w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
             >
               {loading ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
               Сгенерировать (Gemini Pro Vision)
             </button>

             {generatedImage && (
               <div className="space-y-2 animate-in fade-in duration-500">
                 <img src={generatedImage} alt="Generated" className="w-full rounded-lg border border-gray-700" />
                 <button 
                    onClick={applyTexture}
                    className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs"
                 >
                   Применить как текстуру
                 </button>
               </div>
             )}
          </div>
        )}

        {/* MAPS TAB */}
        {activeTab === 'maps' && (
          <div className="space-y-4">
             <p className="text-sm text-gray-300">
               Используйте Gemini 2.5 с Google Maps, чтобы найти ближайшие места, связанные с астрономией.
             </p>
             <button 
               onClick={handleMaps}
               disabled={loading}
               className="w-full py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
             >
               {loading ? <Loader2 className="animate-spin" size={16} /> : <MapPin size={16} />}
               Найти обсерватории рядом
             </button>

             {mapsResult && (
               <div className="bg-black/40 p-3 rounded-lg text-sm border border-gray-800 space-y-2">
                 <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{mapsResult.text}</ReactMarkdown>
                 </div>
                 {mapsResult.chunks?.map((chunk, i) => (
                    chunk.maps && (
                      <a 
                        key={i} 
                        href={chunk.maps.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="block bg-gray-800 p-2 rounded hover:bg-gray-700 transition"
                      >
                         <div className="font-bold text-red-400">{chunk.maps.title}</div>
                         {chunk.maps.placeAnswerSources?.[0]?.reviewSnippets?.[0] && (
                           <div className="text-xs text-gray-400 mt-1 italic">
                             "{chunk.maps.placeAnswerSources[0].reviewSnippets[0].text}"
                           </div>
                         )}
                      </a>
                    )
                 ))}
               </div>
             )}
          </div>
        )}

      </div>
      
      {/* Time Controls Footer */}
      <div className="p-3 bg-gray-950 border-t border-gray-700 flex items-center justify-between">
         <span className="text-xs text-gray-500">Скорость времени:</span>
         <div className="flex items-center gap-2">
           <button onClick={() => setTimeSpeed(0)} className={`p-1 rounded ${timeSpeed === 0 ? 'text-white bg-gray-700' : 'text-gray-400'}`}><Pause size={14} /></button>
           <button onClick={() => setTimeSpeed(0.1)} className={`p-1 rounded text-xs ${timeSpeed === 0.1 ? 'text-white bg-gray-700' : 'text-gray-400'}`}>0.1x</button>
           <button onClick={() => setTimeSpeed(1)} className={`p-1 rounded ${timeSpeed === 1 ? 'text-white bg-gray-700' : 'text-gray-400'}`}><Play size={14} /></button>
           <button onClick={() => setTimeSpeed(10)} className={`p-1 rounded ${timeSpeed === 10 ? 'text-white bg-gray-700' : 'text-gray-400'}`}>10x</button>
           <button onClick={() => setTimeSpeed(50)} className={`p-1 rounded ${timeSpeed === 50 ? 'text-white bg-gray-700' : 'text-gray-400'}`}><FastForward size={14} /></button>
         </div>
      </div>
    </div>
  );
};

export default UIOverlay;