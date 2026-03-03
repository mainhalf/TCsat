
import React, { useState, useMemo, useEffect } from 'react';
import ChartCard from './ChartCard';
import GroundMap from './GroundMap';
import { 
  X, 
  Activity, 
  Wind, 
  Droplets, 
  Thermometer, 
  ShieldCheck, 
  Zap,
  TrendingUp,
  Clock,
  Database,
  Signal,
  AlertTriangle,
  MapPin,
  Battery,
  FlaskConical,
  Gauge,
  Cpu,
  Radio,
  Wifi,
  ArrowUpDown,
  Trophy,
  ListFilter,
  ChevronRight,
  Maximize2,
  Minimize2,
  Search,
  Info,
  ChevronDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  AreaChart,
  Area
} from 'recharts';

interface MonitoringStation {
  id: string;
  name: string;
  country: string;
  province: string;
  city: string;
  county: string;
  type: 'air' | 'water' | 'sound';
  coords: { x: number; y: number; lat: string; lng: string; };
  status: 'excellent' | 'good' | 'polluted' | 'critical';
  metrics: { 
    index: number; // AQI for air, WQI for water
    // Air specific
    pm25?: number; 
    pm10?: number; 
    co?: number;    
    co2?: number;   
    so2?: number;   
    no2?: number;   
    o3?: number;
    // Water specific
    ph?: number;
    do?: number;
    turbidity?: number;
    nh3n?: number;
    tp?: number;
    tn?: number;
    basin?: string;
    sectionName?: string;
    monitoringTime?: string;
    waterQualityCategory?: string;
    waterTemp?: number;
    conductivity?: number;
    permanganateIndex?: number;
    chlorophyllA?: number;
    algalDensity?: number;
    // Sound specific
    noise?: number;
    freq?: number;
    dbMax?: number;
    dbMin?: number;
  };
  deviceStatus: { 
    sensorHealth: number; 
    battery: number; 
    signal: number; 
    lastSync: string; 
    temp: number; 
    humi: number; 
    syncRate: number;
    load: number;
  };
}

const GroundNetworkView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false);
  const [menuLevel, setMenuLevel] = useState(0);
  const [tick, setTick] = useState(0);
  const [airSortOrder, setAirSortOrder] = useState<'asc' | 'desc'>('desc');
  const [waterSortOrder, setWaterSortOrder] = useState<'asc' | 'desc'>('desc');
  const [soundSortOrder, setSoundSortOrder] = useState<'asc' | 'desc'>('desc');
  const [rankingTab, setRankingTab] = useState<'air' | 'water' | 'sound'>('air');
  const [isLegendExpanded, setIsLegendExpanded] = useState(false);
  const [legendType, setLegendType] = useState<'air' | 'water' | 'sound'>('air');
  const [searchTerm, setSearchTerm] = useState('');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(timer);
  }, []);

  const STATIONS: MonitoringStation[] = useMemo(() => {
    const countries = [
      { 
        name: '中国', 
        provinces: [
          { name: '北京', id: 'BJ', lat: 39.9, lng: 116.4 },
          { name: '上海', id: 'SH', lat: 31.2, lng: 121.4 },
          { name: '广东', id: 'GD', lat: 23.1, lng: 113.2 },
        ]
      },
      { 
        name: '美国', 
        provinces: [
          { name: '纽约州', id: 'NY', lat: 40.7, lng: -74.0 },
          { name: '加利福尼亚', id: 'CA', lat: 34.0, lng: -118.2 },
        ]
      },
      { 
        name: '日本', 
        provinces: [
          { name: '东京都', id: 'TYO', lat: 35.7, lng: 139.7 },
        ]
      },
      { 
        name: '英国', 
        provinces: [
          { name: '大伦敦', id: 'LDN', lat: 51.5, lng: -0.1 },
        ]
      }
    ];

    const generated: MonitoringStation[] = [];
    countries.forEach(c => {
      c.provinces.forEach(p => {
        const cities = [
          { name: '中心城区', offset: [0, 0], counties: ['一号县', '二号县'] },
          { name: '北部新区', offset: [0, 0.8], counties: ['三号县', '四号县'] },
          { name: '南部工业区', offset: [0, -0.8], counties: ['五号县', '六号县'] },
          { name: '东部开发区', offset: [0.8, 0], counties: ['七号县', '八号县'] },
        ];

        // Generate Air Stations
        for (let i = 0; i < 6; i++) {
          const cityIndex = Math.floor(i / 1.5);
          const city = cities[cityIndex % 4];
          const county = city.counties[i % 2];
          const index = Math.floor(20 + Math.random() * 230);
          const status = index < 50 ? 'excellent' : index < 100 ? 'good' : index < 200 ? 'polluted' : 'critical';
          generated.push({
            id: `AIR-${p.id}-${i}`,
            name: `${c.name}${p.name}${city.name}${county}空气站 #${i + 1}`,
            country: c.name,
            province: p.name,
            city: city.name,
            county: county,
            type: 'air',
            coords: { 
              x: 0, y: 0, 
              lat: (p.lat + city.offset[1] + (Math.random() - 0.5) * 0.4).toFixed(2) + (p.lat > 0 ? 'N' : 'S'),
              lng: (p.lng + city.offset[0] + (Math.random() - 0.5) * 0.4).toFixed(2) + (p.lng > 0 ? 'E' : 'W')
            },
            status,
            metrics: { 
              index, 
              pm25: Math.floor(index * 0.7), 
              pm10: Math.floor(index * 1.2), 
              co: Number((0.2 + Math.random() * 1.5).toFixed(1)), 
              co2: 380 + Math.floor(Math.random() * 100), 
              so2: 5 + Math.floor(Math.random() * 30), 
              no2: 10 + Math.floor(Math.random() * 60), 
              o3: 20 + Math.floor(Math.random() * 180) 
            },
            deviceStatus: { 
              sensorHealth: 85 + Math.floor(Math.random() * 15), 
              battery: 30 + Math.floor(Math.random() * 70), 
              signal: 70 + Math.floor(Math.random() * 30), 
              lastSync: Math.floor(Math.random() * 60) + 's前', 
              temp: Math.floor(Math.random() * 35), 
              humi: 20 + Math.floor(Math.random() * 60), 
              syncRate: 90 + Math.random() * 10, 
              load: 20 + Math.floor(Math.random() * 70) 
            }
          });
        }

        // Generate Water Stations
        for (let i = 0; i < 6; i++) {
          const cityIndex = Math.floor(i / 1.5);
          const city = cities[cityIndex % 4];
          const county = city.counties[i % 2];
          const index = Math.floor(20 + Math.random() * 100);
          const status = index > 80 ? 'excellent' : index > 60 ? 'good' : index > 40 ? 'polluted' : 'critical';
          generated.push({
            id: `WATER-${p.id}-${i}`,
            name: `${c.name}${p.name}${city.name}${county}水质站 #${i + 1}`,
            country: c.name,
            province: p.name,
            city: city.name,
            county: county,
            type: 'water',
            coords: { 
              x: 0, y: 0, 
              lat: (p.lat + city.offset[1] + (Math.random() - 0.5) * 0.4).toFixed(2) + (p.lat > 0 ? 'N' : 'S'),
              lng: (p.lng + city.offset[0] + (Math.random() - 0.5) * 0.4).toFixed(2) + (p.lng > 0 ? 'E' : 'W')
            },
            status,
            metrics: { 
              index, 
              ph: Number((6.5 + Math.random() * 2).toFixed(1)),
              do: Number((4 + Math.random() * 6).toFixed(1)),
              turbidity: Number((1 + Math.random() * 10).toFixed(1)),
              nh3n: Number((0.1 + Math.random() * 2).toFixed(2)),
              tp: Number((0.02 + Math.random() * 0.5).toFixed(2)),
              tn: Number((0.5 + Math.random() * 5).toFixed(2)),
              basin: ['长江流域', '黄河流域', '珠江流域', '淮河流域'][Math.floor(Math.random() * 4)],
              sectionName: `${p.name}${city.name}断面`,
              monitoringTime: new Date().toISOString().split('T')[0],
              waterQualityCategory: ['Ⅰ类', 'Ⅱ类', 'Ⅲ类', 'Ⅳ类', 'Ⅴ类'][Math.floor(Math.random() * 5)],
              waterTemp: Number((15 + Math.random() * 10).toFixed(1)),
              conductivity: Math.floor(200 + Math.random() * 800),
              permanganateIndex: Number((1 + Math.random() * 5).toFixed(1)),
              chlorophyllA: Number((0.001 + Math.random() * 0.05).toFixed(3)),
              algalDensity: Math.floor(1000 + Math.random() * 9000),
            },
            deviceStatus: { 
              sensorHealth: 85 + Math.floor(Math.random() * 15), 
              battery: 30 + Math.floor(Math.random() * 70), 
              signal: 70 + Math.floor(Math.random() * 30), 
              lastSync: Math.floor(Math.random() * 60) + 's前', 
              temp: 15 + Math.floor(Math.random() * 10),
              humi: 80 + Math.floor(Math.random() * 20), 
              syncRate: 90 + Math.random() * 10, 
              load: 20 + Math.floor(Math.random() * 70) 
            }
          });
        }

        // Generate Sound Stations
        for (let i = 0; i < 6; i++) {
          const cityIndex = Math.floor(i / 1.5);
          const city = cities[cityIndex % 4];
          const county = city.counties[i % 2];
          const index = Math.floor(30 + Math.random() * 60);
          const status = index < 55 ? 'excellent' : index < 70 ? 'good' : index < 85 ? 'polluted' : 'critical';
          generated.push({
            id: `SOUND-${p.id}-${i}`,
            name: `${c.name}${p.name}${city.name}${county}声环站 #${i + 1}`,
            country: c.name,
            province: p.name,
            city: city.name,
            county: county,
            type: 'sound',
            coords: { 
              x: 0, y: 0, 
              lat: (p.lat + city.offset[1] + (Math.random() - 0.5) * 0.4).toFixed(2) + (p.lat > 0 ? 'N' : 'S'),
              lng: (p.lng + city.offset[0] + (Math.random() - 0.5) * 0.4).toFixed(2) + (p.lng > 0 ? 'E' : 'W')
            },
            status,
            metrics: { 
              index, 
              noise: index,
              freq: 50 + Math.floor(Math.random() * 450),
              dbMax: index + Math.floor(Math.random() * 15),
              dbMin: Math.max(20, index - Math.floor(Math.random() * 10)),
            },
            deviceStatus: { 
              sensorHealth: 85 + Math.floor(Math.random() * 15), 
              battery: 30 + Math.floor(Math.random() * 70), 
              signal: 70 + Math.floor(Math.random() * 30), 
              lastSync: Math.floor(Math.random() * 60) + 's前', 
              temp: 15 + Math.floor(Math.random() * 15),
              humi: 40 + Math.floor(Math.random() * 40), 
              syncRate: 90 + Math.random() * 10, 
              load: 10 + Math.floor(Math.random() * 40) 
            }
          });
        }
      });
    });
    return generated;
  }, []);

  const airRankings = useMemo(() => {
    return STATIONS.filter(s => s.type === 'air')
      .sort((a, b) => airSortOrder === 'desc' ? b.metrics.index - a.metrics.index : a.metrics.index - b.metrics.index)
      .slice(0, 20);
  }, [STATIONS, airSortOrder]);

  const waterRankings = useMemo(() => {
    return STATIONS.filter(s => s.type === 'water')
      .sort((a, b) => waterSortOrder === 'desc' ? b.metrics.index - a.metrics.index : a.metrics.index - b.metrics.index)
      .slice(0, 20);
  }, [STATIONS, waterSortOrder]);

  const soundRankings = useMemo(() => {
    return STATIONS.filter(s => s.type === 'sound')
      .sort((a, b) => soundSortOrder === 'desc' ? b.metrics.index - a.metrics.index : a.metrics.index - b.metrics.index)
      .slice(0, 20);
  }, [STATIONS, soundSortOrder]);

  const activeStation = useMemo(() => {
    if (!selectedId) return STATIONS[0];
    return STATIONS.find(s => s.id === selectedId) || STATIONS[0];
  }, [selectedId, STATIONS]);

  const countries = useMemo(() => {
    return Array.from(new Set(STATIONS.map(s => s.country))).sort();
  }, [STATIONS]);

  const provinces = useMemo(() => {
    return Array.from(new Set(STATIONS.filter(s => !selectedCountry || s.country === selectedCountry).map(s => s.province))).sort();
  }, [STATIONS, selectedCountry]);

  const cities = useMemo(() => {
    return Array.from(new Set(STATIONS.filter(s => 
      (!selectedCountry || s.country === selectedCountry) && 
      (!selectedProvince || s.province === selectedProvince)
    ).map(s => s.city))).sort();
  }, [STATIONS, selectedCountry, selectedProvince]);

  const counties = useMemo(() => {
    return Array.from(new Set(STATIONS.filter(s => 
      (!selectedCountry || s.country === selectedCountry) && 
      (!selectedProvince || s.province === selectedProvince) &&
      (!selectedCity || s.city === selectedCity)
    ).map(s => s.county))).sort();
  }, [STATIONS, selectedCountry, selectedProvince, selectedCity]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return STATIONS.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.county.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [STATIONS, searchTerm]);
  
  const getLegendItems = (type: 'air' | 'water' | 'sound') => {
    if (type === 'air') return [
      { label: '优 (Excellent)', range: '0 - 50 AQI', color: 'text-emerald-500' },
      { label: '良 (Good)', range: '51 - 100 AQI', color: 'text-sky-500' },
      { label: '轻度污染 (Polluted)', range: '101 - 200 AQI', color: 'text-amber-500' },
      { label: '重度污染 (Critical)', range: '> 200 AQI', color: 'text-rose-500' },
    ];
    if (type === 'water') return [
      { label: '优 (Excellent)', range: '> 80 WQI', color: 'text-emerald-500' },
      { label: '良 (Good)', range: '61 - 80 WQI', color: 'text-sky-500' },
      { label: '轻度污染 (Polluted)', range: '41 - 60 WQI', color: 'text-amber-500' },
      { label: '重度污染 (Critical)', range: '< 40 WQI', color: 'text-rose-500' },
    ];
    return [
      { label: '舒适 (Quiet)', range: '< 55 dB', color: 'text-emerald-500' },
      { label: '正常 (Moderate)', range: '55 - 70 dB', color: 'text-sky-500' },
      { label: '吵闹 (Noisy)', range: '71 - 85 dB', color: 'text-amber-500' },
      { label: '极度吵闹 (Extreme)', range: '> 85 dB', color: 'text-rose-500' },
    ];
  };

  const pollutantRadarData = useMemo(() => {
    if (activeStation.type === 'air') {
      return [
        { subject: 'PM2.5', A: activeStation.metrics.pm25 || 0, fullMark: 150 },
        { subject: 'PM10', A: (activeStation.metrics.pm10 || 0) / 2, fullMark: 150 },
        { subject: 'SO2', A: (activeStation.metrics.so2 || 0) * 5, fullMark: 150 },
        { subject: 'NO2', A: (activeStation.metrics.no2 || 0) * 2, fullMark: 150 },
        { subject: 'O3', A: activeStation.metrics.o3 || 0, fullMark: 150 },
        { subject: 'CO', A: (activeStation.metrics.co || 0) * 50, fullMark: 150 },
      ];
    } else if (activeStation.type === 'water') {
      return [
        { subject: 'pH', A: (activeStation.metrics.ph || 0) * 15, fullMark: 150 },
        { subject: '溶解氧', A: (activeStation.metrics.do || 0) * 15, fullMark: 150 },
        { subject: '浊度', A: (activeStation.metrics.turbidity || 0) * 10, fullMark: 150 },
        { subject: '氨氮', A: (activeStation.metrics.nh3n || 0) * 50, fullMark: 150 },
        { subject: '总磷', A: (activeStation.metrics.tp || 0) * 200, fullMark: 150 },
        { subject: '总氮', A: (activeStation.metrics.tn || 0) * 20, fullMark: 150 },
      ];
    } else {
      return [
        { subject: '实时分贝', A: (activeStation.metrics.noise || 0) * 1.5, fullMark: 150 },
        { subject: '峰值分贝', A: (activeStation.metrics.dbMax || 0) * 1.2, fullMark: 150 },
        { subject: '平均频率', A: (activeStation.metrics.freq || 0) / 3, fullMark: 150 },
        { subject: '低频分量', A: 80, fullMark: 150 },
        { subject: '高频分量', A: 60, fullMark: 150 },
        { subject: '环境底噪', A: (activeStation.metrics.dbMin || 0) * 2, fullMark: 150 },
      ];
    }
  }, [activeStation]);

  return (
    <div className="flex flex-col h-full gap-4 relative overflow-hidden">
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
        
        {/* 左侧看板：污染物雷达 + (监测指数 & 环境参数) */}
        <div className="col-span-2 flex flex-col gap-4 min-h-0">
          <ChartCard title={activeStation.type === 'air' ? "大气污染物特征" : activeStation.type === 'water' ? "水质特征维度" : "声环境特征分析"} className="h-[240px] lg:h-[280px] shrink-0">
             <div className="h-full flex flex-col">
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={pollutantRadarData}>
                           <PolarGrid stroke="#1e293b" />
                           <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} />
                           <Radar name="指标" dataKey="A" stroke={activeStation.type === 'air' ? "#38bdf8" : activeStation.type === 'water' ? "#10b981" : "#f59e0b"} fill={activeStation.type === 'air' ? "#38bdf8" : activeStation.type === 'water' ? "#10b981" : "#f59e0b"} fillOpacity={0.4} />
                        </RadarChart>
                     </ResponsiveContainer>
                 </div>
                 <p className="text-[8px] text-center text-slate-600 font-bold uppercase tracking-widest mt-1">
                   {activeStation.type === 'air' ? "Air Quality Profile" : activeStation.type === 'water' ? "Water Quality Profile" : "Acoustic Environment Profile"}
                 </p>
             </div>
          </ChartCard>

          <ChartCard title={`${activeStation.name} · 实时监测`} className="flex-1 overflow-hidden">
             <div className="flex flex-col h-full">
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-sky-900/20 shrink-0">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        {activeStation.type === 'air' ? "AQI 指数" : activeStation.type === 'water' ? "WQI 水质指数" : "噪声分贝 (dB)"}
                      </span>
                      <span className={`px-2.5 py-0.5 mt-2 rounded-full text-[8px] font-bold uppercase tracking-widest border w-fit ${activeStation.status === 'excellent' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : activeStation.status === 'polluted' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-sky-500/20 text-sky-400 border-sky-500/30'}`}>
                        {activeStation.status === 'excellent' ? '状态: 优' : activeStation.status === 'good' ? '状态: 良' : '状态: 污染'}
                      </span>
                   </div>
                   <span className={`text-4xl font-orbitron font-bold drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] ${activeStation.type === 'air' ? 'text-sky-400' : activeStation.type === 'water' ? 'text-emerald-400' : 'text-amber-400'}`}>
                     {activeStation.metrics.index}
                   </span>
                </div>

                <div className="grid grid-cols-2 gap-3 overflow-y-auto custom-scrollbar pr-1 pb-4">
                   {activeStation.type === 'air' ? (
                     <>
                       <EnvMetric icon={<Activity size={16}/>} label="PM2.5 浓度" value={activeStation.metrics.pm25?.toString()} unit="μg/m³" color="text-sky-400" />
                       <EnvMetric icon={<Activity size={16}/>} label="PM10 颗粒物" value={activeStation.metrics.pm10?.toString()} unit="μg/m³" color="text-indigo-400" />
                       <EnvMetric icon={<FlaskConical size={16}/>} label="CO 浓度" value={activeStation.metrics.co?.toString()} unit="mg/m³" color="text-emerald-400" />
                       <EnvMetric icon={<FlaskConical size={16}/>} label="CO2 二氧化碳" value={activeStation.metrics.co2?.toString()} unit="ppm" color="text-amber-400" />
                       <EnvMetric icon={<FlaskConical size={16}/>} label="SO2 二氧化硫" value={activeStation.metrics.so2?.toString()} unit="μg/m³" color="text-rose-400" />
                       <EnvMetric icon={<FlaskConical size={16}/>} label="NO2 二氧化氮" value={activeStation.metrics.no2?.toString()} unit="μg/m³" color="text-cyan-400" />
                       <EnvMetric icon={<FlaskConical size={16}/>} label="O3 臭氧" value={activeStation.metrics.o3?.toString()} unit="μg/m³" color="text-purple-400" />
                       <EnvMetric icon={<Thermometer size={16}/>} label="环境温度" value={activeStation.deviceStatus.temp.toString()} unit="°C" color="text-sky-400" />
                     </>
                   ) : activeStation.type === 'water' ? (
                     <>
                       <EnvMetric icon={<MapPin size={16}/>} label="国家" value={activeStation.country} unit="" color="text-sky-400" />
                       <EnvMetric icon={<MapPin size={16}/>} label="省份" value={activeStation.province} unit="" color="text-sky-400" />
                       <EnvMetric icon={<Wind size={16}/>} label="流域" value={activeStation.metrics.basin} unit="" color="text-indigo-400" />
                       <EnvMetric icon={<Activity size={16}/>} label="断面名称" value={activeStation.metrics.sectionName} unit="" color="text-emerald-400" />
                       <EnvMetric icon={<Clock size={16}/>} label="监测时间" value={activeStation.metrics.monitoringTime} unit="" color="text-amber-400" />
                       <EnvMetric icon={<ShieldCheck size={16}/>} label="水质类别" value={activeStation.metrics.waterQualityCategory} unit="" color="text-rose-400" />
                       <EnvMetric icon={<Thermometer size={16}/>} label="水温" value={activeStation.metrics.waterTemp?.toString()} unit="℃" color="text-sky-400" />
                       <EnvMetric icon={<Droplets size={16}/>} label="PH" value={activeStation.metrics.ph?.toString()} unit="" color="text-indigo-400" />
                       <EnvMetric icon={<Zap size={16}/>} label="溶解氧" value={activeStation.metrics.do?.toString()} unit="mg/L" color="text-emerald-400" />
                       <EnvMetric icon={<Activity size={16}/>} label="电导率" value={activeStation.metrics.conductivity?.toString()} unit="μS/cm" color="text-amber-400" />
                       <EnvMetric icon={<Wind size={16}/>} label="浊度" value={activeStation.metrics.turbidity?.toString()} unit="NTU" color="text-rose-400" />
                       <EnvMetric icon={<FlaskConical size={16}/>} label="高锰酸钾盐指数" value={activeStation.metrics.permanganateIndex?.toString()} unit="mg/L" color="text-cyan-400" />
                       <EnvMetric icon={<FlaskConical size={16}/>} label="氨氮" value={activeStation.metrics.nh3n?.toString()} unit="mg/L" color="text-purple-400" />
                       <EnvMetric icon={<FlaskConical size={16}/>} label="总磷" value={activeStation.metrics.tp?.toString()} unit="mg/L" color="text-sky-400" />
                       <EnvMetric icon={<FlaskConical size={16}/>} label="总氮" value={activeStation.metrics.tn?.toString()} unit="mg/L" color="text-indigo-400" />
                       <EnvMetric icon={<FlaskConical size={16}/>} label="叶绿素α" value={activeStation.metrics.chlorophyllA?.toString()} unit="mg/L" color="text-emerald-400" />
                       <EnvMetric icon={<Activity size={16}/>} label="藻密度" value={activeStation.metrics.algalDensity?.toString()} unit="cells/L" color="text-amber-400" />
                     </>
                   ) : (
                     <>
                       <EnvMetric icon={<Radio size={16}/>} label="实时声级" value={activeStation.metrics.noise?.toString()} unit="dB" color="text-amber-400" />
                       <EnvMetric icon={<Activity size={16}/>} label="主导频率" value={activeStation.metrics.freq?.toString()} unit="Hz" color="text-sky-400" />
                       <EnvMetric icon={<TrendingUp size={16}/>} label="峰值声压" value={activeStation.metrics.dbMax?.toString()} unit="dB" color="text-rose-400" />
                       <EnvMetric icon={<Clock size={16}/>} label="底噪水平" value={activeStation.metrics.dbMin?.toString()} unit="dB" color="text-slate-400" />
                       <EnvMetric icon={<Thermometer size={16}/>} label="环境温度" value={activeStation.deviceStatus.temp.toString()} unit="°C" color="text-sky-400" />
                       <EnvMetric icon={<Droplets size={16}/>} label="环境湿度" value={activeStation.deviceStatus.humi.toString()} unit="%" color="text-indigo-400" />
                       <EnvMetric icon={<Cpu size={16}/>} label="计算负载" value={activeStation.deviceStatus.load.toString()} unit="%" color="text-emerald-400" />
                       <EnvMetric icon={<Wifi size={16}/>} label="信号强度" value={activeStation.deviceStatus.signal.toString()} unit="%" color="text-sky-400" />
                     </>
                   )}
                </div>
             </div>
          </ChartCard>
        </div>

        {/* 中间地图 */}
        <div className={`relative flex flex-col overflow-hidden transition-all duration-500 ${isMaximized ? 'fixed inset-0 z-[999] w-screen h-screen top-0 left-0 m-0 bg-[#020617]' : 'col-span-8 bg-[#01040a] rounded-[40px] border border-sky-900/20 shadow-[inset_0_0_100px_rgba(56,189,248,0.05)]'}`}>
           
           {/* Maximize Toggle */}
           <button 
             onClick={() => setIsMaximized(!isMaximized)}
             className="absolute top-6 right-8 z-[1000] p-2 bg-slate-800/50 hover:bg-sky-500/20 border border-sky-500/20 rounded-xl text-sky-400 transition-all"
             title={isMaximized ? "退出全屏" : "全屏查看"}
           >
             {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
           </button>

           <div className="flex-1 relative flex items-center justify-center">
              <div className="absolute w-[80%] h-[80%] border border-sky-500/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
              
              <GroundMap 
                stations={STATIONS} 
                selectedId={selectedId} 
                                 onStationClick={(id) => {
                    const s = STATIONS.find(st => st.id === id);
                    if (s) {
                        setSelectedId(id);
                        setSelectedCountry(s.country);
                        setSelectedProvince(s.province);
                        setSelectedCity(s.city);
                        setSelectedCounty(s.county);
                        setIsInfoModalOpen(true);
                    }
                 }} 
                 selectedCountry={selectedCountry}
                 selectedProvince={selectedProvince}
                 selectedCity={selectedCity} 
                 selectedCounty={selectedCounty}
              />
           </div>

           {/* Bottom-Left Controls: Region Selection & Search */}
           <div className="absolute bottom-8 left-8 z-20 flex items-center gap-3 pointer-events-auto">
              {/* Region Selector Cascader */}
              <div className="relative">
                <button 
                  onClick={() => setIsRegionMenuOpen(!isRegionMenuOpen)}
                  className={`glass-panel rounded-xl border p-2.5 bg-[#020617]/80 backdrop-blur-md shadow-2xl flex items-center gap-2 min-w-[120px] transition-all ${isRegionMenuOpen ? 'border-sky-400 ring-1 ring-sky-400/30' : 'border-sky-500/30 hover:border-sky-500/50'}`}
                >
                  <MapPin size={14} className="text-sky-400" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest truncate max-w-[80px]">
                    {selectedCounty || selectedCity || selectedProvince || selectedCountry || '区域选择'}
                  </span>
                  <ChevronDown size={12} className={`text-sky-400/50 transition-transform ${isRegionMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isRegionMenuOpen && (
                  <div className="absolute bottom-full mb-3 left-0 w-64 glass-panel rounded-2xl border border-sky-500/30 bg-[#020617]/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
                    {/* Menu Header */}
                    <div className="p-3 border-b border-sky-500/20 flex items-center justify-between bg-sky-500/5">
                      <div className="flex items-center gap-2">
                        {menuLevel > 0 && (
                          <button 
                            onClick={() => setMenuLevel(prev => prev - 1)}
                            className="p-1 hover:bg-white/10 rounded text-sky-400"
                          >
                            <ChevronRight size={14} className="rotate-180" />
                          </button>
                        )}
                        <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">
                          {menuLevel === 0 ? '选择国家' : menuLevel === 1 ? '选择省份' : menuLevel === 2 ? '选择城市' : '选择区县'}
                        </span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedCountry(null);
                          setSelectedProvince(null);
                          setSelectedCity(null);
                          setSelectedCounty(null);
                          setSelectedId(null);
                          setMenuLevel(0);
                          setIsRegionMenuOpen(false);
                        }}
                        className="text-[8px] font-bold text-slate-500 hover:text-sky-400 uppercase tracking-widest transition-colors"
                      >
                        重置
                      </button>
                    </div>

                    {/* Menu Options */}
                    <div className="max-h-64 overflow-y-auto custom-scrollbar p-1">
                      {menuLevel === 0 && countries.map(c => (
                        <button
                          key={c}
                          onClick={() => {
                            setSelectedCountry(c);
                            setSelectedProvince(null);
                            setSelectedCity(null);
                            setSelectedCounty(null);
                            setMenuLevel(1);
                          }}
                          className={`w-full p-2.5 flex items-center justify-between rounded-lg transition-all hover:bg-sky-500/10 text-left group ${selectedCountry === c ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400'}`}
                        >
                          <span className="text-[10px] font-bold">{c}</span>
                          <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}

                      {menuLevel === 1 && provinces.map(p => (
                        <button
                          key={p}
                          onClick={() => {
                            setSelectedProvince(p);
                            setSelectedCity(null);
                            setSelectedCounty(null);
                            setMenuLevel(2);
                          }}
                          className={`w-full p-2.5 flex items-center justify-between rounded-lg transition-all hover:bg-sky-500/10 text-left group ${selectedProvince === p ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400'}`}
                        >
                          <span className="text-[10px] font-bold">{p}</span>
                          <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}

                      {menuLevel === 2 && cities.map(c => (
                        <button
                          key={c}
                          onClick={() => {
                            setSelectedCity(c);
                            setSelectedCounty(null);
                            setMenuLevel(3);
                          }}
                          className={`w-full p-2.5 flex items-center justify-between rounded-lg transition-all hover:bg-sky-500/10 text-left group ${selectedCity === c ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400'}`}
                        >
                          <span className="text-[10px] font-bold">{c}</span>
                          <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}

                      {menuLevel === 3 && counties.map(c => (
                        <button
                          key={c}
                          onClick={() => {
                            setSelectedCounty(c);
                            setIsRegionMenuOpen(false);
                          }}
                          className={`w-full p-2.5 flex items-center justify-between rounded-lg transition-all hover:bg-sky-500/10 text-left group ${selectedCounty === c ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400'}`}
                        >
                          <span className="text-[10px] font-bold">{c}</span>
                          <ShieldCheck size={12} className="opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative group w-64">
                <div className="glass-panel rounded-xl border border-sky-500/30 p-2.5 flex items-center gap-2 bg-[#020617]/80 backdrop-blur-md shadow-2xl transition-all group-focus-within:border-sky-400">
                  <Search size={16} className="text-sky-400 ml-1" />
                  <input 
                    type="text" 
                    placeholder="搜索站点名称..." 
                    className="bg-transparent border-none outline-none text-xs text-white w-full placeholder:text-slate-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute bottom-full mb-2 left-0 w-full glass-panel rounded-xl border border-sky-500/30 bg-[#020617]/95 backdrop-blur-xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
                    <div className="p-2 border-b border-sky-500/10 bg-sky-500/5">
                      <span className="text-[8px] font-bold text-sky-400 uppercase tracking-widest">搜索结果</span>
                    </div>
                    {searchResults.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedId(s.id);
                          setSelectedCountry(s.country);
                          setSelectedProvince(s.province);
                          setSelectedCity(s.city);
                          setSelectedCounty(s.county);
                          setSearchTerm('');
                        }}
                        className="w-full p-2.5 flex items-center gap-3 hover:bg-sky-500/10 transition-colors border-b border-sky-500/5 last:border-0 text-left"
                      >
                        <div className={`w-2 h-2 rounded-full ${s.type === 'air' ? 'bg-sky-400' : s.type === 'water' ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] text-white font-bold truncate">{s.name}</span>
                          <span className="text-[8px] text-slate-500">{s.country} · {s.province} · {s.city} · {s.county}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
           </div>

           {/* Station Info Modal Overlay */}
           {isInfoModalOpen && activeStation && (
             <div className="absolute inset-0 z-[1100] flex items-center justify-center p-8 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
               <div className="w-full max-w-2xl glass-panel rounded-[32px] border border-sky-500/30 bg-[#020617]/95 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300">
                 {/* Modal Header */}
                 <div className="p-6 border-b border-sky-500/20 flex justify-between items-start bg-gradient-to-r from-sky-500/10 to-transparent">
                   <div className="flex gap-4 items-center">
                     <div className={`p-3 rounded-2xl ${activeStation.type === 'air' ? 'bg-sky-500/20 text-sky-400' : activeStation.type === 'water' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                       {activeStation.type === 'air' ? <Wind size={24} /> : activeStation.type === 'water' ? <Droplets size={24} /> : <Radio size={24} />}
                     </div>
                     <div>
                       <h3 className="text-xl font-bold text-white tracking-tight">{activeStation.name}</h3>
                       <div className="flex gap-2 mt-1 items-center">
                         <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{activeStation.province} · {activeStation.city}</span>
                         <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border ${activeStation.status === 'excellent' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : activeStation.status === 'polluted' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-sky-500/20 text-sky-400 border-sky-500/30'}`}>
                           {activeStation.status === 'excellent' ? '状态: 优' : activeStation.status === 'good' ? '状态: 良' : '状态: 污染'}
                         </span>
                       </div>
                     </div>
                   </div>
                   <button 
                     onClick={() => setIsInfoModalOpen(false)}
                     className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all"
                   >
                     <X size={20} />
                   </button>
                 </div>

                 {/* Modal Content */}
                 <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                   <div className="grid grid-cols-3 gap-4 mb-8">
                     <div className="col-span-1 glass-panel rounded-2xl border border-sky-500/10 p-4 flex flex-col items-center justify-center bg-sky-500/5">
                       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">综合指数</span>
                       <span className={`text-4xl font-orbitron font-bold ${activeStation.type === 'air' ? 'text-sky-400' : activeStation.type === 'water' ? 'text-emerald-400' : 'text-amber-400'}`}>
                         {activeStation.metrics.index}
                       </span>
                     </div>
                     <div className="col-span-2 grid grid-cols-2 gap-3">
                       <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
                         <span className="text-[8px] text-slate-500 uppercase font-bold block mb-1">设备状态</span>
                         <div className="flex items-center gap-2">
                           <ShieldCheck size={14} className="text-emerald-400" />
                           <span className="text-xs font-bold text-white">运行正常</span>
                         </div>
                       </div>
                       <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
                         <span className="text-[8px] text-slate-500 uppercase font-bold block mb-1">最后同步</span>
                         <div className="flex items-center gap-2">
                           <Clock size={14} className="text-sky-400" />
                           <span className="text-xs font-bold text-white">{activeStation.deviceStatus.lastSync}</span>
                         </div>
                       </div>
                     </div>
                   </div>

                   <h4 className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.2em] mb-4 border-l-2 border-sky-500 pl-3">详细监测指标</h4>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                     {activeStation.type === 'air' ? (
                       <>
                         <ModalMetric label="PM2.5" value={activeStation.metrics.pm25?.toString()} unit="μg/m³" />
                         <ModalMetric label="PM10" value={activeStation.metrics.pm10?.toString()} unit="μg/m³" />
                         <ModalMetric label="CO" value={activeStation.metrics.co?.toString()} unit="mg/m³" />
                         <ModalMetric label="CO2" value={activeStation.metrics.co2?.toString()} unit="ppm" />
                         <ModalMetric label="SO2" value={activeStation.metrics.so2?.toString()} unit="μg/m³" />
                         <ModalMetric label="NO2" value={activeStation.metrics.no2?.toString()} unit="μg/m³" />
                         <ModalMetric label="O3" value={activeStation.metrics.o3?.toString()} unit="μg/m³" />
                         <ModalMetric label="温度" value={activeStation.deviceStatus.temp.toString()} unit="°C" />
                         <ModalMetric label="湿度" value={activeStation.deviceStatus.humi.toString()} unit="%" />
                       </>
                     ) : activeStation.type === 'water' ? (
                       <>
                         <ModalMetric label="流域" value={activeStation.metrics.basin} unit="" />
                         <ModalMetric label="断面" value={activeStation.metrics.sectionName} unit="" />
                         <ModalMetric label="水质类别" value={activeStation.metrics.waterQualityCategory} unit="" />
                         <ModalMetric label="水温" value={activeStation.metrics.waterTemp?.toString()} unit="℃" />
                         <ModalMetric label="PH" value={activeStation.metrics.ph?.toString()} unit="" />
                         <ModalMetric label="溶解氧" value={activeStation.metrics.do?.toString()} unit="mg/L" />
                         <ModalMetric label="电导率" value={activeStation.metrics.conductivity?.toString()} unit="μS/cm" />
                         <ModalMetric label="浊度" value={activeStation.metrics.turbidity?.toString()} unit="NTU" />
                         <ModalMetric label="高锰酸钾" value={activeStation.metrics.permanganateIndex?.toString()} unit="mg/L" />
                         <ModalMetric label="氨氮" value={activeStation.metrics.nh3n?.toString()} unit="mg/L" />
                         <ModalMetric label="总磷" value={activeStation.metrics.tp?.toString()} unit="mg/L" />
                         <ModalMetric label="总氮" value={activeStation.metrics.tn?.toString()} unit="mg/L" />
                       </>
                     ) : (
                       <>
                         <ModalMetric label="实时声级" value={activeStation.metrics.noise?.toString()} unit="dB" />
                         <ModalMetric label="主导频率" value={activeStation.metrics.freq?.toString()} unit="Hz" />
                         <ModalMetric label="峰值声压" value={activeStation.metrics.dbMax?.toString()} unit="dB" />
                         <ModalMetric label="底噪水平" value={activeStation.metrics.dbMin?.toString()} unit="dB" />
                         <ModalMetric label="计算负载" value={activeStation.deviceStatus.load.toString()} unit="%" />
                         <ModalMetric label="信号强度" value={activeStation.deviceStatus.signal.toString()} unit="%" />
                       </>
                     )}
                   </div>
                 </div>

                 {/* Modal Footer */}
                 <div className="p-6 border-t border-sky-500/10 bg-slate-900/20 flex justify-end">
                   <button 
                     onClick={() => setIsInfoModalOpen(false)}
                     className="px-6 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                   >
                     确认关闭
                   </button>
                 </div>
               </div>
             </div>
           )}

           <div className="absolute bottom-8 right-8 z-20">
              <div 
                className={`glass-panel rounded-2xl border border-sky-500/30 transition-all duration-500 overflow-hidden shadow-2xl bg-[#020617]/90 backdrop-blur-xl ${isLegendExpanded ? 'w-56 p-4' : 'w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-sky-500/10'}`}
                onClick={() => !isLegendExpanded && setIsLegendExpanded(true)}
              >
                {!isLegendExpanded ? (
                  <ListFilter className="text-sky-400" size={18} />
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">图例说明</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setIsLegendExpanded(false); }} 
                        className="p-1 hover:bg-white/5 rounded text-slate-500 hover:text-white transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    
                    <div className="flex border border-sky-500/50 rounded-md overflow-hidden h-6">
                       {(['air', 'water', 'sound'] as const).map((t) => (
                         <button 
                           key={t}
                           onClick={(e) => { e.stopPropagation(); setLegendType(t); }}
                           className={`flex-1 text-[8px] font-bold transition-all ${legendType === t ? 'bg-sky-500 text-white' : 'text-sky-500 hover:bg-sky-500/10'}`}
                         >
                           {t === 'air' ? '空气' : t === 'water' ? '水环' : '声环'}
                         </button>
                       ))}
                    </div>

                    <div className="space-y-2">
                       {getLegendItems(legendType).map((item, idx) => (
                         <div key={idx} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${item.color.replace('text-', 'bg-')}`}></div>
                            <div className="flex flex-col leading-tight">
                               <span className="text-[9px] text-slate-200 font-bold">{item.label}</span>
                               <span className="text-[7px] text-slate-500 font-mono tracking-tighter">{item.range}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* 右侧看板：综合排行模块 */}
        <div className="col-span-2 flex flex-col gap-4 min-h-0">
           <ChartCard 
             title="全球监测站质量排行" 
             className="flex-1 overflow-hidden"
           >
              <div className="h-full flex flex-col">
                 <div className="flex justify-center mb-4 shrink-0">
                    <div className="flex border border-sky-500 rounded-md overflow-hidden h-7">
                      <button 
                        onClick={() => setRankingTab('air')}
                        className={`px-4 flex items-center justify-center text-[10px] font-bold transition-all border-r border-sky-500 last:border-r-0 ${rankingTab === 'air' ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500 hover:bg-sky-500/10'}`}
                      >空气</button>
                      <button 
                        onClick={() => setRankingTab('water')}
                        className={`px-4 flex items-center justify-center text-[10px] font-bold transition-all border-r border-sky-500 last:border-r-0 ${rankingTab === 'water' ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500 hover:bg-sky-500/10'}`}
                      >水</button>
                      <button 
                        onClick={() => setRankingTab('sound')}
                        className={`px-4 flex items-center justify-center text-[10px] font-bold transition-all border-r border-sky-500 last:border-r-0 ${rankingTab === 'sound' ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500 hover:bg-sky-500/10'}`}
                      >声</button>
                    </div>
                 </div>

                 <div className="flex items-center px-2 py-1 mb-1 border-b border-sky-900/20 text-[9px] font-bold text-slate-500 uppercase tracking-widest shrink-0">
                    <span className="w-5">#</span>
                    <span className="flex-1">站点名称</span>
                    <div 
                      className={`flex items-center gap-1 cursor-pointer transition-colors ${rankingTab === 'air' ? 'hover:text-sky-400' : rankingTab === 'water' ? 'hover:text-emerald-400' : 'hover:text-amber-400'}`} 
                      onClick={() => {
                        if (rankingTab === 'air') setAirSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
                        if (rankingTab === 'water') setWaterSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
                        if (rankingTab === 'sound') setSoundSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
                      }}
                    >
                       <ArrowUpDown size={10} />
                    </div>
                 </div>
                 <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
                    {(rankingTab === 'air' ? airRankings : rankingTab === 'water' ? waterRankings : soundRankings).map((station, index) => (
                       <div 
                         key={station.id}
                         onClick={() => {
                            if (selectedId === station.id) {
                                setSelectedId(null);
                                setSelectedProvince(null);
                                setSelectedCity(null);
                            } else {
                                setSelectedId(station.id);
                                setSelectedProvince(station.province);
                                setSelectedCity(station.city);
                            }
                         }}
                         className={`flex items-center gap-2 px-2 py-1 rounded-lg border transition-all cursor-pointer group ${selectedId === station.id ? (rankingTab === 'air' ? 'bg-sky-500/20 border-sky-500/40' : rankingTab === 'water' ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-amber-500/20 border-amber-500/40') : 'bg-slate-900/20 border-transparent hover:bg-white/5'}`}
                       >
                          <div className={`w-5 h-5 shrink-0 rounded flex items-center justify-center text-[9px] font-bold font-orbitron ${
                            index < 3 && (rankingTab === 'air' ? airSortOrder === 'desc' : rankingTab === 'water' ? waterSortOrder === 'desc' : soundSortOrder === 'desc') 
                            ? (rankingTab === 'air' ? 'bg-sky-500 text-white' : rankingTab === 'water' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white') 
                            : 'bg-slate-800 text-slate-500'
                          }`}>
                             {index + 1}
                          </div>
                          <span className={`text-[10px] font-bold truncate flex-1 ${selectedId === station.id ? 'text-white' : 'text-slate-400'}`}>
                            {station.name}
                          </span>
                          <span className={`text-[11px] font-orbitron font-bold shrink-0 ${
                            rankingTab === 'air' ? (
                              station.status === 'excellent' ? 'text-emerald-400' : 
                              station.status === 'good' ? 'text-yellow-400' : 
                              station.status === 'polluted' ? 'text-orange-400' : 
                              'text-red-400'
                            ) : rankingTab === 'water' ? 'text-sky-400' : 'text-amber-400'
                          }`}>
                             {station.metrics.index}
                          </span>
                       </div>
                    ))}
                 </div>
              </div>
           </ChartCard>
        </div>
      </div>
    </div>
  );
};

// --- 子组件与辅助渲染 ---

const EnvMetric = ({ icon, label, value, unit, color }: any) => (
  <div className="bg-[#0f172a]/60 p-3 rounded-2xl border border-sky-900/10 flex items-center gap-3 group transition-all hover:bg-sky-500/5 hover:border-sky-500/20">
    <div className={`${color} group-hover:scale-110 transition-transform shrink-0`}>{icon}</div>
    <div className="flex flex-col min-w-0 flex-1">
      <span className="text-[8px] text-slate-500 uppercase font-bold tracking-tighter truncate">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-bold font-orbitron text-white">{value}</span>
        <span className="text-[8px] text-slate-600 font-bold uppercase">{unit}</span>
      </div>
    </div>
  </div>
);

const SimpleStat = ({ label, value, unit, icon }: any) => (
  <div className="flex justify-between items-center text-[10px]">
     <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-slate-500 font-bold uppercase tracking-tighter">{label}</span>
     </div>
     <div className="flex items-baseline gap-0.5">
        <span className="font-orbitron font-bold text-sky-200">{value}</span>
        <span className="text-[7px] text-slate-600 font-bold uppercase">{unit}</span>
     </div>
  </div>
);

const ModalMetric = ({ label, value, unit }: any) => (
  <div className="bg-slate-900/60 p-3 rounded-xl border border-sky-500/5 flex flex-col gap-1">
    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter truncate">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-sm font-bold font-orbitron text-white truncate">{value}</span>
      <span className="text-[7px] text-slate-600 font-bold uppercase">{unit}</span>
    </div>
  </div>
);

export default GroundNetworkView;
