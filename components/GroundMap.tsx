
import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

interface Station {
  id: string;
  name: string;
  country: string;
  province: string;
  city: string;
  county: string;
  type: 'air' | 'water' | 'sound';
  coords: { x: number; y: number; lat: string; lng: string; };
  status: 'excellent' | 'good' | 'polluted' | 'critical';
}

interface GroundMapProps {
  stations: Station[];
  selectedId: string | null;
  selectedCountry: string | null;
  selectedProvince: string | null;
  selectedCity: string | null;
  selectedCounty: string | null;
  onStationClick: (id: string) => void;
}

const GroundMap: React.FC<GroundMapProps> = ({ 
  stations, 
  selectedId, 
  selectedCountry,
  selectedProvince, 
  selectedCity, 
  selectedCounty,
  onStationClick 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [zoomTier, setZoomTier] = useState(0); // 0: Global, 1: Regional, 2: City, 3: Station
  const currentTransformRef = useRef(d3.zoomIdentity);
  const zoomRef = useRef<any>(null);

  const width = containerRef.current?.clientWidth || 800;
  const height = containerRef.current?.clientHeight || 600;

  const projection = useMemo(() => {
    return d3.geoMercator()
      .scale(width / 6.5)
      .translate([width / 2, height / 1.6])
      .precision(0.1);
  }, [width, height]);

  const path = useMemo(() => d3.geoPath().projection(projection), [projection]);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(data => {
        setWorldData(topojson.feature(data, data.objects.countries));
      });
  }, []);

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
      .attr('fill', 'rgba(15, 23, 42, 0.5)')
      .attr('stroke', 'rgba(56, 189, 248, 0.1)')
      .attr('stroke-width', 0.5 / currentTransformRef.current.k);

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 40])
      .on('zoom', (event) => {
        const { transform } = event;
        currentTransformRef.current = transform;
        content.attr('transform', transform);
        
        // Update stroke widths to keep them consistent
        content.selectAll('path.country')
          .attr('stroke-width', 0.5 / transform.k);

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

        setZoomTier(prev => {
          if (prev !== newTier) return newTier;
          return prev;
        });
      })
      .filter((event) => event.type === 'wheel' || event.type === 'mousedown' || event.type === 'touchstart');

    zoomRef.current = zoom;
    svg.call(zoom);
    content.attr('transform', currentTransformRef.current);

    // Data Processing: Show all stations directly
    const displayData = stations.map(s => ({ 
      type: 'station', 
      type_val: s.type,
      ...s, 
      coords: [parseFloat(s.coords.lng), parseFloat(s.coords.lat)] 
    }));

    // Draw displayData
    const nodes = content.selectAll<SVGGElement, any>('g.map-node')
      .data(displayData, (d: any) => d.id)
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
        onStationClick(d.id);
      });

    // Add Pulse Effect for selected or critical nodes
    nodes.selectAll('circle.pulse')
      .data(d => (d.id === selectedId || d.status === 'critical') ? [d] : [])
      .join('circle')
      .attr('class', 'pulse')
      .attr('r', 6)
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
      .attr('from', 6)
      .attr('to', 20)
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

    // Selection ring for stations
    nodes.selectAll('circle.ring')
      .data((d: any) => d.id === selectedId ? [d] : [])
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
      .attr('r', (d: any) => (d.id === selectedId ? 8 : 4))
      .attr('fill', (d: any) => {
        if (d.type_val === 'water') return '#38bdf8'; 
        if (d.type_val === 'sound') return '#f59e0b'; 
        if (d.status === 'excellent') return '#10b981';
        if (d.status === 'good') return '#facc15';
        if (d.status === 'polluted') return '#f97316';
        return '#ef4444';
      })
      .attr('stroke', (d: any) => d.id === selectedId ? '#fff' : 'rgba(255, 255, 255, 0.2)')
      .attr('stroke-width', (d: any) => (d.id === selectedId ? 2 : 1))
      .attr('filter', 'url(#glow)');

    // Labels (only show when zoomed in or selected)
    nodes.selectAll('text.label')
      .data(d => [d])
      .join('text')
      .attr('class', 'label')
      .attr('y', 14)
      .attr('text-anchor', 'middle')
      .attr('fill', (d: any) => d.id === selectedId ? '#fff' : '#94a3b8')
      .attr('font-size', 8)
      .attr('font-weight', 'bold')
      .style('text-shadow', '0 1px 2px rgba(0,0,0,0.8)')
      .style('display', (d: any) => (zoomTier >= 2 || d.id === selectedId) ? 'block' : 'none')
      .text((d: any) => d.name.split('监测站')[0]);

  }, [worldData, stations, selectedId, zoomTier, width, height, projection, path]);

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
    } else if (selectedCounty) {
      const countyStations = stations.filter(s => s.county === selectedCounty);
      if (countyStations.length > 0) {
        const avgLat = d3.mean(countyStations, s => parseFloat(s.coords.lat))!;
        const avgLng = d3.mean(countyStations, s => parseFloat(s.coords.lng))!;
        const p = projection([avgLng, avgLat]);
        if (p) {
          const k = 18;
          const x = width / 2 - k * p[0];
          const y = height / 2 - k * p[1];
          svg.transition().duration(1000).call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(k));
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
    } else if (selectedCountry) {
      const countryStations = stations.filter(s => s.country === selectedCountry);
      if (countryStations.length > 0) {
        const avgLat = d3.mean(countryStations, s => parseFloat(s.coords.lat))!;
        const avgLng = d3.mean(countryStations, s => parseFloat(s.coords.lng))!;
        const p = projection([avgLng, avgLat]);
        if (p) {
          const k = 3;
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
  }, [selectedId, selectedCountry, selectedProvince, selectedCity, selectedCounty]); // Trigger when any selection changes

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
      
      <div className="absolute top-4 left-4 flex flex-col items-center gap-1 pointer-events-none">
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
