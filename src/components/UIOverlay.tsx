import { Move, MousePointer2, Globe2 } from 'lucide-react';
import { useLanguage } from '../store/LanguageContext';

export function UIOverlay() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none flex flex-col justify-between z-10 text-slate-200 font-sans">
      <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-screen" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute inset-0 pointer-events-none mix-blend-screen" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.15) 0%, transparent 70%)' }}></div>
      
      {/* Top right Language Switcher */}
      <div className="absolute top-6 right-6 z-20 flex bg-slate-900/50 backdrop-blur border border-white/10 p-1 rounded-lg pointer-events-auto">
         {(['zh', 'en', 'ja', 'ko'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors ${
                lang === l 
                  ? 'bg-cyan-500/20 text-cyan-400' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
      </div>

      <header className="relative z-10 p-6 flex flex-col gap-1 border-b border-white/5 bg-slate-950/40 backdrop-blur-md animate-fade-in pointer-events-auto w-max">
        <h1 className="text-xl font-bold tracking-widest text-white uppercase">
          {t('title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{t('subtitle')}</span>
        </h1>
        <div className="flex items-center gap-2 mt-1">
           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
           <span className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-tighter">{t('desc')}</span>
        </div>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('reset-view'))}
          className="mt-4 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-mono font-bold uppercase tracking-widest self-start rounded-lg text-slate-300 hover:text-white flex items-center gap-2"
        >
          <Globe2 className="w-4 h-4" />
          {t('resetView')}
        </button>
      </header>

      <main className="relative flex-1 flex pointer-events-none animate-fade-in-up">
        {/* Navigation Control Grouped Container */}
        <div className="absolute left-6 bottom-6 z-20 flex flex-col gap-4 pointer-events-auto">
          <div className="p-4 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl w-56 flex flex-col gap-4">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{t('navCtrl')}</div>
            <div className="flex flex-col gap-4">
              {/* WASD Legend */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded border border-white/20 bg-white/5 flex items-center justify-center shrink-0">
                  <Move className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex flex-col">
                  <div className="font-semibold text-xs tracking-wide text-white uppercase">{t('wasdKeys')}</div>
                  <div className="text-[10px] text-slate-400">{t('moveCamera')}</div>
                </div>
              </div>

              {/* Mouse Legend */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded border border-white/20 bg-white/5 flex items-center justify-center shrink-0">
                  <MousePointer2 className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex flex-col">
                  <div className="font-semibold text-xs tracking-wide text-white uppercase">{t('dragScroll')}</div>
                  <div className="text-[10px] text-slate-400">{t('rotateZoom')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-6 py-3 flex items-center justify-between bg-black/40 backdrop-blur-sm border-t border-white/5 text-[10px] font-mono text-slate-500 pointer-events-auto">
        <div className="flex gap-6 uppercase">
          <span>{t('posLabel')}: {t('tracking')}</span>
          <span>{t('fovLabel')}: 60&deg;</span>
        </div>
        <div className="flex gap-4">
          <span>{t('sysStatus')}</span>
          <span className="text-cyan-500/70 underline cursor-pointer hover:text-cyan-400 transition-colors">{t('viewLogs')}</span>
        </div>
      </footer>
    </div>
  );
}
