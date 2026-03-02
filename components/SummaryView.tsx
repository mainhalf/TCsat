
import React, { useState, useMemo, useEffect } from 'react';
import ChartCard from './ChartCard';
import { 
  Satellite, 
  Network, 
  Server, 
  Factory, 
  ShieldCheck, 
  Zap, 
  Radio, 
  Database, 
  RefreshCcw, 
  Waves, 
  Signal, 
  Gauge,
  Timer,
  Cpu,
  Layers,
  Activity,
  ArrowUpRight,
  HardDrive,
  BarChart3,
  Wifi,
  Package,
  CheckCircle2,
  ArrowRightLeft,
  MapPin,
  AlertTriangle,
  Calendar,
  History,
  Wind,
  Volume2,
  Cloud,
  Droplets,
  Mic2,
  Binary,
  Workflow,
  Settings2,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  BarChart,
  Bar
} from 'recharts';

type SystemNode = 'constellation' | 'reception' | 'network' | 'server' | 'production';

const SummaryView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<SystemNode>('reception');
  const [isMaximized, setIsMaximized] = useState(false);
  
  // 实时动态数据状态
  const [realtimeStats, setRealtimeStats] = useState({
    health: 99.2,
    processingLoad: 82.5,
    gaugeRotation: 0,
    // 服务器相关展示数据
    srv: { totalStorage: '64.2 PB', dataVolume: '1.24 PB', io: '2.8 GB/s', nodes: '156/160' },
    // 卫星接收站展示数据
    stn: { monitoredSats: 58, antennas: 18, planned: 124, actual: 118 },
    // 地基网络展示数据
    net: { stations: 245, loss: '0.0002%', jitter: '1.2ms', bandwidth: '400 Gbps' },
    // 数据生成信息 (不变)
    prd: { rate: '4.2', qlen: 185, qa: '99.98', free: 520 }
  });

  // 模拟数据跳动
  useEffect(() => {
    const timer = setInterval(() => {
      setRealtimeStats(prev => ({
        ...prev,
        health: 99.0 + Math.random() * 0.5,
        processingLoad: 75 + Math.random() * 10,
        gaugeRotation: (prev.gaugeRotation + 5) % 360,
        srv: { 
          ...prev.srv, 
          io: (2.5 + Math.random() * 0.6).toFixed(2) + ' GB/s',
          dataVolume: (1.2 + Math.random() * 0.1).toFixed(2) + ' PB'
        },
        stn: { 
          ...prev.stn, 
          actual: prev.stn.actual + (Math.random() > 0.8 ? 1 : 0) > 124 ? 118 : prev.stn.actual + (Math.random() > 0.8 ? 1 : 0)
        },
        net: { 
          ...prev.net, 
          jitter: (1.0 + Math.random() * 0.4).toFixed(2) + 'ms'
        },
        prd: { 
          ...prev.prd,
          rate: (4.0 + Math.random() * 0.5).toFixed(1),
          qlen: 180 + Math.floor(Math.random() * 10)
        }
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const throughputData = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    val: 600 + Math.random() * 300
  })), []);

  const nodeDetails = useMemo(() => ({
    constellation: {
      name: '空间星座群', sub: 'Space Constellations', status: '已同步',
      metrics: [ { label: '活跃轨道卫星', value: '58', unit: '颗' }, { label: '星间链路状态', value: '99.8', unit: '%' }, { label: '轨道高度偏差', value: '< 2', unit: '米' } ],
      description: '监测全域极轨与静止轨道卫星群，作为系统的核心原始数据源。'
    },
    reception: {
      name: '卫星接收枢纽', sub: 'Satellite Receivers', status: '运行中',
      metrics: [ { label: '在线天线数', value: '18', unit: '套' }, { label: '实时接收速率', value: '2.4', unit: 'Gbps' }, { label: '解调质量', value: 'A级', unit: '' } ],
      description: '全球分布式地面站接收终端，负责卫星码流的实时采集与数字变频。'
    },
    network: {
      name: '地基网络架构', sub: 'Ground Network', status: '稳定',
      metrics: [ { label: '骨干链路带宽', value: '400', unit: 'Gbps' }, { label: '全网平均延时', value: '1.2', unit: 'ms' }, { label: '接入站点', value: '245', unit: '个' } ],
      description: '基于SDN架构的高可靠传输网络，实现卫星数据的分布式回传。'
    },
    air: {
      name: '大气监测网', sub: 'Air Quality', status: '在线',
      metrics: [ { label: '监测站点', value: '124', unit: '个' }, { label: 'PM2.5均值', value: '12', unit: 'μg/m³' }, { label: '数据可用率', value: '99.8', unit: '%' } ],
      description: '全域大气环境质量实时监测，提供高精度气象与污染数据。'
    },
    water: {
      name: '水质监测网', sub: 'Water Quality', status: '在线',
      metrics: [ { label: '监测断面', value: '86', unit: '个' }, { label: '溶解氧', value: '7.2', unit: 'mg/L' }, { label: '水质达标率', value: '96.5', unit: '%' } ],
      description: '重点流域水质自动监测，实现水环境风险预警。'
    },
    sound: {
      name: '声环境监测网', sub: 'Sound Level', status: '在线',
      metrics: [ { label: '监测点位', value: '35', unit: '个' }, { label: '平均噪声', value: '52', unit: 'dB' }, { label: '超标预警', value: '0', unit: '次' } ],
      description: '城市功能区声环境质量监测，保障居民生活环境。'
    },
    server: {
      name: '运维计算中心', sub: 'Server Clusters', status: '高负载',
      metrics: [ { label: '计算节点', value: '160', unit: '组' }, { label: '存储可用率', value: '82', unit: '%' }, { label: '服务可用性', value: '99.99', unit: '%' } ],
      description: '核心资源池，承载所有原始数据的预处理、校验及存储。'
    },
    production: {
      name: '数据生产流水线', sub: 'Production Pipeline', status: '生产中',
      metrics: [ { label: '产出速率', value: '4.2', unit: 'TB/h' }, { label: '质检合格率', value: '99.98', unit: '%' }, { label: '自动化率', value: '100', unit: '%' } ],
      description: '全自动数据产品工厂，产出L3级行业应用产品。'
    }
  }), []);

  const activeNode = nodeDetails[selectedNode];

  return (
    <div className="flex flex-col h-full gap-6 duration-1000">
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* 左侧面板 */}
        <div className="col-span-2 flex flex-col gap-4">
          <ChartCard title="核心大脑全域态势">
             <div className="flex flex-col items-center py-4">
                <div className="relative w-56 h-56 flex items-center justify-center scale-110">
                   <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <div className="w-full h-full border-4 border-dashed border-sky-900 rounded-full animate-[spin_20s_linear_infinite]"></div>
                   </div>
                   <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                      <defs>
                         <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                         </filter>
                      </defs>
                      <circle cx="100" cy="100" r="85" fill="none" stroke="#0f172a" strokeWidth="8" />
                      <circle 
                        cx="100" cy="100" r="85" fill="none" stroke="#0ea5e9" strokeWidth="8" 
                        strokeDasharray={`${(realtimeStats.processingLoad / 100) * 534} 534`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 drop-shadow-[0_0_8px_#0ea5e9]"
                      />
                      <circle cx="100" cy="100" r="72" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
                      <g style={{ transform: `rotate(${realtimeStats.gaugeRotation}deg)`, transformOrigin: 'center' }}>
                         <path d="M100 20 L100 35" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
                         <path d="M100 100 L100 28" stroke="url(#needleGrad)" strokeWidth="1" strokeOpacity="0.5" />
                         <defs>
                            <linearGradient id="needleGrad" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="0%" stopColor="#38bdf8" />
                               <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                         </defs>
                      </g>
                   </svg>
                   <div className="flex flex-col items-center z-10">
                      <div className="flex items-baseline gap-1">
                         <span className="text-5xl font-orbitron font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                            {realtimeStats.health.toFixed(1)}
                         </span>
                         <span className="text-xs text-sky-400 font-bold">%</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-3">运维健康指数</span>
                   </div>
                </div>
                <div className="mt-8 w-full space-y-4 px-2">
                   <MiniIndicator label="多路并发接收链路" value="同步中" status="online" />
                   <MiniIndicator label="全系统调度线程" value="28,405" status="online" />
                </div>
             </div>
          </ChartCard>
          <ChartCard title="核心资源动态负载" className="flex-1">
             <div className="h-full flex flex-col justify-center gap-6">
                <ProgressItem label="CPU 处理集群" value={55} color="bg-sky-400" />
                <ProgressItem label="GPU 渲染阵列" value={78} color="bg-indigo-500" />
                <ProgressItem label="存储 I/O 通道" value={42} color="bg-emerald-400" />
                <ProgressItem label="骨干网带宽负载" value={35} color="bg-amber-400" />
             </div>
          </ChartCard>
        </div>

        {/* 中间核心拓扑区域 */}
        <div className={`col-span-8 flex flex-col relative bg-slate-900/10 rounded-3xl border border-sky-900/10 overflow-hidden transition-all duration-500 ${isMaximized ? 'fixed inset-0 z-[999] w-screen h-screen top-0 left-0 m-0 rounded-none bg-[#020617]' : ''}`}>
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.06)_0%,transparent_80%)]"></div>
           <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

           {/* Maximize Toggle */}
           <button 
             onClick={() => setIsMaximized(!isMaximized)}
             className="absolute top-6 left-8 z-[1000] p-2 bg-slate-800/50 hover:bg-sky-500/20 border border-sky-500/20 rounded-xl text-sky-400 transition-all"
             title={isMaximized ? "退出全屏" : "全屏查看"}
           >
             {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
           </button>

           {/* 上方：工作流动态监测 (卫星接收与地基网络并列) */}
           <div className="relative flex-1 flex flex-col items-center justify-center p-4">
              <div className="absolute top-6 left-8 z-20">
                 <h2 className="text-lg font-orbitron font-bold text-white tracking-widest uppercase flex items-center gap-3">
                    <History className="text-sky-400" size={18} />
                    卫星数据流向全景预览
                 </h2>
              </div>
               <svg viewBox="0 0 1850 550" className="w-full h-full drop-shadow-[0_0_50px_rgba(56,189,248,0.15)] mt-4">
                 <defs>
                   <filter id="complexGlow" x="-30%" y="-30%" width="160%" height="160%">
                     <feGaussianBlur stdDeviation="5" result="blur" />
                     <feComposite in="SourceGraphic" in2="blur" operator="over" />
                   </filter>
                 </defs>

                 {/* --- 1. 空间星座段 --- */}
                 <WorkflowBus d="M140 60 L280 60 L280 120 L420 120" color="#38bdf8" dur="3s" />
                 <WorkflowBus d="M140 180 L280 180 L280 120 L420 120" color="#38bdf8" dur="3.5s" />

                 {/* --- 2. 卫星接收段 (Orthogonal) --- */}
                 <WorkflowBus d="M420 120 L480 120 L480 200 L560 200" color="#0ea5e9" dur="3s" opacity={0.3} />
                 <WorkflowBus d="M560 200 L680 200 L680 250 L780 250" color="#c084fc" dur="2.2s" strokeWidth={3} />

                 {/* --- 3. 地基网络段 (Orthogonal) --- */}
                 <WorkflowBus d="M60 400 L120 400 L120 320 L200 320" color="#10b981" dur="3s" opacity={0.2} />
                 <WorkflowBus d="M60 400 L200 400" color="#10b981" dur="3s" opacity={0.2} />
                 <WorkflowBus d="M60 400 L120 400 L120 480 L200 480" color="#10b981" dur="3s" opacity={0.2} />
                 
                 <WorkflowBus d="M240 320 L680 320 L680 250 L780 250" color="#10b981" dur="2.5s" strokeWidth={2} />
                 <WorkflowBus d="M240 400 L680 400 L680 250 L780 250" color="#10b981" dur="2.8s" strokeWidth={2} />
                 <WorkflowBus d="M240 480 L680 480 L680 250 L780 250" color="#10b981" dur="3.1s" strokeWidth={2} />

                 {/* --- 4. 核心计算段 (Orthogonal) --- */}
                 <WorkflowBus d="M780 250 L840 250 L840 150 L920 150" color="#c084fc" dur="3s" opacity={0.3} />
                 <WorkflowBus d="M780 250 L840 250 L840 350 L920 350" color="#c084fc" dur="3s" opacity={0.3} />
                 
                 <WorkflowBus d="M960 150 L1020 150 L1020 250 L1100 250" color="#fb7185" dur="1.8s" strokeWidth={3} />
                 <WorkflowBus d="M960 350 L1020 350 L1020 250 L1100 250" color="#fb7185" dur="2s" strokeWidth={3} />

                 {/* --- 5. 数据生产段 (Orthogonal) --- */}
                 <WorkflowBus d="M1150 250 L1260 250" color="#fb7185" dur="2s" strokeWidth={4} />
                 <WorkflowBus d="M1292 250 L1380 250" color="#fb7185" dur="2s" strokeWidth={4} />
                 
                 {/* 算法引擎 -> 8个产品分支 (Orthogonal) */}
                 {[60, 120, 180, 240, 300, 360, 420, 480].map((y, i) => (
                   <WorkflowBus 
                     key={i}
                     d={`M1452 250 L1500 250 L1500 ${y} L1550 ${y}`} 
                     color="#fb7185" 
                     dur={`${2.2 + i * 0.1}s`} 
                     opacity={0.4} 
                   />
                 ))}

                 {/* 节点渲染 */}
                 {/* 空间星座 */}
                 <ComplexNode x={100} y={60} label="极轨星座" sub="LEO" icon={<Satellite size={16}/>} color="#38bdf8" size={32} isSelected={selectedNode === 'constellation'} onClick={() => setSelectedNode('constellation')} />
                 <ComplexNode x={100} y={180} label="静止星座" sub="GEO" icon={<Satellite size={16}/>} color="#38bdf8" size={32} isSelected={selectedNode === 'constellation'} onClick={() => setSelectedNode('constellation')} />

                 {/* 接收枢纽 */}
                 <ComplexNode x={420} y={120} label="卫星接收枢纽" sub="Receiver Hub" icon={<Radio size={24}/>} color="#0ea5e9" size={50} isSelected={selectedNode === 'reception'} onClick={() => setSelectedNode('reception')} />
                 <ComplexNode x={560} y={200} label="载荷处理" sub="Payload Proc" icon={<Layers size={18}/>} color="#0ea5e9" size={32} isSelected={selectedNode === 'reception'} onClick={() => setSelectedNode('reception')} />

                 {/* 地基网络 */}
                 <ComplexNode x={60} y={400} label="地基网络" sub="Ground Net" icon={<Network size={24}/>} color="#10b981" size={50} isSelected={selectedNode === 'network'} onClick={() => setSelectedNode('network')} />
                 <ComplexNode x={200} y={320} label="大气监测" sub="Air" icon={<Wind size={16}/>} color="#38bdf8" size={32} labelPos="right" isSelected={selectedNode === 'network'} onClick={() => setSelectedNode('network')} />
                 <ComplexNode x={200} y={400} label="水质监测" sub="Water" icon={<Waves size={16}/>} color="#10b981" size={32} labelPos="right" isSelected={selectedNode === 'network'} onClick={() => setSelectedNode('network')} />
                 <ComplexNode x={200} y={480} label="声环境监测" sub="Sound" icon={<Volume2 size={16}/>} color="#f59e0b" size={32} labelPos="right" isSelected={selectedNode === 'network'} onClick={() => setSelectedNode('network')} />

                 {/* 计算集群 */}
                 <ComplexNode x={780} y={250} label="核心计算集群" sub="Computing" icon={<Server size={24}/>} color="#c084fc" size={50} isSelected={selectedNode === 'server'} onClick={() => setSelectedNode('server')} />
                 <ComplexNode x={920} y={150} label="计算资源" sub="Compute" icon={<Cpu size={18}/>} color="#c084fc" size={32} isSelected={selectedNode === 'server'} onClick={() => setSelectedNode('server')} />
                 <ComplexNode x={920} y={350} label="存储资源" sub="Storage" icon={<Database size={18}/>} color="#c084fc" size={32} isSelected={selectedNode === 'server'} onClick={() => setSelectedNode('server')} />

                 {/* 生产工厂 */}
                 <ComplexNode x={1100} y={250} label="数据生产工厂" sub="Production" icon={<Factory size={24}/>} color="#fb7185" size={50} isSelected={selectedNode === 'production'} onClick={() => setSelectedNode('production')} />
                 <ComplexNode x={1260} y={250} label="算法引擎" sub="Engine" icon={<Binary size={18}/>} color="#fb7185" size={32} isSelected={selectedNode === 'production'} onClick={() => setSelectedNode('production')} />
                 
                 {/* 8个具体产品节点 */}
                 <ComplexNode x={1550} y={60} label="大气产品" sub="Air" icon={<Wind size={14}/>} color="#fb7185" size={24} labelPos="right" isSelected={selectedNode === 'production'} onClick={() => setSelectedNode('production')} />
                 <ComplexNode x={1550} y={120} label="生态产品" sub="Eco" icon={<Activity size={14}/>} color="#fb7185" size={24} labelPos="right" isSelected={selectedNode === 'production'} onClick={() => setSelectedNode('production')} />
                 <ComplexNode x={1550} y={180} label="生物质燃烧产品" sub="Biomass" icon={<Zap size={14}/>} color="#fb7185" size={24} labelPos="right" isSelected={selectedNode === 'production'} onClick={() => setSelectedNode('production')} />
                 <ComplexNode x={1550} y={240} label="人类活动产品" sub="Human" icon={<MapPin size={14}/>} color="#fb7185" size={24} labelPos="right" isSelected={selectedNode === 'production'} onClick={() => setSelectedNode('production')} />
                 <ComplexNode x={1550} y={300} label="扬尘源产品" sub="Dust" icon={<Cloud size={14}/>} color="#fb7185" size={24} labelPos="right" isSelected={selectedNode === 'production'} onClick={() => setSelectedNode('production')} />
                 <ComplexNode x={1550} y={360} label="固废产品" sub="Solid Waste" icon={<Package size={14}/>} color="#fb7185" size={24} labelPos="right" isSelected={selectedNode === 'production'} onClick={() => setSelectedNode('production')} />
                 <ComplexNode x={1550} y={420} label="碳源汇产品" sub="Carbon" icon={<RefreshCcw size={14}/>} color="#fb7185" size={24} labelPos="right" isSelected={selectedNode === 'production'} onClick={() => setSelectedNode('production')} />
                 <ComplexNode x={1550} y={480} label="水环境产品" sub="Water" icon={<Waves size={14}/>} color="#fb7185" size={24} labelPos="right" isSelected={selectedNode === 'production'} onClick={() => setSelectedNode('production')} />
              </svg>
           </div>

           {/* 下方：四个核心展示板块 (数据指标按最新要求修改) */}
           <div className="grid grid-cols-4 gap-4 px-6 pb-6 z-30">
              {/* 板块 1: 服务器 */}
              <div className="glass-panel p-3 rounded-xl border-t-2 border-sky-400 bg-slate-900/80 hover:bg-slate-900/90 transition-all group">
                 <div className="flex items-center gap-2 mb-3">
                    <Server size={14} className="text-sky-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">服务器运维</span>
                 </div>
                 <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                    <SimpleMetric label="总存储量" value={realtimeStats.srv.totalStorage} unit="" icon={<Database size={10}/>} />
                    <SimpleMetric label="数据量" value={realtimeStats.srv.dataVolume} unit="" icon={<HardDrive size={10}/>} />
                    <SimpleMetric label="磁盘 I/O" value={realtimeStats.srv.io} unit="" icon={<ArrowRightLeft size={10}/>} />
                    <SimpleMetric label="在线节点" value={realtimeStats.srv.nodes} unit="" icon={<ShieldCheck size={10}/>} />
                 </div>
              </div>

              {/* 板块 2: 卫星接收站 */}
              <div className="glass-panel p-3 rounded-xl border-t-2 border-indigo-500 bg-slate-900/80 hover:bg-slate-900/90 transition-all group">
                 <div className="flex items-center gap-2 mb-3">
                    <Radio size={14} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">卫星接收站</span>
                 </div>
                 <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                    <SimpleMetric label="监测卫星数" value={realtimeStats.stn.monitoredSats} unit="颗" icon={<Satellite size={10}/>} />
                    <SimpleMetric label="在线天线数" value={realtimeStats.stn.antennas} unit="套" icon={<Waves size={10}/>} />
                    <SimpleMetric label="计划接收" value={realtimeStats.stn.planned} unit="项" icon={<Calendar size={10}/>} />
                    <SimpleMetric label="实际接收" value={realtimeStats.stn.actual} unit="项" icon={<CheckCircle2 size={10}/>} />
                 </div>
              </div>

              {/* 板块 3: 地基网络 (分拆展示) */}
              <div className="glass-panel p-3 rounded-xl border-t-2 border-emerald-500 bg-slate-900/80 hover:bg-slate-900/90 transition-all group">
                 <div className="flex items-center gap-2 mb-3">
                    <Network size={14} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">地基网络 (分拆)</span>
                 </div>
                 <div className="space-y-2.5">
                    <div className="flex justify-between items-center bg-sky-500/5 p-1.5 rounded-lg border border-sky-500/10">
                       <div className="flex items-center gap-2">
                          <Wind size={12} className="text-sky-400" />
                          <span className="text-[9px] text-slate-300 font-bold">大气监测网</span>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-[11px] font-orbitron text-sky-400 leading-none">124 站</span>
                          <span className="text-[7px] text-slate-600 font-bold uppercase">Air Quality</span>
                       </div>
                    </div>
                    <div className="flex justify-between items-center bg-emerald-500/5 p-1.5 rounded-lg border border-emerald-500/10">
                       <div className="flex items-center gap-2">
                          <Waves size={12} className="text-emerald-400" />
                          <span className="text-[9px] text-slate-300 font-bold">水质监测网</span>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-[11px] font-orbitron text-emerald-400 leading-none">86 站</span>
                          <span className="text-[7px] text-slate-600 font-bold uppercase">Water Quality</span>
                       </div>
                    </div>
                    <div className="flex justify-between items-center bg-amber-500/5 p-1.5 rounded-lg border border-amber-500/10">
                       <div className="flex items-center gap-2">
                          <Volume2 size={12} className="text-amber-400" />
                          <span className="text-[9px] text-slate-300 font-bold">声环境监测网</span>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-[11px] font-orbitron text-amber-400 leading-none">35 站</span>
                          <span className="text-[7px] text-slate-600 font-bold uppercase">Noise Level</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* 板块 4: 数据生成 */}
              <div className="glass-panel p-3 rounded-xl border-t-2 border-amber-500 bg-slate-900/80 hover:bg-slate-900/90 transition-all group">
                 <div className="flex items-center gap-2 mb-3">
                    <Factory size={14} className="text-amber-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">数据生成</span>
                 </div>
                 <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                    <SimpleMetric label="生产速率" value={realtimeStats.prd.rate} unit="TB/h" icon={<BarChart3 size={10}/>} />
                    <SimpleMetric label="队列积压" value={realtimeStats.prd.qlen} unit="Tasks" icon={<Package size={10}/>} />
                    <SimpleMetric label="合格率 QA" value={realtimeStats.prd.qa} unit="%" icon={<CheckCircle2 size={10}/>} />
                    <SimpleMetric label="存储余量" value={realtimeStats.prd.free} unit="TB" icon={<HardDrive size={10}/>} />
                 </div>
              </div>
           </div>
        </div>

        {/* 右侧面板 */}
        <div className="col-span-2 flex flex-col gap-4">
          <ChartCard title={`${activeNode.name} · 状态`}>
             <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start mb-2">
                   <div>
                      <h4 className="text-xl font-orbitron font-bold text-white tracking-tight">{activeNode.name}</h4>
                      <p className="text-[9px] text-sky-500 font-bold uppercase tracking-[0.2em]">{activeNode.sub}</p>
                   </div>
                   <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-500/20 text-emerald-400">{activeNode.status}</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                   {activeNode.metrics.map((m, idx) => (
                      <div key={idx} className="bg-slate-900/40 p-3 rounded-xl border border-sky-900/10 flex justify-between items-center hover:bg-sky-500/5 transition-all">
                         <span className="text-xs text-slate-400 font-bold">{m.label}</span>
                         <div className="flex items-baseline gap-1">
                            <span className="text-lg font-orbitron font-bold text-sky-300">{m.value}</span>
                            <span className="text-[9px] text-slate-600 font-bold">{m.unit}</span>
                         </div>
                      </div>
                   ))}
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed bg-sky-900/10 p-3 rounded-lg border-l-2 border-sky-500 italic mt-2">
                   "{activeNode.description}"
                </p>
             </div>
          </ChartCard>
          <ChartCard title="全链路生产趋势" className="h-[180px]">
             <div className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={throughputData}>
                    <defs>
                      <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fb7185" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#fb7185" fillOpacity={1} fill="url(#flowGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </ChartCard>
          <ChartCard title="系统异常日志" className="flex-1 overflow-hidden">
             <div className="space-y-3 h-full overflow-y-auto custom-scrollbar pr-1">
                <AlarmItem time="14:52" level="info" text="极轨卫星 FY-3D 下行锁定成功" />
                <AlarmItem time="14:50" level="warn" text="GPU 计算集群负载瞬时波动" />
                <AlarmItem time="14:45" level="info" text="SDN 骨干网路由策略更新完毕" />
             </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

// --- 辅助可视化组件 ---

const SimpleMetric = ({ label, value, unit, icon }: any) => (
  <div className="flex flex-col gap-0.5 min-w-0">
     <div className="flex items-center gap-1.5 text-[8px] text-slate-500 font-bold uppercase truncate">
        {icon}
        <span>{label}</span>
     </div>
     <div className="flex items-baseline gap-0.5">
        <span className="text-[12px] font-orbitron font-bold text-white leading-none tracking-tighter">{value}</span>
        <span className="text-[7px] text-slate-600 font-bold uppercase">{unit}</span>
     </div>
  </div>
);

const ComplexNode = ({ x, y, label, sub, icon, color, isSelected, onClick, size = 48, labelPos = 'bottom' }: any) => (
  <g transform={`translate(${x}, ${y})`} className="cursor-pointer group" onClick={onClick}>
    {isSelected && <circle r={size + 15} fill={color} fillOpacity="0.1" className="animate-pulse" />}
    <circle r={size} fill={color} fillOpacity={isSelected ? 0.2 : 0.05} className="group-hover:fill-opacity-10 transition-all duration-300" />
    <circle r={size - 10} fill="rgba(15, 23, 42, 0.98)" stroke={isSelected ? '#fff' : color} strokeWidth={isSelected ? 3 : 2} filter="url(#complexGlow)" />
    <foreignObject x="-12" y="-12" width="24" height="24">
      <div className={`flex items-center justify-center ${isSelected ? 'text-white' : ''}`} style={{ color: isSelected ? '#fff' : color }}>
        {icon}
      </div>
    </foreignObject>
    {labelPos === 'bottom' ? (
      <>
        <text y={size + 22} textAnchor="middle" className={`${isSelected ? 'fill-sky-400' : 'fill-white'} font-bold text-[11px] uppercase tracking-wider`}>{label}</text>
        <text y={size + 35} textAnchor="middle" className="fill-slate-600 font-mono text-[8px] uppercase tracking-widest">{sub}</text>
      </>
    ) : (
      <>
        <text x={size + 12} y={-4} textAnchor="start" dominantBaseline="middle" className={`${isSelected ? 'fill-sky-400' : 'fill-white'} font-bold text-[11px] uppercase tracking-wider`}>{label}</text>
        <text x={size + 12} y={10} textAnchor="start" dominantBaseline="middle" className="fill-slate-600 font-mono text-[8px] uppercase tracking-widest">{sub}</text>
      </>
    )}
  </g>
);

const WorkflowBus = ({ d, color, dur, strokeWidth = 1.5 }: any) => (
  <g>
    <path d={d} fill="none" stroke="#1e293b" strokeWidth={strokeWidth + 2} className="opacity-40" />
    <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray="5, 20" className="opacity-30">
      <animate attributeName="stroke-dashoffset" from="100" to="0" dur={dur} repeatCount="indefinite" />
    </path>
    <circle r="2.5" fill={color}>
      <animateMotion path={d} dur={dur} repeatCount="indefinite" />
    </circle>
  </g>
);

const MiniIndicator = ({ label, value, status }: any) => (
  <div className="flex justify-between items-center py-2 border-b border-sky-900/10 last:border-0">
    <div className="flex flex-col">
       <span className="text-[10px] text-slate-500 font-bold uppercase">{label}</span>
       <span className="text-lg font-orbitron font-bold text-sky-400">{value}</span>
    </div>
    <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></div>
  </div>
);

const ProgressItem = ({ label, value, color }: any) => (
  <div className="space-y-1.5">
     <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
        <span>{label}</span>
        <span className="text-slate-200">{value}%</span>
     </div>
     <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000 shadow-[0_0_10px_currentColor]`} style={{ width: `${value}%` }}></div>
     </div>
  </div>
);

const AlarmItem = ({ time, level, text }: any) => (
  <div className="flex gap-3 text-[10px] pb-3 border-b border-sky-900/5 last:border-0 last:pb-0">
    <span className="text-slate-600 font-mono whitespace-nowrap opacity-60">{time}</span>
    <div className="flex items-start gap-2">
      <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${level === 'error' ? 'bg-rose-500' : level === 'warn' ? 'bg-amber-500' : 'bg-sky-500'}`}></div>
      <span className={`${level === 'error' ? 'text-rose-400 font-bold' : level === 'warn' ? 'text-amber-400' : 'text-slate-400'}`}>{text}</span>
    </div>
  </div>
);

export default SummaryView;
