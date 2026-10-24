import { useState, useEffect, Fragment } from 'react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import type { FormEvent, ReactNode } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Globe2,
  Landmark,
  LineChart,
  LockKeyhole,
  Menu,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Target,
  Wallet,
  X,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Copy,
  HelpCircle,
  Zap,
  TrendingUp,
  ChevronDown,
  Handshake,
  Building2,
  Calculator,
  CheckCircle2,
  Cpu,
  Layers,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth, DEMO_ACCOUNTS } from '@/lib/auth-context';
import { MotionCanvas3D } from '@/components/MotionCanvas3D';
import { Card3DTilt } from '@/components/Card3DTilt';
import { ScrollProgressBar, ScrollReveal, AnimatedCounter } from '@/components/ScrollAnimations';
import { CinematicBackground } from '@/components/CinematicBackground';
import { CinematicFilmReel } from '@/components/CinematicFilmReel';

export type PublicRoute = 'home' | 'about' | 'platform' | 'company' | 'pricing' | 'partnerships' | 'register' | 'login' | 'contact';

interface MarketingLayoutProps {
  route: PublicRoute;
  navigate: (route: PublicRoute) => void;
  children: ReactNode;
}

interface LoginPageProps {
  onLogin: () => void;
  navigate: (route: PublicRoute) => void;
}

const navItems: Array<{ route: PublicRoute; label: string }> = [
  { route: 'about', label: 'Over Xabi' },
  { route: 'platform', label: 'Platform' },
  { route: 'pricing', label: 'Prijzen' },
  { route: 'partnerships', label: 'Samenwerkingen' },
  { route: 'company', label: 'Holding' },
  { route: 'contact', label: 'Contact' },
];

function MarketingLayout({ route, navigate, children }: MarketingLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (nextRoute: PublicRoute) => {
    setMenuOpen(false);
    navigate(nextRoute);
  };

  return (
    <div className="marketing-shell min-h-screen flex flex-col relative">
      <CinematicBackground />
      <ScrollProgressBar />
      <header
        className={`marketing-nav sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 dark:bg-[#0b1714]/85 backdrop-blur-xl shadow-sm border-b border-slate-200/80 py-1'
            : 'bg-transparent'
        }`}
      >
        <div className="marketing-container flex h-20 items-center justify-between">
          <Logo onClick={() => { window.location.hash = '#home'; }} />
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <button
                className={`marketing-nav-link ${route === item.route ? 'is-active' : ''}`}
                key={item.route}
                onClick={() => handleNavigate(item.route)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <button className="marketing-quiet-button" onClick={() => handleNavigate('login')} type="button">
              Inloggen
            </button>
            <button className="marketing-primary-button" onClick={() => handleNavigate('register')} type="button">
              Word lid <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <button
            aria-label={menuOpen ? 'Menu sluiten' : 'Menu openen'}
            className="marketing-mobile-toggle md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="marketing-mobile-menu md:hidden">
            {navItems.map((item) => (
              <button key={item.route} onClick={() => handleNavigate(item.route)} type="button">
                {item.label}
              </button>
            ))}
            <button onClick={() => handleNavigate('login')} type="button">
              Inloggen
            </button>
            <button className="marketing-primary-button justify-center" onClick={() => handleNavigate('register')} type="button">
              Word lid <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </header>
      <div className="flex-1">
        {children}
      </div>
      <footer className="marketing-footer">
        <div className="marketing-container grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo onClick={() => { window.location.hash = '#home'; }} />
            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-500">
              De wereld rond je financiële toekomst. Heldere inzichten, gebouwd voor de volgende stap.
            </p>
          </div>
          <FooterColumn title="Verken" items={[['Over Xabi', 'about'], ['Platform', 'platform'], ['Holding', 'company'], ['Samenwerkingen', 'partnerships']]} navigate={navigate} />
          <FooterColumn title="Diensten" items={[['Prijzen & Pakketten', 'pricing'], ['Contact', 'contact'], ['Inloggen', 'login']]} navigate={navigate} />
          <div>
            <p className="marketing-eyebrow">Contact & Conciërge</p>
            <a className="mt-4 block text-sm font-semibold text-emerald-800 hover:text-emerald-950" href="mailto:info@xabi.world">
              info@xabi.world
            </a>
            <p className="mt-1 text-xs text-slate-500">Herengracht 420, Amsterdam</p>
            <p className="mt-1 text-xs text-slate-400">Response binnen 2 uur</p>
          </div>
        </div>
        <div className="marketing-container flex flex-col gap-3 border-t border-slate-200 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Xabi World. Een LTD binnen Quantum Initium Holding.</span>
          <span>Beveiligd met 256-bit AES Enclave · info@xabi.world</span>
        </div>
      </footer>
    </div>
  );
}

function FooterColumn({
  title,
  items,
  navigate,
}: {
  title: string;
  items: Array<[string, PublicRoute]>;
  navigate: (route: PublicRoute) => void;
}) {
  return (
    <div>
      <p className="marketing-eyebrow">{title}</p>
      <div className="mt-4 space-y-3">
        {items.map(([label, route]) => (
          <button className="marketing-footer-link" key={label} onClick={() => navigate(route)} type="button">
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function LandingPage({ navigate }: { navigate: (route: PublicRoute) => void }) {
  return (
    <MarketingLayout navigate={navigate} route="home">
      <main>
        <section className="marketing-hero">
          <div className="marketing-container relative grid gap-14 pb-24 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-32 lg:pt-24">
            <div className="relative z-10">
              <div className="marketing-kicker">
                <span className="marketing-kicker-dot" />
                De toekomst van financieel overzicht
              </div>
              <h1 className="marketing-display mt-7 max-w-4xl">
                Zie het grotere
                <span className="marketing-display-accent"> geheel.</span>
              </h1>
              <p className="marketing-lead mt-7 max-w-xl">
                Xabi World brengt je geld, doelen en mogelijkheden samen in één rustige omgeving. Minder ruis. Meer richting.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button className="marketing-primary-button justify-center" onClick={() => navigate('login')} type="button">
                  Ga naar je dashboard <ArrowUpRight className="h-4 w-4" />
                </button>
                <button className="marketing-outline-button justify-center" onClick={() => navigate('platform')} type="button">
                  Bekijk de platform <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-700" /> Ontworpen met privacy in gedachten</span>
                <span className="inline-flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-emerald-700" /> Jouw overzicht, jouw tempo</span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
              {/* Interactive 3D Canvas Sphere in Background */}
              <div className="absolute -top-16 -right-16 h-80 w-80 pointer-events-none -z-10 opacity-70">
                <MotionCanvas3D radius={160} particleCount={130} />
              </div>
              <div className="marketing-orbit marketing-orbit-one" />
              <div className="marketing-orbit marketing-orbit-two" />
              <Card3DTilt maxTilt={10}>
                <div className="marketing-dashboard-card shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">Jouw wereld</p>
                      <p className="mt-1 text-lg font-medium text-white">Overzicht</p>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"><Sparkles className="h-4 w-4" /></span>
                  </div>
                  <div className="mt-8">
                    <p className="text-sm text-white/55">Totale balans</p>
                    <p className="mt-2 text-4xl font-medium tracking-[-0.06em] text-white">€ 39.187,70</p>
                    <div className="mt-5 flex items-center gap-2 text-sm text-emerald-300">
                      <span className="rounded-full bg-emerald-400/15 px-2 py-1">+8,4%</span>
                      <span className="text-white/45">deze maand</span>
                    </div>
                  </div>
                  <div className="mt-10 flex h-32 items-end gap-2">
                    {[28, 38, 32, 52, 48, 68, 61, 82, 72, 96].map((height, index) => (
                      <div className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-400/30 to-lime-200" key={index} style={{ height: `${height}%` }} />
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between text-xs text-white/35">
                    <span>MEI</span><span>JUN</span><span>JUL</span><span>AUG</span><span>SEP</span><span>OKT</span>
                  </div>
                </div>
              </Card3DTilt>
              <div className="marketing-float-card marketing-float-card-top animate-float-slow">
                <span className="marketing-float-icon"><Target className="h-4 w-4" /></span>
                <div><p className="text-xs text-slate-400">Doel in zicht</p><p className="mt-1 text-sm font-semibold text-slate-900">Wereldreis 2027 · 72%</p></div>
              </div>
              <div className="marketing-float-card marketing-float-card-bottom animate-float-reverse">
                <span className="marketing-float-icon bg-lime-100 text-lime-800"><Globe2 className="h-4 w-4" /></span>
                <div><p className="text-xs text-slate-400">Wereldwijd gebouwd</p><p className="mt-1 text-sm font-semibold text-slate-900">Voor jouw volgende stap</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="marketing-section bg-white">
          <div className="marketing-container py-24 lg:py-32">
            <ScrollReveal animation="fade-up">
              <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
                <div>
                  <p className="marketing-eyebrow">Waarom Xabi</p>
                  <h2 className="marketing-section-title mt-5">Financiële helderheid voelt als ruimte.</h2>
                </div>
                <div className="grid gap-8 sm:grid-cols-3">
                  <FeatureCard number="01" title="Zie wat telt" text="Van dagelijkse bewegingen tot lange doelen: alles krijgt een plek die logisch voelt." />
                  <FeatureCard number="02" title="Kies bewuster" text="Krijg de context om keuzes te maken die passen bij het leven dat je wilt bouwen." />
                  <FeatureCard number="03" title="Beweeg vooruit" text="Maak van inzicht een gewoonte en geef je volgende stap meer richting." />
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={150}>
              <div className="mt-20 grid gap-px overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-8">
                  <p className="text-3xl font-black tracking-[-0.04em] text-emerald-900">
                    <AnimatedCounter value={39187.7} prefix="€ " decimals={2} />
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Voorbeeldsaldo over drie rekeningen</p>
                </div>
                <div className="bg-white p-8">
                  <p className="text-3xl font-black tracking-[-0.04em] text-emerald-900">
                    <AnimatedCounter value={4} suffix=" domeinen" />
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Betalingen, kaarten, beleggen, sparen</p>
                </div>
                <div className="bg-white p-8">
                  <p className="text-3xl font-black tracking-[-0.04em] text-emerald-900">NL & EN</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Eén omgeving, volledig tweetalig</p>
                </div>
                <div className="bg-white p-8">
                  <p className="text-3xl font-black tracking-[-0.04em] text-emerald-900">
                    <AnimatedCounter value={100} suffix="% self-service" />
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Inzicht en actie zonder wachttijd</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="marketing-section bg-white">
          <div className="marketing-container py-24 lg:py-32">
            <ScrollReveal animation="fade-up">
              <div className="max-w-2xl">
                <p className="marketing-eyebrow">Hoe Xabi werkt</p>
                <h2 className="marketing-section-title mt-5">Van gegevens naar richting, in drie stappen.</h2>
              </div>
            </ScrollReveal>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              <ScrollReveal animation="fade-up" delay={100}>
                <Card3DTilt>
                  <StepCard icon={<Wallet className="h-5 w-5" />} step="Stap 1" title="Verbind je wereld" text="Rekeningen, kaarten en doelen komen samen in één helder dashboard — alles in euro's, alles in één blik." />
                </Card3DTilt>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={200}>
                <Card3DTilt>
                  <StepCard icon={<LineChart className="h-5 w-5" />} step="Stap 2" title="Lees je patronen" text="Activiteit, uitgaven en beleggingen worden begrijpelijk gemaakt zodat je precies weet waar je staat." />
                </Card3DTilt>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={300}>
                <Card3DTilt>
                  <StepCard icon={<PiggyBank className="h-5 w-5" />} step="Stap 3" title="Bouw aan je doelen" text="Spaardoelen volgen mee met je voortgang — inzicht wordt een gewoonte, geen klus." />
                </Card3DTilt>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 70mm Panavision Cinematic Film Scroll Experience */}
        <CinematicFilmReel />

        <section className="marketing-section bg-white">
          <div className="marketing-container pb-24 lg:pb-32">
            <ScrollReveal animation="zoom-in">
              <div className="rounded-[2rem] border border-slate-200 bg-[#f8faf6] p-8 md:p-14">
                <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                  <div>
                    <p className="marketing-eyebrow">Vertrouwen als fundament</p>
                    <h2 className="marketing-section-title mt-5">Zakelijk betrouwbaar. Persoonlijk gebouwd.</h2>
                    <p className="mt-6 max-w-xl text-base leading-8 text-slate-500">
                      Xabi World is een LTD binnen Quantum Initium Holding. Achter elke pixel zit een belofte: helderheid over je geld moet net zo vanzelfsprekend voelen als de rest van je wereld.
                    </p>
                  </div>
                  <ul className="space-y-4">
                    {[
                      { icon: <ShieldCheck className="h-4 w-4" />, text: 'Privacy-by-design in elke laag van het platform' },
                      { icon: <LockKeyhole className="h-4 w-4" />, text: 'Versleutelde sessies en duidelijke toegangscontrole' },
                      { icon: <Landmark className="h-4 w-4" />, text: 'Onderdeel van Quantum Initium Holding' },
                    ].map((item) => (
                      <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600" key={item.text}>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">{item.icon}</span>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="marketing-section marketing-deep-section">
          <div className="marketing-container grid gap-12 py-24 lg:grid-cols-[1fr_0.85fr] lg:items-end lg:py-32">
            <ScrollReveal animation="slide-left">
              <div>
                <p className="marketing-eyebrow text-emerald-300">Een bredere blik</p>
                <h2 className="marketing-section-title mt-5 max-w-2xl text-white">Je financiële wereld is groter dan een saldo.</h2>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="slide-right">
              <div>
                <p className="text-base leading-8 text-white/55">
                  Xabi World is de plek waar overzicht en ambitie samenkomen. Een platform voor mensen die niet alleen willen bijhouden, maar vooruit willen kijken.
                </p>
                <button className="marketing-light-button mt-8" onClick={() => navigate('about')} type="button">
                  Ontdek het verhaal <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="marketing-section bg-[#f2f5ef]">
          <div className="marketing-container py-24 lg:py-32">
            <ScrollReveal animation="fade-up">
              <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div><p className="marketing-eyebrow">Klaar voor meer overzicht?</p><h2 className="marketing-section-title mt-5 max-w-2xl">Begin bij de wereld die je al hebt.</h2></div>
                <button className="marketing-primary-button" onClick={() => navigate('login')} type="button">Open Xabi World <ArrowUpRight className="h-4 w-4" /></button>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}

function FeatureCard({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="border-t border-slate-200 pt-5">
      <span className="text-xs font-semibold tracking-[0.16em] text-emerald-700">{number}</span>
      <h3 className="mt-6 text-lg font-semibold tracking-[-0.03em] text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

function StepCard({ icon, step, title, text }: { icon: ReactNode; step: string; title: string; text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/5">
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{step}</span>
      </div>
      <h3 className="mt-8 text-xl font-semibold tracking-[-0.03em] text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

export function AboutPage({ navigate }: { navigate: (route: PublicRoute) => void }) {
  return (
    <MarketingLayout navigate={navigate} route="about">
      <main>
        {/* Hero with 3D Core Sphere */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0b1714] via-[#0f231d] to-[#0b1714] text-white py-24 lg:py-36">
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <MotionCanvas3D className="w-full h-full opacity-60" radius={220} particleCount={180} />
          </div>

          <div className="marketing-container relative z-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Over Xabi World & Quantum Initium Holding
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.05em] leading-[1.08] text-white">
                Financiële helderheid als <span className="text-gradient">fundament</span> voor ambitie.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-white/70">
                Xabi World begon als een zoektocht naar rust in een overprikkelde financiële wereld. Vandaag is het uitgegroeid tot een geavanceerd vermogensplatform waarin intelligente automatisering, menselijke regie en radicale transparantie samenkomen.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('pricing')}
                  className="rounded-2xl bg-[#9fe870] px-6 py-3.5 text-sm font-bold text-[#0b1714] shadow-lg shadow-emerald-500/20 hover:bg-[#8fd860] transition-all flex items-center gap-2"
                  type="button"
                >
                  Ontdek de lidmaatschappen <ArrowUpRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate('contact')}
                  className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/10 transition-all flex items-center gap-2"
                  type="button"
                >
                  Neem contact op <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative">
              <Card3DTilt maxTilt={14} className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-[#9fe870]">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/50">Holding Structuur</p>
                      <p className="text-sm font-bold text-white">Quantum Initium Holding</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                    LTD Status
                  </span>
                </div>
                <div className="mt-6 space-y-4 text-xs text-white/70">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span>Oprichtingsbasis:</span>
                    <span className="font-semibold text-white">Amsterdam, Nederland</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span>Platform Beveiliging:</span>
                    <span className="font-semibold text-[#9fe870]">256-bit AES Enclave</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span>SEPA Netwerk:</span>
                    <span className="font-semibold text-white">Instant Credit Transfers (&lt; 2s)</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Centraal Contact:</span>
                    <span className="font-mono font-medium text-emerald-300">info@xabi.world</span>
                  </div>
                </div>
              </Card3DTilt>
            </div>
          </div>
        </section>

        {/* Section: De Evolutie (Van Sabi naar Xabi World) */}
        <section className="marketing-section bg-white">
          <div className="marketing-container py-24 lg:py-32">
            <ScrollReveal animation="fade-up">
              <div className="text-center max-w-2xl mx-auto">
                <p className="marketing-eyebrow">Onze Oorsprong</p>
                <h2 className="marketing-section-title mt-4">De Evolutie: Van Sabi naar Xabi World</h2>
                <p className="mt-5 text-base text-slate-500 leading-relaxed">
                  Hoe een eenvoudig idee over financiële rust uitgroeide tot een compleet internationaal vermogensecosysteem.
                </p>
              </div>
            </ScrollReveal>

            <div className="mt-20 grid gap-8 md:grid-cols-3">
              <ScrollReveal animation="fade-up" delay={100}>
                <Card3DTilt className="h-full rounded-3xl border border-slate-200 bg-[#f8faf6] p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-700">2024 · Fase 1</span>
                    <h3 className="text-2xl font-black text-slate-950 mt-3">Sabi</h3>
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                      De eerste verkenning. Een minimalistisch, stil inzichtscanvas ontworpen voor mensen die verloren raakten in de drukke interfaces van traditionele banken. Eenvoud boven alles.
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-200/80 text-xs font-semibold text-slate-400">
                    Concept & Visuele Rust
                  </div>
                </Card3DTilt>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={200}>
                <Card3DTilt className="h-full rounded-3xl border border-slate-200 bg-[#f8faf6] p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-700">2025 · Fase 2</span>
                    <h3 className="text-2xl font-black text-slate-950 mt-3">SabiBank</h3>
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                      Van inzicht naar actie. De introductie van echte rekeningen, debet- en creditcards, automatische spaardoelen en de fundamenten voor instant betalingsverkeer.
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-200/80 text-xs font-semibold text-slate-400">
                    Rekeningen & Betaalkaarten
                  </div>
                </Card3DTilt>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={300}>
                <Card3DTilt className="h-full rounded-3xl border-2 border-[#2ead4b]/30 bg-gradient-to-b from-emerald-50/50 to-white p-8 flex flex-col justify-between shadow-xl shadow-emerald-950/5">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-700">
                      <Sparkles className="h-3 w-3" /> 2026 · Heden
                    </span>
                    <h3 className="text-2xl font-black text-slate-950 mt-3">Xabi World</h3>
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                      Een LTD binnen Quantum Initium Holding. Een compleet platform voor particulieren, vermogensbeleggers en zakelijke ondernemers met AI Copilot, portfoliobeheer en holdingintegratie.
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-emerald-200 text-xs font-bold text-emerald-700 flex items-center justify-between">
                    <span>Volledig Ecosysteem</span>
                    <span>Actief</span>
                  </div>
                </Card3DTilt>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Section: De 4 Pijlers */}
        <section className="marketing-section bg-[#f2f5ef]">
          <div className="marketing-container py-24 lg:py-32">
            <ScrollReveal animation="fade-up">
              <div className="max-w-2xl">
                <p className="marketing-eyebrow">Onze Filosofie</p>
                <h2 className="marketing-section-title mt-4">De Vier Pijlers van Xabi World</h2>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  Elk detail in ons platform rust op vier ononderhandelbare principes.
                </p>
              </div>
            </ScrollReveal>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <ShieldCheck className="h-6 w-6 text-emerald-700" />,
                  title: 'Soevereine Privacy',
                  text: 'Jouw data is van jou. Geen verkoop aan adverteerders, geen kredietprofielen delen. Volledige versleuteling via de Xabi Secure Enclave.',
                },
                {
                  icon: <Zap className="h-6 w-6 text-emerald-700" />,
                  title: 'Instant Snelheid',
                  text: 'SEPA Instant overboekingen binnen milliseconden, live transactie-inzichten en realtime kaartblokkade zonder tussenkomst van helpdesks.',
                },
                {
                  icon: <TrendingUp className="h-6 w-6 text-emerald-700" />,
                  title: 'Vermogensintelligentie',
                  text: 'Geen droge tabellen, maar proactieve AI-assistentie die cashflowtrends herkent, spaardoelen berekent en portfolio-allocatie optimaliseert.',
                },
                {
                  icon: <Globe2 className="h-6 w-6 text-emerald-700" />,
                  title: 'Wereldwijde Schaal',
                  text: 'Ondersteuning voor multi-valuta rekeningen, holdingoverzichten en naadloze koppelingen voor ondernemers met een internationale horizon.',
                },
              ].map((p, i) => (
                <ScrollReveal animation="fade-up" delay={i * 100} key={p.title}>
                  <Card3DTilt className="h-full rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 mb-6">
                      {p.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                    <p className="mt-3 text-sm text-slate-500 leading-6">{p.text}</p>
                  </Card3DTilt>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Founder Statement */}
        <section className="marketing-section bg-white">
          <div className="marketing-container py-24 lg:py-32">
            <ScrollReveal animation="zoom-in">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0b1714] text-white p-10 md:p-16 lg:p-20 shadow-2xl">
                <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-3xl">
                  <span className="text-emerald-400 font-mono text-sm tracking-widest uppercase">
                    Oprichtersvisie
                  </span>
                  <blockquote className="mt-6 text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug tracking-[-0.03em] text-white/95">
                    “Financiële helderheid moet geen maandelijkse bron van stress zijn, maar een dagelijks fundament van rust en zelfvertrouwen om groter te denken.”
                  </blockquote>
                  <div className="mt-10 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xl border border-emerald-400/30">
                      JD
                    </div>
                    <div>
                      <p className="font-bold text-lg text-white">Jamal Drenthe</p>
                      <p className="text-sm text-white/60">Oprichter & Managing Director · Quantum Initium Holding</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Section: Impact in Cijfers */}
        <section className="marketing-section bg-[#f2f5ef]">
          <div className="marketing-container py-20 lg:py-28">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Getransporteerd Volume', value: 142, prefix: '€ ', suffix: 'M+' },
                { label: 'Actieve Leden', value: 48, suffix: '.200+' },
                { label: 'Klanttevredenheid', value: 99.4, suffix: '%', decimals: 1 },
                { label: 'Gemiddelde Response', value: 2, prefix: '< ', suffix: ' uur' },
              ].map((stat, i) => (
                <ScrollReveal animation="fade-up" delay={i * 100} key={stat.label}>
                  <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <p className="text-4xl lg:text-5xl font-black tracking-[-0.05em] text-emerald-900">
                      <AnimatedCounter
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        decimals={stat.decimals || 0}
                      />
                    </p>
                    <p className="mt-3 text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="marketing-section bg-white text-center py-20">
          <div className="marketing-container max-w-xl mx-auto">
            <h3 className="text-3xl font-black text-slate-900 tracking-[-0.04em]">
              Klaar om jouw wereld in beeld te brengen?
            </h3>
            <p className="mt-4 text-slate-500 leading-relaxed">
              Start vandaag nog met Xabi World en ontdek wat echte financiële rust betekent.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => navigate('pricing')}
                className="marketing-primary-button"
                type="button"
              >
                Kies je lidmaatschap <ArrowUpRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate('contact')}
                className="marketing-outline-button"
                type="button"
              >
                Vraag advies aan <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}

export function ContactPage({ navigate }: { navigate: (route: PublicRoute) => void }) {
  const [category, setCategory] = useState<'personal' | 'business' | 'investment' | 'press'>('personal');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('info@xabi.world');
    setCopiedEmail(true);
    toast.success('info@xabi.world gekopieerd naar klembord!');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Vul a.u.b. alle verplichte velden in.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2ead4b', '#9fe870', '#34d399', '#ffffff'],
      });
      toast.success(
        `Bedankt ${form.name.split(' ')[0]}! Je bericht is direct ontvangen op info@xabi.world. Ons team reageert binnen 2 uur.`
      );
    }, 700);
  };

  const faqs = [
    {
      q: 'Hoe snel wordt mijn aanvraag voor een lidmaatschap verwerkt?',
      a: 'Aanvragen voor particuliere rekeningen worden via ons geautomatiseerde identiteitsverificatiesysteem binnen 5 minuten geactiveerd. Voor zakelijke accounts en holdingstructuren neemt onze compliance desk binnen 2 uur contact met je op.',
    },
    {
      q: 'Zijn mijn tegoeden en beleggingen beschermd?',
      a: 'Zeker. Tegoeden vallen onder het Europese depositogarantiestelsel (DGS) tot € 100.000 per rekeninghouder. Al je documenten en persoonsgegevens worden beschermd via 256-bit AES-versleuteling in onze Xabi Secure Enclave.',
    },
    {
      q: 'Hoe kan ik contact opnemen buiten kantoortijden?',
      a: 'Onze e-mailservice op info@xabi.world wordt 7 dagen per week gemonitord. Premium en Pro-leden hebben daarnaast 24/7 toegang tot onze prioritaire conciërge-hotline in het dashboard.',
    },
    {
      q: 'Kan ik met mijn bestaande zakelijke rekeningen overstappen?',
      a: 'Ja. Met de geïntegreerde Xabi Overstapservice migreren we al je periodieke overboekingen, debiteurenincasso\'s en boekhoudkoppelingen naadloos en zonder onderbreking.',
    },
  ];

  return (
    <MarketingLayout navigate={navigate} route="contact">
      <main>
        {/* Contact Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0b1714] via-[#0f231d] to-[#0b1714] text-white py-20 lg:py-28">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <MotionCanvas3D className="w-full h-full opacity-50" radius={200} particleCount={140} />
          </div>

          <div className="marketing-container relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md">
              <Mail className="h-3.5 w-3.5" />
              Directe Conciërge & Klantenservice
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-[-0.05em] leading-[1.1] text-white">
              We staan direct voor je klaar. <span className="text-gradient">Zonder wachttijd.</span>
            </h1>
            <p className="mt-6 text-lg text-white/70 leading-relaxed">
              Heb je een vraag over Xabi World, wil je zakelijk overstappen of sparren met onze vermogensspecialisten? Ons team in Amsterdam staat 7 dagen per week voor je klaar.
            </p>
          </div>
        </section>

        {/* Channels & Form Grid */}
        <section className="marketing-section bg-white py-20 lg:py-28">
          <div className="marketing-container grid gap-12 lg:grid-cols-[1fr_1.3fr]">
            {/* Left Column: Direct Channels & HQ Info */}
            <div className="space-y-6">
              <ScrollReveal animation="slide-left">
                <div>
                  <p className="marketing-eyebrow">Direct Contact</p>
                  <h2 className="marketing-section-title mt-3">Kanalen & Hoofdkantoor</h2>
                  <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                    Kies het kanaal dat het beste bij jouw situatie past of plan een afspraak op ons kantoor in Amsterdam.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={100}>
                <Card3DTilt maxTilt={8} className="rounded-3xl border border-slate-200 bg-[#f8faf6] p-6 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Centraal E-mailadres</p>
                      <a href="mailto:info@xabi.world" className="text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors block mt-0.5">
                        info@xabi.world
                      </a>
                      <p className="text-xs text-slate-500 mt-1">
                        Reactiegarantie binnen 2 uur op werkdagen
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 transition-colors"
                      title="Kopieer e-mailadres"
                    >
                      {copiedEmail ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-200/70 flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Bezoekadres</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">Keizersgracht 321</p>
                      <p className="text-xs text-slate-500">1017 BZ Amsterdam, Nederland</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/70 flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Openingstijden</p>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5">Maandag t/m Vrijdag: 08:30 – 18:30 CET</p>
                      <p className="text-xs text-slate-500">Zaterdag & Zondag: Conciërge bereikbaar</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/70 flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Priority Hotline</p>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5">+31 (0)20 894 3000</p>
                      <p className="text-xs text-slate-500">Directe verbinding voor leden</p>
                    </div>
                  </div>
                </Card3DTilt>
              </ScrollReveal>

              {/* Amsterdam HQ Visual Badge */}
              <ScrollReveal animation="fade-up" delay={200}>
                <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-tr from-emerald-950 to-[#0b1714] p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#9fe870] animate-ping" />
                      <span className="text-xs font-bold tracking-wider uppercase text-[#9fe870]">Amsterdam HQ · Live</span>
                    </div>
                    <span className="text-xs text-white/50">GMT+1</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white/90">
                    Onderdeel van Quantum Initium Holding
                  </p>
                  <p className="mt-1 text-xs text-white/60">
                    Gevestigd aan de Amsterdamse grachtengordel. Volledig geregistreerde LTD.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Interactive Form */}
            <div>
              <ScrollReveal animation="slide-right">
                <Card3DTilt maxTilt={6} className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl shadow-slate-950/5">
                  <h3 className="text-2xl font-bold text-slate-950">Stuur direct een bericht</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Kies je categorie en ontvang binnen 2 uur een inhoudelijke reactie van ons team.
                  </p>

                  {submitted ? (
                    <div className="mt-8 rounded-2xl bg-emerald-50 p-8 text-center border border-emerald-200">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <Check className="h-7 w-7" />
                      </div>
                      <h4 className="mt-4 text-xl font-bold text-emerald-950">Bericht Succesvol Ontvangen!</h4>
                      <p className="mt-2 text-sm text-emerald-800">
                        Bedankt voor je bericht. We hebben een kopie gestuurd naar <span className="font-semibold">{form.email}</span> en nemen binnen 2 uur contact met je op via <span className="font-semibold">info@xabi.world</span>.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setForm({ name: '', email: '', phone: '', subject: '', message: '' });
                        }}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition"
                      >
                        Nog een bericht sturen
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                      {/* Category selector pills */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Waar gaat je vraag over?
                        </label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {[
                            { id: 'personal', label: 'Particulier' },
                            { id: 'business', label: 'Zakelijk' },
                            { id: 'investment', label: 'Vermogen' },
                            { id: 'press', label: 'Partnership' },
                          ].map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setCategory(cat.id as any)}
                              className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all border ${
                                category === cat.id
                                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Name & Email Row */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Volledige Naam *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="bijv. Sophie van Dijk"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            E-mailadres *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="jouw@email.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
                          />
                        </div>
                      </div>

                      {/* Phone & Subject Row */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Telefoonnummer (optioneel)
                          </label>
                          <input
                            type="tel"
                            placeholder="+31 6 ..."
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Onderwerp
                          </label>
                          <input
                            type="text"
                            placeholder="bijv. Overstapservice of Zakelijk pakket"
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Jouw Bericht of Vraag *
                        </label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Vertel ons over jouw vraag, plannen of situatie..."
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="marketing-primary-button w-full justify-center py-4 text-sm font-bold shadow-lg shadow-emerald-900/10 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          'Versturen naar info@xabi.world...'
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-1.5" />
                            Verstuur Bericht
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                        <LockKeyhole className="h-3.5 w-3.5" /> Beveiligde verzending naar info@xabi.world via TLS 1.3
                      </p>
                    </form>
                  )}
                </Card3DTilt>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="marketing-section bg-[#f2f5ef] py-20 lg:py-28">
          <div className="marketing-container max-w-4xl mx-auto">
            <ScrollReveal animation="fade-up">
              <div className="text-center">
                <p className="marketing-eyebrow">Veelgestelde Vragen</p>
                <h2 className="marketing-section-title mt-3">Direct antwoord op je vragen</h2>
              </div>
            </ScrollReveal>

            <div className="mt-12 space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <ScrollReveal animation="fade-up" delay={index * 80} key={faq.q}>
                    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all">
                      <button
                        type="button"
                        onClick={() => setActiveFaq(isOpen ? null : index)}
                        className="flex w-full items-center justify-between p-6 text-left"
                      >
                        <span className="font-bold text-slate-900 text-base flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                          {faq.q}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-emerald-700' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}

export function PlatformPage({ navigate }: { navigate: (route: PublicRoute) => void }) {
  return (
    <MarketingLayout navigate={navigate} route="platform">
      <main>
        <PageHero eyebrow="Het Xabi-platform" title="Eén rustige plek voor de volgende stap." text="Van je dagelijkse overzicht tot de doelen die verder weg liggen: Xabi brengt de belangrijkste signalen bij elkaar." />
        <section className="marketing-section bg-white">
          <div className="marketing-container py-24 lg:py-32">
            <div className="grid gap-6 md:grid-cols-2">
              <PlatformFeature title="Dashboard" text="Een helder startpunt met je balans, activiteit en belangrijkste bewegingen." />
              <PlatformFeature title="Inzichten" text="Bekijk patronen in transacties, investeringen en uitgaven zonder de ruis." />
              <PlatformFeature title="Doelen" text="Geef plannen een plek en volg de voortgang die voor jou betekenis heeft." />
              <PlatformFeature title="Rustige controle" text="Een interface die je helpt handelen wanneer dat nodig is en loslaten wanneer dat kan." />
            </div>
            <div className="mt-12 rounded-[2rem] bg-[#0b1714] p-8 text-white md:p-12">
              <div className="grid gap-10 md:grid-cols-[1fr_0.8fr] md:items-center">
                <div><p className="marketing-eyebrow text-emerald-300">Gebouwd voor de lange termijn</p><h2 className="mt-5 max-w-xl text-3xl font-medium tracking-[-0.05em] md:text-5xl">Meer zien. Minder zoeken.</h2></div>
                <ul className="space-y-4 text-sm text-white/65">{['Een dashboard dat met je meebeweegt', 'Inzichten zonder overdreven complexiteit', 'Een visuele taal die vertrouwen geeft'].map((item) => <li className="flex items-center gap-3" key={item}><span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"><Check className="h-3.5 w-3.5" /></span>{item}</li>)}</ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}

function PlatformFeature({ title, text }: { title: string; text: string }) {
  return <div className="rounded-[1.5rem] border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/5"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><Check className="h-4 w-4" /></span><ArrowUpRight className="h-4 w-4 text-slate-300" /></div><h3 className="mt-12 text-xl font-semibold tracking-[-0.03em] text-slate-950">{title}</h3><p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">{text}</p></div>;
}

export function CompanyPage({ navigate }: { navigate: (route: PublicRoute) => void }) {
  return (
    <MarketingLayout navigate={navigate} route="company">
      <main>
        <PageHero eyebrow="Quantum Initium Holding" title="Een huis voor ideeën met een lange horizon." text="Xabi World is een LTD binnen Quantum Initium Holding. We bouwen aan producten die mensen en organisaties helpen om met meer helderheid vooruit te bewegen." />
        <section className="marketing-section bg-white">
          <div className="marketing-container grid gap-12 py-24 lg:grid-cols-[0.75fr_1.25fr] lg:py-32">
            <div><p className="marketing-eyebrow">Onze geschiedenis</p><p className="mt-6 text-5xl font-medium tracking-[-0.07em] text-emerald-800">Sabi → Xabi</p></div>
            <div><h2 className="marketing-section-title max-w-2xl">Een nieuwe naam, dezelfde ambitie.</h2><p className="mt-7 max-w-2xl text-lg leading-8 text-slate-500">Xabi World begon als Sabi en SabiBank: een eerste verkenning van hoe financiële helderheid eruit kan zien. Vandaag groeit het uit tot een bredere wereld voor inzicht, ambitie en vooruitgang.</p></div>
          </div>
          <div className="marketing-container grid gap-6 pb-24 md:grid-cols-3 lg:pb-32">
            {[
              ['Sabi', 'De eerste verkenning: een idee over overzicht en eenvoud.'],
              ['SabiBank', 'Van idee naar product: bankieren als onderdeel van een groter verhaal.'],
              ['Xabi World', 'Een LTD binnen Quantum Initium Holding — gebouwd voor de wereld van nu.'],
            ].map(([name, text]) => (
              <div className="rounded-[1.5rem] border border-slate-200 bg-[#f8faf6] p-7" key={name}>
                <p className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{name}</p>
                <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}

interface MembershipTier {
  id: string;
  name: string;
  price: string;
  monthlyPrice: number;
  annualPrice: number;
  tagline: string;
  cardHardware: string;
  featured?: boolean;
  features: string[];
  ctaLabel: string;
}

const membershipTiers: MembershipTier[] = [
  {
    id: 'core',
    name: 'Xabi Core',
    price: '€ 0',
    monthlyPrice: 0,
    annualPrice: 0,
    tagline: 'Essentiële financiële helderheid en rust.',
    cardHardware: '1 Digitale Betaalpas (Visa Direct)',
    features: [
      'Particuliere betaalrekening met SEPA Instant (< 1,4s)',
      '1 Virtuele debetkaart (direct actief in app)',
      'Realtime uitgaveninzicht & categorisatie',
      'Contactloos, Apple Pay & Google Wallet',
      '1 Dynamisch spaardoel met automatische rente',
      'Standaard 256-bit AES Enclave beveiliging',
      'Nederlands IBAN & beschermd tot € 100.000',
    ],
    ctaLabel: 'Start Gratis',
  },
  {
    id: 'pro',
    name: 'Xabi Pro',
    price: '€ 9,99',
    monthlyPrice: 9.99,
    annualPrice: 99,
    tagline: 'Voor actieve spaarders en vermogensopbouw.',
    cardHardware: '3 Virtuele + 1 Fysieke Pas',
    features: [
      'Alles uit Xabi Core',
      'Multi-valuta vaults (EUR, USD, GBP, CHF)',
      '0,5% Onbeperkte cashback op alle uitgaven',
      'Predictieve cashflow-analyse 30 dagen vooruit',
      'Onbeperkte spaardoelen & automatische afronding',
      'Prioriteitsondersteuning via in-app conciërge',
      'Xabi Investments beleggersdepot integratie',
    ],
    ctaLabel: 'Kies Xabi Pro',
  },
  {
    id: 'obsidian',
    name: 'Xabi Obsidian Metal',
    price: '€ 24,99',
    monthlyPrice: 24.99,
    annualPrice: 249,
    tagline: 'Exclusief vermogensbeheer & wereldwijde privileges.',
    cardHardware: '18g Massief Titanium (Mastercard World Elite)',
    featured: true,
    features: [
      'Alles uit Xabi Pro',
      '18g Massief Titanium Obsidian Mastercard World Elite',
      '1,5% Exclusieve cashback op alle betalingen',
      'Toegang tot 1.400+ Airport Lounges wereldwijd (LoungeKey)',
      'Wereldwijde reis- en aankoopverzekering tot € 1.000.000',
      '24/7 Dedicated Private Wealth Concierge',
      '0% wisselkoersopslag overal ter wereld',
    ],
    ctaLabel: 'Bestel Obsidian Metal',
  },
  {
    id: 'corporate',
    name: 'Quantum Corporate',
    price: '€ 79',
    monthlyPrice: 79,
    annualPrice: 790,
    tagline: 'Voor BV’s, holdings en serieuze ondernemers.',
    cardHardware: 'Onbeperkte Virtuele & Fysieke Pasjes',
    features: [
      'Alles uit Xabi Obsidian Metal',
      'Multi-entiteit holding consolidatie & treasury',
      'Geautomatiseerde btw- en belastingreservering',
      'Directe boekhoudkoppeling (Exact, Moneybird, Twinfield)',
      'Directe Realtime API-toegang & Enterprise Webhooks',
      'Multi-user rollen en individuele medewerkerslimieten',
      'Dedicated institutional accountmanager & kwartaalreview',
    ],
    ctaLabel: 'Vraag Zakelijk Aan',
  },
];

function selectTier(id: string) {
  try {
    sessionStorage.setItem('xabi-tier', id);
  } catch {
    // opslag niet beschikbaar — registratieformulier valt terug op standaard
  }
}

export function PricingPage({ navigate }: { navigate: (route: PublicRoute) => void }) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [monthlySpend, setMonthlySpend] = useState<number>(2500);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleJoin = (tierId: string) => {
    selectTier(tierId);
    navigate('register');
  };

  // Calculations for interactive ROI calculator
  const annualCashback = Math.round(monthlySpend * 0.015 * 12);
  const annualFxSavings = Math.round(monthlySpend * 0.02 * 12);
  const totalBenefit = annualCashback + annualFxSavings;
  const obsidianCost = billingCycle === 'annual' ? 249 : 24.99 * 12;
  const netProfit = totalBenefit - obsidianCost;

  const faqs = [
    {
      q: 'Kan ik op elk moment wisselen of opzeggen?',
      a: 'Ja, absoluut. Xabi World hanteert geen wurgcontracten. Maandelijkse lidmaatschappen zijn per direct opzegbaar, en je kunt op ieder moment overstappen naar een ander pakket.',
    },
    {
      q: 'Hoe werkt de 18g Massief Titanium Obsidian pas?',
      a: 'Onze Obsidian Metal pas is vervaardigd uit 18g massief titanium op het exclusieve Mastercard World Elite netwerk. De pas bevat standaard geen zichtbare nummers op de voorzijde voor maximale privacy en wordt binnen 3 werkdagen in een luxueuze verpakking bezorgd.',
    },
    {
      q: 'Is mijn geld beschermd onder het depositogarantiestelsel?',
      a: 'Zeker. Al het saldo op Xabi World rekeningen wordt aangehouden bij erkende en gereguleerde Europese bankpartners onder toezicht van de Europese toezichthouders, en is beschermd onder het Europese Depositogarantiestelsel (DGS) tot € 100.000 per rekeninghouder.',
    },
    {
      q: 'Zijn er verborgen transactie- of wisselkoerskosten?',
      a: 'Nee. Transparantie is onze kernwaarde. Bij Xabi Obsidian Metal betaal je 0% opslag op buitenlandse valuta volgens de officiële interbancaire Mastercard/Visa koers.',
    },
    {
      q: 'Kan ik zakelijke rekeningen en privérekeningen combineren?',
      a: 'Ja, met Quantum Corporate kun je zowel je holding, werkmaatschappijen als privérekeningen in één centrale cockpit overzien met strikte scheiding van bevoegdheden en administratie.',
    },
  ];

  return (
    <MarketingLayout navigate={navigate} route="pricing">
      <main>
        <PageHero
          eyebrow="Transparante Prijzen"
          title="Heldere tarieven voor elke financiële horizon."
          text="Geen verborgen wisselkoersopslagen, geen verrassingen achteraf. Kies het lidmaatschap dat bij jou past en wissel maandelijks kosteloos."
        />

        {/* Billing Cycle Switcher */}
        <section className="marketing-section bg-white border-b border-slate-100">
          <div className="marketing-container pt-8 pb-4 text-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-[#f8faf6] p-1.5 shadow-inner">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-[#0b1714] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Maandelijks betalen
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-[#0b1714] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Jaarlijks</span>
                <span className="rounded-full bg-[#9fe870] px-2 py-0.5 text-[10px] font-bold text-[#0b1714]">
                  2 mnd gratis ✨
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <section className="marketing-section bg-white">
          <div className="marketing-container grid gap-6 py-16 md:grid-cols-2 lg:py-24 xl:grid-cols-4">
            {membershipTiers.map((tier) => {
              const displayPrice =
                tier.monthlyPrice === 0
                  ? 'Gratis'
                  : billingCycle === 'annual'
                  ? `€ ${(tier.annualPrice / 12).toFixed(2).replace('.', ',')}`
                  : `€ ${tier.monthlyPrice.toString().replace('.', ',')}`;

              const billedNote =
                tier.monthlyPrice === 0
                  ? 'Altijd kosteloos'
                  : billingCycle === 'annual'
                  ? `€ ${tier.annualPrice} per jaar gefactureerd`
                  : 'Maandelijks opzegbaar';

              return (
                <ScrollReveal key={tier.id} animation="fade-up">
                  <Card3DTilt>
                    <div
                      className={`flex h-full flex-col rounded-[2rem] border p-8 transition-all duration-300 ${
                        tier.featured
                          ? 'border-[#9fe870]/50 bg-gradient-to-b from-[#121c17] via-[#09110d] to-[#040806] text-white shadow-2xl shadow-emerald-950/30'
                          : 'border-slate-200 bg-[#f8faf6] text-slate-900 hover:border-emerald-300 hover:shadow-xl'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex items-center justify-between">
                        <h3 className={`text-xl font-bold tracking-tight ${tier.featured ? 'text-white' : 'text-slate-950'}`}>
                          {tier.name}
                        </h3>
                        {tier.featured && (
                          <span className="rounded-full bg-[#9fe870] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0b1714]">
                            Meest gekozen
                          </span>
                        )}
                      </div>

                      <p className={`mt-2 text-xs leading-relaxed ${tier.featured ? 'text-white/60' : 'text-slate-500'}`}>
                        {tier.tagline}
                      </p>

                      {/* Hardware Badge */}
                      <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-white/10">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-medium ${
                          tier.featured ? 'text-emerald-300' : 'text-emerald-700'
                        }`}>
                          💳 {tier.cardHardware}
                        </span>
                      </div>

                      {/* Price Display */}
                      <div className="mt-6">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-4xl sm:text-5xl font-black tracking-[-0.05em]">{displayPrice}</span>
                          {tier.monthlyPrice > 0 && (
                            <span className={`text-xs ${tier.featured ? 'text-white/50' : 'text-slate-400'}`}>
                              / maand
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] mt-1 ${tier.featured ? 'text-white/40' : 'text-slate-400'}`}>
                          {billedNote}
                        </p>
                      </div>

                      {/* Features List */}
                      <ul className="mt-8 flex-1 space-y-3.5 border-t border-slate-200/50 dark:border-white/10 pt-6">
                        {tier.features.map((feature) => (
                          <li className="flex items-start gap-2.5" key={feature}>
                            <CheckCircle2
                              className={`mt-0.5 h-4 w-4 shrink-0 ${
                                tier.featured ? 'text-[#9fe870]' : 'text-emerald-600'
                              }`}
                            />
                            <span className={`text-xs leading-relaxed ${tier.featured ? 'text-white/80' : 'text-slate-600'}`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={() => handleJoin(tier.id)}
                        className={`mt-8 w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold transition-all shadow-md ${
                          tier.featured
                            ? 'bg-[#9fe870] text-[#0b1714] hover:bg-[#b0f584] active:scale-[0.98]'
                            : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]'
                        }`}
                      >
                        {tier.ctaLabel} <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  </Card3DTilt>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* Interactive ROI & Cashback Calculator Section */}
        <section className="marketing-section bg-[#f8faf6] border-y border-slate-200/80">
          <div className="marketing-container py-20 lg:py-28">
            <ScrollReveal animation="fade-up">
              <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl shadow-emerald-950/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
                  <div>
                    <span className="marketing-eyebrow text-emerald-700">Interactieve Calculator</span>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 mt-1">
                      Bereken hoeveel Xabi jou oplevert.
                    </h2>
                    <p className="text-sm text-slate-500 mt-2 max-w-xl">
                      Dankzij 1,5% cashback en 0% valutamarge op onze Obsidian Metal betaalpas verdient het lidmaatschap zichzelf bij veel gebruikers direct meervoudig terug.
                    </p>
                  </div>

                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Calculator className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Geschatte maandelijkse kaartuitgaven:
                      </span>
                      <span className="text-2xl font-black text-emerald-700 font-mono">
                        € {monthlySpend.toLocaleString('nl-NL')}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="500"
                      max="10000"
                      step="250"
                      value={monthlySpend}
                      onChange={(e) => setMonthlySpend(Number(e.target.value))}
                      className="w-full accent-[#2ead4b] cursor-pointer h-2 bg-slate-200 rounded-lg"
                    />

                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                      <span>€ 500/mnd</span>
                      <span>€ 5.000/mnd</span>
                      <span>€ 10.000/mnd</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <div className="rounded-2xl border border-slate-100 bg-[#f8faf6] p-4 text-center">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Jaarlijkse Cashback (1.5%)</p>
                      <p className="text-2xl font-black text-slate-900 mt-1 font-mono">
                        + € {annualCashback.toLocaleString('nl-NL')}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-[#f8faf6] p-4 text-center">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Valuta- & Reisbesparing</p>
                      <p className="text-2xl font-black text-slate-900 mt-1 font-mono">
                        + € {annualFxSavings.toLocaleString('nl-NL')}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/70 p-4 text-center shadow-inner">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Netto Voordeel (na abonnementskosten)</p>
                      <p className="text-2xl font-black text-emerald-700 mt-1 font-mono">
                        + € {netProfit.toLocaleString('nl-NL')} / jr
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#0b1714] p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#9fe870]" />
                      <span>Bij € {monthlySpend.toLocaleString('nl-NL')} uitgaven verdient de <strong>Obsidian Metal pas</strong> zichzelf ruimschoots terug.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleJoin('obsidian')}
                      className="inline-flex items-center gap-1 font-bold text-[#9fe870] hover:underline shrink-0"
                    >
                      Kies Obsidian <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Feature Comparison Matrix Section */}
        <section className="marketing-section bg-white">
          <div className="marketing-container py-20 lg:py-28">
            <ScrollReveal animation="fade-up">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="marketing-eyebrow">Alles in detail</span>
                <h2 className="marketing-section-title mt-2">Volledige vergelijkingstabel</h2>
                <p className="text-sm text-slate-500 mt-3">
                  Vergelijk de specifieke functies, hardware en limieten per lidmaatschap.
                </p>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-lg">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-[#f8faf6]">
                      <th className="p-4 sm:p-5 font-bold text-slate-900 w-1/3">Functies & Specificaties</th>
                      <th className="p-4 sm:p-5 font-bold text-slate-900 text-center">Xabi Core</th>
                      <th className="p-4 sm:p-5 font-bold text-slate-900 text-center">Xabi Pro</th>
                      <th className="p-4 sm:p-5 font-bold text-emerald-700 bg-emerald-50/50 text-center">Xabi Obsidian Metal</th>
                      <th className="p-4 sm:p-5 font-bold text-slate-900 text-center">Quantum Corporate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { cat: 'Betaalkaarten & Hardware', items: [
                        { name: 'Virtuele passen (Instant issuing)', core: '1 pas', pro: '3 passen', obsidian: '5 passen', corp: 'Onbeperkt' },
                        { name: 'Fysieke Titanium betaalpas (16g)', core: '—', pro: 'Optioneel (€49)', obsidian: 'Inbegrepen (Massief Titanium)', corp: 'Inbegrepen' },
                        { name: 'Kaartnetwerk & Betaalrails', core: 'Visa Direct', pro: 'Visa & Mastercard', obsidian: 'Mastercard World Elite', corp: 'Dedicated Banking Rails' },
                      ]},
                      { cat: 'Betalingen & Vermogen', items: [
                        { name: 'SEPA Instant overschrijvingen', core: '< 1.4s', pro: '< 1.4s', obsidian: '< 1.4s', corp: '< 1.4s' },
                        { name: 'Multi-valuta rekeningen', core: 'Alleen EUR', pro: '4 valuta’s', obsidian: '18+ valuta’s', corp: 'Onbeperkt + Treasury' },
                        { name: 'Cashback op aankopen', core: '—', pro: '0,5%', obsidian: '1,5% Onbeperkt', corp: '1,5% Zakelijk' },
                        { name: 'Wisselkoersopslag (FX)', core: '1,2%', pro: '0,4%', obsidian: '0% (Interbancair)', corp: '0% + Forward contracts' },
                      ]},
                      { cat: 'Lifestyle & Privileges', items: [
                        { name: 'Airport LoungeKey toegang', core: '—', pro: '—', obsidian: '1.400+ lounges gratis', corp: '1.400+ lounges gratis' },
                        { name: 'Reis- & aankoopverzekering', core: '—', pro: '—', obsidian: 'Tot € 1.000.000', obsidian_check: true, corp: 'Tot € 2.500.000' },
                        { name: 'Dedicated Concierge service', core: 'Standaard', pro: 'Priority support', obsidian: '24/7 Dedicated Manager', corp: 'Institutional Desk' },
                      ]},
                      { cat: 'Zakelijk & Integraties', items: [
                        { name: 'Boekhoudkoppeling (Exact / Moneybird)', core: '—', pro: 'Export CSV', obsidian: 'Export + Sync', corp: 'Directe realtime API sync' },
                        { name: 'Developer API & Webhooks', core: '—', pro: '—', obsidian: '—', corp: 'Volledige GraphQL & REST' },
                      ]},
                    ].map((section) => (
                      <Fragment key={section.cat}>
                        <tr className="bg-slate-50/70 font-bold text-slate-800">
                          <td colSpan={5} className="p-3.5 px-5 uppercase text-[10px] tracking-wider text-slate-500">
                            {section.cat}
                          </td>
                        </tr>
                        {section.items.map((row) => (
                          <tr key={row.name} className="hover:bg-slate-50/40 transition-colors">
                            <td className="p-4 px-5 font-medium text-slate-700">{row.name}</td>
                            <td className="p-4 text-center text-slate-600">{row.core}</td>
                            <td className="p-4 text-center text-slate-600">{row.pro}</td>
                            <td className="p-4 text-center font-bold text-emerald-800 bg-emerald-50/30">{row.obsidian}</td>
                            <td className="p-4 text-center text-slate-600">{row.corp}</td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Pricing FAQ Section */}
        <section className="marketing-section bg-[#f8faf6]">
          <div className="marketing-container py-20 lg:py-28 max-w-4xl mx-auto">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-12">
                <span className="marketing-eyebrow">Duidelijkheid vooraf</span>
                <h2 className="marketing-section-title mt-2">Veelgestelde vragen over tarieven</h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={faq.q}
                    className="rounded-2xl border border-slate-200 bg-white transition-all overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm text-slate-900"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                          openFaq === idx ? 'rotate-180 text-emerald-600' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="p-5 pt-0 text-xs leading-relaxed text-slate-500 border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="marketing-section bg-white">
          <div className="marketing-container py-16">
            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-[#0b1714] via-[#12231c] to-[#0b1714] p-8 md:p-14 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <span className="marketing-eyebrow text-emerald-300">Start vandaag</span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-2 text-white">
                  Klaar voor meer controle over je geld?
                </h2>
                <p className="mt-3 text-sm text-white/60 max-w-xl">
                  Probeer de interactieve demo omgeving of registreer direct je persoonlijke of zakelijke Xabi World lidmaatschap.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => navigate('register')}
                  className="marketing-primary-button justify-center py-3.5 px-6"
                >
                  Direct Registreren <ArrowUpRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('login')}
                  className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-xs font-bold text-white hover:bg-white/20 transition justify-center text-center"
                >
                  Bekijk Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}

// ---------------------------------------------------------
// SAMENWERKINGEN PAGINA (PARTNERSHIPS)
// ---------------------------------------------------------

export function PartnershipsPage({ navigate }: { navigate: (route: PublicRoute) => void }) {
  const [partnerType, setPartnerType] = useState('Fintech & Betaalrails');
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      confetti({
        particleCount: 140,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#2ead4b', '#9fe870', '#ffffff', '#38bdf8'],
      });
      toast.success('Samenwerkingsaanvraag succesvol ontvangen!', {
        description: `Ons partnerships-team (partnerships@xabi.world) neemt binnen 24 uur contact op met ${contactName || companyName}.`,
      });

      setCompanyName('');
      setWebsite('');
      setContactName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 700);
  };

  const partnerPillars = [
    {
      icon: Cpu,
      title: 'Europese Kaartinfrastructuur',
      subtitle: 'Mastercard World Elite & Visa Direct',
      desc: 'Samen met erkende Europese financiële instellingen leveren we premium betaalkaarten (Mastercard & Visa), instant virtuele passen en 256-bit PCI-DSS enclave technologie.',
      tag: 'FINANCIEEL RAILS',
    },
    {
      icon: Building2,
      title: 'Quantum Initium Ecosysteem',
      subtitle: 'Participaties & Zusterbedrijven',
      desc: 'Synergie met alle 11 bedrijven binnen de holding: Quantum Initium, Boostplug, CRMos, Djobba, Immigratiepunt, InvestBotiq, Logs Rent, Spontiva, VVC Works, WoningVry en Zheavenzy. Geïntegreerde oplossingen voor finance, AI, vastgoed en zakelijke groei.',
      tag: 'HOLDING ALLIANTIES',
    },
    {
      icon: Layers,
      title: 'Boekhouding & Zakelijke Software',
      subtitle: 'Exact, Moneybird, SnelStart & Twinfield',
      desc: 'Geautomatiseerde realtime bankkoppelingen en geavanceerde btw-reservering voor accountants, fiscalisten en finance directors.',
      tag: 'SOFTWARE INTEGRATIE',
    },
    {
      icon: Landmark,
      title: 'Institutioneel & Family Offices',
      subtitle: 'Private Wealth & Co-Investeringen',
      desc: 'Directe strategische kapitaalallocatie, private banking diensten en veilige treasury oplossingen voor family offices en vermogende particulieren.',
      tag: 'KAPITAAL & TREASURY',
    },
  ];

  const currentPartners = [
    { name: 'Quantum Initium', domain: 'quantuminitium.com', role: 'Moedermaatschappij & Holding', badge: 'Moederholding' },
    { name: 'Boostplug', domain: 'boostplug.one', role: 'AI Marketing & Growth Engine', badge: 'Ecosysteem' },
    { name: 'CRMos', domain: 'crmos.one', role: 'Enterprise CRM & Facturatie', badge: 'Ecosysteem' },
    { name: 'Djobba', domain: 'djobba.works', role: 'Flexibele Payroll & Freelance', badge: 'Ecosysteem' },
    { name: 'Immigratiepunt', domain: 'immigratiepunt.nl', role: 'Juridisch & Expat Relocatie', badge: 'Ecosysteem' },
    { name: 'InvestBotiq', domain: 'investbotiq.com', role: 'Kwantitatief Vermogen & AI', badge: 'Ecosysteem' },
    { name: 'Logs Rent', domain: 'logs.rent', role: 'Short-Stay Accommodatie', badge: 'Ecosysteem' },
    { name: 'Spontiva', domain: 'spontiva.nl', role: 'Social Lifestyle & Events', badge: 'Ecosysteem' },
    { name: 'VVC Works', domain: 'vvc.works', role: 'Verdienende Vrienden Club', badge: 'Ecosysteem' },
    { name: 'WoningVry', domain: 'woningvry.nl', role: 'PropTech & Woningverhuur', badge: 'Ecosysteem' },
    { name: 'Zheavenzy', domain: 'zheavenzy.one', role: 'Luxury Concierge & Private Life', badge: 'Ecosysteem' },
    { name: 'Mastercard Europe', domain: 'mastercard.com', role: 'World Elite Kaartprogramma', badge: 'Gereguleerd Netwerk' },
    { name: 'Visa International', domain: 'visa.com', role: 'Corporate & Infinite Rails', badge: 'Gereguleerd Netwerk' },
    { name: 'Europese Partnerbanken', domain: 'xabi.world', role: 'DGS Borging tot € 100.000', badge: 'Toezicht DNB / ECB' },
    { name: 'Exact Software', domain: 'exact.com', role: 'Boekhouding & ERP Koppeling', badge: 'API Sync' },
  ];

  const partnerFaqs = [
    {
      q: 'Welke typen partnerschappen ondersteunt Xabi World?',
      a: 'We werken samen met vier hoofdgroepen: gereguleerde financiële instellingen en kaartnetwerken, ecosysteembedrijven binnen Quantum Initium Holding, zakelijke software/boekhoudpakketten en institutionele investeerders/family offices.',
    },
    {
      q: 'Hoe snel kunnen API-koppelingen gerealiseerd worden?',
      a: 'Via onze sandbox-omgevingen en REST/GraphQL APIs kunnen ontwikkelaars en enterprise partners binnen enkele uren een werkende proof-of-concept opzetten. Productiekoppelingen worden na compliance-verificatie doorgaans binnen 5 tot 10 werkdagen live gebracht.',
    },
    {
      q: 'Biedt Xabi World een partnerprogramma voor accountants en adviseurs?',
      a: 'Ja. Accountantskantoren en financieel adviseurs krijgen dedicated partner dashboards, directe klantmachtigingen en aantrekkelijke tarieven voor hun zakelijke cliënten.',
    },
    {
      q: 'Met wie kan ik direct contact opnemen voor een strategisch voorstel?',
      a: 'Voor strategische allianties en M&A kun je rechtstreeks mailen naar partnerships@xabi.world of bellen met ons team in Amsterdam op +31 20 890 1200.',
    },
  ];

  return (
    <MarketingLayout navigate={navigate} route="partnerships">
      <main>
        {/* Hero Section */}
        <PageHero
          eyebrow="Ecosysteem & Allianties"
          title="Samen bouwen aan de financiële infrastructuur van morgen."
          text="Xabi World en Quantum Initium Holding slaan de handen ineen met toonaangevende technologiepartners, financiële instellingen, accountants en vooruitstrevende ondernemingen."
        />

        {/* 4 Strategic Pillars */}
        <section className="marketing-section bg-white">
          <div className="marketing-container py-20 lg:py-28">
            <ScrollReveal animation="fade-up">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="marketing-eyebrow">Onze Pijlers</span>
                <h2 className="marketing-section-title mt-2">Vier domeinen van samenwerking</h2>
                <p className="text-sm text-slate-500 mt-3">
                  Van embedded card issuing tot institutionele holding-synergie: samen creëren we exponentiële meerwaarde.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {partnerPillars.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <Card3DTilt key={pillar.title}>
                      <div className="h-full rounded-3xl border border-slate-200 bg-[#f8faf6] p-7 transition-all duration-300 hover:border-emerald-300 hover:shadow-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                              <Icon className="h-6 w-6" />
                            </span>
                            <span className="rounded-full bg-slate-200/60 px-2.5 py-1 text-[9px] font-mono font-bold text-slate-600">
                              {pillar.tag}
                            </span>
                          </div>

                          <h3 className="mt-6 text-lg font-bold text-slate-950 tracking-tight">
                            {pillar.title}
                          </h3>
                          <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                            {pillar.subtitle}
                          </p>

                          <p className="mt-3 text-xs leading-relaxed text-slate-500">
                            {pillar.desc}
                          </p>
                        </div>

                        <div className="pt-5 mt-6 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                          <span>Ontdek mogelijkheden</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </Card3DTilt>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Current Strategic Partners Grid */}
        <section className="marketing-section bg-[#f8faf6] border-y border-slate-200/80">
          <div className="marketing-container py-20 lg:py-28">
            <ScrollReveal animation="fade-up">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="marketing-eyebrow text-emerald-700">Bewezen Netwerk</span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 mt-1">
                  Onze technologie- en holdingpartners
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Een greep uit de instellingen en participaties waarmee wij dagelijks bouwen.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentPartners.map((partner) => (
                  <div
                    key={partner.name}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all text-center flex flex-col justify-between group"
                  >
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                        {partner.badge}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 tracking-tight">{partner.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">{partner.role}</p>
                    </div>

                    {partner.domain && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-center">
                        <a
                          href={`https://${partner.domain}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-600 hover:text-emerald-800 hover:underline"
                        >
                          {partner.domain}
                          <ArrowUpRight className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Interactive Partnership Application Form */}
        <section className="marketing-section bg-white">
          <div className="marketing-container py-20 lg:py-28 max-w-4xl mx-auto">
            <ScrollReveal animation="fade-up">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-14 shadow-2xl shadow-emerald-950/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Handshake className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="marketing-eyebrow text-emerald-700">Samenwerken</span>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                      Dien een samenwerkingsvoorstel in
                    </h2>
                  </div>
                </div>

                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                  Wil je als fintech, softwareleverancier, accountant of investeerder aansluiten bij het Xabi World ecosysteem? Vul onderstaand formulier in en ons directieteam reageert binnen één werkdag.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Pills */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
                      Kies jouw type samenwerking:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Fintech & Betaalrails',
                        'Ecosysteem & Participatie',
                        'Boekhouding & Software',
                        'Institutioneel & Family Office',
                        'Overig',
                      ].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setPartnerType(type)}
                          className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                            partnerType === type
                              ? 'bg-[#0b1714] text-white shadow-md'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Company & Website */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Organisatie / Bedrijfsnaam *
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="bv. FinTech Innovators B.V."
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://voorbeeld.nl"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Contact Person & Function */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Contactpersoon *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Voor- en achternaam"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Zakelijk E-mailadres *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="partner@bedrijf.nl"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Telefoonnummer (optioneel)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+31 6 12345678"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                    />
                  </div>

                  {/* Proposal Message */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Korte toelichting van het voorstel *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Beschrijf beknopt jullie technologie, synergie of gewenste integratie..."
                      className="w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-[#2ead4b] py-4 text-sm font-bold text-white shadow-lg shadow-emerald-950/15 hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? 'Bezig met versturen...' : 'Verstuur Samenwerkingsvoorstel'}
                  </button>
                </form>

                {/* Direct Contacts Bar */}
                <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-600" />
                    <span>Direct: <strong className="text-slate-800">partnerships@xabi.world</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <span>Herengracht 420, Amsterdam</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Partner FAQ Section */}
        <section className="marketing-section bg-[#f8faf6]">
          <div className="marketing-container py-20 lg:py-28 max-w-4xl mx-auto">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-12">
                <span className="marketing-eyebrow">Duidelijke afspraken</span>
                <h2 className="marketing-section-title mt-2">Veelgestelde vragen voor partners</h2>
              </div>

              <div className="space-y-3">
                {partnerFaqs.map((faq, idx) => (
                  <div
                    key={faq.q}
                    className="rounded-2xl border border-slate-200 bg-white transition-all overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm text-slate-900"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                          openFaq === idx ? 'rotate-180 text-emerald-600' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="p-5 pt-0 text-xs leading-relaxed text-slate-500 border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}

export function RegisterPage({ navigate }: { navigate: (route: PublicRoute) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tierId, setTierId] = useState(() => {
    try {
      return sessionStorage.getItem('xabi-tier') ?? 'basis';
    } catch {
      return 'basis';
    }
  });
  const tier = membershipTiers.find((item) => item.id === tierId) ?? membershipTiers[1];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success(`Welkom bij Xabi World, ${name.split(' ')[0] || 'nieuwkomer'} — je ${tier.name}-aanmelding is ontvangen.`);
    navigate('login');
  };

  return (
    <div className="login-shell">
      <div className="login-aside">
        <Logo light />
        <div className="mt-auto max-w-lg">
          <p className="marketing-eyebrow text-emerald-300">Lid worden</p>
          <h1 className="mt-6 text-5xl font-medium tracking-[-0.07em] text-white md:text-7xl">Jouw wereld begint hier.</h1>
          <p className="mt-7 max-w-md text-base leading-7 text-white/55">
            Je hebt {tier.name} gekozen — {tier.price} per maand. Maandelijks opzegbaar, overstappen kan altijd.
          </p>
        </div>
        <p className="text-xs text-white/35">Xabi World · Quantum Initium Holding</p>
      </div>
      <div className="login-form-side">
        <button className="mb-12 self-start text-sm text-slate-500 hover:text-slate-950" onClick={() => navigate('pricing')} type="button">← Terug naar lidmaatschappen</button>
        <div className="w-full max-w-md">
          <p className="marketing-eyebrow">Aanmelden</p>
          <h2 className="mt-4 text-4xl font-medium tracking-[-0.06em] text-slate-950">Word lid van Xabi</h2>
          <p className="mt-4 text-sm leading-6 text-slate-500">Dit is een demo-omgeving. Vul je gegevens in om je {tier.name}-lidmaatschap te activeren.</p>
          <form className="mt-9 space-y-5" onSubmit={handleSubmit}>
            <label className="login-label">Volledige naam<input className="login-input" onChange={(event) => setName(event.target.value)} placeholder="Jouw naam" required type="text" value={name} /></label>
            <label className="login-label">E-mailadres<input className="login-input" onChange={(event) => setEmail(event.target.value)} placeholder="jij@voorbeeld.nl" required type="email" value={email} /></label>
            <label className="login-label">Wachtwoord<input className="login-input" onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required type="password" value={password} /></label>
            <label className="login-label">
              Lidmaatschap
              <select className="login-input" onChange={(event) => setTierId(event.target.value)} value={tier.id}>
                {membershipTiers.map((item) => (
                  <option key={item.id} value={item.id}>{item.name} — {item.price} / maand</option>
                ))}
              </select>
            </label>
            <button className="marketing-primary-button w-full justify-center py-4" type="submit">Activeer {tier.name} <ArrowUpRight className="h-4 w-4" /></button>
          </form>
          <div className="mt-8 flex items-center gap-3 text-xs text-slate-400"><LockKeyhole className="h-4 w-4" /> Je aanmelding blijft lokaal op dit apparaat.</div>
        </div>
      </div>
    </div>
  );
}

function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <section className="marketing-page-hero"><div className="marketing-container max-w-5xl py-24 lg:py-32"><p className="marketing-kicker"><span className="marketing-kicker-dot" />{eyebrow}</p><h1 className="marketing-display mt-7 max-w-4xl">{title}</h1><p className="marketing-lead mt-7 max-w-2xl">{text}</p></div></section>;
}

export function LoginPage({ onLogin, navigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { loginWithGoogle, loginWithDemo, loginWithEmail } = useAuth();

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const profile = await loginWithGoogle();
      if (profile.role === 'admin') {
        toast.success(`Welkom terug Jamal (${profile.email}) — Ingelogd als Administrator.`);
      } else {
        toast.success(`Welkom ${profile.fullName}! Ingelogd via Google.`);
      }
      onLogin();
    } catch (err: any) {
      toast.error(err?.message || 'Inloggen met Google mislukt.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleDemoSelect = (demoId: string) => {
    const demo = loginWithDemo(demoId);
    if (demo.role === 'admin') {
      toast.success('Ingelogd met Beheerdersaccount (Jamal Drenthe)');
    } else {
      toast.success(`Ingelogd met demo account (${demo.fullName})`);
    }
    onLogin();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    const profile = loginWithEmail(email);
    if (profile.role === 'admin') {
      toast.success(`Welkom Jamal! Ingelogd als Administrator (${profile.email}).`);
    } else {
      toast.success(`Welkom ${profile.fullName}! Ingelogd als gebruiker.`);
    }
    onLogin();
  };

  const normalAccounts = DEMO_ACCOUNTS.filter((acc) => acc.role !== 'admin');
  const adminAccount = DEMO_ACCOUNTS.find((acc) => acc.role === 'admin') || DEMO_ACCOUNTS[0];

  return (
    <div className="login-shell">
      <div className="login-aside">
        <Logo light />
        <div className="mt-auto max-w-lg">
          <p className="marketing-eyebrow text-emerald-300">Welkom bij Xabi World</p>
          <h1 className="mt-6 text-5xl font-medium tracking-[-0.07em] text-white md:text-7xl">
            Jouw wereld, weer in beeld.
          </h1>
          <p className="mt-7 max-w-md text-base leading-7 text-white/55">
            Log in met Google OAuth, test met demo-accounts voor normale gebruikers of beheer het platform als Admin.
          </p>
        </div>
        <p className="text-xs text-white/35">Xabi World · info@xabi.world</p>
      </div>

      <div className="login-form-side overflow-y-auto py-10">
        <button
          className="mb-8 self-start text-sm text-slate-500 hover:text-slate-950"
          onClick={() => navigate('home')}
          type="button"
        >
          ← Terug naar xabi.world
        </button>

        <div className="w-full max-w-md">
          <p className="marketing-eyebrow">Toegang & Authenticatie</p>
          <h2 className="mt-3 text-3xl font-medium tracking-[-0.05em] text-slate-950 sm:text-4xl">
            Inloggen bij Xabi
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Kies Google OAuth, selecteer een demo-account voor normale gebruikers of log in als beheerder.
          </p>

          {/* 1. Google OAuth Button */}
          <div className="mt-8">
            <button
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50"
              disabled={isGoogleLoading}
              onClick={handleGoogleSignIn}
              type="button"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span>{isGoogleLoading ? 'Verbinden met Google...' : 'Inloggen via Google OAuth'}</span>
            </button>
            <p className="mt-2 text-center text-xs text-slate-500">
              💡 Inloggen met <span className="font-semibold text-slate-700">info@xabi.world</span> (of info@jamaldrenthe.com) geeft automatisch <span className="font-semibold text-emerald-700">Admin</span>-rechten.
            </p>
          </div>

          {/* Divider */}
          <div className="my-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            <span>Of kies een demo account</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* 2. Demo Accounts Section */}
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Demo accounts voor normale gebruikers:
              </p>
              <div className="space-y-2">
                {normalAccounts.map((acc) => (
                  <button
                    className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50/40"
                    key={acc.id}
                    onClick={() => handleDemoSelect(acc.id)}
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 text-xs">
                        {acc.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-950">
                          {acc.fullName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {acc.badge} · {acc.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-700 opacity-0 transition group-hover:opacity-100 flex items-center gap-1">
                      Inloggen <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Admin Demo Button */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Beheerder (Admin) account:
              </p>
              <button
                className="group flex w-full items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50/60 p-3 text-left transition hover:border-emerald-400 hover:bg-emerald-100/50"
                onClick={() => handleDemoSelect(adminAccount.id)}
                type="button"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white shadow-sm text-xs">
                    👑
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {adminAccount.fullName}
                      </p>
                      <span className="rounded bg-emerald-200 px-1.5 py-0.5 text-[10px] font-bold text-emerald-900">
                        ADMIN
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {adminAccount.email} (Volledige beheerdersrechten)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-800 opacity-0 transition group-hover:opacity-100 flex items-center gap-1">
                  Inloggen <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="my-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            <span>Of handmatig e-mailadres</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* 3. Manual Email/Password Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="login-label">
              E-mailadres
              <input
                className="login-input"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="info@xabi.world of jouw e-mail"
                required
                type="email"
                value={email}
              />
            </label>
            <label className="login-label">
              Wachtwoord (optioneel in demo)
              <input
                className="login-input"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                type="password"
                value={password}
              />
            </label>
            <button
              className="marketing-primary-button w-full justify-center py-3.5"
              type="submit"
            >
              Ga naar dashboard <ArrowUpRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
            <LockKeyhole className="h-3.5 w-3.5" /> Firebase Firestore security rules beveiligen alle documenten.
          </div>
        </div>
      </div>
    </div>
  );
}
