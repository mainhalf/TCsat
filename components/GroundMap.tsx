
import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

interface Station {
  id: string;
  name: string;
  province: string;
  city: string;
  type: 'air' | 'water' | 'sound';
  coords: { x: number; y: number; lat: string; lng: string; };
  status: 'excellent' | 'good' | 'polluted' | 'critical';
}

interface GroundMapProps {
  stations: Station[];
  selectedId: string | null;
  selectedProvince: string | null;
  selectedCity: string | null;
  onStationClick: (id: string) => void;
}

const GroundMap: React.FC<GroundMapProps> = ({ stations, selectedId, selectedProvince, selectedCity, onStationClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [chinaData, setChinaData] = useState<any>(null);
  const [provinceData, setProvinceData] = useState<any>(null);
  const [zoomTier, setZoomTier] = useState(0); // 0: National, 1: Province, 2: City, 3: Station
  const currentTransformRef = useRef(d3.zoomIdentity);
  const zoomRef = useRef<any>(null);

  const width = containerRef.current?.clientWidth || 800;
  const height = containerRef.current?.clientHeight || 600;

  const projection = useMemo(() => {
    return d3.geoMercator()
      .center([105, 36]) 
      .scale(Math.min(width, height) * 1.1)
      .translate([width / 2, height / 2]);
  }, [width, height]);

  const path = useMemo(() => d3.geoPath().projection(projection), [projection]);

  const provinceCodes: Record<string, string> = {
    '北京': '110000',
    '上海': '310000',
    '广东': '440000',
    '四川': '510000',
    '陕西': '610000',
    '浙江': '330000',
    '江苏': '320000',
    '湖北': '420000',
    '天津': '120000',
    '黑龙江': '230000',
    '辽宁': '210000',
    '山东': '370000',
    '河南': '410000',
    '湖南': '430000',
    '福建': '350000',
    '江西': '360000',
    '贵州': '520000',
    '云南': '530000',
    '西藏': '540000',
    '甘肃': '620000',
    '青海': '630000',
    '宁夏': '640000',
    '新疆': '650000',
    '重庆': '500000',
  };

  useEffect(() => {
    // Using world-atlas for consistency, we'll center on China
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(data => {
        setWorldData(topojson.feature(data, data.objects.countries));
      });

    // Fetch China province boundaries
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
      .then(response => response.json())
      .then(data => {
        setChinaData(data);
      });
  }, []);

  // Fetch detailed province data when a station is selected
  useEffect(() => {
    if (!selectedId) {
      setProvinceData(null);
      return;
    }
    const station = stations.find(s => s.id === selectedId);
    if (station && provinceCodes[station.province]) {
      const code = provinceCodes[station.province];
      fetch(`https://geo.datav.aliyun.com/areas_v3/bound/${code}_full.json`)
        .then(response => response.json())
        .then(data => {
          setProvinceData(data);
        })
        .catch(() => setProvinceData(null));
    }
  }, [selectedId, stations]);

  useEffect(() => {
    if (!worldData || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`);

    let content = svg.select<SVGGElement>('g.map-content');
    if (content.empty()) {
      content = svg.append('g').attr('class', 'map-content');
    }

    // Draw map
    content.selectAll('path.country')
      .data(worldData.features)
      .join('path')
      .attr('class', 'country')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        const name = d.properties.name || '';
        if (name.includes('China')) return 'rgba(14, 165, 233, 0.02)';
        return 'rgba(15, 23, 42, 0.5)';
      })
      .attr('stroke', (d: any) => {
        const name = d.properties.name || '';
        if (name.includes('China')) return 'none';
        return 'rgba(56, 189, 248, 0.1)';
      })
      .attr('stroke-width', (d: any) => {
        const name = d.properties.name || '';
        return (name.includes('China') ? 0 : 0.5) / currentTransformRef.current.k;
      });

    // Draw China Provinces
    if (chinaData && chinaData.features) {
      content.selectAll('path.province')
        .data(chinaData.features)
        .join('path')
        .attr('class', 'province')
        .attr('d', path as any)
        .attr('fill', 'rgba(56, 189, 248, 0.05)') 
        .attr('stroke', 'rgba(56, 189, 248, 0.4)') 
        .attr('stroke-width', 1 / currentTransformRef.current.k);

      // Draw Province Labels
      const provinceLabels = content.selectAll('g.province-label-group')
        .data(chinaData.features)
        .join('g')
        .attr('class', 'province-label-group')
        .attr('transform', (d: any) => {
          const centroid = path.centroid(d);
          if (isNaN(centroid[0]) || isNaN(centroid[1])) return 'translate(-100, -100)';
          return `translate(${centroid[0]}, ${centroid[1]}) scale(${1 / currentTransformRef.current.k})`;
        })
        .style('display', zoomTier <= 1 ? 'block' : 'none')
        .style('pointer-events', 'none');

      provinceLabels.selectAll('text.province-label-bg')
        .data(d => [d])
        .join('text')
        .attr('class', 'province-label-bg')
        .attr('text-anchor', 'middle')
        .attr('fill', '#000')
        .attr('stroke', '#000')
        .attr('stroke-width', 3)
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('opacity', 0.6)
        .text((d: any) => d.properties.name);

      provinceLabels.selectAll('text.province-label')
        .data(d => [d])
        .join('text')
        .attr('class', 'province-label')
        .attr('text-anchor', 'middle')
        .attr('fill', '#38bdf8') 
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('opacity', 0.8)
        .text((d: any) => d.properties.name);
    }

    // Draw Detailed Province/City boundaries when zoomed in
    if (provinceData && provinceData.features) {
      content.selectAll('path.city-boundary')
        .data(provinceData.features)
        .join('path')
        .attr('class', 'city-boundary')
        .attr('d', path as any)
        .attr('fill', 'rgba(56, 189, 248, 0.02)')
        .attr('stroke', 'rgba(56, 189, 248, 0.3)')
        .attr('stroke-width', 0.5 / currentTransformRef.current.k)
        .attr('stroke-dasharray', '2,2');

      // City Labels
      const cityLabels = content.selectAll('g.city-label-group')
        .data(provinceData.features)
        .join('g')
        .attr('class', 'city-label-group')
        .attr('transform', (d: any) => {
          const centroid = path.centroid(d);
          if (isNaN(centroid[0]) || isNaN(centroid[1])) return 'translate(-100, -100)';
          return `translate(${centroid[0]}, ${centroid[1]}) scale(${1 / currentTransformRef.current.k})`;
        })
        .style('display', zoomTier >= 2 ? 'block' : 'none')
        .style('pointer-events', 'none');

      cityLabels.selectAll('text.city-label')
        .data(d => [d])
        .join('text')
        .attr('class', 'city-label')
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(255, 255, 255, 0.4)')
        .attr('font-size', '8px')
        .text((d: any) => d.properties.name);
    }

    // Draw Simulated Road Network (Major Highways)
    // ... (rest of the road logic)
    const capitals: [number, number][] = [
      [116.4, 39.9], [121.5, 31.2], [113.3, 23.1], [104.1, 30.7], 
      [108.9, 34.3], [120.2, 30.3], [118.8, 32.1], [114.3, 30.6],
      [117.2, 39.1], [126.6, 45.8], [123.4, 41.8], [117.0, 36.7],
      [113.7, 34.8], [113.0, 28.2], [119.3, 26.1], [115.9, 28.7],
      [106.7, 26.6], [102.7, 25.0], [91.1, 29.7], [103.8, 36.1],
      [101.8, 36.6], [106.3, 38.5], [87.6, 43.8], [106.5, 29.6]
    ];

    const roadLinks: { source: [number, number], target: [number, number] }[] = [];
    for (let i = 0; i < capitals.length; i++) {
      for (let j = i + 1; j < capitals.length; j++) {
        const dist = d3.geoDistance(capitals[i], capitals[j]);
        if (dist < 0.15) {
          roadLinks.push({ source: capitals[i], target: capitals[j] });
        }
      }
    }

    content.selectAll('line.road')
      .data(roadLinks)
      .join('line')
      .attr('class', 'road')
      .attr('x1', d => projection(d.source)![0])
      .attr('y1', d => projection(d.source)![1])
      .attr('x2', d => projection(d.target)![0])
      .attr('y2', d => projection(d.target)![1])
      .attr('stroke', 'rgba(56, 189, 248, 0.12)')
      .attr('stroke-width', 0.4 / currentTransformRef.current.k)
      .attr('stroke-dasharray', zoomTier > 1 ? 'none' : '2,2');

    // Add a subtle glow to China
    content.selectAll('path.china-glow')
      .data(worldData.features.filter((d: any) => (d.properties.name || '').includes('China')))
      .join('path')
      .attr('class', 'china-glow')
      .attr('d', path as any)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(56, 189, 248, 0.3)')
      .attr('stroke-width', 4 / currentTransformRef.current.k)
      .attr('filter', 'url(#glow)');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 40])
      .on('zoom', (event) => {
        const { transform } = event;
        currentTransformRef.current = transform;
        content.attr('transform', transform);
        
        // Update stroke widths to keep them consistent
        content.selectAll('path.country')
          .attr('stroke-width', (d: any) => (d.properties.name === 'China' ? 0 : 0.5) / transform.k);
        content.selectAll('path.province')
          .attr('stroke-width', 0.5 / transform.k);
        content.selectAll('line.road')
          .attr('stroke-width', 0.3 / transform.k);
        content.selectAll('path.china-glow')
          .attr('stroke-width', 3 / transform.k);

        // Update node transforms to keep them constant size
        content.selectAll<SVGGElement, any>('g.map-node')
          .attr('transform', (d: any) => {
            const p = projection(d.coords);
            if (!p) return 'translate(-100, -100)';
            return `translate(${p[0]}, ${p[1]}) scale(${1 / transform.k})`;
          });

        // Determine tier without triggering re-render unless it changes
        const k = transform.k;
        let newTier = 0;
        if (k < 1.5) newTier = 0;
        else if (k < 4) newTier = 1;
        else if (k < 10) newTier = 2;
        else newTier = 3;

        content.selectAll<SVGGElement, any>('g.province-label-group')
          .attr('transform', (d: any) => {
            const centroid = path.centroid(d);
            if (isNaN(centroid[0]) || isNaN(centroid[1])) return 'translate(-100, -100)';
            return `translate(${centroid[0]}, ${centroid[1]}) scale(${1 / transform.k})`;
          })
          .style('display', newTier <= 1 ? 'block' : 'none');

        setZoomTier(prev => {
          if (prev !== newTier) return newTier;
          return prev;
        });
      });

    zoomRef.current = zoom;
    svg.call(zoom);
    content.attr('transform', currentTransformRef.current);

    // Hierarchical Data Processing
    let displayData: any[] = [];
    if (selectedId) {
      // If a station is selected, ONLY show that station
      const s = stations.find(st => st.id === selectedId);
      if (s) {
        displayData = [{ 
          type: 'station', 
          type_val: s.type,
          ...s, 
          coords: [parseFloat(s.coords.lng), parseFloat(s.coords.lat)] 
        }];
      }
    } else if (selectedCity) {
      displayData = stations.filter(s => s.city === selectedCity).map(s => ({
        type: 'station',
        type_val: s.type,
        ...s,
        coords: [parseFloat(s.coords.lng), parseFloat(s.coords.lat)]
      }));
    } else if (selectedProvince) {
      displayData = stations.filter(s => s.province === selectedProvince).map(s => ({
        type: 'station',
        type_val: s.type,
        ...s,
        coords: [parseFloat(s.coords.lng), parseFloat(s.coords.lat)]
      }));
    } else if (zoomTier === 0) {
      // Level 0: National Aggregation
      const types = d3.group(stations, d => d.type);
      types.forEach((members, type) => {
        const avgLat = d3.mean(members, m => parseFloat(m.coords.lat))!;
        const avgLng = d3.mean(members, m => parseFloat(m.coords.lng))!;
        const avgIndex = d3.mean(members, m => (m as any).metrics.index)!;
        const status = type === 'air' ? 
          (avgIndex < 50 ? 'excellent' : avgIndex < 100 ? 'good' : avgIndex < 200 ? 'polluted' : 'critical') : 
          type === 'water' ? 'excellent' : 'good';
        displayData.push({ 
          type: 'country', 
          type_val: type,
          name: type === 'air' ? '全国空气监测' : type === 'water' ? '全国水质监测' : '全国声环监测', 
          count: members.length, 
          coords: [avgLng + (type === 'air' ? -5 : type === 'water' ? 0 : 5), avgLat + (type === 'water' ? 2 : 0)], 
          status 
        });
      });
    } else if (zoomTier === 1) {
      // Level 1: Province Aggregation
      const byType = d3.group(stations, d => d.type);
      byType.forEach((typeMembers, type) => {
        const provinces = d3.group(typeMembers, d => d.province);
        provinces.forEach((members, name) => {
          const avgLat = d3.mean(members, m => parseFloat(m.coords.lat))!;
          const avgLng = d3.mean(members, m => parseFloat(m.coords.lng))!;
          const avgIndex = d3.mean(members, m => (m as any).metrics.index)!;
          const status = type === 'air' ? 
            (avgIndex < 50 ? 'excellent' : avgIndex < 100 ? 'good' : avgIndex < 200 ? 'polluted' : 'critical') : 
            type === 'water' ? 'excellent' : 'good';
          displayData.push({ 
            type: 'province', 
            type_val: type,
            name, 
            count: members.length, 
            coords: [avgLng + (type === 'air' ? -1.5 : type === 'water' ? 0 : 1.5), avgLat + (type === 'water' ? 0.8 : 0)], 
            status 
          });
        });
      });
    } else if (zoomTier === 2) {
      // Level 2: City Aggregation
      const byType = d3.group(stations, d => d.type);
      byType.forEach((typeMembers, type) => {
        const cities = d3.group(typeMembers, d => d.city);
        cities.forEach((members, name) => {
          const avgLat = d3.mean(members, m => parseFloat(m.coords.lat))!;
          const avgLng = d3.mean(members, m => parseFloat(m.coords.lng))!;
          const avgIndex = d3.mean(members, m => (m as any).metrics.index)!;
          const status = type === 'air' ? 
            (avgIndex < 50 ? 'excellent' : avgIndex < 100 ? 'good' : avgIndex < 200 ? 'polluted' : 'critical') : 
            type === 'water' ? 'excellent' : 'good';
          displayData.push({ 
            type: 'city', 
            type_val: type,
            name, 
            count: members.length, 
            coords: [avgLng + (type === 'air' ? -0.5 : type === 'water' ? 0 : 0.5), avgLat + (type === 'water' ? 0.3 : 0)], 
            status 
          });
        });
      });
    } else {
      // Level 3: Individual Stations
      displayData = stations.map(s => ({ 
        type: 'station', 
        type_val: s.type,
        ...s, 
        coords: [parseFloat(s.coords.lng), parseFloat(s.coords.lat)] 
      }));
    }

    // Draw displayData
    const nodes = content.selectAll<SVGGElement, any>('g.map-node')
      .data(displayData, (d: any) => d.type === 'station' ? d.id : `${d.type}-${d.type_val}-${d.name}`)
      .join('g')
      .attr('class', 'map-node')
      .attr('transform', (d: any) => {
        const p = projection(d.coords);
        if (!p) return 'translate(-100, -100)';
        // Apply inverse scale to keep nodes constant size
        return `translate(${p[0]}, ${p[1]}) scale(${1 / currentTransformRef.current.k})`;
      })
      .style('cursor', 'pointer')
      .on('click', (event, d: any) => {
        if (d.type === 'station') {
          onStationClick(d.id);
        }
      });

    // Add Pulse Effect for all nodes in panorama
    nodes.selectAll('circle.pulse')
      .data(d => [d])
      .join('circle')
      .attr('class', 'pulse')
      .attr('r', (d: any) => {
        return d.type === 'country' ? 24 : d.type === 'province' ? 18 : d.type === 'city' ? 12 : 6;
      })
      .attr('fill', 'none')
      .attr('stroke', (d: any) => {
        if (d.type_val === 'water') return '#38bdf8'; 
        if (d.type_val === 'sound') return '#f59e0b'; 
        return '#10b981';
      })
      .attr('stroke-width', 1)
      .attr('opacity', 0)
      .append('animate')
      .attr('attributeName', 'r')
      .attr('from', (d: any) => (d.type === 'country' ? 24 : d.type === 'province' ? 18 : d.type === 'city' ? 12 : 6))
      .attr('to', (d: any) => (d.type === 'country' ? 60 : d.type === 'province' ? 40 : d.type === 'city' ? 30 : 20))
      .attr('dur', '3s')
      .attr('begin', (d, i) => `${i * 0.2}s`)
      .attr('repeatCount', 'indefinite');

    nodes.selectAll('circle.pulse')
      .append('animate')
      .attr('attributeName', 'opacity')
      .attr('from', 0.6)
      .attr('to', 0)
      .attr('dur', '3s')
      .attr('begin', (d, i) => `${i * 0.2}s`)
      .attr('repeatCount', 'indefinite');

    // Data Streams to Beijing (Central Hub)
    if (!selectedId && zoomTier === 0) {
      const beijingCoords: [number, number] = [116.4, 39.9];
      const bjPos = projection(beijingCoords);
      
      if (bjPos) {
        // Draw Beijing Hub Glow
        content.selectAll('circle.hub-glow')
          .data([bjPos])
          .join('circle')
          .attr('class', 'hub-glow')
          .attr('cx', d => d[0])
          .attr('cy', d => d[1])
          .attr('r', 40 / currentTransformRef.current.k)
          .attr('fill', 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)')
          .attr('style', 'fill: url(#hubGradient); pointer-events: none;');

        const streamData = displayData.filter(d => d.type === 'country');
        
        // Satellite Beams
        content.selectAll('line.sat-beam')
          .data(streamData)
          .join('line')
          .attr('class', 'sat-beam')
          .attr('x1', d => projection(d.coords)![0])
          .attr('y1', d => projection(d.coords)![1] - 100 / currentTransformRef.current.k)
          .attr('x2', d => projection(d.coords)![0])
          .attr('y2', d => projection(d.coords)![1])
          .attr('stroke', 'url(#beamGradient)')
          .attr('stroke-width', 2 / currentTransformRef.current.k)
          .attr('opacity', 0.4);

        const streams = content.selectAll('path.data-stream')
          .data(streamData)
          .join('path')
          .attr('class', 'data-stream')
          .attr('d', (d: any) => {
            const start = projection(d.coords);
            if (!start) return '';
            const dx = bjPos[0] - start[0];
            const dy = bjPos[1] - start[1];
            const dr = Math.sqrt(dx * dx + dy * dy) * 1.2;
            return `M${start[0]},${start[1]}A${dr},${dr} 0 0,1 ${bjPos[0]},${bjPos[1]}`;
          })
          .attr('fill', 'none')
          .attr('stroke', (d: any) => d.type_val === 'air' ? 'rgba(56, 189, 248, 0.2)' : d.type_val === 'water' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)')
          .attr('stroke-width', 1 / currentTransformRef.current.k)
          .attr('stroke-dasharray', '4,4');

        // Flowing particles
        const particles = content.selectAll('circle.stream-particle')
          .data(streamData)
          .join('circle')
          .attr('class', 'stream-particle')
          .attr('r', 2 / currentTransformRef.current.k)
          .attr('fill', (d: any) => d.type_val === 'air' ? '#38bdf8' : d.type_val === 'water' ? '#10b981' : '#f59e0b')
          .attr('filter', 'url(#glow)');

        particles.append('animateMotion')
          .attr('dur', (d, i) => `${2 + Math.random() * 2}s`)
          .attr('repeatCount', 'indefinite')
          .attr('path', (d: any) => {
            const start = projection(d.coords);
            if (!start) return '';
            const dx = bjPos[0] - start[0];
            const dy = bjPos[1] - start[1];
            const dr = Math.sqrt(dx * dx + dy * dy) * 1.2;
            return `M${start[0]},${start[1]}A${dr},${dr} 0 0,1 ${bjPos[0]},${bjPos[1]}`;
          });
      }
    } else {
      content.selectAll('path.data-stream').remove();
      content.selectAll('circle.stream-particle').remove();
      content.selectAll('line.sat-beam').remove();
      content.selectAll('circle.hub-glow').remove();
    }

    // Selection ring for stations
    nodes.selectAll('circle.ring')
      .data((d: any) => d.type === 'station' && d.id === selectedId ? [d] : [])
      .join('circle')
      .attr('class', 'ring')
      .attr('r', 10) 
      .attr('fill', 'none')
      .attr('stroke', '#38bdf8')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2,2')
      .append('animateTransform')
      .attr('attributeName', 'transform')
      .attr('type', 'rotate')
      .attr('from', '0 0 0')
      .attr('to', '360 0 0')
      .attr('dur', '4s')
      .attr('repeatCount', 'indefinite');

    // Node circles
    nodes.selectAll('circle.node-bg')
      .data(d => [d])
      .join('circle')
      .attr('class', 'node-bg')
      .attr('r', (d: any) => {
        return d.type === 'country' ? 24 : d.type === 'province' ? 18 : d.type === 'city' ? 12 : 6;
      })
      .attr('fill', (d: any) => {
        if (d.type_val === 'water') return '#38bdf8'; 
        if (d.type_val === 'sound') return '#f59e0b'; 
        if (d.status === 'excellent') return '#10b981';
        if (d.status === 'good') return '#facc15';
        if (d.status === 'polluted') return '#f97316';
        return '#ef4444';
      })
      .attr('stroke', (d: any) => d.type === 'station' && d.id === selectedId ? '#fff' : 'rgba(255, 255, 255, 0.2)')
      .attr('stroke-width', (d: any) => (d.type === 'station' && d.id === selectedId ? 2 : 1))
      .attr('filter', 'url(#glow)');

    // Counts for clusters
    nodes.selectAll('text.count')
      .data((d: any) => d.type !== 'station' ? [d] : [])
      .join('text')
      .attr('class', 'count')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#fff')
      .attr('font-size', (d: any) => {
        return d.type === 'country' ? 12 : d.type === 'province' ? 10 : 8;
      })
      .attr('font-weight', 'bold')
      .text((d: any) => d.count);

    // Labels
    nodes.selectAll('text.label')
      .data(d => [d])
      .join('text')
      .attr('class', 'label')
      .attr('y', (d: any) => {
        return d.type === 'country' ? 36 : d.type === 'province' ? 28 : d.type === 'city' ? 22 : 14;
      })
      .attr('text-anchor', 'middle')
      .attr('fill', (d: any) => d.type === 'station' && d.id === selectedId ? '#fff' : '#94a3b8')
      .attr('font-size', (d: any) => (d.type === 'station' ? 8 : 9))
      .attr('font-weight', 'bold')
      .style('text-shadow', '0 1px 2px rgba(0,0,0,0.8)')
      .text((d: any) => {
        if (d.type === 'country') return d.name;
        if (d.type === 'province') return d.name;
        if (d.type === 'city') return d.name.replace(d.province, ''); 
        return d.name.split('监测站')[0];
      });

  }, [worldData, chinaData, provinceData, stations, selectedId, zoomTier, width, height, projection, path]);

  // Separate Effect for Auto-zoom to prevent manual zoom resets
  useEffect(() => {
    if (!svgRef.current || !zoomRef.current || !projection) return;

    const svg = d3.select(svgRef.current);
    const zoom = zoomRef.current;

    if (selectedId && stations.length > 0) {
      const selectedStation = stations.find(s => s.id === selectedId);
      if (selectedStation) {
        const coords: [number, number] = [parseFloat(selectedStation.coords.lng), parseFloat(selectedStation.coords.lat)];
        const p = projection(coords);
        if (p) {
          const k = 25; 
          const x = width / 2 - k * p[0];
          const y = height / 2 - k * p[1];
          
          svg.transition()
            .duration(1200)
            .ease(d3.easeCubicInOut)
            .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(k));
        }
      }
    } else if (selectedCity) {
      const cityStations = stations.filter(s => s.city === selectedCity);
      if (cityStations.length > 0) {
        const avgLat = d3.mean(cityStations, s => parseFloat(s.coords.lat))!;
        const avgLng = d3.mean(cityStations, s => parseFloat(s.coords.lng))!;
        const p = projection([avgLng, avgLat]);
        if (p) {
          const k = 12;
          const x = width / 2 - k * p[0];
          const y = height / 2 - k * p[1];
          svg.transition().duration(1000).call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(k));
        }
      }
    } else if (selectedProvince) {
      const provinceStations = stations.filter(s => s.province === selectedProvince);
      if (provinceStations.length > 0) {
        const avgLat = d3.mean(provinceStations, s => parseFloat(s.coords.lat))!;
        const avgLng = d3.mean(provinceStations, s => parseFloat(s.coords.lng))!;
        const p = projection([avgLng, avgLat]);
        if (p) {
          const k = 6;
          const x = width / 2 - k * p[0];
          const y = height / 2 - k * p[1];
          svg.transition().duration(1000).call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(k));
        }
      }
    } else {
      // Only reset to panorama if it's the first load or explicit deselect
      // We check if the current transform is significantly different from identity to avoid unnecessary resets
      const currentK = currentTransformRef.current.k;
      if (currentK > 1.5 || currentK < 0.9) {
        const k = 1.1;
        svg.transition()
          .duration(1000)
          .call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(k));
      }
    }
  }, [selectedId, selectedProvince, selectedCity]); // Trigger when any selection changes

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-move">
      <svg ref={svgRef} className="w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="hubGradient">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      
      <div className="absolute top-4 right-4 flex flex-col items-center gap-1 pointer-events-none">
        <div className="relative w-12 h-12 flex items-center justify-center">
          {/* Compass Ring */}
          <div className="absolute inset-0 border border-sky-500/20 rounded-full"></div>
          <div className="absolute inset-1 border border-sky-500/10 rounded-full"></div>
          
          {/* Compass Needle */}
          <div className="relative w-1 h-8 bg-gradient-to-b from-rose-500 via-white to-sky-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.4)]">
          </div>
          
          {/* Decorative ticks */}
          {[0, 90, 180, 270].map(deg => (
            <div 
              key={deg} 
              className="absolute w-0.5 h-1.5 bg-sky-500/40" 
              style={{ transform: `rotate(${deg}deg) translateY(-20px)` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-sky-500/10 text-[8px] text-sky-500 font-bold uppercase tracking-widest pointer-events-none">
        Drag to pan • Scroll to zoom
      </div>
    </div>
  );
};

export default GroundMap;
