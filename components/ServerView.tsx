
import React, { useState, useMemo, useEffect } from 'react';
import ChartCard from './ChartCard';
import { 
  Monitor, 
  ChevronLeft,
  ChevronRight,
  Database, 
  Thermometer, 
  Zap, 
  Box, 
  Activity,
  Cpu,
  Layers,
  Settings,
  HardDrive,
  Globe,
  Server as ServerIcon,
  Maximize2,
  MapPin,
  Signal,
  Wind,
  Droplets,
  Volume2,
  X,
  ShieldCheck,
  AlertCircle,
  BarChart3,
  ListFilter,
  ArrowUpRight,
  ShieldAlert,
  ClipboardList,
  Flame,
  Network,
  ArrowRightLeft,
  History,
  Clock,
  Calendar,
  Power,
  RotateCcw,
  Terminal,
  Minimize2,
  Lock,
  Wifi,
  Cloud
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';

enum ViewDepth {
  ROOMS = 0,
  RACKS = 1,
  SERVERS = 2
}

interface ServerStatus {
  id: string;
  name: string;
  status: '在线' | '告警' | '离线';
  cpuLoad: number;
  memLoad: number;
  temp: number;
  ip: string;
  vlan: string;
  uPos: number;
  config: {
    cpu: string;
    memory: string;
    disk: string;
    bandwidth: string;
    os: string;
    model: string;
    power: string;
    cores: string;
    frequency: string;
    memType: string;
    diskCount: string;
    osVersion: string;
    kernel: string;
    arch: string;
    hostname: string;
    mac: string;
    gateway: string;
    dns: string;
    interface: string;
    uptime: string;
    processes: string;
    load1m: string;
    load5m: string;
    created: string;
    updated: string;
  };
}

interface RackStatus {
  id: string;
  name: string;
  status: 'normal' | 'alarm' | 'failure';
  temp: number;
  power: number;
  usage: number;
  uCapacity: number;
}

const ServerUnit: React.FC<{ server: ServerStatus, isSelected: boolean, onClick: () => void }> = ({ server, isSelected, onClick }) => {
  const isOffline = server.status === '离线';
  const isAlarm = server.status === '告警';

  return (
    <div 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`relative w-full transition-all duration-300 cursor-pointer rounded flex flex-col group mb-1
        ${isSelected ? 'ring-2 ring-sky-400 ring-offset-1 ring-offset-[#020617] scale-[1.01] z-20 shadow-[0_0_20px_rgba(56,189,248,0.3)]' : 'hover:brightness-125 hover:translate-x-1'}
        ${isOffline ? 'opacity-30 grayscale' : ''}
      `}
      style={{ 
        height: '44px', 
        background: isAlarm ? 'linear-gradient(90deg, #450a0a, #7f1d1d)' : 'linear-gradient(90deg, #0f172a, #1e293b)',
        border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(56,189,248,0.1)',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
      }}
    >
      <div className="flex-1 flex items-center px-3 relative overflow-hidden">
        <div className="flex flex-col gap-1 mr-3 opacity-60 shrink-0">
           <div className={`w-1.5 h-1.5 rounded-full ${server.status === '在线' ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : isAlarm ? 'bg-amber-500 animate-ping' : 'bg-slate-700'}`}></div>
           <div className="w-1.5 h-1.5 rounded-full bg-slate-800 border border-white/5 shadow-inner"></div>
        </div>
        <div className="flex-1 flex items-center gap-4 min-w-0">
          <div className="w-28 flex flex-col justify-center leading-none">
             <span className={`text-[9px] font-bold font-orbitron truncate uppercase tracking-tighter ${isSelected ? 'text-white' : 'text-sky-300'}`}>
                {server.name.split('-').pop()}
             </span>
             <span className="text-[7px] font-mono text-slate-500 font-bold mt-0.5">{server.ip}</span>
          </div>
          <div className="flex gap-3 flex-1">
             <div className="flex flex-col gap-0.5 w-14">
                <div className="flex justify-between items-center text-[6px] font-bold text-slate-600">
                   <span>CPU</span>
                   <span className="text-sky-400">{server.cpuLoad}%</span>
                </div>
                <div className="h-0.5 bg-black/50 rounded-full overflow-hidden">
                   <div className="h-full bg-sky-400" style={{ width: `${server.cpuLoad}%` }}></div>
                </div>
             </div>
             <div className="flex flex-col gap-0.5 w-14">
                <div className="flex justify-between items-center text-[6px] font-bold text-slate-600">
                   <span>MEM</span>
                   <span className="text-indigo-400">{server.memLoad}%</span>
                </div>
                <div className="h-0.5 bg-black/50 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500" style={{ width: `${server.memLoad}%` }}></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IsometricRack: React.FC<{ rack: RackStatus, onClick: () => void }> = ({ rack, onClick }) => {
  const isNormal = rack.status === 'normal';
  const isFailure = rack.status === 'failure';
  const isAlarm = rack.status === 'alarm';
  
  return (
    <div onClick={onClick} className="relative w-24 h-48 cursor-pointer group transition-all duration-700" style={{ perspective: '1200px' }}>
      <div className="absolute inset-0 preserve-3d transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-4">
         <div className="absolute -bottom-6 left-6 right-0 h-10 bg-black/80 blur-2xl rounded-full transform rotateX(85deg) opacity-40"></div>
         <div className={`absolute inset-0 z-30 shadow-[0_25px_50px_-12px_rgba(0,0,0,1)] overflow-hidden border-[1.5px] rounded-sm
            ${isFailure ? 'bg-[#1a0808] border-rose-600/60' : isAlarm ? 'bg-[#1a1208] border-amber-600/60' : 'bg-[#02040a] border-slate-700/80'}`}
         >
            <div className={`h-1.5 w-full ${isNormal ? 'bg-sky-500/90' : 'bg-rose-500 animate-pulse'} shadow-[0_0_10px_currentColor]`}></div>
            <div className="relative p-2.5 h-full flex flex-col z-20">
               <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col gap-0.5 max-w-[70%]">
                    <span className="text-[9px] font-bold text-slate-200 tracking-tight flex items-center gap-1.5 truncate">{rack.name}</span>
                    <span className="text-[6px] font-orbitron font-bold text-slate-500 uppercase tracking-widest truncate">{rack.id}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full border border-white/10 shrink-0 ${isNormal ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 animate-pulse'}`}></div>
               </div>
               <div className="flex-1 flex flex-col gap-[2px] opacity-80 group-hover:opacity-100 transition-all overflow-hidden py-1">
                  {Array.from({length: 12}).map((_, u) => (
                    <div key={u} className="h-2 w-full bg-slate-900/50 rounded-[1px] flex items-center px-1">
                       <div className="h-[1px] flex-1 bg-sky-500/10"></div>
                       <div className={`w-1 h-1 rounded-full ml-1 ${Math.random() > 0.3 ? 'bg-sky-400' : 'bg-slate-800'}`}></div>
                    </div>
                  ))}
               </div>
               <div className="mt-auto pt-2">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">负载状态</span>
                     <span className="text-[8px] font-orbitron font-bold text-sky-400">{rack.usage}%</span>
                  </div>
                  <div className="h-1 bg-black rounded-full overflow-hidden">
                     <div className={`h-full bg-sky-500 transition-all duration-1000`} style={{ width: `${rack.usage}%` }}></div>
                  </div>
               </div>
            </div>
         </div>
         <div className="absolute -top-[16px] left-0 w-full h-[16px] bg-slate-800 transform skew-x-[-45deg] origin-bottom border-x-[1.5px] border-t-[1.5px] border-white/10 z-20"></div>
         <div className="absolute top-0 -right-[16px] w-[16px] h-full bg-black transform skew-y-[-45deg] origin-left border-y-[1.5px] border-r-[1.5px] border-white/10 z-20"></div>
      </div>
    </div>
  );
};

const ServerView: React.FC = () => {
  const [depth, setDepth] = useState<ViewDepth>(ViewDepth.ROOMS);
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedRackId, setSelectedRackId] = useState<string | null>(null);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(timer);
  }, []);

  const MOCK_ROOMS = [
    { 
      name: '北京数据中心', 
      id: 'IDC-BJ', 
      nodes: 1240, 
      load: 68, 
      racks: 120, 
      dataVolume: '45.2 PB', 
      status: '运行中',
      latency: '12ms',
      power: '1,240 kW',
      pue: '1.25',
      security: 'Tier IV',
      uptime: '99.999%',
      alerts: 0,
      temp: '22.4°C'
    },
    { 
      name: '黑龙江数据中心', 
      id: 'IDC-HLJ', 
      nodes: 850, 
      load: 42, 
      racks: 80, 
      dataVolume: '28.5 PB', 
      status: '运行中',
      latency: '28ms',
      power: '850 kW',
      pue: '1.18',
      security: 'Tier III+',
      uptime: '99.995%',
      alerts: 1,
      temp: '18.2°C'
    },
    { 
      name: '上海数据中心', 
      id: 'IDC-SH', 
      nodes: 2100, 
      load: 85, 
      racks: 180, 
      dataVolume: '62.1 PB', 
      status: '运行中',
      latency: '15ms',
      power: '2,100 kW',
      pue: '1.32',
      security: 'Tier IV',
      uptime: '99.999%',
      alerts: 3,
      temp: '24.5°C'
    },
  ];

  useEffect(() => {
    if (!selectedRoomId && MOCK_ROOMS.length > 0) {
      setSelectedRoomId(MOCK_ROOMS[0].id);
    }
  }, [selectedRoomId]);

  const currentRacks = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    id: `RACK-${(i + 1).toString().padStart(2, '0')}`,
    name: `机柜-${(i + 1).toString().padStart(2, '0')}`,
    status: (i === 1 || i === 6) ? 'alarm' : 'normal',
    temp: 22 + Math.floor(Math.random() * 8),
    power: 2.5 + Math.random() * 2,
    usage: 45 + Math.floor(Math.random() * 40),
    uCapacity: 42
  } as RackStatus)), [selectedRoomId]);

  const currentServers = useMemo(() => [
    { id: 'S1', name: '计算节点-A01', status: '在线', cpuLoad: 45, memLoad: 32, temp: 42, ip: '10.22.1.15', vlan: '100', uPos: 40, config: { cpu: 'Xeon 8380 x2', memory: '512GB ECC', disk: '2TB NVMe x4', bandwidth: '10Gbps', os: 'CentOS', model: 'Dell R750', power: '800W', cores: '80', frequency: '3.0 GHz', memType: 'DDR4', diskCount: '4', osVersion: '7.9.2009', kernel: '3.10.0-1160', arch: 'x86_64', hostname: 'node-a01-srv', mac: '00:15:5D:01:20:AF', gateway: '10.22.1.1', dns: '8.8.8.8', interface: 'eth0', uptime: '124天 15小时', processes: '245', load1m: '0.85', load5m: '0.72', created: '2023-05-12', updated: '2024-03-01' } },
    { id: 'S2', name: '存储节点-S12', status: '在线', cpuLoad: 12, memLoad: 88, temp: 38, ip: '10.22.1.88', vlan: '102', uPos: 36, config: { cpu: 'EPYC 7763 64C', memory: '1TB DDR4', disk: '16TB SAS x12', bandwidth: '25Gbps', os: 'Ubuntu', model: 'Inspur NF5280', power: '1200W', cores: '128', frequency: '2.45 GHz', memType: 'DDR4', diskCount: '12', osVersion: '22.04.3 LTS', kernel: '5.15.0-84', arch: 'x86_64', hostname: 'storage-s12-node', mac: '00:15:5D:05:44:BC', gateway: '10.22.1.1', dns: '114.114.114.114', interface: 'enp1s0', uptime: '45天 8小时', processes: '188', load1m: '1.20', load5m: '1.15', created: '2023-08-20', updated: '2024-03-01' } },
    { id: 'S3', name: '核心数据库-DB01', status: '告警', cpuLoad: 92, memLoad: 95, temp: 68, ip: '10.22.2.10', vlan: '110', uPos: 32, config: { cpu: 'Xeon 6330 x2', memory: '256GB ECC', disk: '960GB SSD x2', bandwidth: '10Gbps', os: 'RHEL', model: 'H3C UniServer', power: '750W', cores: '56', frequency: '2.0 GHz', memType: 'DDR4', diskCount: '2', osVersion: '8.4', kernel: '4.18.0-305', arch: 'x86_64', hostname: 'db-core-01', mac: '00:15:5D:0A:11:22', gateway: '10.22.2.1', dns: '1.1.1.1', interface: 'bond0', uptime: '312天 4小时', processes: '512', load1m: '8.45', load5m: '7.80', created: '2022-11-05', updated: '2024-03-01' } },
    { id: 'S4', name: '边缘网关-GW09', status: '在线', cpuLoad: 22, memLoad: 15, temp: 35, ip: '10.22.0.1', vlan: '1', uPos: 28, config: { cpu: 'Xeon E-2276G', memory: '64GB DDR4', disk: '480GB SSD', bandwidth: '40Gbps', os: 'Debian', model: 'Supermicro 1U', power: '350W', cores: '6', frequency: '3.8 GHz', memType: 'DDR4', diskCount: '1', osVersion: '11.7', kernel: '5.10.0-23', arch: 'x86_64', hostname: 'edge-gw-09', mac: '00:15:5D:FF:EE:DD', gateway: '10.22.0.254', dns: '8.8.4.4', interface: 'eth1', uptime: '12天 22小时', processes: '95', load1m: '0.15', load5m: '0.22', created: '2024-01-15', updated: '2024-03-01' } },
    { id: 'S5', name: '通用应用-APP04', status: '在线', cpuLoad: 65, memLoad: 42, temp: 45, ip: '10.22.3.45', vlan: '120', uPos: 24, config: { cpu: 'Xeon 4314', memory: '128GB ECC', disk: '1.2TB SAS x2', bandwidth: '1Gbps', os: 'CentOS', model: 'HPE DL380', power: '500W', cores: '16', frequency: '2.4 GHz', memType: 'DDR4', diskCount: '2', osVersion: '8.5.2111', kernel: '4.18.0-348', arch: 'x86_64', hostname: 'app-node-04', mac: '00:15:5D:33:44:55', gateway: '10.22.3.1', dns: '223.5.5.5', interface: 'eth0', uptime: '88天 2小时', processes: '156', load1m: '2.10', load5m: '1.95', created: '2023-10-10', updated: '2024-03-01' } },
    { id: 'S6', name: '离线备份-BK01', status: '离线', cpuLoad: 0, memLoad: 0, temp: 0, ip: '10.22.5.10', vlan: '150', uPos: 20, config: { cpu: 'i7-10700K', memory: '32GB', disk: '4TB HDD x4', bandwidth: '1Gbps', os: 'Windows', model: 'Custom Build', power: '450W', cores: '8', frequency: '3.8 GHz', memType: 'DDR4', diskCount: '4', osVersion: 'Server 2019', kernel: '10.0.17763', arch: 'x64', hostname: 'backup-srv-01', mac: '00:15:5D:99:88:77', gateway: '10.22.5.1', dns: '8.8.8.8', interface: 'Ethernet', uptime: '0', processes: '0', load1m: '0.00', load5m: '0.00', created: '2023-02-15', updated: '2024-03-01' } },
  ].map(s => ({
    ...s,
    cpuLoad: s.status === '在线' ? Math.max(0, Math.min(100, s.cpuLoad + Math.floor(Math.sin(tick) * 5))) : s.cpuLoad,
    memLoad: s.status === '在线' ? Math.max(0, Math.min(100, s.memLoad + Math.floor(Math.cos(tick) * 2))) : s.memLoad,
  }) as ServerStatus), [tick, selectedRackId]);

  const currentServer = useMemo(() => currentServers.find(s => s.id === selectedServerId), [selectedServerId, currentServers]);
  const currentRack = useMemo(() => currentRacks.find(r => r.id === selectedRackId), [selectedRackId, currentRacks]);
  const currentRoom = useMemo(() => MOCK_ROOMS.find(r => r.id === selectedRoomId), [selectedRoomId]);

  useEffect(() => {
    if (depth === ViewDepth.SERVERS && currentServers.length > 0) {
      const isCurrentServerValid = currentServers.some(s => s.id === selectedServerId);
      if (!selectedServerId || !isCurrentServerValid) {
        setSelectedServerId(currentServers[0].id);
      }
    }
  }, [depth, selectedRackId, currentServers, selectedServerId]);

  const handleBack = () => {
    if (depth === ViewDepth.SERVERS) { setDepth(ViewDepth.RACKS); setSelectedServerId(null); }
    else if (depth === ViewDepth.RACKS) { setDepth(ViewDepth.ROOMS); setSelectedRoomId(null); setSelectedRackId(null); }
  };

  const currentPath = useMemo(() => {
    const path = ['全域资产'];
    if (selectedRoomId) path.push(currentRoom?.name || selectedRoomId);
    if (selectedRackId) path.push(selectedRackId);
    return path;
  }, [selectedRoomId, selectedRackId, currentRoom]);

  const renderLeftPanel = () => {
    const depthLabels = ["全域房级", "机柜单元", "节点实例"];
    const currentLabel = depthLabels[depth];

    // 数据量模拟联动
    const stats = {
      processed: depth === ViewDepth.ROOMS ? '425.4 PB' : depth === ViewDepth.RACKS ? '12.8 TB' : '850.2 GB',
      realtime: depth === ViewDepth.ROOMS ? '12.8 Gbps' : depth === ViewDepth.RACKS ? '1.5 Gbps' : '450.2 Mbps',
      cpu: depth === ViewDepth.ROOMS ? 62 : depth === ViewDepth.RACKS ? currentRack?.usage || 45 : currentServer?.cpuLoad || 0,
      mem: depth === ViewDepth.ROOMS ? 45 : depth === ViewDepth.RACKS ? 52 : currentServer?.memLoad || 0,
      storage: 58,
      net: 24
    };

    return (
      <div className="flex flex-col gap-4 animate-in slide-in-from-left duration-500 h-full overflow-hidden">
        <ChartCard title={`${currentLabel} · 处理效能`} className="shrink-0">
           <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-sky-900/10 pb-4">
                 <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                       <Database size={10} className="text-sky-400" /> 累积处理量
                    </span>
                    <div className="flex items-baseline gap-1">
                       <span className="text-2xl font-orbitron font-bold text-white tracking-tighter">{stats.processed.split(' ')[0]}</span>
                       <span className="text-[9px] text-sky-600 font-bold uppercase">{stats.processed.split(' ')[1]}</span>
                    </div>
                 </div>
                 <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                       <Activity size={10} className="text-emerald-400" /> 实时吞吐
                    </span>
                    <div className="flex items-baseline gap-1">
                       <span className="text-xl font-orbitron font-bold text-emerald-400 tracking-tighter">{stats.realtime.split(' ')[0]}</span>
                       <span className="text-[9px] text-emerald-600/60 font-bold uppercase">{stats.realtime.split(' ')[1]}</span>
                    </div>
                 </div>
              </div>

              <div className="h-28">
                 <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-3">24H 处理速率趋势 (History)</p>
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={Array.from({length: 12}, (_, i) => ({ t: i, v: 40 + Math.random()*40 }))}>
                       <defs>
                          <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <Area type="monotone" dataKey="v" stroke="#38bdf8" fill="url(#flowGrad)" strokeWidth={2} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </ChartCard>

        <ChartCard title="计算资源负载矩阵" className="flex-1 overflow-hidden">
           <div className="h-full flex flex-col justify-center gap-6 py-2">
              <ResourceItem label="CPU 算力集群" value={stats.cpu} color="bg-sky-400" icon={<Cpu size={14}/>} />
              <ResourceItem label="内存交换空间" value={stats.mem} color="bg-indigo-500" icon={<Layers size={14}/>} />
              <ResourceItem label="存储 I/O 通道" value={stats.storage} color="bg-emerald-400" icon={<HardDrive size={14}/>} />
              <ResourceItem label="全双工网络带宽" value={stats.net} color="bg-amber-400" icon={<Network size={14}/>} />
           </div>
        </ChartCard>
      </div>
    );
  };

  const renderRightPanel = () => {
    if (depth === ViewDepth.ROOMS) {
      return (
        <div className="flex flex-col gap-4 animate-in slide-in-from-right duration-500 h-full overflow-hidden">
          <ChartCard title="全域态势告警中心" className="shrink-0">
             <div className="space-y-4">
                <div className="flex items-center justify-between mb-4 bg-rose-500/5 p-3 rounded-xl border border-rose-500/10">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                         <ShieldAlert size={20} />
                      </div>
                      <div>
                         <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">活跃异常</span>
                         <h4 className="text-xl font-orbitron font-bold text-white tracking-tighter">04 <span className="text-[9px] text-slate-600">UNRESOLVED</span></h4>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                         <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></div>
                         <span className="text-[8px] text-rose-500 font-bold uppercase tracking-widest">实时监控中</span>
                      </div>
                      <p className="text-[9px] text-slate-600 font-mono mt-1">SLA_GUARD_ON</p>
                   </div>
                </div>

                <div className="space-y-2.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                   <AlarmItem level="critical" time="15:24" text="IDC-CORE 机架温度异常 (42°C)" icon={<Flame size={10}/>} />
                   <AlarmItem level="warning" time="15:12" text="S3 数据库节点内存溢出风险" icon={<AlertCircle size={10}/>} />
                   <AlarmItem level="info" time="14:55" text="边缘节点 GW09 心跳同步延迟" icon={<Signal size={10}/>} />
                   <AlarmItem level="critical" time="14:30" text="非法 SSH 暴力破解拦截 (12次)" icon={<ShieldAlert size={10}/>} />
                </div>
             </div>
          </ChartCard>

          <ChartCard title="运维日志与可靠性" className="flex-1 overflow-hidden">
             <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-4 py-2">
                   <MaintenanceItem time="14:40" user="SYS" action="全链路校验" desc="对当前层级节点执行了自动化一致性校验。" />
                   <MaintenanceItem time="13:15" user="ADMIN" action="算力资源调优" desc="动态调整了 GPU 集群的作业分配权重。" />
                   <MaintenanceItem time="11:30" user="SYS" action="镜像补丁推送" desc="推送安全补丁 v2.4.1 至所有在线节点。" />
                   <MaintenanceItem time="09:20" user="TECH" action="物理巡检录入" desc="机柜散热风扇更换完毕，转速恢复正常。" />
                </div>
                <div className="mt-4 pt-4 border-t border-sky-900/10 flex justify-between items-center bg-sky-500/5 -mx-5 px-5 pb-1">
                   <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">硬件平均无故障评分</span>
                      <span className="text-lg font-orbitron font-bold text-sky-400">99.98<span className="text-[10px] ml-1 font-sans font-bold text-slate-600">SLA</span></span>
                   </div>
                   <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400 border border-sky-500/20">
                      <History size={16} />
                   </div>
                </div>
             </div>
          </ChartCard>
        </div>
      );
    }

    if (depth === ViewDepth.RACKS && currentRoom) {
      return (
        <div className="flex flex-col gap-4 animate-in slide-in-from-right duration-500 h-full overflow-hidden">
          <ChartCard title="机房实时统计" className="shrink-0">
            <div className="space-y-4">
              <div className="bg-sky-500/5 p-4 rounded-2xl border border-sky-500/10">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">机房总负载</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-orbitron font-bold text-sky-400">{currentRoom.load}%</span>
                  <span className="text-[10px] text-emerald-500 font-bold">↑ 2.4%</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <StatBox label="在线节点" value={currentRoom.nodes} unit="Units" icon={<Cpu size={14} />} />
                <StatBox label="机柜总数" value={currentRoom.racks} unit="Racks" icon={<Layers size={14} />} />
                <StatBox label="实时功耗" value="124.5" unit="kW" icon={<Zap size={14} />} />
                <StatBox label="平均温度" value="24.2" unit="°C" icon={<Thermometer size={14} />} />
              </div>
            </div>
          </ChartCard>
          <ChartCard title="机房资源分布" className="flex-1">
             <div className="h-full flex flex-col justify-center gap-6">
                <ResourceItem label="计算资源" value={currentRoom.load} color="bg-sky-400" icon={<Cpu size={14}/>} />
                <ResourceItem label="存储资源" value={58} color="bg-emerald-400" icon={<HardDrive size={14}/>} />
                <ResourceItem label="网络带宽" value={42} color="bg-amber-400" icon={<Network size={14}/>} />
             </div>
          </ChartCard>
        </div>
      );
    }

    if (depth === ViewDepth.SERVERS && currentServer) {
      return (
        <div className="flex flex-col gap-4 animate-in slide-in-from-right duration-500 h-full overflow-hidden">
          <ChartCard title="服务器信息" className="flex-1">
            <div className="space-y-4 py-2">
              <ConfigItem label="服务器类型" value="数据服务器" icon={<ServerIcon size={14} />} />
              <ConfigItem label="IP 地址" value={currentServer.ip} icon={<Globe size={14} />} />
              <ConfigItem label="机柜位置" value={`${selectedRackId} - ${currentServer.uPos}U`} icon={<Layers size={14} />} />
              <ConfigItem label="运行时间" value={currentServer.config.uptime} icon={<Clock size={14} />} />
              <ConfigItem label="创建日期" value={currentServer.config.created} icon={<Calendar size={14} />} />
              <ConfigItem label="最后更新日期" value={currentServer.config.updated} icon={<History size={14} />} />
            </div>
          </ChartCard>
          <ChartCard title="安全防护状态" className="shrink-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-300">防火墙状态</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase">Active</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-sky-500/5 rounded-lg border border-sky-500/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-sky-500" />
                  <span className="text-[10px] font-bold text-slate-300">入侵检测</span>
                </div>
                <span className="text-[10px] font-bold text-sky-500 uppercase">Enabled</span>
              </div>
            </div>
          </ChartCard>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-4 h-full animate-in fade-in duration-1000 overflow-hidden min-h-0">
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 relative">
        {depth === ViewDepth.ROOMS && (
          <div className="col-span-2 min-h-0">
            {renderLeftPanel()}
          </div>
        )}

        <div className={`${isMaximized ? 'fixed inset-0 z-[100] m-0 rounded-none bg-[#020617]' : depth === ViewDepth.ROOMS ? "col-span-8" : "col-span-10"} flex flex-col gap-4 min-h-0 relative transition-all duration-500`}>
          <div className={`glass-panel p-6 lg:p-8 flex-1 relative overflow-hidden flex flex-col bg-[#01040a] border-sky-900/30 shadow-[inset:0:0:100px:rgba(56,189,248,0.05)] ${isMaximized ? 'rounded-none' : 'rounded-[40px]'}`}>
            
            {/* Maximize Toggle */}
            <button 
              onClick={() => setIsMaximized(!isMaximized)}
              className="absolute top-6 right-8 z-50 p-2 bg-slate-800/50 hover:bg-sky-500/20 border border-sky-500/20 rounded-xl text-sky-400 transition-all"
              title={isMaximized ? "退出全屏" : "全屏查看"}
            >
              {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>

            {/* 背景科技装饰层 */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {/* 动态网格背景 */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_20%,transparent_100%)]"></div>
              
              {/* 扫描线效果 */}
              <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-sky-400/5 to-transparent animate-[scan_8s_ease-in-out_infinite]"></div>
              
              {/* 浮动粒子点阵 */}
              <div className="absolute inset-0 opacity-20">
                 {Array.from({length: 20}).map((_, i) => (
                   <div 
                    key={i} 
                    className="absolute w-1 h-1 bg-sky-400 rounded-full animate-pulse" 
                    style={{ 
                      top: `${Math.random() * 100}%`, 
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      opacity: Math.random() * 0.5 + 0.2
                    }}
                   ></div>
                 ))}
              </div>

              {/* HUD 边角装饰 */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-sky-500/20 rounded-tl-xl"></div>
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-sky-500/20 rounded-tr-xl"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-sky-500/20 rounded-bl-xl"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-sky-500/20 rounded-br-xl"></div>
            </div>

            <div className="flex items-center justify-between mb-6 z-10 shrink-0">
              <div className="flex items-center gap-4">
                {depth > 0 && (
                  <button onClick={handleBack} className="p-2.5 bg-sky-500/10 border border-sky-400/20 rounded-xl text-sky-400 hover:bg-sky-500/20 transition-all">
                    <ChevronLeft size={18} />
                  </button>
                )}
                <div className="flex items-center gap-2 text-[10px] font-bold font-orbitron tracking-widest uppercase">
                  {currentPath.map((p, i) => (
                    <React.Fragment key={p}>
                      <span className={i === currentPath.length - 1 ? "text-sky-400" : "text-slate-600"}>{p}</span>
                      {i < currentPath.length - 1 && <span className="text-slate-800 px-2">/</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-400/20 rounded-full text-[9px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2 mr-12">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                系统状态: 稳定
              </div>
            </div>

            <div className="flex-1 relative flex flex-col min-h-0 overflow-hidden z-10">
              {depth === ViewDepth.ROOMS && (
                <div className="flex-1 w-full grid grid-cols-3 gap-8 p-4 lg:p-8 animate-in zoom-in duration-700 overflow-y-auto custom-scrollbar">
                  {MOCK_ROOMS.map((room) => (
                    <div 
                      key={room.id}
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        setDepth(ViewDepth.RACKS);
                      }}
                      className="group relative flex flex-col bg-slate-900/40 rounded-[32px] border border-sky-900/20 overflow-hidden hover:border-sky-500/50 hover:bg-sky-500/5 transition-all duration-500 cursor-pointer shadow-2xl"
                    >
                      {/* 科幻缩略图可视化 */}
                      <div className="h-48 relative overflow-hidden bg-[#020617]">
                        <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                          <svg viewBox="0 0 400 200" className="w-full h-full">
                            <defs>
                              <pattern id={`grid-${room.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56,189,248,0.1)" strokeWidth="0.5" />
                              </pattern>
                              <radialGradient id={`glow-${room.id}`} cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                              </radialGradient>
                            </defs>
                            <rect width="100%" height="100%" fill={`url(#grid-${room.id})`} />
                            
                            {/* 动态核心环 */}
                            <g transform="translate(200, 100)">
                              <circle r="60" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="10 20" className="animate-[spin_20s_linear_infinite]" />
                              <circle r="50" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5 15" className="animate-[spin_15s_linear_infinite_reverse]" opacity="0.5" />
                              <circle r="40" fill={`url(#glow-${room.id})`} className="animate-pulse" />
                              
                              {/* 轨道粒子 */}
                              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                                <g key={i} transform={`rotate(${angle + tick * 10})`}>
                                  <circle cx="60" cy="0" r="2" fill="#38bdf8" className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                </g>
                              ))}
                            </g>

                            {/* 扫描线 */}
                            <line x1="0" y1="0" x2="400" y2="0" stroke="#38bdf8" strokeWidth="1" opacity="0.2" className="animate-[scan_4s_linear_infinite]" />
                          </svg>
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                        
                        {/* 实时状态浮窗 */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <div className="px-3 py-1 bg-sky-500/20 backdrop-blur-md border border-sky-500/30 rounded-full w-fit">
                            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2">
                              <MapPin size={12} /> {room.name.split('数据中心')[0]}
                            </span>
                          </div>
                          <div className="px-3 py-1 bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-full w-fit">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <Wifi size={10} /> {room.latency}
                            </span>
                          </div>
                        </div>

                        {/* 告警角标 */}
                        {room.alerts > 0 && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-rose-500/20 backdrop-blur-md border border-rose-500/30 rounded-full animate-pulse">
                            <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-2">
                              <ShieldAlert size={12} /> {room.alerts} ALERTS
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 基础数据 */}
                      <div className="p-6 flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">{room.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">{room.id}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                <Lock size={10} /> {room.security}
                              </span>
                            </div>
                          </div>
                          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{room.status}</span>
                          </div>
                        </div>

                        {/* 核心指标矩阵 */}
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                <Database size={10} className="text-sky-400" /> 数据总量
                              </span>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-orbitron font-bold text-white tracking-tighter">{room.dataVolume.split(' ')[0]}</span>
                                <span className="text-[10px] text-sky-600 font-bold uppercase">{room.dataVolume.split(' ')[1]}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                <Zap size={10} className="text-amber-400" /> 实时功耗
                              </span>
                              <div className="flex items-baseline gap-1">
                                <span className="text-xl font-orbitron font-bold text-white">{room.power.split(' ')[0]}</span>
                                <span className="text-[10px] text-slate-600 font-bold uppercase">{room.power.split(' ')[1]}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                <Layers size={10} className="text-indigo-400" /> 机柜单元
                              </span>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-orbitron font-bold text-white">{room.racks}</span>
                                <span className="text-[10px] text-slate-600 font-bold uppercase">Units</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                <Thermometer size={10} className="text-rose-400" /> 平均温控
                              </span>
                              <div className="flex items-baseline gap-1">
                                <span className="text-xl font-orbitron font-bold text-white">{room.temp.split('°')[0]}</span>
                                <span className="text-[10px] text-slate-600 font-bold uppercase">°C</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 扩展指标栏 */}
                        <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5">
                          <div className="flex flex-col items-center">
                            <span className="text-[8px] text-slate-600 font-bold uppercase">PUE 指数</span>
                            <span className="text-[11px] font-orbitron font-bold text-emerald-400">{room.pue}</span>
                          </div>
                          <div className="flex flex-col items-center border-x border-white/5">
                            <span className="text-[8px] text-slate-600 font-bold uppercase">可用性</span>
                            <span className="text-[11px] font-orbitron font-bold text-sky-400">{room.uptime}</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[8px] text-slate-600 font-bold uppercase">节点数</span>
                            <span className="text-[11px] font-orbitron font-bold text-white">{room.nodes}</span>
                          </div>
                        </div>

                        {/* 负载进度条 */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <span className="flex items-center gap-2"><Activity size={10} /> 算力负载</span>
                            <span className="text-sky-400">{room.load}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-[1px]">
                            <div 
                              className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all duration-1000" 
                              style={{ width: `${room.load}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* 悬浮进入提示 */}
                      <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                        <div className="flex items-center gap-2 text-sky-400 font-bold text-[10px] uppercase tracking-widest">
                          进入机房控制台 <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {depth === ViewDepth.RACKS && (
                <>
                  <div className="flex-1 w-full flex flex-col items-center justify-center animate-in zoom-in duration-700 min-h-0">
                    <div className="grid grid-cols-5 gap-x-12 gap-y-16 lg:gap-x-16 lg:gap-y-24 w-full px-6 lg:px-12">
                      {currentRacks.map((rack) => (
                        <div key={rack.id} className="flex justify-center">
                          <IsometricRack rack={rack} onClick={() => { setSelectedRackId(rack.id); setDepth(ViewDepth.SERVERS); }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <BottomSwitcher items={MOCK_ROOMS} selectedId={selectedRoomId} onSelect={setSelectedRoomId} type="room" />
                </>
              )}

              {depth === ViewDepth.SERVERS && (
                <>
                  <div className="flex-1 w-full flex gap-4 lg:gap-8 p-2 lg:p-4 animate-in zoom-in duration-700 min-h-0">
                    <div className="w-[280px] lg:w-[340px] bg-[#020617]/90 border-x-[6px] lg:border-x-[10px] border-[#1e293b] rounded-3xl p-4 lg:p-6 flex flex-col relative shadow-2xl min-h-0">
                       <div className="h-8 lg:h-10 bg-[#0f172a] border-b border-sky-900/40 flex items-center px-4 mb-3 lg:mb-4 rounded-t-xl">
                          <span className="text-[9px] lg:text-[10px] font-orbitron font-bold text-sky-500 tracking-widest uppercase truncate">{selectedRackId} 空间明细</span>
                       </div>
                       <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar pr-1">
                          {currentServers.map((s) => (
                            <ServerUnit key={s.id} server={s} isSelected={selectedServerId === s.id} onClick={() => setSelectedServerId(s.id)} />
                          ))}
                       </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-4 transition-all duration-700 opacity-100 translate-x-0 min-h-0">
                       {currentServer && (
                          <div className="glass-panel h-full rounded-[32px] lg:rounded-[40px] border-l-[4px] lg:border-l-[6px] border-sky-500 p-6 lg:p-8 flex flex-col shadow-2xl bg-[#080b14]/95 backdrop-blur-3xl overflow-hidden min-h-0">
                             <div className="flex justify-between items-start mb-6 lg:mb-8 shrink-0">
                                <div className="flex items-center gap-4 lg:gap-5">
                                   <div className="w-12 h-12 lg:w-14 lg:h-14 bg-sky-500/10 border border-sky-400/20 rounded-2xl flex items-center justify-center text-sky-400 glow-blue"> <ServerIcon size={24} /> </div>
                                   <div>
                                      <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight">{currentServer.name.split('-').pop()}</h3>
                                      <p className="text-[8px] lg:text-[9px] text-sky-500 font-bold uppercase tracking-[0.2em] opacity-80">{currentServer.config.model}</p>
                                   </div>
                                </div>

                                {/* Server Controls */}
                                <div className="flex items-center gap-2 lg:gap-3">
                                   <button 
                                     className={`group flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 ${currentServer.status === '在线' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'}`}
                                     title={currentServer.status === '在线' ? '关机' : '启动'}
                                   >
                                      <Power size={16} className="group-hover:scale-110 transition-transform" />
                                      <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">{currentServer.status === '在线' ? '关机' : '启动'}</span>
                                   </button>
                                   <button 
                                     className="group flex items-center gap-2 px-3 py-2 rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-all duration-300"
                                     title="重启"
                                   >
                                      <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                                      <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">重启</span>
                                   </button>
                                   <button 
                                     className="group flex items-center gap-2 px-3 py-2 rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-all duration-300"
                                     title="链接终端"
                                   >
                                      <Terminal size={16} className="group-hover:translate-x-1 transition-transform" />
                                      <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">终端</span>
                                   </button>
                                </div>
                             </div>
                             <div className="flex flex-col gap-4 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4 lg:pb-6 min-h-0">
                                <ServerDetailSection 
                                  title="显示配置" 
                                  icon={<Monitor size={14}/>}
                                  items={[
                                    { label: '核心数', value: currentServer.config.cores },
                                    { label: '型号', value: currentServer.config.cpu },
                                    { label: '主频', value: currentServer.config.frequency },
                                    { label: '使用率', value: `${currentServer.cpuLoad}%` }
                                  ]}
                                />
                                <ServerDetailSection 
                                  title="内存配置" 
                                  icon={<Layers size={14}/>}
                                  items={[
                                    { label: '核心数', value: 'N/A' },
                                    { label: '型号', value: currentServer.config.memory },
                                    { label: '类型', value: currentServer.config.memType },
                                    { label: '使用率', value: `${currentServer.memLoad}%` }
                                  ]}
                                />
                                <ServerDetailSection 
                                  title="磁盘配置" 
                                  icon={<HardDrive size={14}/>}
                                  items={[
                                    { label: '总容量', value: currentServer.config.disk },
                                    { label: '已使用', value: `${(parseFloat(currentServer.config.disk) * 0.65).toFixed(1)} TB` },
                                    { label: '主频', value: '7200 RPM' },
                                    { label: '磁盘数量', value: currentServer.config.diskCount },
                                    { label: '使用率', value: '65%' }
                                  ]}
                                />
                                <ServerDetailSection 
                                  title="网络带宽" 
                                  icon={<Network size={14}/>}
                                  items={[
                                    { label: '上传宽带', value: '450 Mbps' },
                                    { label: '下载宽带', value: '820 Mbps' },
                                    { label: '总宽带', value: currentServer.config.bandwidth }
                                  ]}
                                />
                                <ServerDetailSection 
                                  title="系统信息" 
                                  icon={<Settings size={14}/>}
                                  items={[
                                    { label: '操作系统', value: currentServer.config.os },
                                    { label: '系统版本', value: currentServer.config.osVersion },
                                    { label: '内核版本', value: currentServer.config.kernel },
                                    { label: '系统架构', value: currentServer.config.arch },
                                    { label: '主机名', value: currentServer.config.hostname }
                                  ]}
                                />
                                <ServerDetailSection 
                                  title="网络配置" 
                                  icon={<Globe size={14}/>}
                                  items={[
                                    { label: 'MAC地址', value: currentServer.config.mac },
                                    { label: '网关', value: currentServer.config.gateway },
                                    { label: 'DNS服务器', value: currentServer.config.dns },
                                    { label: '网络接口', value: currentServer.config.interface }
                                  ]}
                                />
                                <ServerDetailSection 
                                  title="运行信息" 
                                  icon={<Activity size={14}/>}
                                  items={[
                                    { label: '启动时间', value: currentServer.config.uptime },
                                    { label: '运行进程数', value: currentServer.config.processes },
                                    { label: '系统负载(1m)', value: currentServer.config.load1m },
                                    { label: '系统负载(5m)', value: currentServer.config.load5m }
                                  ]}
                                />
                                
                                <div className="col-span-2 pt-4 lg:pt-6 mt-2 lg:mt-4 border-t border-sky-900/30">
                                   <span className="text-[9px] lg:text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-3 mb-4 lg:mb-5">
                                      <Activity size={12} className="text-sky-500" /> 实时遥测
                                   </span>
                                   <div className="h-32 lg:h-40 w-full bg-black/40 rounded-2xl border border-sky-900/10 p-2 lg:p-3 shadow-inner">
                                      <ResponsiveContainer width="100%" height="100%">
                                         <BarChart data={Array.from({length: 15}, (_, i) => ({ t: i, v: 30 + Math.random()*50 }))}>
                                            <Bar dataKey="v" fill="#38bdf8" radius={[1, 1, 0, 0]} barSize={5} />
                                         </BarChart>
                                      </ResponsiveContainer>
                                   </div>
                                </div>
                             </div>
                          </div>
                       )}
                    </div>
                  </div>
                  <BottomSwitcher items={currentRacks} selectedId={selectedRackId} onSelect={setSelectedRackId} type="rack" />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-2 min-h-0">
          {renderRightPanel()}
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(400%); opacity: 0; }
        }
        @keyframes flow {
          0% { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

const StatBox = ({ label, value, unit, icon }: any) => (
  <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-sky-900/20 group hover:border-sky-500/30 transition-all">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-sky-500/10 rounded-lg text-sky-500 group-hover:bg-sky-500/20 transition-colors">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-sm font-orbitron font-bold text-white">{value}</span>
      <span className="text-[8px] text-slate-600 font-bold uppercase">{unit}</span>
    </div>
  </div>
);

const ConfigItem = ({ label, value, icon }: any) => (
  <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-sky-900/20 group hover:border-sky-500/30 transition-all">
    <div className="p-2 bg-sky-500/10 rounded-lg text-sky-500 group-hover:bg-sky-500/20 transition-colors">
      {icon}
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{label}</span>
      <span className="text-[10px] font-bold text-slate-200 truncate">{value}</span>
    </div>
  </div>
);

const BottomSwitcher = ({ items, selectedId, onSelect, type }: { items: any[], selectedId: string | null, onSelect: (id: string) => void, type: 'room' | 'rack' }) => (
  <div className="flex gap-4 overflow-x-auto py-4 px-2 custom-scrollbar shrink-0 border-t border-sky-900/20 bg-black/20">
    {items.map(item => (
      <div 
        key={item.id} 
        onClick={() => onSelect(item.id)}
        className={`min-w-[160px] p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3
          ${selectedId === item.id ? 'bg-sky-500/20 border-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.2)]' : 'bg-slate-900/40 border-sky-900/30 hover:border-sky-500/50'}
        `}
      >
        <div className={`p-2 rounded-lg ${selectedId === item.id ? 'bg-sky-500 text-white' : 'bg-sky-500/10 text-sky-500'}`}>
          {type === 'room' ? <Monitor size={16} /> : <Layers size={16} />}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-bold text-white truncate">{item.name}</span>
          <span className="text-[8px] text-slate-500 font-mono">{item.id}</span>
        </div>
      </div>
    ))}
  </div>
);

const ResourceItem = ({ label, value, color, icon }: any) => (
  <div className="space-y-1.5 group">
     <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
        <div className="flex items-center gap-2 group-hover:text-sky-400 transition-colors">
           {icon}
           <span>{label}</span>
        </div>
        <span className="text-slate-200 font-orbitron">{value}%</span>
     </div>
     <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner border border-white/5">
        <div className={`h-full ${color} transition-all duration-1000 shadow-[0_0:8px:currentColor]`} style={{ width: `${value}%` }}></div>
     </div>
  </div>
);

const DetailItem: React.FC<{ label: string, value: string, icon: React.ReactNode, color?: string }> = ({ label, value, icon, color = 'text-slate-200' }) => (
  <div className="flex items-center gap-3 lg:gap-4 bg-[#0f172a]/40 p-3 lg:p-4 rounded-2xl border border-sky-900/10 group hover:border-sky-500/30 transition-all">
    <div className="p-2 lg:p-3 bg-sky-500/10 rounded-xl text-sky-500 group-hover:bg-sky-500/20 transition-colors"> {icon} </div>
    <div className="flex flex-col min-w-0">
       <span className="text-[8px] lg:text-[9px] text-slate-500 font-bold uppercase tracking-widest">{label}</span>
       <span className={`text-[10px] lg:text-xs font-medium truncate ${color}`}>{value}</span>
    </div>
  </div>
);

const ServerDetailSection = ({ title, items, icon }: { title: string, items: { label: string, value: string }[], icon: React.ReactNode }) => (
  <div className="col-span-2 bg-sky-500/5 rounded-2xl border border-sky-500/10 p-4 mb-2">
    <div className="flex items-center gap-2 mb-3 border-b border-sky-500/10 pb-2">
      <div className="text-sky-400">{icon}</div>
      <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">{title}</span>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col gap-1">
          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{item.label}</span>
          <span className="text-[10px] text-slate-200 font-medium truncate">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const AlarmItem = ({ level, time, text, icon }: any) => {
   const colors = {
      critical: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      info: 'bg-sky-500/10 text-sky-500 border-sky-500/20'
   };
   return (
      <div className={`flex items-start gap-3 p-2.5 rounded-xl border ${colors[level]} group hover:brightness-125 transition-all`}>
         <div className="mt-1 shrink-0">{icon}</div>
         <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-0.5">
               <span className="text-[7px] font-mono font-bold uppercase opacity-60">{level}</span>
               <span className="text-[7px] font-mono opacity-50">{time}</span>
            </div>
            <p className="text-[10px] leading-tight font-bold tracking-tight truncate">{text}</p>
         </div>
      </div>
   );
};

const MaintenanceItem = ({ time, user, action, desc }: any) => (
  <div className="flex gap-4 group">
     <div className="flex flex-col items-center shrink-0">
        <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0:8px:#38bdf8] group-hover:scale-125 transition-transform"></div>
        <div className="flex-1 w-[1px] bg-sky-900/20 my-1"></div>
     </div>
     <div className="flex-1 pb-4">
        <div className="flex justify-between items-center mb-1">
           <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">{action}</span>
           <span className="text-[8px] font-mono text-slate-600">{time} | {user}</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic group-hover:text-slate-400 transition-colors truncate">
           {desc}
        </p>
     </div>
  </div>
);

export default ServerView;
