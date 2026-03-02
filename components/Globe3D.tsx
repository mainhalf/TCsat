
import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

// Versor (quaternion) utility for smooth 3D rotation
const versor = (() => {
  const acos = Math.acos,
        asin = Math.asin,
        atan2 = Math.atan2,
        cos = Math.cos,
        max = Math.max,
        min = Math.min,
        sin = Math.sin,
        sqrt = Math.sqrt,
        radians = Math.PI / 180,
        degrees = 180 / Math.PI;

  const v = (e: [number, number, number]) => {
    const l = e[0] * radians, p = e[1] * radians, g = e[2] * radians;
    const sl = sin(l / 2), cl = cos(l / 2),
          sp = sin(p / 2), cp = cos(p / 2),
          sg = sin(g / 2), cg = cos(g / 2);
    return [
      cl * cp * cg + sl * sp * sg,
      sl * cp * cg - cl * sp * sg,
      cl * sp * cg + sl * cp * sg,
      cl * cp * sg - sl * sp * cg
    ] as [number, number, number, number];
  };

  v.cartesian = (e: [number, number]) => {
    const l = e[0] * radians, p = e[1] * radians, cp = cos(p);
    return [cp * cos(l), cp * sin(l), sin(p)] as [number, number, number];
  };

  v.delta = (e0: [number, number, number], e1: [number, number, number]) => {
    const d = max(-1, min(1, e0[0] * e1[0] + e0[1] * e1[1] + e0[2] * e1[2]));
    const w = e0[1] * e1[2] - e0[2] * e1[1],
          x = e0[2] * e1[0] - e0[0] * e1[2],
          y = e0[0] * e1[1] - e0[1] * e1[0],
          z = sqrt(w * w + x * x + y * y);
    if (!z) return [1, 0, 0, 0] as [number, number, number, number];
    const a = acos(d) / 2, s = sin(a) / z;
    return [cos(a), w * s, x * s, y * s] as [number, number, number, number];
  };

  v.multiply = (e0: [number, number, number, number], e1: [number, number, number, number]) => {
    return [
      e0[0] * e1[0] - e0[1] * e1[1] - e0[2] * e1[2] - e0[3] * e1[3],
      e0[0] * e1[1] + e0[1] * e1[0] + e0[2] * e1[3] - e0[3] * e1[2],
      e0[0] * e1[2] - e0[1] * e1[3] + e0[2] * e1[0] + e0[3] * e1[1],
      e0[0] * e1[3] + e0[1] * e1[2] - e0[2] * e1[1] + e0[3] * e1[0]
    ] as [number, number, number, number];
  };

  v.rotation = (e: [number, number, number, number]) => {
    return [
      atan2(2 * (e[0] * e[1] + e[2] * e[3]), 1 - 2 * (e[1] * e[1] + e[2] * e[2])) * degrees,
      asin(max(-1, min(1, 2 * (e[0] * e[2] - e[3] * e[1])))) * degrees,
      atan2(2 * (e[0] * e[3] + e[1] * e[2]), 1 - 2 * (e[2] * e[2] + e[3] * e[3])) * degrees
    ] as [number, number, number];
  };

  return v;
})();

interface Globe3DProps {
  onStationClick?: (name: string) => void;
  onSatelliteClick?: (name: string) => void;
  selectedDate: number;
}

const Globe3D: React.FC<Globe3DProps> = ({ onStationClick, onSatelliteClick, selectedDate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const rotationRef = useRef<[number, number, number]>([-105, -35, 0]);
  const scaleRef = useRef<number>(250);
  const isInteractingRef = useRef(false);
  const requestRef = useRef<number>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  
  // Generate static stars once
  const stars = useMemo(() => {
    const generatedStars = [];
    for (let i = 0; i < 300; i++) {
      generatedStars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.002 + 0.0005
      });
    }
    return generatedStars;
  }, []);

  // 模拟站点数据
  const stations = [
    { name: '北京怀柔站', coords: [116.63, 40.32] as [number, number], color: '#38bdf8' },
    { name: '额尔古纳站', coords: [120.18, 50.24] as [number, number], color: '#10b981' },
    { name: '上海站', coords: [121.47, 31.23] as [number, number], color: '#38bdf8' },
    { name: '青海站', coords: [101.78, 36.62] as [number, number], color: '#38bdf8' },
    { name: '湖北站', coords: [114.31, 30.59] as [number, number], color: '#38bdf8' },
  ];

  // 模拟卫星轨道数据
  // 极轨卫星周期约为 100 分钟 (LEO)，静止卫星周期为 24 小时 (GEO)
  // 这里设置相对速度比例：LEO 约为 14.4 圈/天
  const satellites = [
    // 极轨卫星 (Polar Orbiting) - 速度根据真实轨道周期微调 (约 98-102 分钟)
    { name: 'AQUA', color: '#10b981', type: 'polar', inclination: 98.2, speed: 0.00082, phase: 0, nodeLon: 0 },
    { name: 'NPP', color: '#38bdf8', type: 'polar', inclination: 98.7, speed: 0.00080, phase: Math.PI / 3, nodeLon: 60 },
    { name: 'NOAA', color: '#6366f1', type: 'polar', inclination: 98.7, speed: 0.00079, phase: Math.PI * 2/3, nodeLon: 120 },
    { name: 'FY3D', color: '#22d3ee', type: 'polar', inclination: 98.7, speed: 0.00078, phase: Math.PI, nodeLon: 180 },
    { name: 'FY3E', color: '#0ea5e9', type: 'polar', inclination: 98.7, speed: 0.00078, phase: Math.PI * 4/3, nodeLon: 270 },
    // 静止卫星 (Geostationary)
    { name: 'GK2A', color: '#f59e0b', type: 'geo', lon: 128.2, lat: 0 },
    { name: 'HIMAWARI-8', color: '#f43f5e', type: 'geo', lon: 140.7, lat: 0 },
  ];

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(data => {
        setWorldData(topojson.feature(data, data.objects.countries));
      });
  }, []);

  // Responsive dimensions
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
        // Adjust initial scale to fit height (radius = height / 2, with a small margin)
        scaleRef.current = Math.min(width, height) * 0.45;
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!worldData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const { width, height } = dimensions;
    canvas.width = width;
    canvas.height = height;

    const projection = d3.geoOrthographic()
      .scale(scaleRef.current)
      .translate([width / 2, height / 2])
      .rotate(rotationRef.current as [number, number, number])
      .precision(0.1);

    const path = d3.geoPath(projection, context);

    // Zoom behavior - Only handle wheel for scaling
    const zoom = d3.zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([100, 2000])
      .on('zoom', (event) => {
        scaleRef.current = event.transform.k;
        projection.scale(scaleRef.current);
      })
      .filter((event) => {
        // Only allow wheel events for zoom to avoid conflict with drag
        return event.type === 'wheel';
      });

    d3.select(canvas).call(zoom).call(zoom.transform, d3.zoomIdentity.scale(scaleRef.current));

    // Drag behavior for rotation
    let v0: [number, number, number] | null = null;
    let r0: [number, number, number] | null = null;
    let q0: [number, number, number, number] | null = null;

    const drag = d3.drag<HTMLCanvasElement, unknown>()
      .on('start', (event) => { 
        isInteractingRef.current = true;
      })
      .on('drag', (event) => {
        const rotate = projection.rotate();
        const k = 75 / projection.scale(); // Sensitivity adjustment based on zoom
        projection.rotate([
          rotate[0] + event.dx * k,
          rotate[1] - event.dy * k
        ]);
        rotationRef.current = projection.rotate() as [number, number, number];
      })
      .on('end', () => {
        // Delay resuming auto-rotation
        setTimeout(() => { isInteractingRef.current = false; }, 2000);
      });

    d3.select(canvas).call(drag as any);

    // Click behavior
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      stations.forEach(station => {
        const [lon, lat] = station.coords;
        const point = projection([lon, lat]);
        const isVisible = d3.geoDistance(station.coords, [-projection.rotate()[0], -projection.rotate()[1]]) < Math.PI / 2;

        if (point && isVisible) {
          const dx = x - point[0];
          const dy = y - point[1];
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 15) {
            onStationClick?.(station.name);
          }
        }
      });
    };

    canvas.addEventListener('click', handleClick);

    const render = (time: number) => {
      // Auto rotation disabled as per user request
      
      context.clearRect(0, 0, width, height);

      // --- Draw Universe Background ---
      // Deep space background
      const spaceGradient = context.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height)
      );
      spaceGradient.addColorStop(0, '#020617'); // Slate 950
      spaceGradient.addColorStop(1, '#000000'); // Pure black
      context.fillStyle = spaceGradient;
      context.fillRect(0, 0, width, height);

      // Draw stars
      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed) * 0.5 + 0.5;
        context.beginPath();
        context.arc(star.x * width, star.y * height, star.size, 0, 2 * Math.PI);
        context.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        context.fill();
      });

      // 1. Draw Globe Background (Ocean)
      context.beginPath();
      context.arc(width / 2, height / 2, projection.scale(), 0, 2 * Math.PI);
      
      // Ocean gradient
      const oceanGradient = context.createRadialGradient(
        width / 2 - projection.scale() * 0.3, height / 2 - projection.scale() * 0.3, 0,
        width / 2, height / 2, projection.scale()
      );
      oceanGradient.addColorStop(0, '#0f172a'); // Slate 900
      oceanGradient.addColorStop(1, '#020617'); // Slate 950
      context.fillStyle = oceanGradient;
      context.fill();
      
      // Atmosphere glow effect for the globe
      const atmosphereGradient = context.createRadialGradient(
        width / 2, height / 2, projection.scale() * 0.8,
        width / 2, height / 2, projection.scale() * 1.2
      );
      atmosphereGradient.addColorStop(0, 'rgba(14, 165, 233, 0)');
      atmosphereGradient.addColorStop(0.8, 'rgba(14, 165, 233, 0.2)');
      atmosphereGradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
      
      context.beginPath();
      context.arc(width / 2, height / 2, projection.scale() * 1.2, 0, 2 * Math.PI);
      context.fillStyle = atmosphereGradient;
      context.fill();

      // 2. Draw Graticule
      const graticule = d3.geoGraticule();
      context.beginPath();
      path(graticule());
      context.lineWidth = 0.5;
      context.strokeStyle = 'rgba(56, 189, 248, 0.1)';
      context.stroke();

      // 3. Draw Countries
      context.beginPath();
      path(worldData);
      context.fillStyle = '#1e293b';
      context.fill();
      context.lineWidth = 0.5;
      context.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      context.stroke();

      // 4. Draw Stations
      stations.forEach(station => {
        const [lon, lat] = station.coords;
        const point = projection([lon, lat]);
        
        // Check if point is on the visible side of the globe
        const isVisible = d3.geoDistance(station.coords, [-projection.rotate()[0], -projection.rotate()[1]]) < Math.PI / 2;

        if (point && isVisible) {
          // Draw station marker
          context.beginPath();
          context.arc(point[0], point[1], 4, 0, 2 * Math.PI);
          context.fillStyle = station.color;
          context.fill();
          context.strokeStyle = '#fff';
          context.lineWidth = 1;
          context.stroke();

          // Glow for station
          context.beginPath();
          context.arc(point[0], point[1], 8, 0, 2 * Math.PI);
          context.fillStyle = `${station.color}33`;
          context.fill();

          // Label
          context.font = 'bold 10px Inter';
          context.fillStyle = '#38bdf8';
          context.textAlign = 'center';
          context.fillText(station.name, point[0], point[1] - 12);
        }
      });

      // 5. Draw Satellites and Orbits
      satellites.forEach((sat) => {
        let satLon: number, satLat: number;
        const altitudeScale = sat.type === 'geo' ? 1.5 : 1.12; // Distance from center

        if (sat.type === 'polar') {
          const angle = (time * (sat.speed || 0.001) + (sat.phase || 0)) % (2 * Math.PI);
          const inclinationRad = ((sat.inclination || 98) * Math.PI) / 180;
          const nodeLon = (sat.nodeLon || 0);

          // 极轨卫星坐标计算 (Spherical trigonometry for orbit)
          satLat = Math.asin(Math.sin(angle) * Math.sin(inclinationRad)) * (180 / Math.PI);
          satLon = (Math.atan2(Math.sin(angle) * Math.cos(inclinationRad), Math.cos(angle)) * (180 / Math.PI)) + nodeLon;

          // 模拟地球自转带来的经度偏移 (Longitudinal drift)
          // 地球自转周期为 1440 分钟，极轨卫星约为 100 分钟，比例约为 1:14.4
          const driftSpeed = (sat.speed || 0.001) * (100 / 1440);
          satLon = (satLon - time * driftSpeed) % 360; 
          if (satLon > 180) satLon -= 360;
          if (satLon < -180) satLon += 360;

          // --- Draw Orbital Line ---
          context.beginPath();
          context.setLineDash([2, 4]);
          context.strokeStyle = `${sat.color}22`;
          context.lineWidth = 1;

          for (let a = 0; a <= 2 * Math.PI; a += 0.1) {
            const pLat = Math.asin(Math.sin(a) * Math.sin(inclinationRad)) * (180 / Math.PI);
            let pLon = (Math.atan2(Math.sin(a) * Math.cos(inclinationRad), Math.cos(a)) * (180 / Math.PI)) + nodeLon;
            pLon = (pLon - time * driftSpeed) % 360;
            if (pLon > 180) pLon -= 360;
            if (pLon < -180) pLon += 360;

            const pPointOnSurface = projection([pLon, pLat]);
            if (pPointOnSurface) {
              const dx = pPointOnSurface[0] - width / 2;
              const dy = pPointOnSurface[1] - height / 2;
              const pPoint = [width / 2 + dx * altitudeScale, height / 2 + dy * altitudeScale];

              const pVisible = d3.geoDistance([pLon, pLat], [-projection.rotate()[0], -projection.rotate()[1]]) < Math.PI / 2;
              
              if (pVisible) {
                if (a === 0) context.moveTo(pPoint[0], pPoint[1]);
                else context.lineTo(pPoint[0], pPoint[1]);
              } else {
                context.moveTo(pPoint[0], pPoint[1]);
              }
            }
          }
          context.stroke();
          context.setLineDash([]); // Reset dash
        } else {
          // 静止卫星 (Geostationary)
          satLon = sat.lon || 0;
          satLat = sat.lat || 0;
        }

        const pointOnSurface = projection([satLon, satLat]);
        const isVisible = d3.geoDistance([satLon, satLat], [-projection.rotate()[0], -projection.rotate()[1]]) < Math.PI / 2;

        if (pointOnSurface && isVisible) {
          // Offset point for altitude
          const dx = pointOnSurface[0] - width / 2;
          const dy = pointOnSurface[1] - height / 2;
          const point = [width / 2 + dx * altitudeScale, height / 2 + dy * altitudeScale];

          // Draw satellite
          context.beginPath();
          context.arc(point[0], point[1], sat.type === 'geo' ? 4 : 3, 0, 2 * Math.PI);
          context.fillStyle = sat.color;
          context.fill();

          // 静止卫星增加外圈发光
          if (sat.type === 'geo') {
            context.beginPath();
            context.arc(point[0], point[1], 7, 0, 2 * Math.PI);
            context.strokeStyle = `${sat.color}44`;
            context.lineWidth = 1;
            context.stroke();
          }

          context.font = `bold ${sat.type === 'geo' ? '10px' : '9px'} Orbitron`;
          context.fillStyle = sat.color;
          context.textAlign = 'center';
          context.fillText(sat.name, point[0], point[1] + (sat.type === 'geo' ? 15 : 12));
        }
      });

      // 6. Atmosphere glow (outer)
      context.beginPath();
      context.arc(width / 2, height / 2, projection.scale() * 1.05, 0, 2 * Math.PI);
      const outerGradient = context.createRadialGradient(
        width / 2, height / 2, projection.scale(),
        width / 2, height / 2, projection.scale() * 1.05
      );
      outerGradient.addColorStop(0, 'rgba(14, 165, 233, 0.1)');
      outerGradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
      context.fillStyle = outerGradient;
      context.fill();

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener('click', handleClick);
    };
  }, [worldData, dimensions]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="cursor-move"
      />
      
      {/* Instructions Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-sky-500/10 text-[8px] text-sky-500 font-bold uppercase tracking-widest pointer-events-none">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};

export default Globe3D;
