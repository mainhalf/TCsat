
import React, { useState, useEffect, useMemo } from 'react';
import ChartCard from './ChartCard';
import Globe3D from './Globe3D';
import { 
  Satellite, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  X,
  Radio,
  Activity,
  Signal,
  Video,
  Play,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  Thermometer,
  Box,
  Globe,
  Settings,
  Battery,
  HardDrive,
  Target,
  BarChart3,
  Percent,
  Network,
  Calendar,
  Waves,
  ArrowUp,
  ArrowDown,
  Filter,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ComposedChart, 
  Bar,
  AreaChart,
  Area,
  ReferenceLine,
  Legend
} from 'recharts';

type DayStatus = 'success' | 'warning' | 'none';

const SatelliteView: React.FC = () => {
  const [selectedStationDetail, setSelectedStationDetail] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedSatelliteDetail, setSelectedSatelliteDetail] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<{ sat: string, time: string } | null>(null);
  
  // 日历相关状态
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(0); // 0-indexed (0 = Jan)
  const [selectedDate, setSelectedDate] = useState<number>(8); // 默认选中今天
  const [isDataLoading, setIsDataLoading] = useState(false);

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  // 模拟日历数据：每日接收状态
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      let status: DayStatus = 'success';
      // 随机生成一些状态以增强真实感
      const hash = (currentYear * 10000 + (currentMonth + 1) * 100 + day) % 31;
      if ([4, 12, 20, 25, 7, 18].includes(hash)) status = 'warning';
      if ([15, 28, 3].includes(hash)) status = 'none';
      return { day, status };
    });
  }, [currentYear, currentMonth]);

  // 切换月份
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
    setIsDataLoading(true);
    setTimeout(() => setIsDataLoading(false), 400);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
    setIsDataLoading(true);
    setTimeout(() => setIsDataLoading(false), 400);
  };

  const handlePrevYear = () => {
    setCurrentYear(prev => prev - 1);
    setIsDataLoading(true);
    setTimeout(() => setIsDataLoading(false), 400);
  };

  const handleNextYear = () => {
    setCurrentYear(prev => prev + 1);
    setIsDataLoading(true);
    setTimeout(() => setIsDataLoading(false), 400);
  };

  // 模拟点击日期切换数据
  const handleDateClick = (day: number) => {
    if (day === selectedDate) return;
    setSelectedDate(day);
    setIsDataLoading(true);
    // 模拟数据加载延时
    setTimeout(() => setIsDataLoading(false), 600);
  };

  const weeklyRateData = [
    { name: '01/02', value: 92, avg: 90 },
    { name: '01/03', value: 88, avg: 90 },
    { name: '01/04', value: 95, avg: 90 },
    { name: '01/05', value: 82, avg: 90 },
    { name: '01/06', value: 98, avg: 90 },
    { name: '01/07', value: 91, avg: 90 },
    { name: '01/08', value: 96, avg: 90 },
  ];

  const analysisData = [
    { name: '1月', lastMonth: 420, thisMonth: 450, rate: 94 },
    { name: '2月', lastMonth: 460, thisMonth: 440, rate: 91 },
    { name: '3月', lastMonth: 410, thisMonth: 480, rate: 97 },
    { name: '4月', lastMonth: 500, thisMonth: 520, rate: 95 },
    { name: '5月', lastMonth: 480, thisMonth: 540, rate: 98 },
    { name: '6月', lastMonth: 520, thisMonth: 510, rate: 93 },
  ];

  const statsGaugeData = [
    { name: 'FY3E', value: 9, color: '#22d3ee' },
    { name: 'AQUA', value: 37, color: '#38bdf8' },
    { name: 'JPSS1', value: 25, color: '#0ea5e9' },
    { name: 'NPP', value: 9, color: '#6366f1' },
    { name: 'FY3D', value: 20, color: '#0c4a6e' },
  ];

  const receptionPlans = [
    { id: 1, sat: 'NPP', startTime: `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')} 03:28`, endTime: '03:41', status: '已接收', hasVideo: true },
    { id: 2, sat: 'FY3D', startTime: `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')} 04:15`, endTime: '04:30', status: '已接收', hasVideo: true },
    { id: 3, sat: 'AQUA', startTime: `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')} 05:00`, endTime: '05:15', status: '已接收', hasVideo: true },
    { id: 4, sat: 'JPSS1', startTime: `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')} 05:45`, endTime: '06:00', status: '已接收', hasVideo: true },
    { id: 5, sat: 'NPP', startTime: `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')} 06:30`, endTime: '06:45', status: '已接收', hasVideo: true },
    { id: 6, sat: 'FY3E', startTime: `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')} 07:15`, endTime: '07:30', status: '已接收', hasVideo: true },
  ];

  return (
    <div className={`flex flex-col h-full gap-4 relative ${isDataLoading ? 'opacity-50 grayscale' : 'opacity-100'} transition-all`}>
      
      {selectedStationDetail && (
        <StationDetailOverlay 
          stationName={selectedStationDetail} 
          onClose={() => setSelectedStationDetail(null)} 
        />
      )}

      {selectedSatelliteDetail && (
        <SatelliteDetailOverlay 
          satName={selectedSatelliteDetail} 
          onClose={() => setSelectedSatelliteDetail(null)} 
        />
      )}

      {playingVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setPlayingVideo(null)}></div>
          <div className="relative w-full max-w-4xl aspect-video glass-panel rounded-3xl overflow-hidden border border-sky-400/30 shadow-[0_0_100px_rgba(56,189,248,0.2)] animate-in zoom-in duration-300">
            <div className="absolute top-0 inset-x-0 h-14 flex items-center justify-between px-6 bg-slate-900/60 border-b border-sky-900/30 z-10">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
                     <Video size={18} />
                  </div>
                  <div>
                    <span className="text-sm font-orbitron font-bold text-white tracking-widest uppercase">REC_{playingVideo.sat}_STREAM</span>
                    <p className="text-[10px] text-sky-500 font-bold tracking-tighter opacity-70">时间戳: {playingVideo.time}</p>
                  </div>
               </div>
               <button onClick={() => setPlayingVideo(null)} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                  <X size={20} />
               </button>
            </div>
            <div className="w-full h-full pt-14 bg-black flex items-center justify-center relative">
               <div className="flex flex-col items-center gap-4 z-10">
                  <div className="w-20 h-20 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-400/40 animate-pulse">
                     <Play size={32} className="text-sky-400 ml-1" />
                  </div>
                  <span className="text-[12px] font-orbitron font-bold text-sky-500 animate-pulse tracking-widest uppercase">Streaming Recorded Data...</span>
               </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* 左侧面板 */}
        <div className="col-span-2 flex flex-col gap-4 overflow-hidden">
          {/* 接收日历 - Interactive & Status-based colors */}
          <ChartCard title="接收态势日历" className="h-[280px] shrink-0">
             <div className="flex flex-col h-full text-[9px]">
                <div className="flex flex-col gap-2 mb-4">
                   <div className="flex justify-between items-center text-sky-400 font-bold">
                      <div className="flex items-center gap-2">
                         <ChevronLeft size={12} className="cursor-pointer hover:text-white transition-colors" onClick={handlePrevYear} />
                         <span className="font-orbitron min-w-[36px] text-center">{currentYear}</span>
                         <ChevronRight size={12} className="cursor-pointer hover:text-white transition-colors" onClick={handleNextYear} />
                      </div>
                      <div className="flex items-center gap-2">
                         <ChevronLeft size={12} className="cursor-pointer hover:text-white transition-colors" onClick={handlePrevMonth} />
                         <div className="flex items-center gap-1 px-3 py-1 bg-sky-500/10 rounded-full border border-sky-500/20 text-[10px] font-orbitron min-w-[60px] justify-center">
                            {monthNames[currentMonth]}
                         </div>
                         <ChevronRight size={12} className="cursor-pointer hover:text-white transition-colors" onClick={handleNextMonth} />
                      </div>
                   </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                   {['一', '二', '三', '四', '五', '六', '日'].map(d => <div key={d} className="text-slate-500 py-1 font-bold">{d}</div>)}
                   {calendarDays.map(({ day, status }) => {
                     const isSelected = day === selectedDate;
                     const statusColors = {
                        success: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20',
                        warning: 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20',
                        none: 'bg-slate-800/40 text-slate-600'
                     };
                     
                     return (
                        <div 
                           key={day} 
                           onClick={() => handleDateClick(day)}
                           className={`
                              relative py-1.5 rounded-lg transition-all cursor-pointer font-orbitron font-bold
                              ${isSelected ? 'bg-sky-500 text-white shadow-[0_0_15px_rgba(56,189,248,0.6)] scale-110 z-10 border border-white/40' : statusColors[status]}
                              ${status === 'none' ? 'cursor-not-allowed opacity-50' : ''}
                           `}
                        >
                           {day}
                           {/* 状态小圆点指示器 */}
                           {!isSelected && status !== 'none' && (
                              <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${status === 'success' ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                           )}
                        </div>
                     );
                   })}
                </div>

                {/* 图例说明 */}
                <div className="mt-auto flex justify-between px-2 pt-2 border-t border-sky-900/20">
                   <div className="flex items-center gap-1.5 text-[7px] text-slate-500 font-bold uppercase">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> 成功
                   </div>
                   <div className="flex items-center gap-1.5 text-[7px] text-slate-500 font-bold uppercase">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> 部分
                   </div>
                   <div className="flex items-center gap-1.5 text-[7px] text-slate-500 font-bold uppercase">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div> 无数据
                   </div>
                </div>
             </div>
          </ChartCard>

          <ChartCard title="七天接收率监控" className="h-[230px] shrink-0">
             <div className="h-full relative flex flex-col">
                <div className="absolute top-0 right-0 flex items-center gap-3 z-10 bg-[#0f172a]/40 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-sky-500/10">
                   <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_5px_#38bdf8]"></div>
                      <span className="text-[8px] text-slate-400 font-bold tracking-widest uppercase">实时</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                      <span className="text-[8px] text-slate-400 font-bold tracking-widest uppercase">基准线</span>
                   </div>
                </div>
                <div className="flex-1 min-h-0">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={weeklyRateData} margin={{ top: 20, right: 5, left: -30, bottom: 0 }}>
                       <defs>
                         <linearGradient id="rateColor" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                           <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="2 4" stroke="#1e293b" vertical={false} />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#475569', fontWeight: 'bold' }} />
                       <YAxis hide domain={[70, 100]} />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '10px', fontSize: '10px' }}
                         itemStyle={{ color: '#38bdf8' }}
                       />
                       <ReferenceLine y={90} stroke="#334155" strokeDasharray="5 5" />
                       <Area 
                         type="monotone" 
                         dataKey="value" 
                         stroke="#0ea5e9" 
                         strokeWidth={3} 
                         fillOpacity={1} 
                         fill="url(#rateColor)" 
                         animationDuration={1500}
                         dot={{ fill: '#38bdf8', r: 3, strokeWidth: 0 }}
                         activeDot={{ r: 5, fill: '#fff', stroke: '#38bdf8', strokeWidth: 2 }}
                       />
                     </AreaChart>
                   </ResponsiveContainer>
                </div>
                <div className="flex justify-between items-center mt-2 px-1">
                   <span className="text-[8px] text-slate-500 font-bold uppercase">历史平均: 90.2%</span>
                   <span className="text-[8px] text-emerald-400 font-bold uppercase flex items-center gap-1"><ArrowUp size={8}/> 稳定性提升</span>
                </div>
             </div>
          </ChartCard>

          <ChartCard title="周期接收效能对比" className="flex-1">
             <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                   <div className="flex gap-4">
                      <div className="flex items-center gap-1.5">
                         <div className="w-2 h-2 rounded-sm bg-slate-700"></div>
                         <span className="text-[8px] text-slate-500 font-bold uppercase">上月</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                         <div className="w-2 h-2 rounded-sm bg-sky-500"></div>
                         <span className="text-[8px] text-slate-500 font-bold uppercase">本月</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-sm bg-emerald-400"></div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase">接收率</span>
                   </div>
                </div>

                <div className="flex-1 min-h-0">
                   <ResponsiveContainer width="100%" height="100%">
                     <ComposedChart data={analysisData} margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
                       <defs>
                          <linearGradient id="barThisMonth" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="#38bdf8" />
                             <stop offset="100%" stopColor="#0284c7" />
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} />
                       <YAxis yAxisId="left" hide />
                       <YAxis yAxisId="right" hide domain={[0, 100]} />
                       <Tooltip 
                         cursor={{ fill: 'rgba(56,189,248,0.03)' }}
                         contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                       />
                       <Bar yAxisId="left" dataKey="lastMonth" fill="#1e293b" radius={[2, 2, 0, 0]} barSize={10} />
                       <Bar yAxisId="left" dataKey="thisMonth" fill="url(#barThisMonth)" radius={[2, 2, 0, 0]} barSize={10} />
                       <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="rate" 
                          stroke="#a3e635" 
                          strokeWidth={2} 
                          dot={{ r: 2, fill: '#a3e635' }}
                          strokeDasharray="4 2"
                       />
                     </ComposedChart>
                   </ResponsiveContainer>
                </div>
                
                <div className="mt-4 pt-4 border-t border-sky-900/10 grid grid-cols-2 gap-4 shrink-0">
                   <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">接收成功率</span>
                      <div className="flex items-baseline gap-1">
                         <span className="text-xl font-orbitron font-bold text-emerald-400">95.2</span>
                         <span className="text-[9px] text-slate-600 font-bold">%</span>
                      </div>
                   </div>
                   <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest text-right">环比上月增长</span>
                      <div className="flex items-baseline gap-1 text-sky-400">
                         <TrendingUp size={10} className="text-emerald-500" />
                         <span className="text-xl font-orbitron font-bold">+12.8</span>
                         <span className="text-[9px] font-bold text-slate-600">%</span>
                      </div>
                   </div>
                </div>
             </div>
          </ChartCard>
        </div>

        {/* 中间地球视图 */}
        <div className={`relative flex flex-col overflow-hidden transition-all duration-500 ${isMaximized ? 'fixed inset-0 z-[999] w-screen h-screen top-0 left-0 m-0 bg-[#020617]' : 'col-span-8'}`}>
          
          {/* Maximize Toggle */}
          <button 
            onClick={() => setIsMaximized(!isMaximized)}
            className="absolute top-4 left-4 z-[1000] p-2 bg-slate-800/50 hover:bg-sky-500/20 border border-sky-500/20 rounded-xl text-sky-400 transition-all"
            title={isMaximized ? "退出全屏" : "全屏查看"}
          >
            {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          <div className="flex-1 relative flex items-center justify-center">
             <div className="absolute top-4 left-4 z-40 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-sky-500/20">
                <p className="text-[10px] text-sky-500 font-bold tracking-widest uppercase mb-1 flex items-center gap-2">
                   <Filter size={12} /> 当前显示业务日期
                </p>
                <h4 className="text-lg font-orbitron font-bold text-white tracking-tighter">
                  {currentYear}-{(currentMonth + 1).toString().padStart(2, '0')}-{selectedDate.toString().padStart(2, '0')}
                </h4>
             </div>

             <Globe3D 
                selectedDate={selectedDate}
                onStationClick={setSelectedStationDetail}
                onSatelliteClick={setSelectedSatelliteDetail}
             />
          </div>
        </div>

        {/* 右侧面板 */}
        <div className="col-span-2 flex flex-col gap-4 overflow-hidden">
          <ChartCard title="接收统计" className="h-[340px]">
             <div className="h-full flex flex-col">
                <div className="relative flex-1 flex items-center justify-center">
                   <div className="absolute w-[200px] h-[200px] border border-sky-500/10 rounded-full animate-[spin_30s_linear_infinite]"></div>
                   <div className="absolute w-[160px] h-[160px] border border-dashed border-sky-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>

                   <div className="w-[120px] h-[120px] relative z-20">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie 
                               data={statsGaugeData} 
                               cx="50%" cy="50%" 
                               innerRadius={42} outerRadius={54} 
                               paddingAngle={6} 
                               dataKey="value" 
                               stroke="none"
                            >
                               {statsGaugeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                         </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-[7px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-0.5">Success Rate</span>
                         <span className="text-xl font-orbitron font-bold text-white leading-none">87.5%</span>
                      </div>
                   </div>

                   {/* 各卫星数据标签 */}
                   <div className="absolute left-4 top-2">
                      <div className="flex items-center gap-2 mb-0.5">
                         <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                         <span className="text-[8px] text-slate-400 font-bold">FY3E</span>
                      </div>
                      <p className="text-xs font-orbitron font-bold text-white ml-3.5">9.4%</p>
                   </div>
                   <div className="absolute right-4 top-2 text-right">
                      <div className="flex items-center gap-2 justify-end mb-0.5">
                         <span className="text-[8px] text-slate-400 font-bold">AQUA</span>
                         <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                      </div>
                      <p className="text-xs font-orbitron font-bold text-white mr-3.5">37.2%</p>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-sky-900/10">
                   <MiniStatCard label="总计划" value="38" icon={<Target size={12}/>} color="sky" />
                   <MiniStatCard label="总接收" value="33" icon={<BarChart3 size={12}/>} color="emerald" />
                   <MiniStatCard label="成功率" value="87" unit="%" icon={<Percent size={12}/>} color="amber" />
                </div>
             </div>
          </ChartCard>

          <ChartCard title="当日详细接收计划" className="flex-1 overflow-hidden">
             <div className="space-y-2 h-full overflow-y-auto custom-scrollbar pr-1">
                {receptionPlans.map(plan => (
                   <div key={plan.id} className="flex items-center gap-3 p-2 bg-slate-900/40 border border-sky-900/10 rounded group hover:border-sky-500/30 transition-all cursor-pointer" onClick={() => setSelectedSatelliteDetail(plan.sat)}>
                      <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                         <Satellite size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-slate-200">{plan.sat}</span>
                            <div className="flex items-center gap-2">
                               {plan.hasVideo && (
                                  <button onClick={(e) => { e.stopPropagation(); setPlayingVideo({ sat: plan.sat, time: plan.startTime }); }} className="p-1 bg-sky-500/20 hover:bg-sky-500/40 border border-sky-400/30 rounded text-sky-400">
                                     <Video size={10} />
                                  </button>
                               )}
                               <span className="text-[8px] text-emerald-400 font-bold flex items-center gap-1">
                                  <CheckCircle2 size={10} /> {plan.status}
                               </span>
                            </div>
                         </div>
                         <div className="text-[8px] text-slate-500 truncate flex items-center gap-1">
                            <Clock size={8} /> {plan.startTime.split(' ')[1]} 至 {plan.endTime}
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </ChartCard>
        </div>
      </div>
      <style>{`
        @keyframes rotate-polar { from { transform: rotateY(0deg) rotateX(15deg); } to { transform: rotateY(360deg) rotateX(15deg); } }
        @keyframes rotate-equatorial { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slide-down-overlay { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

const MiniStatCard = ({ label, value, unit, icon, color }: any) => {
   const colorClasses: Record<string, string> = {
      sky: 'text-sky-400 bg-sky-500/5 border-sky-500/10',
      emerald: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10',
      amber: 'text-amber-400 bg-amber-500/5 border-amber-500/10',
   };
   return (
      <div className={`flex flex-col items-center p-3 rounded-2xl border ${colorClasses[color]} hover:bg-white/5 transition-all group`}>
         <div className="mb-2 opacity-60 group-hover:scale-110 transition-transform">{icon}</div>
         <span className="text-[7px] font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</span>
         <div className="flex items-baseline gap-0.5">
            <span className="text-base font-orbitron font-bold text-white">{value}</span>
            {unit && <span className="text-[8px] font-bold text-slate-600">{unit}</span>}
         </div>
      </div>
   );
}

const StationDetailOverlay: React.FC<{ stationName: string, onClose: () => void }> = ({ stationName, onClose }) => (
  <div 
    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
    onClick={onClose}
  >
    <div 
      className="w-full max-w-6xl glass-panel rounded-[40px] p-8 lg:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.9)] animate-in slide-in-from-top-12 duration-500"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-center gap-6">
           <div className="p-5 bg-sky-500/10 rounded-2xl border border-sky-400/30 text-sky-400 glow-blue">
              <Radio size={40} />
           </div>
           <div>
              <h2 className="text-3xl font-orbitron font-bold text-white tracking-tight">{stationName} 远程接收监控终端</h2>
              <div className="flex items-center gap-6 mt-2">
                 <p className="text-sm text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} /> 信号链路: 标称 (NOMINAL)
                 </p>
                 <span className="text-slate-800">|</span>
                 <p className="text-sm text-sky-500 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Signal size={14} /> SNR: 14.5 dB
                 </p>
              </div>
           </div>
        </div>
        <button onClick={onClose} className="p-4 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-all border border-sky-900/30 shadow-xl">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-10">
         <MetricPanel label="天线俯仰角" value="32.4" unit="deg" icon={<ArrowUpRight size={20}/>} />
         <MetricPanel label="伺服系统功耗" value="2.8" unit="kW" icon={<Zap size={20}/>} />
         <MetricPanel label="解调器同步率" value="99.9" unit="%" icon={<ShieldCheck size={20}/>} />
         <MetricPanel label="实时下行带宽" value="1.2" unit="Gbps" icon={<Activity size={20}/>} />
      </div>

      <div className="bg-[#0f172a]/60 rounded-3xl p-6 border border-sky-900/20">
         <h4 className="text-[11px] text-slate-500 font-bold uppercase mb-4 tracking-[0.2em]">当前接收会话 (Active Sessions)</h4>
         <div className="grid grid-cols-2 gap-6">
            <div className="flex justify-between items-center p-5 bg-[#1e293b]/40 rounded-2xl border border-sky-900/20 hover:border-sky-500/30 transition-all">
               <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-base font-bold text-white uppercase">FY-3D (TRACKING)</span>
               </div>
               <span className="text-sm font-mono text-sky-400 tracking-wider">AZ: 185.2° / EL: 42.1°</span>
            </div>
            <div className="flex justify-between items-center p-5 bg-[#1e293b]/40 rounded-2xl border border-sky-900/20 opacity-50">
               <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                  <span className="text-base font-bold text-slate-400 uppercase">AQUA (WAITING)</span>
               </div>
               <span className="text-sm font-mono text-slate-500 tracking-wider">T-MINUS: 12:42</span>
            </div>
         </div>
      </div>
    </div>
  </div>
);

const SatelliteDetailOverlay: React.FC<{ satName: string, onClose: () => void }> = ({ satName, onClose }) => {
  const satData = useMemo(() => {
    const data: Record<string, any> = {
      'FY-3D': {
        type: '极轨气象卫星',
        status: '健康度: 99.2%',
        specs: [
          { label: '载荷数量', value: '10', unit: '个', icon: <Box size={14}/> },
          { label: '太阳能帆板', value: '3.2', unit: 'kW', icon: <Zap size={14}/> },
          { label: '下行频率', value: '7.8', unit: 'GHz', icon: <Activity size={14}/> },
          { label: '主载荷温度', value: '15.2', unit: '℃', icon: <Thermometer size={14}/> },
        ],
        payloads: [
          { name: '红外分光计 (IRAS)', status: '采集完成', health: 100 },
          { name: '微波温度计 (MWTS)', status: '实时下传', health: 98 },
          { name: '中分辨率光谱成像仪', status: '常规监测', health: 99 },
          { name: '电离层分析仪', status: '背景采集', health: 100 },
        ],
        hardware: [
          { label: '主控 CPU', val: '9%', icon: <Cpu size={12}/> },
          { label: '存储余量', val: '840GB', icon: <HardDrive size={12}/> },
          { label: '电池电量', val: '92%', icon: <Battery size={12}/> },
        ]
      },
      'AQUA': {
        type: '地球科学观测卫星',
        status: '健康度: 98.5%',
        specs: [
          { label: 'AMSR-E 载荷', value: 'Active', unit: '', icon: <Activity size={14}/> },
          { label: 'MODIS 通道', value: '36', unit: 'Ch', icon: <Layers size={14}/> },
          { label: '轨道高度', value: '705', unit: 'km', icon: <ArrowUpRight size={14}/> },
          { label: '运行天数', value: '8204', unit: 'd', icon: <Clock size={14}/> },
        ],
        payloads: [
          { name: 'MODIS 扫描仪', status: '常规扫描', health: 97 },
          { name: 'AIRS 探测器', status: '数据压缩中', health: 100 },
          { name: 'CERES 测量仪', status: '实时广播', health: 99 },
        ],
        hardware: [
          { label: '数据总线', val: 'Nominal', icon: <Network size={12}/> },
          { label: '姿态管控', val: 'Lock', icon: <Settings size={12}/> },
          { label: '电池电压', val: '28.4V', icon: <Zap size={12}/> },
        ]
      },
      'default': {
        type: '多功能观测星座',
        status: '健康度: 95.5%',
        specs: [
          { label: '活跃时长', value: '1240', unit: '天', icon: <Clock size={14}/> },
          { label: '轨道高度', value: '830', unit: 'km', icon: <ArrowUpRight size={14}/> },
          { label: '链路强度', value: '14.2', unit: 'dB', icon: <Signal size={14}/> },
          { label: '存储余量', value: '256', unit: 'GB', icon: <Layers size={14}/> },
        ],
        payloads: [
          { name: '多光谱成像载荷', status: '实时作业', health: 96 },
          { name: '雷达高度计', status: '待命状态', health: 100 },
          { name: '姿态管控芯片', status: '运算中', health: 99 },
        ]
      }
    };
    return data[satName] || data['default'];
  }, [satName]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md" onClick={onClose}>
      <div 
        className="w-full max-w-5xl glass-panel rounded-[40px] p-8 lg:p-10 shadow-[0_40px_100px_rgba(0,0,0,1)] animate-in zoom-in duration-300 flex flex-col max-h-[90vh] overflow-hidden border-t border-sky-400/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8 shrink-0">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-sky-500/10 border border-sky-400/20 rounded-2xl flex items-center justify-center text-sky-400 glow-blue">
                 <Satellite size={32} />
              </div>
              <div>
                 <h2 className="text-3xl font-orbitron font-bold text-white tracking-tight">{satName} 机载实时运维视图</h2>
                 <p className="text-xs text-sky-500 font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                    <Globe size={14} /> 核心载荷架构: {satData.type}
                 </p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 {satData.status}
              </div>
              <button onClick={onClose} className="p-3 bg-slate-900/60 hover:bg-slate-800 text-slate-400 rounded-full transition-colors border border-sky-900/30">
                 <X size={20} />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8 shrink-0">
           {satData.specs.map((spec: any, i: number) => (
              <div key={i} className="bg-slate-900/40 border border-sky-900/20 p-5 rounded-3xl group hover:border-sky-500/30 transition-all shadow-inner">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{spec.label}</span>
                    <div className="text-sky-500 opacity-50 group-hover:opacity-100 transition-opacity">{spec.icon}</div>
                 </div>
                 <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-orbitron font-bold text-white">{spec.value}</span>
                    <span className="text-[10px] text-sky-400 uppercase">{spec.unit}</span>
                 </div>
              </div>
           ))}
        </div>

        <div className="flex-1 min-h-0 flex gap-6 overflow-hidden">
           <div className="flex-1 bg-[#04080f]/80 rounded-3xl p-6 border border-sky-900/30 flex flex-col min-h-0 shadow-inner">
              <h4 className="text-[11px] text-slate-500 font-bold uppercase mb-4 tracking-[0.2em] flex items-center gap-2 shrink-0">
                 <Activity size={14} className="text-sky-500" /> 载荷传感器运行状态 (Payload Telemetry)
              </h4>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                 {satData.payloads.map((pl: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-[#0f172a]/60 rounded-2xl border border-sky-900/10 hover:bg-sky-500/5 transition-all">
                       <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-200">{pl.name}</span>
                          <span className="text-[10px] text-sky-600 font-bold uppercase tracking-tighter">{pl.status}</span>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className={`text-xs font-orbitron font-bold ${pl.health >= 98 ? 'text-emerald-400' : 'text-amber-400'}`}>{pl.health}%</span>
                          <div className="w-24 h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                             <div className={`h-full ${pl.health >= 98 ? 'bg-emerald-500' : 'bg-amber-500'} transition-all duration-1000`} style={{ width: `${pl.health}%` }}></div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="w-80 flex flex-col gap-6">
              <div className="bg-[#0f172a]/60 border border-sky-900/30 rounded-3xl p-6 flex flex-col shadow-inner">
                 <span className="text-[11px] text-slate-500 font-bold uppercase mb-5 tracking-[0.2em] flex items-center gap-2">
                    <Cpu size={14} className="text-indigo-400" /> 关键机载硬件 (HW Components)
                 </span>
                 <div className="space-y-4">
                    {satData.hardware && satData.hardware.map((hw: any, idx: number) => (
                       <div key={idx} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">{hw.icon}</div>
                             <span className="text-[10px] text-slate-400 font-bold uppercase">{hw.label}</span>
                          </div>
                          <span className="text-xs font-orbitron font-bold text-white">{hw.val}</span>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="flex-1 bg-[#02040a] rounded-3xl border border-sky-900/30 p-6 flex flex-col overflow-hidden relative shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                 <span className="text-[11px] text-slate-500 font-bold uppercase mb-4 tracking-[0.2em] relative z-10 flex items-center justify-between">
                    <span>下行信道码流</span>
                    <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></div>
                 </span>
                 <div className="flex-1 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={Array.from({length: 20}, (_, i) => ({ v: 40 + Math.sin(i * 0.8) * 20 + Math.random() * 10 }))}>
                          <Area type="monotone" dataKey="v" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.1} strokeWidth={1} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const MetricPanel = ({ label, value, unit, icon }: any) => (
  <div className="bg-[#0f172a]/40 border border-sky-900/20 p-6 rounded-3xl group hover:border-sky-500/40 transition-all">
     <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</span>
        <div className="text-sky-500 opacity-50 group-hover:opacity-100 transition-opacity">{icon}</div>
     </div>
     <div className="flex items-baseline gap-1">
        <span className="text-3xl font-orbitron font-bold text-white">{value}</span>
        <span className="text-xs text-sky-400">{unit}</span>
     </div>
  </div>
);

export default SatelliteView;
