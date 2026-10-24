import { useEffect, useRef, useState } from 'react';

/**
 * Upgraded CinematicBackground
 * Features:
 * 1. Living multi-layer organic aurora gradients with scroll parallax & mouse sway
 * 2. Interactive neural particle constellation: particles connect with glowing lines and respond to cursor
 * 3. Anamorphic lens flare streak that flares on scroll bursts
 * 4. 35mm analog film grain overlay with toggleable visual HUD
 * 5. Interactive Panavision 70mm Viewfinder HUD with live timecode, lens aperture, and focal length
 */
export function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHudVisible, setIsHudVisible] = useState(true);
  const [isGrainActive, setIsGrainActive] = useState(true);
  const [isConstellationActive, setIsConstellationActive] = useState(true);

  const lastScrollY = useRef(0);
  const velocityTimeout = useRef<number | null>(null);

  // Scroll tracking with velocity measurement
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;
      setScrollY(currentY);
      setScrollVelocity(Math.min(35, Math.max(-35, diff)));
      lastScrollY.current = currentY;

      if (velocityTimeout.current) clearTimeout(velocityTimeout.current);
      velocityTimeout.current = window.setTimeout(() => {
        setScrollVelocity(0);
      }, 100);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (velocityTimeout.current) clearTimeout(velocityTimeout.current);
    };
  }, []);

  // Canvas Neural Particle Constellation with Scroll Warp & Cursor Gravity
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

    // Particle pool with 3D depth and varied palette
    const count = Math.min(85, Math.floor(window.innerWidth / 16));
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      depth: Math.random() * 0.8 + 0.2, // 0.2 (far) to 1.0 (close)
      opacity: Math.random() * 0.5 + 0.25,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: Math.random() > 0.4 ? '#2ead4b' : Math.random() > 0.5 ? '#9fe870' : '#38bdf8',
    }));

    let currentVel = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth velocity interpolation
      currentVel += (scrollVelocity - currentVel) * 0.12;

      // Draw constellation connection lines
      if (isConstellationActive) {
        ctx.lineWidth = 0.6;
        for (let i = 0; i < count; i++) {
          for (let j = i + 1; j < count; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 90) {
              const alpha = (1 - dist / 90) * 0.18 * Math.min(p1.depth, p2.depth);
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

      // Draw particles & interactive mouse sway
      for (const p of particles) {
        // Natural drift + vertical camera warp from scroll
        p.x += p.vx;
        p.y += p.vy - currentVel * p.depth * 0.75;

        // Interactive mouse interaction
        const mdx = mousePos.x - p.x;
        const mdy = mousePos.y - p.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 140 && mdist > 5) {
          const force = (1 - mdist / 140) * 0.8 * p.depth;
          p.x -= (mdx / mdist) * force;
          p.y -= (mdy / mdist) * force;
        }

        // Wrap around viewport edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Render particle with cinematic bokeh soft edges
        const lengthMultiplier = Math.abs(currentVel) > 2 ? Math.min(Math.abs(currentVel) * 1.6, 22) : 1;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * p.depth;

        if (lengthMultiplier > 2) {
          // Motion blur streak during fast camera move
          ctx.beginPath();
          ctx.ellipse(
            p.x,
            p.y,
            p.size * p.depth,
            p.size * p.depth * (lengthMultiplier * 0.6),
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.depth, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [scrollVelocity, mousePos, isConstellationActive]);

  // Calculate cinematic timecode from scroll position
  const minutes = String(Math.floor(scrollY / 1800)).padStart(2, '0');
  const seconds = String(Math.floor((scrollY % 1800) / 30)).padStart(2, '0');
  const frames = String(Math.floor((scrollY % 30) * 0.8)).padStart(2, '0');
  const timecode = `00:${minutes}:${seconds}:${frames}`;
  const frameNumber = String(Math.floor(scrollY / 2) + 100).padStart(4, '0');

  // Focal aperture animation based on scroll velocity
  const aperture = Math.abs(scrollVelocity) > 10 ? 'ƒ/2.8' : 'ƒ/1.2';

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* 1. Multi-Layer Organic Aurora Gradients with Parallax & Mouse Sway */}
      <div
        style={{
          transform: `translate3d(${mousePos.x * 0.015}px, ${-scrollY * 0.22}px, 0)`,
          transition: 'transform 0.15s cubic-bezier(0.1, 0.9, 0.2, 1)',
        }}
        className="absolute -top-[12%] -left-[12%] h-[85vw] w-[85vw] rounded-full bg-gradient-to-tr from-emerald-600/15 via-[#2ead4b]/12 to-transparent blur-[140px] will-change-transform animate-float-slow"
      />
      <div
        style={{
          transform: `translate3d(${-mousePos.x * 0.02}px, ${-scrollY * 0.35}px, 0)`,
          transition: 'transform 0.15s cubic-bezier(0.1, 0.9, 0.2, 1)',
        }}
        className="absolute top-[30%] -right-[15%] h-[75vw] w-[75vw] rounded-full bg-gradient-to-bl from-[#9fe870]/16 via-teal-500/10 to-transparent blur-[150px] will-change-transform animate-float-reverse"
      />
      <div
        style={{
          transform: `translate3d(0, ${-scrollY * 0.18}px, 0)`,
          transition: 'transform 0.15s cubic-bezier(0.1, 0.9, 0.2, 1)',
        }}
        className="absolute top-[70%] left-[15%] h-[65vw] w-[65vw] rounded-full bg-gradient-to-br from-cyan-600/10 via-[#2ead4b]/8 to-transparent blur-[130px] will-change-transform animate-pulse-ring"
      />

      {/* 2. Anamorphic Horizontal Lens Streak on Scroll Surge */}
      <div
        style={{
          opacity: Math.min(0.6, Math.abs(scrollVelocity) / 35),
          transform: `translateY(${Math.min(window.innerHeight * 0.8, scrollY * 0.5 % window.innerHeight)}px)`,
          transition: 'opacity 0.2s ease-out',
        }}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9fe870] to-transparent blur-[1px] pointer-events-none"
      />

      {/* 3. Interactive Neural Particle Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-65" />

      {/* 4. 35mm Analog Film Grain Texture Overlay (GPU-cached tiled pattern) */}
      {isGrainActive && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply dark:mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
      )}

      {/* 5. Viewfinder Corner Brackets & Lens Telemetry */}
      {isHudVisible && (
        <>
          <div className="absolute top-6 left-6 text-slate-400/50 text-xs font-mono tracking-widest hidden md:block">
            ┌ XABI VISION 2.39:1 · 35MM CINEMASCOPE
          </div>
          <div className="absolute top-6 right-6 text-slate-400/50 text-xs font-mono tracking-widest hidden md:block">
            ISO 400 · {aperture} · 24FPS ┐
          </div>
          <div className="absolute bottom-6 left-6 text-slate-400/50 text-xs font-mono tracking-widest hidden md:block">
            └ SHUTTER 1/48 · PANAVISION 70
          </div>
        </>
      )}

      {/* 6. Interactive Floating Cinematic HUD (Bottom Control Pill) */}
      <div className="pointer-events-auto absolute bottom-6 right-8 hidden items-center gap-3 rounded-full border border-slate-300/50 bg-white/80 px-4 py-2 font-mono text-[11px] font-medium text-slate-600 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-black/70 dark:text-slate-300 md:flex">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold text-emerald-600 dark:text-emerald-400">REC ●</span>
        </div>

        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span className="tracking-wider">TC {timecode}</span>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span className="text-[10px] uppercase text-slate-400">FRM #{frameNumber}</span>

        {/* Quick Toggles for Background Atmosphere */}
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

      {/* 7. Subtle Left Edge 70mm Sprocket Perforations */}
      <div className="absolute top-0 bottom-0 left-2 hidden flex-col justify-between py-10 opacity-25 pointer-events-none lg:flex">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="h-4 w-1.5 rounded-sm bg-slate-400/60 shadow-inner" />
        ))}
      </div>
    </div>
  );
}
