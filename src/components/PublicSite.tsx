import { useState } from 'react';
import { toast } from 'sonner';
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
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth, DEMO_ACCOUNTS } from '@/lib/auth-context';

export type PublicRoute = 'home' | 'about' | 'platform' | 'company' | 'pricing' | 'register' | 'login';

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
  { route: 'pricing', label: 'Lid worden' },
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
          <FooterColumn title="Toegang" items={[['Inloggen', 'login'], ['Lid worden', 'pricing'], ['Dashboard', 'login']]} navigate={navigate} />
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
              <div className="marketing-orbit marketing-orbit-one" />
              <div className="marketing-orbit marketing-orbit-two" />
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
              <div className="marketing-float-card marketing-float-card-top">
                <span className="marketing-float-icon"><Target className="h-4 w-4" /></span>
                <div><p className="text-xs text-slate-400">Doel in zicht</p><p className="mt-1 text-sm font-semibold text-slate-900">Wereldreis 2027 · 72%</p></div>
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
            <div className="mt-20 grid gap-px overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['€ 39.187,70', 'Voorbeeld­saldo over drie rekeningen'],
                ['4 domeinen', 'Betalingen, kaarten, beleggen, sparen'],
                ['NL & EN', 'Eén omgeving, volledig tweetalig'],
                ['100% self-service', 'Inzicht en actie zonder wachttijd'],
              ].map(([stat, label]) => (
                <div className="bg-white p-8" key={stat}>
                  <p className="text-2xl font-semibold tracking-[-0.04em] text-emerald-900">{stat}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="marketing-section bg-white">
          <div className="marketing-container py-24 lg:py-32">
            <div className="max-w-2xl">
              <p className="marketing-eyebrow">Hoe Xabi werkt</p>
              <h2 className="marketing-section-title mt-5">Van gegevens naar richting, in drie stappen.</h2>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              <StepCard icon={<Wallet className="h-5 w-5" />} step="Stap 1" title="Verbind je wereld" text="Rekeningen, kaarten en doelen komen samen in één helder dashboard — alles in euro's, alles in één blik." />
              <StepCard icon={<LineChart className="h-5 w-5" />} step="Stap 2" title="Lees je patronen" text="Activiteit, uitgaven en beleggingen worden begrijpelijk gemaakt zodat je precies weet waar je staat." />
              <StepCard icon={<PiggyBank className="h-5 w-5" />} step="Stap 3" title="Bouw aan je doelen" text="Spaardoelen volgen mee met je voortgang — inzicht wordt een gewoonte, geen klus." />
            </div>
          </div>
        </section>

        <section className="marketing-section bg-white">
          <div className="marketing-container pb-24 lg:pb-32">
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
              <button className="marketing-primary-button" onClick={() => navigate('login')} type="button">Open Xabi World <ArrowUpRight className="h-4 w-4" /></button>
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
  tagline: string;
  featured?: boolean;
  features: string[];
}

const membershipTiers: MembershipTier[] = [
  {
    id: 'start',
    name: 'Start',
    price: '€ 10',
    tagline: 'De eerste stap in je wereld.',
    features: [
      'Particuliere betaalrekening',
      '1 Xabi debetkaart',
      'Mobiel & web bankieren',
      'Inzicht-dashboard',
      '1 spaardoel',
      'SEPA-overboekingen',
    ],
  },
  {
    id: 'basis',
    name: 'Basis',
    price: '€ 15',
    tagline: 'Het complete dagelijkse pakket.',
    features: [
      'Alles van Start',
      '2 betaalrekeningen',
      'Xabi Signature creditcard',
      'Onbeperkte spaardoelen',
      'Instant overboekingen',
      'Kaartlimieten zelf instellen',
    ],
  },
  {
    id: 'medium',
    name: 'Medium',
    price: '€ 20',
    tagline: 'Voor wie zijn wereld laat groeien.',
    features: [
      'Alles van Basis',
      'Beleggingsrekening (Xabi Investments)',
      'Xabi Business kaart',
      'Budgetten & uitgaven-meldingen',
      'Partner-/gezinsrekening',
      'Maandrapporten & export',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€ 200',
    tagline: 'Voor professionals & zakelijke klanten.',
    featured: true,
    features: [
      'Alles van Medium',
      'Persoonlijke accountmanager',
      '24/7 priority support',
      'Zakelijke betalingen & batches',
      'API-toegang',
      'Multi-valuta rekeningen',
      'Verhoogde daglimieten',
      'Kwartaal portfolio-review',
    ],
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
  const handleJoin = (tierId: string) => {
    selectTier(tierId);
    navigate('register');
  };

  return (
    <MarketingLayout navigate={navigate} route="pricing">
      <main>
        <PageHero eyebrow="Lid worden" title="Kies het lidmaatschap dat bij jouw wereld past." text="Van je eerste betaalrekening tot een volledig zakelijke omgeving — elk Xabi-lidmaatschap groeit mee met je volgende stap. Alles inbegrepen, maandelijks opzegbaar." />
        <section className="marketing-section bg-white">
          <div className="marketing-container grid gap-6 py-24 md:grid-cols-2 lg:py-32 xl:grid-cols-4">
            {membershipTiers.map((tier) => (
              <div
                className={`flex flex-col rounded-[1.5rem] border p-7 transition hover:-translate-y-1 ${
                  tier.featured
                    ? 'border-[#9fe870]/40 bg-[#0e0f0c] shadow-xl shadow-emerald-950/20'
                    : 'border-slate-200 bg-[#f8faf6] hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/5'
                }`}
                key={tier.id}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-lg font-semibold tracking-[-0.03em] ${tier.featured ? 'text-white' : 'text-slate-950'}`}>
                    {tier.name}
                  </p>
                  {tier.featured && (
                    <span className="rounded-full bg-[#9fe870] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0e0f0c]">
                      Meest gekozen
                    </span>
                  )}
                </div>
                <p className={`mt-2 text-sm leading-6 ${tier.featured ? 'text-white/55' : 'text-slate-500'}`}>{tier.tagline}</p>
                <p className={`mt-7 flex items-baseline gap-2 ${tier.featured ? 'text-white' : 'text-slate-950'}`}>
                  <span className="text-5xl font-extrabold tracking-[-0.05em]">{tier.price}</span>
                  <span className={`text-sm ${tier.featured ? 'text-white/45' : 'text-slate-400'}`}>/ maand</span>
                </p>
                <ul className="mt-8 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li className="flex items-start gap-3" key={feature}>
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${tier.featured ? 'text-[#9fe870]' : 'text-[#2ead4b]'}`} />
                      <span className={`text-sm leading-6 ${tier.featured ? 'text-white/75' : 'text-slate-600'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`${tier.featured ? 'marketing-primary-button' : 'marketing-outline-button'} mt-9 w-full justify-center py-3.5`}
                  onClick={() => handleJoin(tier.id)}
                  type="button"
                >
                  Word lid <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
        <section className="marketing-section bg-[#f2f5ef]">
          <div className="marketing-container flex flex-col gap-10 py-20 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="marketing-eyebrow">Nog aan het vergelijken?</p>
              <h2 className="marketing-section-title mt-5 max-w-2xl">Je wisselt maandelijks van lidmaatschap.</h2>
            </div>
            <button className="marketing-primary-button" onClick={() => navigate('login')} type="button">
              Verken de demo <ArrowUpRight className="h-4 w-4" />
            </button>
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
        <p className="text-xs text-white/35">Xabi World · info@jamaldrenthe.com</p>
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
              💡 Inloggen met <span className="font-semibold text-slate-700">info@jamaldrenthe.com</span> geeft automatisch <span className="font-semibold text-emerald-700">Admin</span>-rechten.
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
                placeholder="info@jamaldrenthe.com of jouw e-mail"
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
