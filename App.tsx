
import React, { useState, useEffect } from 'react';
import { ViewType } from './types';
import SummaryView from './components/SummaryView';
import ServerView from './components/ServerView';
import SatelliteView from './components/SatelliteView';
import GroundNetworkView from './components/GroundNetworkView';
import ProductionView from './components/ProductionView';
import { LayoutDashboard, Server, Satellite, Network, Factory } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>(ViewType.SUMMARY);
  const [timestamp, setTimestamp] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTimestamp(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case ViewType.SUMMARY: return <SummaryView />;
      case ViewType.SERVER: return <ServerView />;
      case ViewType.SATELLITE: return <SatelliteView />;
      case ViewType.GROUND: return <GroundNetworkView />;
      case ViewType.PRODUCTION: return <ProductionView />;
      default: return <SummaryView />;
    }
  };

  const navItems = [
    { id: ViewType.SUMMARY, label: '全景总览', icon: <LayoutDashboard size={18} /> },
    { id: ViewType.SERVER, label: '服务器运维', icon: <Server size={18} /> },
    { id: ViewType.SATELLITE, label: '卫星接收站', icon: <Satellite size={18} /> },
    { id: ViewType.GROUND, label: '地基网络', icon: <Network size={18} /> },
    { id: ViewType.PRODUCTION, label: '数据生产', icon: <Factory size={18} /> },
  ];

  return (
    <div className="min-h-screen h-screen flex flex-col relative overflow-hidden bg-[#020617] text-slate-200">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.15)_0%,transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <header className="z-20 w-full glass-panel border-b border-sky-900/50 px-8 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative group w-11 h-11 bg-slate-900 border border-sky-400/50 rounded-lg flex items-center justify-center glow-blue">
            <Satellite className="text-sky-400 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">卫星数据一体化运维中心</h1>
            <p className="text-[9px] text-sky-600 tracking-[0.25em] font-bold uppercase mt-0.5">Integrated Satellite Data Operations Center</p>
          </div>
        </div>

        <nav className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-2xl border border-sky-900/40">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-3 px-5 py-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-sky-500/10 text-sky-400 border border-sky-400/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]' : 'text-slate-500 hover:text-sky-300'}`}
              >
                {item.icon}
                <span className="text-xs font-bold tracking-wider">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-6 font-mono">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-sky-700 font-bold uppercase tracking-widest">监测节点状态</span>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px]"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>NORMAL</div>
          </div>
          <div className="text-right">
             <div className="text-[10px] font-bold text-sky-600/80">{timestamp.toLocaleDateString()}</div>
             <div className="text-xl font-orbitron font-bold text-sky-400 leading-none">{timestamp.toLocaleTimeString([], {hour12: false})}</div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10 p-6 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 min-h-0">
          {renderView()}
        </div>
      </main>

      <footer className="z-20 glass-panel border-t border-sky-900/30 p-2 text-center text-[10px] text-sky-800 tracking-[0.4em] font-bold uppercase">
        scdi V1.0 Desgin by taocheng
      </footer>
    </div>
  );
};

export default App;
