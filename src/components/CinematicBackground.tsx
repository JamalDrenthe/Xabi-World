import { useEffect, useRef, useState } from 'react';

/**
 * CinematicBackground
 * Provides an atmospheric moving background with:
 * 1. Animated drifting gradient aurora orbs with scroll parallax
 * 2. 3D particle dust motes that react to scroll velocity (hyperspace/film camera warp)
 * 3. 35mm film grain overlay via GPU-composited SVG noise
 * 4. Cinematic viewfinder HUD with dynamic scroll timecode and frame counter
 */
export function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const lastScrollY = useRef(0);
  const velocityTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;
      setScrollY(currentY);
      setScrollVelocity(Math.min(30, Math.max(-30, diff)));
      lastScrollY.current = currentY;

      if (velocityTimeout.current) clearTimeout(velocityTimeout.current);
      velocityTimeout.current = window.setTimeout(() => {
        setScrollVelocity(0);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (velocityTimeout.current) clearTimeout(velocityTimeout.current);
    };
  }, []);

  // Canvas Particle Dust Motes with Scroll Parallax
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

    // Particle definition
    const count = 90;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      depth: Math.random() * 0.8 + 0.2, // 0.2 (far) to 1.0 (close)
      opacity: Math.random() * 0.5 + 0.2,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      color: Math.random() > 0.4 ? '#2ead4b' : Math.random() > 0.5 ? '#9fe870' : '#ffffff',
    }));

    let currentVel = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth velocity interpolation
      currentVel += (scrollVelocity - currentVel) * 0.1;

      for (const p of particles) {
        // Natural drift + vertical camera warp from scroll
        p.x += p.vx;
        p.y += p.vy - currentVel * p.depth * 0.7;

        // Wrap around viewport edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Render particle with cinematic bokeh soft edges
        const lengthMultiplier = Math.abs(currentVel) > 2 ? Math.min(Math.abs(currentVel) * 1.5, 18) : 1;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * p.depth;

        if (lengthMultiplier > 2) {
          // Motion blur streak during fast scroll
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
  }, [scrollVelocity]);

  // Calculate cinematic timecode from scroll position
  const minutes = String(Math.floor(scrollY / 1800)).padStart(2, '0');
  const seconds = String(Math.floor((scrollY % 1800) / 30)).padStart(2, '0');
  const frames = String(Math.floor((scrollY % 30) * 0.8)).padStart(2, '0');
  const timecode = `00:${minutes}:${seconds}:${frames}`;
  const frameNumber = String(Math.floor(scrollY / 2) + 100).padStart(4, '0');

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* 1. Moving Aurora Glow Gradients with Scroll Parallax */}
      <div
        style={{
          transform: `translate3d(0, ${-scrollY * 0.22}px, 0)`,
          transition: 'transform 0.1s cubic-bezier(0.1, 0.9, 0.2, 1)',
        }}
        className="absolute -top-[10%] -left-[10%] h-[80vw] w-[80vw] rounded-full bg-emerald-500/12 blur-[120px] will-change-transform animate-float-slow"
      />
      <div
        style={{
          transform: `translate3d(0, ${-scrollY * 0.35}px, 0)`,
          transition: 'transform 0.1s cubic-bezier(0.1, 0.9, 0.2, 1)',
        }}
        className="absolute top-[35%] -right-[15%] h-[70vw] w-[70vw] rounded-full bg-[#9fe870]/14 blur-[130px] will-change-transform animate-float-reverse"
      />
      <div
        style={{
          transform: `translate3d(0, ${-scrollY * 0.15}px, 0)`,
          transition: 'transform 0.1s cubic-bezier(0.1, 0.9, 0.2, 1)',
        }}
        className="absolute top-[75%] left-[20%] h-[60vw] w-[60vw] rounded-full bg-teal-600/10 blur-[110px] will-change-transform animate-pulse-ring"
      />

      {/* 2. Interactive Canvas Particle Dust */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-60" />

      {/* 3. 35mm Analog Film Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.038] mix-blend-color-burn dark:mix-blend-overlay">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="cinematic-film-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#cinematic-film-grain)" />
        </svg>
      </div>

      {/* 4. Cinematic Viewfinder Corner Crosshairs */}
      <div className="absolute top-6 left-6 text-slate-400/40 text-xs font-mono tracking-widest hidden md:block">
        ┌ XABI VISION 2.39:1
      </div>
      <div className="absolute top-6 right-6 text-slate-400/40 text-xs font-mono tracking-widest hidden md:block">
        ISO 400 · 24FPS ┐
      </div>

      {/* 5. Floating Cinematic HUD (Bottom Bar) */}
      <div className="absolute bottom-6 right-8 hidden items-center gap-4 rounded-full border border-slate-300/40 bg-white/70 px-4 py-2 font-mono text-[11px] font-medium text-slate-600 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-black/60 dark:text-slate-300 md:flex">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold text-emerald-600 dark:text-emerald-400">REC</span>
        </div>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span className="tracking-wider">TC {timecode}</span>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span className="text-[10px] uppercase text-slate-400">FRM #{frameNumber}</span>
      </div>

      {/* 6. Subtle Left Edge Film Sprocket Track (Cinematic Film Strip Notch) */}
      <div className="absolute top-0 bottom-0 left-2 hidden flex-col justify-between py-10 opacity-20 pointer-events-none lg:flex">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="h-4 w-1.5 rounded-sm bg-slate-400/60" />
        ))}
      </div>
    </div>
  );
}
