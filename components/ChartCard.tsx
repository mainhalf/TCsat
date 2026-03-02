
import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  extra?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, className = "", extra }) => {
  return (
    <div className={`glass-panel rounded-2xl overflow-hidden flex flex-col ${className}`}>
      <div className="px-5 py-3 border-b border-sky-900/30 flex justify-between items-center bg-sky-500/5 shrink-0">
        <h3 className="text-sm font-bold text-sky-400 font-orbitron tracking-wider">{title}</h3>
        <div className="flex items-center gap-3">
          {extra && <div className="flex items-center">{extra}</div>}
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-500/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-sky-500/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-sky-500/40"></div>
          </div>
        </div>
      </div>
      <div className="p-5 flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
