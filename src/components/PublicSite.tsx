import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Globe2,
  LockKeyhole,
  Menu,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { XabiScene } from '@/components/XabiScene';

export type PublicRoute = 'home' | 'about' | 'platform' | 'company' | 'login';

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
  { route: 'company', label: 'Holding' },
];

function MarketingLayout({ route, navigate, children }: MarketingLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (nextRoute: PublicRoute) => {
    setMenuOpen(false);
    navigate(nextRoute);
  };

  return (
    <div className="marketing-shell">
      <header className="marketing-nav">
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
            <button className="marketing-dark-button" onClick={() => handleNavigate('login')} type="button">
              Ontdek Xabi <ArrowUpRight className="h-4 w-4" />
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
            <button className="marketing-dark-button justify-center" onClick={() => handleNavigate('login')} type="button">
              Inloggen <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </header>
      {children}
      <footer className="marketing-footer">
        <div className="marketing-container grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo onClick={() => { window.location.hash = '#home'; }} />
            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-500">
              De wereld rond je financiële toekomst. Heldere inzichten, gebouwd voor de volgende stap.
            </p>
          </div>
          <FooterColumn title="Verken" items={[['Over Xabi', 'about'], ['Platform', 'platform'], ['Holding', 'company']]} navigate={navigate} />
          <FooterColumn title="Toegang" items={[['Inloggen', 'login'], ['Dashboard', 'login']]} navigate={navigate} />
          <div>
            <p className="marketing-eyebrow">Contact</p>
            <a className="mt-4 block text-sm text-slate-600 hover:text-slate-950" href="mailto:hello@xabi.world">
              hello@xabi.world
            </a>
            <p className="mt-2 text-sm text-slate-500">xabi.world</p>
          </div>
        </div>
        <div className="marketing-container flex flex-col gap-3 border-t border-slate-200 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Xabi World. Onderdeel van Quantum Initium Holding.</span>
          <span>Gebouwd voor meer overzicht.</span>
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
                <button className="marketing-dark-button justify-center" onClick={() => navigate('login')} type="button">
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
              <XabiScene className="marketing-three-scene" />
              <div className="marketing-dashboard-card">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">Jouw wereld</p>
                    <p className="mt-1 text-lg font-medium text-white">Overzicht</p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"><Sparkles className="h-4 w-4" /></span>
                </div>
                <div className="mt-8">
                  <p className="text-sm text-white/55">Totale balans</p>
                  <p className="mt-2 text-4xl font-medium tracking-[-0.06em] text-white">€ 24.680,42</p>
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
                  <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MEI</span>
                </div>
              </div>
              <div className="marketing-float-card marketing-float-card-top">
                <span className="marketing-float-icon"><Target className="h-4 w-4" /></span>
                <div><p className="text-xs text-slate-400">Doel in zicht</p><p className="mt-1 text-sm font-semibold text-slate-900">Vrijheid · 72%</p></div>
              </div>
              <div className="marketing-float-card marketing-float-card-bottom">
                <span className="marketing-float-icon bg-lime-100 text-lime-800"><Globe2 className="h-4 w-4" /></span>
                <div><p className="text-xs text-slate-400">Wereldwijd gebouwd</p><p className="mt-1 text-sm font-semibold text-slate-900">Voor jouw volgende stap</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="marketing-section bg-white">
          <div className="marketing-container py-24 lg:py-32">
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
          </div>
        </section>

        <section className="marketing-section marketing-deep-section">
          <div className="marketing-container grid gap-12 py-24 lg:grid-cols-[1fr_0.85fr] lg:items-end lg:py-32">
            <div>
              <p className="marketing-eyebrow text-emerald-300">Een bredere blik</p>
              <h2 className="marketing-section-title mt-5 max-w-2xl text-white">Je financiële wereld is groter dan een saldo.</h2>
            </div>
            <div>
              <p className="text-base leading-8 text-white/55">
                Xabi World is de plek waar overzicht en ambitie samenkomen. Een platform voor mensen die niet alleen willen bijhouden, maar vooruit willen kijken.
              </p>
              <button className="marketing-light-button mt-8" onClick={() => navigate('about')} type="button">
                Ontdek het verhaal <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="marketing-section bg-[#f2f5ef]">
          <div className="marketing-container py-24 lg:py-32">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div><p className="marketing-eyebrow">Klaar voor meer overzicht?</p><h2 className="marketing-section-title mt-5 max-w-2xl">Begin bij de wereld die je al hebt.</h2></div>
              <button className="marketing-dark-button" onClick={() => navigate('login')} type="button">Open Xabi World <ArrowUpRight className="h-4 w-4" /></button>
            </div>
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

export function AboutPage({ navigate }: { navigate: (route: PublicRoute) => void }) {
  return (
    <MarketingLayout navigate={navigate} route="about">
      <main>
        <PageHero eyebrow="Over Xabi World" title="Meer overzicht voor de wereld die je aan het bouwen bent." text="Xabi World helpt je om financiële informatie te begrijpen als onderdeel van een groter verhaal: jouw plannen, keuzes en vrijheid." />
        <section className="marketing-section bg-white">
          <div className="marketing-container grid gap-14 py-24 lg:grid-cols-[0.7fr_1.3fr] lg:py-32">
            <p className="marketing-eyebrow">Ons uitgangspunt</p>
            <div><h2 className="marketing-section-title max-w-3xl">Niet meer data. Wel betere context.</h2><p className="mt-7 max-w-2xl text-lg leading-8 text-slate-500">Xabi is ontworpen vanuit een eenvoudig idee: financiële tools moeten niet zwaarder voelen dan je financiële leven. Daarom combineren we rustige interfaces met inzichten die helpen om vooruit te kijken.</p></div>
          </div>
        </section>
        <section className="marketing-section bg-[#f2f5ef]">
          <div className="marketing-container grid gap-10 py-24 md:grid-cols-3 lg:py-32">
            <StoryBlock icon={<Target />} title="Duidelijk" text="We maken complexe bewegingen begrijpelijk, zodat je weet wat er gebeurt en waarom." />
            <StoryBlock icon={<Globe2 />} title="Open" text="We ontwerpen voor een wereld waarin je meerdere ambities, inkomsten en hoofdstukken tegelijk hebt." />
            <StoryBlock icon={<Sparkles />} title="Menselijk" text="Technologie is het middel. Meer vertrouwen en ruimte in je keuzes is het doel." />
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}

function StoryBlock({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <div className="rounded-[1.5rem] border border-slate-200 bg-white p-7"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">{icon}</span><h3 className="mt-8 text-xl font-semibold tracking-[-0.03em] text-slate-950">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{text}</p></div>;
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
        </section>
      </main>
    </MarketingLayout>
  );
}

function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <section className="marketing-page-hero"><div className="marketing-container max-w-5xl py-24 lg:py-32"><p className="marketing-kicker"><span className="marketing-kicker-dot" />{eyebrow}</p><h1 className="marketing-display mt-7 max-w-4xl">{title}</h1><p className="marketing-lead mt-7 max-w-2xl">{text}</p></div></section>;
}

export function LoginPage({ onLogin, navigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email && password) onLogin();
  };

  return (
    <div className="login-shell">
      <div className="login-aside">
        <Logo light />
        <div className="mt-auto max-w-lg"><p className="marketing-eyebrow text-emerald-300">Welkom terug</p><h1 className="mt-6 text-5xl font-medium tracking-[-0.07em] text-white md:text-7xl">Jouw wereld, weer in beeld.</h1><p className="mt-7 max-w-md text-base leading-7 text-white/55">Log in om je overzicht, doelen en financiële bewegingen te bekijken.</p></div>
        <p className="text-xs text-white/35">Xabi World · Quantum Initium Holding</p>
      </div>
      <div className="login-form-side">
        <button className="mb-12 self-start text-sm text-slate-500 hover:text-slate-950" onClick={() => navigate('home')} type="button">← Terug naar xabi.world</button>
        <div className="w-full max-w-md">
          <p className="marketing-eyebrow">Dashboard toegang</p>
          <h2 className="mt-4 text-4xl font-medium tracking-[-0.06em] text-slate-950">Inloggen bij Xabi</h2>
          <p className="mt-4 text-sm leading-6 text-slate-500">Dit is een demo-omgeving. Gebruik een willekeurig e-mailadres en wachtwoord om binnen te gaan.</p>
          <form className="mt-9 space-y-5" onSubmit={handleSubmit}>
            <label className="login-label">E-mailadres<input className="login-input" onChange={(event) => setEmail(event.target.value)} placeholder="jij@voorbeeld.nl" required type="email" value={email} /></label>
            <label className="login-label">Wachtwoord<input className="login-input" onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required type="password" value={password} /></label>
            <button className="marketing-dark-button w-full justify-center py-4" type="submit">Open mijn dashboard <ArrowUpRight className="h-4 w-4" /></button>
          </form>
          <div className="mt-8 flex items-center gap-3 text-xs text-slate-400"><LockKeyhole className="h-4 w-4" /> Je demo-sessie blijft lokaal op dit apparaat.</div>
        </div>
      </div>
    </div>
  );
}
