import React, { useState, useRef } from 'react';
import { analyzeContent, AnalysisInput } from '../services/geminiService';
import { DetectionResult } from '../types';

interface DetectorProps {
  isPremium: boolean;
  result: DetectionResult | null;
  onResult: (res: DetectionResult) => void;
}

const Detector: React.FC<DetectorProps> = ({ isPremium, result, onResult }) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [file, setFile] = useState<{ name: string; mimeType: string; base64: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      const base64 = await fileToBase64(selectedFile);
      setFile({
        name: selectedFile.name,
        mimeType: selectedFile.type || 'application/octet-stream',
        base64
      });
      
      if (selectedFile.type.startsWith('text/') || selectedFile.name.endsWith('.txt')) {
        const textContent = atob(base64);
        setText(textContent);
      } else {
        setText(`[FILE ATTACHED] ${selectedFile.name} ready for deep neural scanning...`);
      }
    } catch (err) {
      console.error("File processing error:", err);
      alert("Failed to process file for upload.");
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim() && !file) return;
    
    setIsAnalyzing(true);
    setScanningProgress(0);

    const interval = setInterval(() => {
      setScanningProgress(prev => {
        if (prev >= 98) return 98;
        return prev + (isPremium ? 5 : 2);
      });
    }, 100);

    try {
      const input: AnalysisInput = {
        text: text.trim() || undefined,
        fileData: file ? { base64: file.base64, mimeType: file.mimeType } : undefined
      };

      const analysis = await analyzeContent(input, isPremium);
      onResult(analysis);
    } catch (e) {
      console.error(e);
      alert("Analysis failed. Please check your API_KEY.");
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
      setScanningProgress(0);
    }
  };

  const clearInput = () => {
    setText('');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      <div className="max-w-4xl mx-auto bg-slate-800/40 rounded-3xl p-8 border border-slate-700/50 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <span className={`w-2 h-2 rounded-full ${(text || file) ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`} />
               System Input: {file ? `Attached [${file.name}]` : 'Direct Text'}
             </label>
             {(text || file) && (
               <button onClick={clearInput} className="text-[10px] text-slate-500 hover:text-red-400 transition-colors uppercase font-bold">
                 Reset Scanner
               </button>
             )}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste content here or upload media (Video, PPT, Text)..."
            className="w-full h-72 bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-slate-200 placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all resize-none shadow-inner text-sm leading-relaxed"
          />
          
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex gap-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".txt,.pdf,.pptx,.docx,.mp4,.png,.jpg" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-2 transition-all border border-slate-700 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                {file ? 'File Loaded' : 'Attach Media/Doc'}
              </button>
            </div>

            <button
              disabled={isAnalyzing || (!text.trim() && !file)}
              onClick={handleAnalyze}
              className={`px-12 py-3.5 rounded-xl font-black text-sm tracking-wider uppercase transition-all transform active:scale-95 flex items-center gap-3 ${
                isAnalyzing ? 'bg-slate-800 cursor-not-allowed text-slate-500 border border-slate-700' : 'bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 text-white'
              }`}
            >
              {isAnalyzing && (
                <svg className="animate-spin h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isAnalyzing ? 'Processing Nodes...' : 'Start Recognition Scan'}
            </button>
          </div>
        </div>

        {isAnalyzing && (
          <div className="mt-8 space-y-4">
            <div className="flex justify-between text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">
              <span>Scanning...</span>
              <span className="tabular-nums">{scanningProgress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-[2px] border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-400 rounded-full transition-all duration-300"
                style={{ width: `${scanningProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative">
            <h3 className="text-xl font-bold text-slate-100 mb-8 flex items-center gap-2">Forensic Analysis</h3>
            <div className="space-y-8">
              <div className="flex items-center justify-between bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">AI Probability</span>
                <span className={`text-5xl font-black tabular-nums ${result.aiProbability > 60 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {result.aiProbability}%
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block mb-2 text-[10px] uppercase tracking-widest">Likely Origin</span>
                <span className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl text-xs font-black border border-indigo-500/20">
                  {result.detectedTool}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block mb-2 text-[10px] uppercase tracking-widest">Structural Insights</span>
                <p className="text-slate-400 text-sm italic">"{result.reasoning}"</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {isPremium && result.sources && result.sources.length > 0 && (
              <div className="bg-slate-900 rounded-3xl p-6 border border-indigo-500/20 shadow-2xl">
                <h4 className="text-xs font-black text-indigo-400 mb-5 uppercase tracking-widest">Web Sources</h4>
                <div className="space-y-3">
                  {result.sources.map((source, idx) => (
                    <a key={idx} href={source.uri} target="_blank" rel="noreferrer" className="block p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all">
                      <p className="text-xs font-black text-slate-200 truncate">{source.title}</p>
                      <p className="text-[9px] text-slate-600 truncate mt-1">{source.uri}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
                <h3 className="text-lg font-black text-slate-100 mb-8 uppercase tracking-widest">Recommendations</h3>
                <div className="space-y-6">
                  {result.recommendations.map((rec, i) => (
                    <div key={i}>
                      <p className="text-indigo-400 font-black text-xs uppercase mb-1">{rec.toolName}</p>
                      <p className="text-xs text-slate-400 mb-2">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Detector;
