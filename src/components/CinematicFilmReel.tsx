import { useEffect, useRef, useState } from 'react';
import { Sparkles, Shield, Cpu, Zap, Landmark, Coins } from 'lucide-react';
import { Card3DTilt } from './Card3DTilt';

interface FilmFrame {
  id: string;
  frameNumber: string;
  title: string;
  subtitle: string;
  tag: string;
  icon: typeof Sparkles;
  stat: string;
  statLabel: string;
}

const frames: FilmFrame[] = [
  {
    id: 'f1',
    frameNumber: '001',
    title: 'Xabi Obsidian Metal',
    subtitle: 'Vervaardigd uit massief titanium. Onmiddellijke freeze via Secure Enclave en dynamische limieten.',
    tag: '70MM HARDWARE',
    icon: Sparkles,
    stat: '16g',
    statLabel: 'Massief Titanium',
  },
  {
    id: 'f2',
    frameNumber: '002',
    title: 'AI Wealth Copilot',
    subtitle: 'Realtime cashflow-modellering en predictieve liquiditeit zonder handmatig rekenwerk.',
    tag: 'INTELLIGENCE ENGINE',
    icon: Cpu,
    stat: '24/7',
    statLabel: 'Proactieve Analyse',
  },
  {
    id: 'f3',
    frameNumber: '003',
    title: 'Instant SEPA Rails',
    subtitle: 'Geldoverdrachten binnen 1,4 seconde in heel Europa. Geen weekend- of feestdagvertraging.',
    tag: 'INFRASTRUCTUUR',
    icon: Zap,
    stat: '< 1.4s',
    statLabel: 'SEPA Settlement',
  },
  {
    id: 'f4',
    frameNumber: '004',
    title: 'Xabi Secure Enclave',
    subtitle: 'Zero-knowledge encryptie en biometrische autorisatie voor elke overschrijving.',
    tag: 'BEVEILIGING',
    icon: Shield,
    stat: '256-bit',
    statLabel: 'AES End-to-End',
  },
  {
    id: 'f5',
    frameNumber: '005',
    title: 'Quantum Initium Holding',
    subtitle: 'Geregistreerde LTD-structuur gebouwd voor generaties vermogen en internationale groei.',
    tag: 'GOVERNANCE',
    icon: Landmark,
    stat: '100%',
    statLabel: 'Transparantie',
  },
  {
    id: 'f6',
    frameNumber: '006',
    title: 'Multi-Valuta Vaults',
    subtitle: 'Houd en converteer euro\'s, dollars, ponden en franken tegen transparante interbancaire tarieven.',
    tag: 'GLOBAL ASSETS',
    icon: Coins,
    stat: '0.0%',
    statLabel: 'Verborgen Markup',
  },
];

export function CinematicFilmReel() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress when container is near viewport
      const totalDist = windowHeight + rect.height;
      const currentPos = windowHeight - rect.top;
      const pct = Math.max(0, Math.min(1, currentPos / totalDist));
      setScrollProgress(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax horizontal offset: shifts from 5% to -45% as user scrolls past
  const translateX = (scrollProgress - 0.5) * -700;

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#070b09] py-24 text-white border-y border-white/10"
    >
      {/* Cinematic Film Perforations (Top Track) */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#040605] border-b border-white/10 flex items-center justify-between px-4 overflow-hidden select-none">
        <div className="flex gap-4">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="h-5 w-3 rounded-[3px] bg-white/20 border border-white/10 shadow-inner shrink-0"
            />
          ))}
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-widest text-emerald-400/80 md:block">
          70MM PANAVISION · COLOR BY XABI LABS · SCENE SEQUENCE
        </span>
      </div>

      {/* Header over Reel */}
      <div className="marketing-container relative z-10 pt-4 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-medium text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              CINEMATIC FILM SCROLL
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.04em] text-white">
              Het Xabi Ecosysteem in <span className="text-gradient">6 Scènes</span>.
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/60 leading-relaxed font-sans">
            Scroll door de filmische sequentie van onze kerninnovaties. Elk frame vertegenwoordigt een pijler van moderne financiële soevereiniteit.
          </p>
        </div>
      </div>

      {/* Film Reel Horizontal Track moving with Scroll Parallax */}
      <div className="relative overflow-x-hidden py-4">
        <div
          style={{
            transform: `translate3d(${translateX}px, 0, 0)`,
            transition: 'transform 0.08s ease-out',
          }}
          className="flex gap-6 px-8 w-max will-change-transform"
        >
          {frames.map((frame, index) => {
            const Icon = frame.icon;
            return (
              <div key={frame.id} className="w-[340px] sm:w-[400px] shrink-0">
                <Card3DTilt maxTilt={12}>
                  <div className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/[0.02] p-8 backdrop-blur-2xl shadow-2xl h-[420px] flex flex-col justify-between group hover:border-emerald-400/50 transition-colors">
                    {/* Frame Top Meta */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs font-mono text-white/50">
                      <span className="text-emerald-400 font-bold tracking-wider">
                        FRAME #{frame.frameNumber}
                      </span>
                      <span className="uppercase tracking-widest text-[10px]">
                        {frame.tag}
                      </span>
                    </div>

                    {/* Frame Center Content */}
                    <div className="my-auto">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-[#9fe870] mb-6 border border-emerald-400/20 shadow-lg shadow-emerald-950/40">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-white tracking-[-0.03em] group-hover:text-emerald-300 transition-colors">
                        {frame.title}
                      </h3>
                      <p className="mt-3 text-sm text-white/70 leading-relaxed font-sans">
                        {frame.subtitle}
                      </p>
                    </div>

                    {/* Frame Bottom Stat */}
                    <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-white/40 font-mono font-medium">
                          {frame.statLabel}
                        </p>
                        <p className="text-2xl font-black text-white mt-0.5 tracking-tight font-mono">
                          {frame.stat}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-emerald-400/80 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                        SCÈNE 0{index + 1}
                      </span>
                    </div>
                  </div>
                </Card3DTilt>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cinematic Film Perforations (Bottom Track) */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#040605] border-t border-white/10 flex items-center justify-between px-4 overflow-hidden select-none">
        <div className="flex gap-4">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="h-5 w-3 rounded-[3px] bg-white/20 border border-white/10 shadow-inner shrink-0"
            />
          ))}
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-widest text-emerald-400/80 md:block">
          ROLL #2026-XABI · ASPECT RATIO 2.39:1 · CINEMASCOPE
        </span>
      </div>
    </section>
  );
}
