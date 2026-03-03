
import React, { useMemo, useState } from 'react';
import ChartCard from './ChartCard';
import { 
  Factory, 
  Cpu, 
  Activity, 
  Zap, 
  Box,
  RefreshCcw,
  Satellite,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Server,
  MapPin,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Cell
} from 'recharts';

type NodeType = 'preprocess' | 'geo_engine' | 'leo_engine' | 'geo_products' | 'leo_products';

const ProductionView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NodeType>('preprocess');
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedStationName, setSelectedStationName] = useState<string | null>(null);

  // 不同节点对应的模拟统计数据
  const nodeStats = useMemo(() => ({
    preprocess: {
      title: '数据预处理中心',
      sub: 'Data Pre-processing Hub',
      queue: [
        { name: '待解析', value: 85, color: '#38bdf8' },
        { name: '待校验', value: 45, color: '#818cf8' },
        { name: '待分发', value: 25, color: '#c084fc' },
      ],
      metrics: { throughput: '2.4', time: '5.2', quality: '99.9', resource: '1.2' },
      details: [
        { 
          name: '北京怀柔站', 
          address: '北京市怀柔区',
          antenna: '-',
          type: '静止卫星',
          satellites: [
            { name: 'GK2A', payloads: ['AMI'], software: '直接拿到1级数据' }
          ],
          data: 450, status: 'normal', throughput: 1.2, load: 45, quality: 99.9 
        },
        { 
          name: '额尔古纳站', 
          address: '内蒙古自治区额尔古纳市',
          antenna: '7.5米',
          type: '极轨卫星',
          satellites: [
            { name: 'AQUA', payloads: ['AIRS', 'AMSU-A', 'HSB', 'AMSR-E', 'MODIS', 'CERES'], software: 'RT-STPS / IPOPP' },
            { name: 'NPP', payloads: ['VIIRS', 'CrIS', 'ATMS', 'OMPS', 'CERES'], software: 'RT-STPS / IPOPP' },
            { name: 'NOAA20', payloads: ['VIIRS', 'CrIS', 'ATMS', 'OMPS', 'CERES'], software: 'RT-STPS / IPOPP' },
            { name: 'FY3D', payloads: ['MERSI-II', 'HIRAS-I', 'MWTS-II', 'MWHS-II', 'MWRI-I', 'GNOS-I', 'GAS-I', 'WAI-I', 'IPM-I', 'SEM'], software: 'RT-STPS / 风云软件包' },
            { name: 'FY3E', payloads: ['MERSI-LL', 'HIRAS-II', 'MWTS-III', 'MWHS-II', 'GNOS-II', 'WindRAD', 'SSIM', 'SIM-II', 'X-EUVI', 'Tri-IPM', 'SEM'], software: 'RT-STPS / 风云软件包' }
          ],
          data: 380, status: 'normal', throughput: 0.9, load: 38, quality: 99.8 
        },
        { 
          name: '上海站', 
          address: '上海市华东师范大学普陀校区',
          antenna: '2.4米',
          type: '极轨卫星',
          satellites: [
            { name: 'AQUA', payloads: ['AIRS', 'AMSU-A', 'HSB', 'AMSR-E', 'MODIS', 'CERES'], software: 'RT-STPS / IPOPP' },
            { name: 'NPP', payloads: ['VIIRS', 'CrIS', 'ATMS', 'OMPS', 'CERES'], software: 'RT-STPS / IPOPP' },
            { name: 'NOAA20', payloads: ['VIIRS', 'CrIS', 'ATMS', 'OMPS', 'CERES'], software: 'RT-STPS / IPOPP' },
            { name: 'NOAA21', payloads: ['VIIRS', 'CrIS', 'ATMS', 'OMPS'], software: 'RT-STPS / IPOPP' }
          ],
          data: 290, status: 'warning', throughput: 0.7, load: 62, quality: 98.5 
        },
        { 
          name: '青海站', 
          address: '青海省德令哈市可鲁克湖景区内',
          antenna: '3米',
          type: '极轨卫星',
          satellites: [
            { name: 'AQUA', payloads: ['AIRS', 'AMSU-A', 'HSB', 'AMSR-E', 'MODIS', 'CERES'], software: 'RT-STPS / IPOPP' },
            { name: 'NPP', payloads: ['VIIRS', 'CrIS', 'ATMS', 'OMPS', 'CERES'], software: 'RT-STPS / IPOPP' },
            { name: 'FY3D', payloads: ['MERSI-II', 'HIRAS-I', 'MWTS-II', 'MWHS-II', 'MWRI-I', 'GNOS-I', 'GAS-I', 'WAI-I', 'IPM-I', 'SEM'], software: 'RT-STPS / 风云软件包' },
            { name: 'FY3E', payloads: ['MERSI-LL', 'HIRAS-II', 'MWTS-III', 'MWHS-II', 'GNOS-II', 'WindRAD', 'SSIM', 'SIM-II', 'X-EUVI', 'Tri-IPM', 'SEM'], software: 'RT-STPS / 风云软件包' }
          ],
          data: 520, status: 'normal', throughput: 1.4, load: 55, quality: 99.9 
        },
        { 
          name: '湖北站', 
          address: '湖北省武汉市中国地质大学未来城校区',
          antenna: '3米',
          type: '极轨卫星',
          satellites: [
            { name: 'AQUA', payloads: ['AIRS', 'AMSU-A', 'HSB', 'AMSR-E', 'MODIS', 'CERES'], software: 'RT-STPS / IPOPP' },
            { name: 'NPP', payloads: ['VIIRS', 'CrIS', 'ATMS', 'OMPS', 'CERES'], software: 'RT-STPS / IPOPP' },
            { name: 'NOAA20', payloads: ['VIIRS', 'CrIS', 'ATMS', 'OMPS', 'CERES'], software: 'RT-STPS / IPOPP' }
          ],
          data: 210, status: 'normal', throughput: 0.5, load: 28, quality: 99.7 
        },
      ]
    },
    geo_engine: {
      title: '静止卫星生产引擎',
      sub: 'GEO Engine Farm',
      queue: [
        { name: '网格化', value: 120, color: '#0ea5e9' },
        { name: '辐射校正', value: 90, color: '#38bdf8' },
        { name: '产品合成', value: 60, color: '#0ea5e9' },
      ],
      metrics: { throughput: '1.8', time: '12.5', quality: '99.8', resource: '4.5' },
      details: [
        { name: 'GPU集群-01', load: 85, task: 'L1级反演', status: 'normal' },
        { name: 'GPU集群-02', load: 92, task: '云顶高度计算', status: 'warning' },
        { name: 'GPU集群-03', load: 45, task: '空闲/就绪', status: 'normal' },
      ]
    },
    leo_engine: {
      title: '极轨卫星生产引擎',
      sub: 'LEO Engine Farm',
      queue: [
        { name: '轨道反演', value: 45, color: '#f59e0b' },
        { name: '几何定位', value: 75, color: '#fbbf24' },
        { name: '分幅处理', value: 30, color: '#f59e0b' },
      ],
      metrics: { throughput: '0.9', time: '18.4', quality: '99.7', resource: '3.8' },
      details: [
        { name: '计算节点-A', load: 78, task: '极轨道校正', status: 'normal' },
        { name: '计算节点-B', load: 82, task: '红外波段提取', status: 'normal' },
      ]
    },
    geo_products: {
      title: '静止数据产品库',
      sub: 'GEO Storage Archive',
      queue: [
        { name: 'L1级', value: 200, color: '#38bdf8' },
        { name: 'L2级', value: 450, color: '#818cf8' },
        { name: 'L3级', value: 150, color: '#c084fc' },
      ],
      metrics: { throughput: '12.5', time: '0.5', quality: '100', resource: '0.8' },
      details: [
        { name: '存储池-Alpha', used: '450TB', free: '120TB', status: 'normal' },
        { name: '存储池-Beta', used: '890TB', free: '10TB', status: 'warning' },
      ]
    },
    leo_products: {
      title: '极轨数据产品库',
      sub: 'LEO Storage Archive',
      queue: [
        { name: 'L1级', value: 120, color: '#f59e0b' },
        { name: 'L2级', value: 280, color: '#fbbf24' },
        { name: 'L3级', value: 80, color: '#d97706' },
      ],
      metrics: { throughput: '8.2', time: '0.8', quality: '100', resource: '0.6' },
      details: [
        { name: '分布式存储-01', used: '210TB', free: '400TB', status: 'normal' },
        { name: '分布式存储-02', used: '180TB', free: '320TB', status: 'normal' },
      ]
    }
  }), []);

  const historyTrend = useMemo(() => [
    { time: '08:00', geo: 120, leo: 130 },
    { time: '10:00', geo: 150, leo: 160 },
    { time: '12:00', geo: 240, leo: 250 },
    { time: '14:00', geo: 180, leo: 190 },
    { time: '16:00', geo: 210, leo: 220 },
    { time: '18:00', geo: 190, leo: 200 },
  ], []);

  const currentData = nodeStats[selectedNode];
  const activeStation = useMemo(() => {
    if (selectedNode === 'preprocess' && selectedStationName) {
      return (nodeStats.preprocess.details as any[]).find(s => s.name === selectedStationName);
    }
    return null;
  }, [selectedNode, selectedStationName, nodeStats]);

  return (
    <div className="flex flex-col h-full gap-6 duration-1000">
      
      {/* 三列布局网格 */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* 左侧列：全网概览与效能趋势 */}
        <div className="col-span-2 flex flex-col gap-4">
          <ChartCard title={activeStation ? `${activeStation.name} 效能监控` : "全网生产效能监控"}>
             <div className="space-y-6 py-2">
                <div className="flex justify-between items-end">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">{activeStation ? "当前站吞吐量" : "实时吞吐总量"}</span>
                      <div className="flex items-baseline gap-1">
                         <span className="text-3xl font-orbitron font-bold text-sky-400">{activeStation ? activeStation.throughput : "3.8"}</span>
                         <span className="text-[10px] text-slate-500">TB/h</span>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                         <TrendingUp size={10} /> {activeStation ? "+5.2%" : "+12.4%"}
                      </span>
                      <span className="text-[8px] text-slate-600 uppercase font-bold">VS 上周期</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 bg-slate-900/60 rounded-xl border border-sky-900/10">
                      <span className="text-[8px] text-slate-500 font-bold uppercase block mb-1">{activeStation ? "数据质量" : "GEO 运行率"}</span>
                      <span className="text-lg font-orbitron font-bold text-sky-300">{activeStation ? `${activeStation.quality}%` : "99.2%"}</span>
                   </div>
                   <div className="p-3 bg-slate-900/60 rounded-xl border border-sky-900/10">
                      <span className="text-[8px] text-slate-500 font-bold uppercase block mb-1">{activeStation ? "站内负载" : "LEO 运行率"}</span>
                      <span className="text-lg font-orbitron font-bold text-amber-300">{activeStation ? `${activeStation.load}%` : "97.8%"}</span>
                   </div>
                </div>

                <div className="h-[180px] w-full mt-4">
                  <p className="text-[9px] text-slate-500 font-bold mb-4 uppercase flex items-center gap-2">
                     <Activity size={12} className="text-sky-500" /> {activeStation ? `${activeStation.name} 产出趋势` : "近24小时全链路产出趋势"}
                  </p>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historyTrend}>
                       <defs>
                          <linearGradient id="globalGeo" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                             <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                       <XAxis dataKey="time" hide />
                       <YAxis hide />
                       <Area type="monotone" dataKey="geo" stroke="#38bdf8" fillOpacity={1} fill="url(#globalGeo)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </ChartCard>

          <ChartCard title={activeStation ? `${activeStation.name} 详细配置` : "系统负载分布 (Nodes)"} className="flex-1">
             <div className="h-full flex flex-col justify-center gap-4">
                {activeStation ? (
                   <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-500">
                      <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
                         <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">接收卫星与载荷配置</span>
                         <span className="text-[10px] text-sky-500 font-mono font-bold">{activeStation.antenna} 天线</span>
                      </div>
                      <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
                         {activeStation.satellites.map((sat: any, sIdx: number) => (
                            <div key={sIdx} className="bg-slate-950/40 p-3 rounded-xl border border-sky-500/10 hover:border-sky-500/30 transition-all">
                               <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs font-bold text-sky-300">{sat.name}</span>
                                  <span className="text-[8px] text-slate-500 font-bold px-1.5 py-0.5 bg-slate-800 rounded uppercase tracking-tighter">{sat.software}</span>
                               </div>
                               <div className="flex flex-wrap gap-1.5">
                                  {sat.payloads.map((p: string, pIdx: number) => (
                                     <span key={pIdx} className="text-[8px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 font-mono">
                                        {p}
                                     </span>
                                  ))}
                               </div>
                            </div>
                         ))}
                      </div>
                      <div className="pt-2 border-t border-sky-500/10">
                         <div className="flex items-center gap-2 text-[9px] text-slate-500 italic">
                            <MapPin size={10} className="text-sky-500" />
                            地址: {activeStation.address}
                         </div>
                      </div>
                   </div>
                ) : (
                   <>
                      <MetricBar label="CPU 集群负载" value={68} color="bg-sky-400" />
                      <MetricBar label="GPU 计算压力" value={82} color="bg-indigo-400" />
                      <MetricBar label="存储 I/O 占用" value={45} color="bg-emerald-400" />
                      <MetricBar label="网络带宽负载" value={32} color="bg-amber-400" />
                   </>
                )}
             </div>
          </ChartCard>
        </div>

        {/* 中间列：工作流 3D 可视化 */}
        <div className={`relative flex flex-col overflow-hidden transition-all duration-500 ${isMaximized ? 'fixed inset-0 z-[999] w-screen h-screen top-0 left-0 m-0 bg-[#020617]' : 'col-span-8 perspective-1200 bg-slate-900/10 rounded-3xl border border-sky-900/10'}`}>
           
           {/* Maximize Toggle */}
           <button 
             onClick={() => setIsMaximized(!isMaximized)}
             className="absolute top-6 right-8 z-[1000] p-2 bg-slate-800/50 hover:bg-sky-500/20 border border-sky-500/20 rounded-xl text-sky-400 transition-all"
             title={isMaximized ? "退出全屏" : "全屏查看"}
           >
             {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
           </button>

           {/* 背景网格与光晕 */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.05)_0%,transparent_70%)]"></div>

            <div className="absolute top-6 left-8">
              <h2 className="text-xl font-orbitron font-bold text-white tracking-widest uppercase flex items-center gap-3">
                 <Factory className="text-sky-400" />
                 {activeStation ? `${activeStation.name} 动态监测` : "生产链路动态监测"}
              </h2>
              <p className="text-[10px] text-sky-600 font-bold uppercase mt-1">
                {activeStation ? `Live Data Flow: ${activeStation.satellites.map((s: any) => s.name).join(' & ')}` : "Live Workflow Visualization Engine"}
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <svg viewBox="0 0 1000 600" className="w-full h-full drop-shadow-[0_0_30px_rgba(56,189,248,0.1)]">
                <defs>
                  <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* 动态计算节点位置 */}
                {(() => {
                  const centerY = 225;

                  // 默认视图 (未选中站点)
                  if (!activeStation) {
                    const stageX = [100, 300, 500, 700, 900];
                    const stageColors = ['#38bdf8', '#0ea5e9', '#818cf8', '#c084fc', '#e879f9'];
                    const stageData = [
                      {
                        title: '1. 卫星接收站',
                        steps: ['卫星过境', '信号捕获', '天线跟踪'],
                        icon: <Satellite size={14}/>,
                        nodeType: 'preprocess' as NodeType
                      },
                      {
                        title: '2. 数据录入',
                        steps: ['数据接收', '解调与解码', '数据分离与解压缩', '元数据提取与存储'],
                        icon: <RefreshCcw size={14}/>,
                        nodeType: 'preprocess' as NodeType
                      },
                      {
                        title: '3. 预处理',
                        steps: ['辐射校正', '几何校正', '其他处理'],
                        icon: <Cpu size={14}/>,
                        nodeType: 'geo_engine' as NodeType
                      },
                      {
                        title: '4. 产品生产',
                        steps: ['数据反演', '图像处理与合成', '投影与格式化', '质检与标注'],
                        icon: <Box size={14}/>,
                        nodeType: 'geo_products' as NodeType
                      },
                      {
                        title: '5. 运算与存储',
                        steps: ['分布式计算', '并行处理', '数据归档', '异地备份'],
                        icon: <Server size={14}/>,
                        nodeType: 'geo_products' as NodeType
                      }
                    ];

                    return (
                      <g className="animate-in fade-in duration-700">
                        {stageData.map((stage, sIdx) => {
                          const x = stageX[sIdx];
                          const steps = stage.steps;
                          const stepSpacing = 90; // Increased spacing
                          const startY = 100; // Top aligned

                          return (
                            <g key={sIdx}>
                              {/* 阶段标题背景装饰 */}
                              <rect 
                                x={x - 90} y={startY - 60} width={180} height={steps.length * stepSpacing + 20} 
                                rx="20" fill={stageColors[sIdx]} fillOpacity="0.02" stroke={stageColors[sIdx]} strokeOpacity="0.1" strokeDasharray="4 4"
                              />
                              <text x={x} y={startY - 40} textAnchor="middle" fill={stageColors[sIdx]} fontSize="12" fontWeight="bold" className="uppercase tracking-widest">
                                {stage.title}
                              </text>

                              {steps.map((step, iIdx) => {
                                const y = startY + iIdx * stepSpacing;
                                const isLastInStage = iIdx === steps.length - 1;
                                const hasNextStage = sIdx < stageData.length - 1;
                                const hasNextStep = iIdx < steps.length - 1;

                                return (
                                  <g key={iIdx}>
                                    {/* 阶段内连线 */}
                                    {hasNextStep && (
                                      <>
                                        <path d={`M${x} ${y + 20} L${x} ${y + stepSpacing - 20}`} stroke={stageColors[sIdx]} strokeWidth="2" strokeOpacity="0.2" fill="none" />
                                        <WorkflowParticle d={`M${x} ${y + 20} L${x} ${y + stepSpacing - 20}`} color={stageColors[sIdx]} dur="1.5s" size={1} />
                                      </>
                                    )}
                                    
                                    {/* 跨阶段连线 (从当前阶段的最后一个节点到下一阶段的第一个节点) */}
                                    {isLastInStage && hasNextStage && (
                                      <>
                                        <path 
                                          d={`M${x + 30} ${y} C${x + 100} ${y}, ${stageX[sIdx+1] - 100} ${startY}, ${stageX[sIdx+1] - 30} ${startY}`} 
                                          stroke={stageColors[sIdx]} strokeWidth="3" strokeOpacity="0.2" fill="none" 
                                        />
                                        <WorkflowParticle 
                                          d={`M${x + 30} ${y} C${x + 100} ${y}, ${stageX[sIdx+1] - 100} ${startY}, ${stageX[sIdx+1] - 30} ${startY}`} 
                                          color={stageColors[sIdx]} dur="2.5s" size={1.5} 
                                        />
                                      </>
                                    )}

                                    <WorkflowNode 
                                      x={x} y={y} label={step} 
                                      icon={stage.icon} color={stageColors[sIdx]} size={28}
                                      isSelected={selectedNode === stage.nodeType}
                                      onClick={() => setSelectedNode(stage.nodeType)}
                                    />
                                  </g>
                                );
                              })}
                            </g>
                          );
                        })}
                      </g>
                    );
                  }

                  // 站点选中视图 (展开卫星和载荷)
                  const stationX = 80;
                  const satelliteX = 240;
                  const payloadX = 420;
                  const engineX = 640;
                  const serverX = 800;
                  const archiveX = 920;

                  const sats = activeStation.satellites;
                  const satCount = sats.length;
                  const isGeo = activeStation.type === '静止卫星';
                  const engineY = isGeo ? 115 : 335;
                  const themeColor = isGeo ? "#38bdf8" : "#f59e0b";
                  
                  // 动态计算卫星间距
                  const satSpacing = Math.min(90, 360 / Math.max(1, satCount));

                  // 1. 提取所有唯一载荷
                  const allPayloads = Array.from(new Set(sats.flatMap((s: any) => s.payloads as string[])));
                  const pCount = allPayloads.length;
                  // 载荷间距：确保名字不重叠，最小 22px
                  const pSpacing = Math.max(22, Math.min(30, 380 / Math.max(1, pCount)));

                  // 2. 预计算载荷位置映射
                  const payloadPosMap: Record<string, number> = {};
                  allPayloads.forEach((p: string, idx: number) => {
                    payloadPosMap[p] = pCount > 1 ? centerY + (idx - (pCount - 1) / 2) * pSpacing : centerY;
                  });

                  return (
                    <g className="animate-in fade-in zoom-in duration-700">
                      {/* 1. 接收站 */}
                      <WorkflowNode 
                        x={stationX} y={centerY} label={activeStation.name} 
                        icon={<Satellite size={20}/>} color={themeColor} 
                        isSelected={selectedNode === 'preprocess'} onClick={() => { setSelectedNode('preprocess'); setSelectedStationName(null); }}
                      />

                      {/* 2. 卫星节点与 站->卫星 连线 */}
                      {sats.map((sat: any, idx: number) => {
                        const sy = satCount > 1 ? centerY + (idx - (satCount - 1) / 2) * satSpacing : centerY;
                        return (
                          <g key={`sat-${idx}`}>
                            <path d={`M${stationX + 45} ${centerY} C${stationX + 120} ${centerY}, ${satelliteX - 120} ${sy}, ${satelliteX - 45} ${sy}`} stroke={themeColor} strokeWidth="3" strokeOpacity="0.3" fill="none" />
                            <WorkflowParticle d={`M${stationX + 45} ${centerY} C${stationX + 120} ${centerY}, ${satelliteX - 120} ${sy}, ${satelliteX - 45} ${sy}`} color={themeColor} dur="1.2s" size={2} />
                            <WorkflowNode x={satelliteX} y={sy} label={sat.name} icon={<Satellite size={14}/>} color={themeColor} size={22} />
                            
                            {/* 卫星 -> 唯一载荷 连线 */}
                            {sat.payloads.map((p: string, pIdx: number) => {
                              const py = payloadPosMap[p];
                              return (
                                <g key={`sat-p-${idx}-${pIdx}`}>
                                  <path d={`M${satelliteX + 22} ${sy} C${satelliteX + 80} ${sy}, ${payloadX - 80} ${py}, ${payloadX - 15} ${py}`} stroke={themeColor} strokeWidth="1.5" strokeOpacity="0.2" fill="none" />
                                  <WorkflowParticle d={`M${satelliteX + 22} ${sy} C${satelliteX + 60} ${sy}, ${payloadX - 60} ${py}, ${payloadX - 15} ${py}`} color={themeColor} dur="1.5s" size={1.2} />
                                </g>
                              );
                            })}
                          </g>
                        );
                      })}

                      {/* 3. 唯一载荷节点与 载荷->引擎 连线 */}
                      {allPayloads.map((payload: string, idx: number) => {
                        const py = payloadPosMap[payload];
                        return (
                          <g key={`unique-payload-${idx}`}>
                            <WorkflowNode x={payloadX} y={py} label={payload} icon={<Zap size={8}/>} color={themeColor} size={10} labelPos="right" />
                            <path d={`M${payloadX + 15} ${py} C${payloadX + 100} ${py}, ${engineX - 100} ${engineY}, ${engineX - 45} ${engineY}`} stroke={themeColor} strokeWidth="1.5" strokeOpacity="0.15" fill="none" />
                            <WorkflowParticle d={`M${payloadX + 15} ${py} C${payloadX + 100} ${py}, ${engineX - 100} ${engineY}, ${engineX - 45} ${engineY}`} color={themeColor} dur="1.8s" size={1.2} />
                          </g>
                        );
                      })}

                      {/* 4. 引擎 -> 服务器 -> 产品库 */}
                      <g>
                        <WorkflowNode 
                          x={engineX} y={engineY} label={isGeo ? "静止卫星引擎" : "极轨卫星引擎"} icon={<Cpu size={20}/>} color={themeColor} sub={isGeo ? "GEO Engine" : "LEO Engine"}
                          isSelected={selectedNode === (isGeo ? 'geo_engine' : 'leo_engine')} onClick={() => setSelectedNode(isGeo ? 'geo_engine' : 'leo_engine')}
                        />
                        <path d={`M${engineX + 45} ${engineY} L${serverX - 45} ${engineY}`} stroke={themeColor} strokeWidth="3" strokeOpacity="0.3" fill="none" />
                        <WorkflowParticle d={`M${engineX + 45} ${engineY} L${serverX - 45} ${engineY}`} color={themeColor} dur="1s" size={2} />
                        
                        <WorkflowNode x={serverX} y={engineY} label="生产服务器" icon={<Server size={20}/>} color={themeColor} sub="Prod Server" />
                        
                        <path d={`M${serverX + 45} ${engineY} L${archiveX - 45} ${engineY}`} stroke={themeColor} strokeWidth="3" strokeOpacity="0.3" fill="none" />
                        <WorkflowParticle d={`M${serverX + 45} ${engineY} L${archiveX - 45} ${engineY}`} color={themeColor} dur="1s" size={2} />
                        
                        <WorkflowNode 
                          x={archiveX} y={engineY} label={isGeo ? "静止产品库" : "极轨产品库"} icon={<Box size={20}/>} color={themeColor} sub={isGeo ? "GEO Archive" : "LEO Archive"}
                          isSelected={selectedNode === (isGeo ? 'geo_products' : 'leo_products')} onClick={() => setSelectedNode(isGeo ? 'geo_products' : 'leo_products')}
                        />

                        {/* 算法标注 */}
                        <text x={engineX} y={engineY - 50} fill={themeColor} fontSize="9" fontWeight="bold" textAnchor="middle" className="animate-pulse">
                          {activeStation.satellites[0].software}
                        </text>
                      </g>
                    </g>
                  );
                })()}
              </svg>
            </div>

           {/* 底部视角说明 */}
           <div className="absolute bottom-6 right-8 flex gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-1 bg-sky-500 rounded-full"></div>
                 <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">静止卫星流</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-1 bg-amber-500 rounded-full"></div>
                 <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">极轨卫星流</span>
              </div>
           </div>
        </div>

        {/* 右侧列：选中节点明细 */}
        <div className="col-span-2 flex flex-col gap-4">
           <ChartCard title={`${currentData.title} · 明细`}>
              <div className="flex flex-col gap-1 mb-6">
                 <h4 className="text-xl font-orbitron font-bold text-white tracking-tight">{currentData.title}</h4>
                 <p className="text-[9px] text-sky-500 font-bold uppercase tracking-widest">{currentData.sub}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                 <MetricSmall label="实时吞吐" value={currentData.metrics.throughput} unit="TB/h" />
                 <MetricSmall label="平均耗时" value={currentData.metrics.time} unit="min" />
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center justify-between">
                    <span>当前环节明细 (Details)</span>
                    <span className="text-sky-500">{selectedNode === 'preprocess' ? '站点列表' : '节点状态'}</span>
                 </p>
                                  <div className="space-y-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                    {selectedNode === 'preprocess' ? (
                       currentData.details.map((station: any, idx: number) => (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedStationName(station.name)}
                            className={`p-3 rounded-xl border transition-all group cursor-pointer ${selectedStationName === station.name ? 'bg-sky-500/20 border-sky-500/50' : 'bg-slate-900/40 border-sky-900/10 hover:border-sky-500/30'}`}
                          >
                             <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold transition-colors ${selectedStationName === station.name ? 'text-sky-400' : 'text-white group-hover:text-sky-400'}`}>{station.name}</span>
                                {station.status === 'warning' ? <AlertCircle size={12} className="text-amber-500" /> : <CheckCircle2 size={12} className="text-emerald-500" />}
                             </div>
                             <div className="flex gap-1.5 mb-2">
                                {station.satellites.map((sat: any) => (
                                   <span key={sat.name} className="px-1.5 py-0.5 bg-slate-800 rounded text-[7px] font-mono text-slate-400 uppercase flex items-center gap-1">
                                      <Satellite size={8} /> {sat.name}
                                   </span>
                                ))}
                             </div>
                             <div className="flex justify-between items-center text-[9px]">
                                <span className="text-slate-500 font-bold uppercase">预处理量</span>
                                <div className="flex items-baseline gap-1">
                                   <span className="text-sky-400 font-bold font-orbitron">{station.data}</span>
                                   <span className="text-slate-600">GB</span>
                                </div>
                             </div>

                             {/* 选中后的详细资源占用信息 (原在左侧) */}
                             {selectedStationName === station.name && (
                                <div className="mt-3 pt-3 border-t border-sky-500/20 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                   <div className="flex items-center justify-between mb-1">
                                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">实时资源负载 (Load)</span>
                                      <span className="text-[8px] text-sky-500 font-mono font-bold">NODE: {station.name.split('站')[0]}</span>
                                   </div>
                                   <div className="space-y-2.5 bg-slate-950/30 p-2.5 rounded-lg border border-sky-500/5">
                                      <MetricBar label="CPU 负载" value={station.load} color="bg-sky-400" />
                                      <MetricBar label="GPU 压力" value={Math.min(100, station.load + 15)} color="bg-indigo-400" />
                                      <MetricBar label="I/O 占用" value={Math.min(100, station.load - 10)} color="bg-emerald-400" />
                                      <MetricBar label="带宽负载" value={Math.min(100, station.load - 5)} color="bg-amber-400" />
                                   </div>
                                   <div className="flex items-center justify-between text-[7px] text-slate-600 font-bold uppercase pt-1">
                                      <span>天线规格: {station.antenna}</span>
                                      <span>状态: {station.status === 'normal' ? '运行正常' : '负载预警'}</span>
                                   </div>
                                </div>
                             )}
                          </div>
                       ))
                    ) : (
                       currentData.details.map((node: any, idx: number) => (
                          <div key={idx} className="bg-slate-900/40 p-3 rounded-xl border border-sky-900/10 hover:border-sky-500/30 transition-all flex justify-between items-center">
                             <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">{node.name}</span>
                                <span className="text-[8px] text-slate-500 font-bold uppercase">{node.task || `空闲: ${node.free}`}</span>
                             </div>
                             <div className="flex flex-col items-end">
                                <span className="text-sm font-orbitron font-bold text-sky-400">{node.load || node.used}</span>
                                <div className="w-12 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                                   <div className="h-full bg-sky-500" style={{ width: `${node.load || 50}%` }}></div>
                                </div>
                             </div>
                          </div>
                       ))
                    )}
                 </div>
              </div>
           </ChartCard>

           <ChartCard title="当前环节积压率" className="flex-1">
              <div className="h-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentData.queue}>
                       <XAxis dataKey="name" hide />
                       <YAxis hide />
                       <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '10px' }} />
                       <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
                          {currentData.queue.map((entry: any, index: number) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </ChartCard>
        </div>

      </div>

    </div>
  );
};

// 辅助组件：工作流节点
const WorkflowNode = ({ x, y, label, icon, color, sub, isSelected, onClick, size = 45, labelPos = 'bottom' }: any) => {
  const isSmall = size < 20;
  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-pointer group" onClick={onClick}>
      {/* 选中高亮 */}
      {isSelected && (
        <circle r={size * 1.3} fill={color} fillOpacity="0.08" className="animate-pulse" />
      )}
      <circle r={size} fill={color} fillOpacity={isSelected ? 0.15 : 0.05} className="group-hover:fill-opacity-10 transition-all" />
      <circle r={size * 0.8} fill="rgba(15, 23, 42, 0.95)" stroke={isSelected ? '#fff' : color} strokeWidth={isSelected ? 3 : 2} filter="url(#nodeGlow)" />
      
      {/* 图标 */}
      <foreignObject x={-size * 0.25} y={-size * 0.3} width={size * 0.5} height={size * 0.5}>
        <div className={`flex items-center justify-center ${isSelected ? 'text-white' : ''}`} style={{ color: isSelected ? '#fff' : color }}>
          {icon}
        </div>
      </foreignObject>

      {/* 文字说明 */}
      <text 
        x={labelPos === 'right' ? size + 6 : 0}
        y={labelPos === 'right' ? 3 : (isSmall ? size + 10 : size + 15)} 
        textAnchor={labelPos === 'right' ? "start" : "middle"}
        className={`${isSelected ? 'fill-sky-400' : 'fill-white'} font-bold ${isSmall ? 'text-[7px]' : 'text-[10px]'} transition-colors uppercase tracking-wider`}
      >
        {label}
      </text>
      {!isSmall && sub && <text y={size + 28} textAnchor="middle" className="fill-slate-600 font-mono text-[7px] uppercase tracking-widest">{sub}</text>}
    </g>
  );
};

const WorkflowParticle = ({ d, color, dur, size = 1.5 }: any) => (
  <g>
    <path d={d} fill="none" stroke={color} strokeWidth="4" strokeDasharray="6, 12" className="opacity-10">
      <animate attributeName="stroke-dashoffset" from="100" to="0" dur={dur} repeatCount="indefinite" />
    </path>
    <circle r={size} fill={color} className="drop-shadow-[0_0_8px_#fff]">
      <animateMotion path={d} dur={dur} repeatCount="indefinite" />
    </circle>
    <circle r={size * 1.5} fill={color} fillOpacity="0.3" className="animate-pulse">
      <animateMotion path={d} dur={dur} repeatCount="indefinite" />
    </circle>
  </g>
);

const MetricSmall = ({ label, value, unit }: any) => (
  <div className="bg-slate-900/60 p-3 rounded-xl border border-sky-900/10">
    <span className="text-[8px] text-slate-500 font-bold uppercase block mb-1">{label}</span>
    <div className="flex items-baseline gap-1">
       <span className="text-xl font-orbitron font-bold text-white">{value}</span>
       <span className="text-[9px] text-slate-500">{unit}</span>
    </div>
  </div>
);

const MetricBar = ({ label, value, color }: any) => (
  <div className="space-y-1.5">
     <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
        <span>{label}</span>
        <span className="text-slate-200">{value}%</span>
     </div>
     <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000 shadow-[0_0_8px_currentColor]`} style={{ width: `${value}%` }}></div>
     </div>
  </div>
);

export default ProductionView;
