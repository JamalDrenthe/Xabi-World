import { useEffect, useRef, useState } from 'react';

/**
 * Ultra High-Performance Cinematic Background
 * Optimized with useRef animation loop (0% React re-render thrashing)
 * 1. Living organic aurora gradients with pure CSS floating animations
 * 2. 60fps Neural Particle Constellation on HTML5 Canvas
 * 3. GPU-cached tiled film grain
 * 4. 70mm Panavision Viewfinder HUD & telemetry pill
 */
export function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollRef = useRef({ y: 0, lastY: 0, velocity: 0 });

  const [isHudVisible, setIsHudVisible] = useState(true);
  const [isGrainActive, setIsGrainActive] = useState(true);
  const [isConstellationActive, setIsConstellationActive] = useState(true);

  // Throttled telemetry state for the HUD (updated smoothly at max 4Hz)
  const [hudStats, setHudStats] = useState({
    timecode: '00:00:00:00',
    frameNumber: '0100',
    aperture: 'ƒ/1.2',
  });

  // Track scroll and mouse without triggering React state re-renders
  useEffect(() => {
    let velocityDecayTimeout: number | null = null;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - scrollRef.current.lastY;
      scrollRef.current.y = currentY;
      scrollRef.current.velocity = Math.min(30, Math.max(-30, diff));
      scrollRef.current.lastY = currentY;

      if (velocityDecayTimeout) clearTimeout(velocityDecayTimeout);
      velocityDecayTimeout = window.setTimeout(() => {
        scrollRef.current.velocity = 0;
      }, 120);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Smooth HUD telemetry updater every 250ms
    const hudInterval = setInterval(() => {
      const scrollY = scrollRef.current.y;
      const vel = scrollRef.current.velocity;

      const minutes = String(Math.floor(scrollY / 1800)).padStart(2, '0');
      const seconds = String(Math.floor((scrollY % 1800) / 30)).padStart(2, '0');
      const frames = String(Math.floor((scrollY % 30) * 0.8)).padStart(2, '0');
      const timecode = `00:${minutes}:${seconds}:${frames}`;
      const frameNumber = String(Math.floor(scrollY / 2) + 100).padStart(4, '0');
      const aperture = Math.abs(vel) > 8 ? 'ƒ/2.8' : 'ƒ/1.2';

      setHudStats({ timecode, frameNumber, aperture });
    }, 250);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (velocityDecayTimeout) clearTimeout(velocityDecayTimeout);
      clearInterval(hudInterval);
    };
  }, []);

  // 60FPS Canvas Neural Particle Constellation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Optimized particle pool
    const count = Math.min(70, Math.max(25, Math.floor(window.innerWidth / 22)));
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.0 + 0.8,
      depth: Math.random() * 0.8 + 0.2,
      opacity: Math.random() * 0.45 + 0.25,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      color: Math.random() > 0.4 ? '#2ead4b' : Math.random() > 0.5 ? '#9fe870' : '#38bdf8',
    }));

    let currentVel = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth camera velocity interpolation from scrollRef
      currentVel += (scrollRef.current.velocity - currentVel) * 0.1;

      // Draw constellation connection lines
      if (isConstellationActive) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < count; i++) {
          for (let j = i + 1; j < Math.min(i + 8, count); j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 85) {
              const alpha = (1 - dist / 85) * 0.16 * Math.min(p1.depth, p2.depth);
              ctx.strokeStyle = p1.color;
              ctx.globalAlpha = alpha;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw particles & subtle cursor sway
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      for (let i = 0; i < count; i++) {
        const p = particles[i];

        // Drift + scroll parallax
        p.x += p.vx;
        p.y += p.vy - currentVel * p.depth * 0.6;

        // Interactive cursor repulsion
        const mdx = mouseX - p.x;
        const mdy = mouseY - p.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 120 && mdist > 2) {
          const force = (1 - mdist / 120) * 0.6 * p.depth;
          p.x -= (mdx / mdist) * force;
          p.y -= (mdy / mdist) * force;
        }

        // Screen wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * p.depth;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.depth, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isConstellationActive]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* 1. Multi-Layer Organic Aurora Gradients */}
      <div className="absolute -top-[10%] -left-[10%] h-[75vw] w-[75vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-tr from-emerald-600/18 via-[#2ead4b]/12 to-transparent blur-[120px] will-change-transform animate-float-slow" />
      <div className="absolute top-[28%] -right-[12%] h-[65vw] w-[65vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-bl from-[#9fe870]/18 via-teal-500/10 to-transparent blur-[130px] will-change-transform animate-float-reverse" />
      <div className="absolute top-[65%] left-[10%] h-[60vw] w-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-br from-cyan-600/10 via-[#2ead4b]/8 to-transparent blur-[120px] will-change-transform animate-pulse-ring" />

      {/* 2. Neural Particle Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-65" />

      {/* 3. 35mm Analog Film Grain Texture Overlay (GPU-cached tiled pattern) */}
      {isGrainActive && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply dark:mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
      )}

      {/* 4. Viewfinder Corner Brackets & Lens Telemetry */}
      {isHudVisible && (
        <>
          <div className="absolute top-6 left-6 text-slate-400/50 text-xs font-mono tracking-widest hidden md:block">
            ┌ XABI VISION 2.39:1 · 35MM CINEMASCOPE
          </div>
          <div className="absolute top-6 right-6 text-slate-400/50 text-xs font-mono tracking-widest hidden md:block">
            ISO 400 · {hudStats.aperture} · 24FPS ┐
          </div>
          <div className="absolute bottom-6 left-6 text-slate-400/50 text-xs font-mono tracking-widest hidden md:block">
            └ SHUTTER 1/48 · PANAVISION 70
          </div>
        </>
      )}

      {/* 5. Interactive Floating Cinematic HUD (Bottom Control Pill) */}
      <div className="pointer-events-auto absolute bottom-6 right-8 hidden items-center gap-3 rounded-full border border-slate-300/50 bg-white/85 px-4 py-2 font-mono text-[11px] font-medium text-slate-700 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-black/75 dark:text-slate-300 md:flex">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold text-emerald-600 dark:text-emerald-400">REC ●</span>
        </div>

        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span className="tracking-wider">TC {hudStats.timecode}</span>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span className="text-[10px] uppercase text-slate-400">FRM #{hudStats.frameNumber}</span>

        {/* Quick Toggles */}
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <div className="flex items-center gap-1.5 text-[10px]">
          <button
            type="button"
            onClick={() => setIsGrainActive((g) => !g)}
            title="Schakel 35mm Film Grain in/uit"
            className={`px-1.5 py-0.5 rounded transition ${
              isGrainActive ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            GRAIN
          </button>
          <button
            type="button"
            onClick={() => setIsConstellationActive((c) => !c)}
            title="Schakel Neural Mesh Constellatie in/uit"
            className={`px-1.5 py-0.5 rounded transition ${
              isConstellationActive ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            MESH
          </button>
          <button
            type="button"
            onClick={() => setIsHudVisible((h) => !h)}
            title="Toon/verberg viewfinder overlays"
            className={`px-1.5 py-0.5 rounded transition ${
              isHudVisible ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            HUD
          </button>
        </div>
      </div>

      {/* 6. Subtle Left Edge 70mm Sprocket Perforations */}
      <div className="absolute top-0 bottom-0 left-2 hidden flex-col justify-between py-10 opacity-25 pointer-events-none lg:flex">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="h-4 w-1.5 rounded-sm bg-slate-400/60 shadow-inner" />
        ))}
      </div>
    </div>
  );
}
