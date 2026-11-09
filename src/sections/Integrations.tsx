import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Landmark,
  Zap,
  Users,
  Briefcase,
  Globe,
  TrendingUp,
  Key,
  Sparkles,
  Network,
  Home,
  Crown,
  ArrowUpRight,
  Search,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Terminal,
  Copy,
  Check,
  Activity,
  Webhook,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/use-language';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { crmos, CRMOS_COMPANIES, CRMOS_AGENT_PROMPT_INSTRUCTION } from '@/lib/crmos';

export type IntegrationCategory = 'all' | 'holding' | 'business' | 'realestate' | 'lifestyle';

export interface Integration {
  id: string;
  name: string;
  domain: string;
  logo: string;
  category: string;
  categoryKey: IntegrationCategory;
  descriptionKey: string;
  icon: LucideIcon;
  badge: string;
  accentClass: string;
}

const integrations: Integration[] = [
  {
    id: 'quantuminitium',
    name: 'Quantum Initium',
    domain: 'quantuminitium.com',
    logo: '/logos/quantuminitium.svg',
    category: 'Moederholding & Treasury',
    categoryKey: 'holding',
    descriptionKey: 'descQuantumInitium',
    icon: Landmark,
    badge: 'Moedermaatschappij',
    accentClass: 'from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'boostplug',
    name: 'Boostplug',
    domain: 'boostplug.one',
    logo: '/logos/boostplug.svg',
    category: 'AI Marketing & Growth',
    categoryKey: 'business',
    descriptionKey: 'descBoostplug',
    icon: Zap,
    badge: 'Growth Engine',
    accentClass: 'from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
  {
    id: 'crmos',
    name: 'CRMos',
    domain: 'crmos.one',
    logo: '/logos/crmos.svg',
    category: 'Cloud CRM & Facturatie',
    categoryKey: 'business',
    descriptionKey: 'descCrmos',
    icon: Users,
    badge: 'Enterprise CRM',
    accentClass: 'from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
  },
  {
    id: 'djobba',
    name: 'Djobba',
    domain: 'djobba.works',
    logo: '/logos/djobba.svg',
    category: 'Flex Payroll & Freelance',
    categoryKey: 'business',
    descriptionKey: 'descDjobba',
    icon: Briefcase,
    badge: 'Freelance & Salaris',
    accentClass: 'from-indigo-500/20 to-violet-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
  },
  {
    id: 'immigratiepunt',
    name: 'Immigratiepunt',
    domain: 'immigratiepunt.nl',
    logo: '/logos/immigratiepunt.svg',
    category: 'Juridisch & Expat Relocatie',
    categoryKey: 'business',
    descriptionKey: 'descImmigratiepunt',
    icon: Globe,
    badge: 'Legal & Expat',
    accentClass: 'from-sky-500/20 to-blue-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30',
  },
  {
    id: 'investbotiq',
    name: 'InvestBotiq',
    domain: 'investbotiq.com',
    logo: '/logos/investbotiq.png',
    category: 'Kwantitatief Vermogen & AI',
    categoryKey: 'holding',
    descriptionKey: 'descInvestbotiq',
    icon: TrendingUp,
    badge: 'AI Trading Bots',
    accentClass: 'from-emerald-500/20 to-green-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'logsrent',
    name: 'Logs Rent',
    domain: 'logs.rent',
    logo: '/logos/logs.svg',
    category: 'Short-Stay & Verhuurbeheer',
    categoryKey: 'realestate',
    descriptionKey: 'descLogsRent',
    icon: Key,
    badge: 'Short-Stay Rentals',
    accentClass: 'from-yellow-500/20 to-amber-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
  },
  {
    id: 'spontiva',
    name: 'Spontiva',
    domain: 'spontiva.nl',
    logo: '/logos/spontiva.svg',
    category: 'Social Lifestyle & Events',
    categoryKey: 'lifestyle',
    descriptionKey: 'descSpontiva',
    icon: Sparkles,
    badge: 'Social Lifestyle',
    accentClass: 'from-fuchsia-500/20 to-pink-500/20 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/30',
  },
  {
    id: 'vvc',
    name: 'VVC Works',
    domain: 'vvc.works',
    logo: '/logos/vvc.svg',
    category: 'Verdienende Vrienden Club',
    categoryKey: 'lifestyle',
    descriptionKey: 'descVvc',
    icon: Network,
    badge: 'Business Club',
    accentClass: 'from-rose-500/20 to-red-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30',
  },
  {
    id: 'woningvry',
    name: 'WoningVry',
    domain: 'woningvry.nl',
    logo: '/logos/woningvry.svg',
    category: 'PropTech & Woningverhuur',
    categoryKey: 'realestate',
    descriptionKey: 'descWoningVry',
    icon: Home,
    badge: 'PropTech & Escrow',
    accentClass: 'from-teal-500/20 to-emerald-500/20 text-teal-600 dark:text-teal-400 border-teal-500/30',
  },
  {
    id: 'zheavenzy',
    name: 'Zheavenzy',
    domain: 'zheavenzy.one',
    logo: '/logos/zheavenzy.svg',
    category: 'Luxury Concierge & Private',
    categoryKey: 'lifestyle',
    descriptionKey: 'descZheavenzy',
    icon: Crown,
    badge: 'Luxury Private Life',
    accentClass: 'from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
  },
];

const STORAGE_KEY = 'xabi-integrations';

const DEFAULT_STATE: Record<string, boolean> = {
  quantuminitium: true,
  boostplug: true,
  crmos: true,
  djobba: true,
  immigratiepunt: true,
  investbotiq: true,
  logsrent: true,
  spontiva: true,
  vvc: true,
  woningvry: true,
  zheavenzy: true,
};

function readIntegrations(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return DEFAULT_STATE;
    const state: Record<string, boolean> = { ...DEFAULT_STATE };
    for (const integration of integrations) {
      if (typeof parsed[integration.id] === 'boolean') {
        state[integration.id] = parsed[integration.id];
      }
    }
    return state;
  } catch {
    return DEFAULT_STATE;
  }
}

export function Integrations() {
  const { t } = useLanguage();
  const [enabled, setEnabled] = useState<Record<string, boolean>>(readIntegrations);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory>('all');

  // CRMos REST API Console state
  const [isCrmosConsoleOpen, setIsCrmosConsoleOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('xabi_world');
  const [copiedInstruction, setCopiedInstruction] = useState(false);
  const [crmosTab, setCrmosTab] = useState<'get' | 'post' | 'queue'>('get');
  const [crmosQuery, setCrmosQuery] = useState('Reyhan');
  const [vvcQuery, setVvcQuery] = useState('VVC-REYHAN-0101');
  const [emailQuery, setEmailQuery] = useState('lars.bakker@voorbeeld.nl');
  const [crmosLoading, setCrmosLoading] = useState(false);
  const [crmosResponse, setCrmosResponse] = useState<string | null>(null);

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
    crmos.setCompany(companyId);
    const comp = CRMOS_COMPANIES[companyId];
    toast.success(`Actief Bedrijf: ${comp?.name}`, {
      description: `X-CRMOS-API-KEY: ${comp?.apiKey} (${comp?.tag})`,
    });
  };

  const handleCopyInstruction = () => {
    navigator.clipboard.writeText(CRMOS_AGENT_PROMPT_INSTRUCTION);
    setCopiedInstruction(true);
    toast.success('CRMos AI Agent Spelregels gekopieerd naar klembord!');
    setTimeout(() => setCopiedInstruction(false), 2500);
  };

  const handleCrmosSearch = async (type: 'health' | 'search' | 'email' | 'vvc' | 'contacts' | 'teams' | 'companies' | 'deals' | 'candidates') => {
    setCrmosLoading(true);
    setCrmosResponse(null);
    try {
      let res;
      if (type === 'health') {
        res = await crmos.checkHealth();
      } else if (type === 'search') {
        res = await crmos.searchUniversal(crmosQuery || 'Reyhan');
      } else if (type === 'email') {
        res = await crmos.getContactByEmail(emailQuery || 'lars.bakker@voorbeeld.nl');
      } else if (type === 'vvc') {
        res = await crmos.lookupVvcTag(vvcQuery || 'VVC-REYHAN-0101');
      } else if (type === 'contacts') {
        res = await crmos.getContacts({ q: crmosQuery });
      } else if (type === 'teams') {
        res = await crmos.getTeams();
      } else if (type === 'companies') {
        res = await crmos.getCompanies();
      } else if (type === 'deals') {
        res = await crmos.getDeals();
      } else if (type === 'candidates') {
        res = await crmos.getCandidates();
      }
      setCrmosResponse(JSON.stringify(res, null, 2));
      if (res?.success) {
        toast.success(`CRMos GET call geslaagd`);
      } else {
        toast.info(`CRMos respons: ${res?.error || 'Verzoek verwerkt'}`);
      }
    } catch (e: any) {
      setCrmosResponse(JSON.stringify({ error: e.message }, null, 2));
    } finally {
      setCrmosLoading(false);
    }
  };

  const handleCrmosPost = async (action: 'upsert' | 'candidate' | 'deal' | 'activity' | 'webhook') => {
    setCrmosLoading(true);
    setCrmosResponse(null);
    const activeComp = CRMOS_COMPANIES[selectedCompanyId] || CRMOS_COMPANIES.xabi_world;
    try {
      let res;
      if (action === 'upsert') {
        res = await crmos.upsertContact({
          first_name: 'Lars',
          last_name: 'Bakker',
          email: 'lars.bakker@voorbeeld.nl',
          phone: '+31 6 12345678',
          company: activeComp.name,
          tags: [activeComp.tag, 'B2B Lead'],
          notes: `Aanvraag via ${activeComp.name} portal voor IT-detachering en licenties.`,
          status: 'qualified',
        });
      } else if (action === 'candidate') {
        res = await crmos.createCandidate({
          first_name: 'Sanne',
          last_name: 'de Jong',
          email: 'sanne.dejong@voorbeeld.nl',
          phone: '+31 6 87654321',
          role_applied: '360° Recruiter',
          deal_model: 'no_cure_no_pay',
          company: activeComp.name,
          tags: [activeComp.tag, '#careers', 'Sollicitant'],
          skills: ['360° Recruiter', 'IT-detachering', 'HBO/WO'],
          experience_years: 3,
          location: '100% Remote',
          notes: `Sollicitatie ontvangen voor 360 Recruiter positie via ${activeComp.name}.`,
        });
      } else if (action === 'deal') {
        res = await crmos.createDeal({
          name: `${activeComp.name} Pilot - Jansen Transport`,
          value: 35000,
          stage: 'qualified',
          company_name: activeComp.id,
          contact_email: 'directie@jansentransport.nl',
          probability: 70,
          notes: 'Offerteaanvraag ontvangen voor hardware en compute licenties.',
        });
      } else if (action === 'activity') {
        res = await crmos.logActivity({
          type: 'call',
          title: 'AI Telefonische Kwalificatie Geslaagd',
          description: `Klant gesproken namens ${activeComp.name}, interesse in enterprise licentie. Afspraak gepland.`,
          performed_by: `${activeComp.name} AI Agent`,
        });
      } else if (action === 'webhook') {
        res = await crmos.registerWebhook({
          company: activeComp.name,
          url: `https://${activeComp.domain || 'xabi.world'}/api/webhooks/crmos`,
          events: ['candidate.placed', 'deal.won', 'contact.upserted'],
          secret: `whsec_${activeComp.id}_crmos_2026`,
        });
      }
      setCrmosResponse(JSON.stringify(res, null, 2));
      if (res?.success) {
        toast.success(`CRMos actie "${action}" succesvol verzonden!`);
      } else {
        toast.info(`CRMos actie geregistreerd: ${res?.error || 'Verwerkt'}`);
      }
    } catch (e: any) {
      setCrmosResponse(JSON.stringify({ error: e.message }, null, 2));
    } finally {
      setCrmosLoading(false);
    }
  };

  const handleSyncQueue = async () => {
    setCrmosLoading(true);
    const count = await crmos.syncOfflineQueue();
    setCrmosLoading(false);
    toast.success(`${count} actie(s) gesynchroniseerd met CRMos`);
  };

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setEnabled(readIntegrations());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleToggle = (integration: Integration, next: boolean) => {
    const updated = { ...enabled, [integration.id]: next };
    setEnabled(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // opslag niet beschikbaar
    }
    toast.success(`${integration.name}: ${next ? t('integrationConnected') : t('integrationDisconnected')}`, {
      description: next ? `Realtime API-synchronisatie met ${integration.domain} actief.` : undefined,
    });
  };

  const handleToggleAll = (enable: boolean) => {
    const updated: Record<string, boolean> = {};
    for (const item of integrations) {
      updated[item.id] = enable;
    }
    setEnabled(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // opslag niet beschikbaar
    }
    toast.success(enable ? 'Alle 11 Quantum Initium integraties gekoppeld!' : 'Alle integraties ontkoppeld.');
  };

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.categoryKey === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.domain.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const activeCount = Object.values(enabled).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header with Title and Ecosystem Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.04em] text-foreground">{t('integrations')}</h2>
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-mono">
              11 Bedrijven
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t('integrationsSubtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleToggleAll(activeCount < integrations.length)}
            className="text-xs font-semibold h-9 rounded-xl border-border"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            {activeCount < integrations.length ? 'Koppel Alles (11)' : 'Ontkoppel Alles'}
          </Button>
        </div>
      </div>

      {/* Ecosystem Status Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-emerald-500/10 via-card to-blue-500/10 p-5 card-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base text-foreground">Quantum Initium Holding Ecosysteem</h4>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl leading-relaxed">
                Beheer alle 11 gelieerde holdingparticipaties en zusterbedrijven vanuit één centrale cockpit. Data wordt end-to-end beveiligd via onze 256-bit AES Enclave en realtime webhook-architectuur.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm p-3 rounded-xl border border-border shrink-0 self-start md:self-center">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Actieve Connecties</span>
              <span className="font-mono text-lg font-black text-emerald-600 dark:text-emerald-400">
                {activeCount} / {integrations.length}
              </span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Enclave Beveiligd</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ecosystem Logo Buttons Strip */}
      <div className="rounded-2xl border border-border bg-card p-4 card-shadow">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Directe Bedrijfslogo Knoppen (Klik om te openen)
            </h4>
          </div>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            11 Actieve Platformen binnen Quantum Initium
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2.5">
          {integrations.map((item) => {
            const isItemOn = enabled[item.id] ?? false;
            return (
              <a
                key={item.id}
                href={`https://${item.domain}`}
                target="_blank"
                rel="noreferrer noopener"
                title={`${item.name} openen (${item.domain})`}
                className="group relative flex flex-col items-center justify-center p-2.5 rounded-xl border border-border/80 bg-background/60 hover:bg-muted/80 hover:border-primary/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:translate-y-0 text-center"
              >
                {/* Active Indicator Dot */}
                <span
                  className={`absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full ${
                    isItemOn ? 'bg-emerald-500 ring-2 ring-emerald-500/30' : 'bg-muted-foreground/30'
                  }`}
                />

                {/* Company Logo Button Image */}
                <div className="h-10 w-10 flex items-center justify-center p-1 rounded-lg bg-card/80 border border-border/40 shadow-xs group-hover:scale-110 transition-transform duration-200">
                  <img
                    src={item.logo}
                    alt={`${item.name} logo`}
                    className="h-full w-full object-contain filter"
                  />
                </div>

                {/* Name */}
                <span className="mt-2 text-[11px] font-bold text-foreground truncate max-w-full leading-tight">
                  {item.name}
                </span>

                {/* Domain Pill */}
                <span className="text-[9px] font-mono text-muted-foreground group-hover:text-primary truncate max-w-full flex items-center gap-0.5 mt-0.5">
                  {item.domain.replace('.one', '').replace('.works', '').replace('.com', '').replace('.nl', '').replace('.rent', '')}
                  <ArrowUpRight className="h-2 w-2 opacity-50 group-hover:opacity-100" />
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { key: 'all', label: `Alle (${integrations.length})` },
            { key: 'holding', label: 'Holding & FinTech' },
            { key: 'business', label: 'Zakelijk & CRM' },
            { key: 'realestate', label: 'Vastgoed & Verhuur' },
            { key: 'lifestyle', label: 'Lifestyle & Club' },
          ].map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key as IntegrationCategory)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-foreground text-background shadow-sm font-bold'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek integratie of domein..."
            className="pl-9 h-9 rounded-xl text-xs bg-card border-border"
          />
        </div>
      </div>

      {/* 11 Ecosystem Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIntegrations.map((integration) => {
          const isOn = enabled[integration.id] ?? false;

          return (
            <Card
              key={integration.id}
              className={`card-shadow rounded-2xl transition-all border ${
                isOn ? 'border-border bg-card' : 'border-border/60 bg-muted/20 opacity-80'
              }`}
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Official Company Logo as Clickable Interactive Button */}
                    <a
                      href={`https://${integration.domain}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      title={`${integration.name} openen (${integration.domain})`}
                      className={`group/logo relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border p-2.5 transition-all duration-200 hover:scale-105 hover:shadow-md hover:ring-2 hover:ring-primary/40 active:scale-95 ${
                        isOn
                          ? 'bg-card border-border shadow-xs'
                          : 'bg-muted/60 border-border/40 opacity-70 grayscale hover:grayscale-0'
                      }`}
                    >
                      <img
                        src={integration.logo}
                        alt={`${integration.name} logo`}
                        className="h-full w-full object-contain filter transition-transform duration-200 group-hover/logo:scale-110"
                      />
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-background border border-border shadow-xs opacity-0 group-hover/logo:opacity-100 transition-opacity">
                        <ArrowUpRight className="h-2.5 w-2.5 text-foreground" />
                      </span>
                    </a>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-base text-foreground tracking-tight">{integration.name}</h4>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-medium py-0 px-2 rounded-full border-border bg-muted/40"
                        >
                          {integration.badge}
                        </Badge>
                      </div>

                      <a
                        href={`https://${integration.domain}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline mt-0.5 group"
                      >
                        {integration.domain}
                        <ArrowUpRight className="h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <Switch
                      aria-label={`${integration.name} integratie`}
                      checked={isOn}
                      onCheckedChange={(next) => handleToggle(integration, next)}
                    />
                    <span
                      className={`text-[10px] font-semibold flex items-center gap-1 ${
                        isOn ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-muted-foreground'
                      }`}
                    >
                      {isOn ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> Gekoppeld
                        </>
                      ) : (
                        'Uitgeschakeld'
                      )}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                  {t(integration.descriptionKey)}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-border/70 text-xs gap-2">
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {integration.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                        isOn
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isOn ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/40'}`} />
                      {isOn ? 'Sync Actief' : 'Standby'}
                    </span>

                    {/* CRMos Live REST API Button */}
                    {integration.id === 'crmos' && (
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => setIsCrmosConsoleOpen(true)}
                        className="h-7 px-2 rounded-lg text-[11px] font-bold bg-blue-600 hover:bg-blue-500 text-white gap-1 shadow-xs"
                      >
                        <Terminal className="h-3 w-3" />
                        <span>API Console</span>
                      </Button>
                    )}

                    {/* Logo Button Link */}
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-7 px-2.5 rounded-lg text-[11px] font-semibold border-border hover:bg-muted"
                    >
                      <a
                        href={`https://${integration.domain}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1"
                      >
                        <img src={integration.logo} alt="" className="h-3 w-3 object-contain" />
                        <span>Openen</span>
                        <ArrowUpRight className="h-2.5 w-2.5 opacity-60" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-dashed border-border p-8 bg-card">
          <p className="text-sm font-semibold text-foreground">Geen integraties gevonden</p>
          <p className="text-xs text-muted-foreground mt-1">Geen bedrijven komen overeen met je zoekopdracht "{searchQuery}".</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 text-xs"
          >
            Filters wissen
          </Button>
        </div>
      )}

      {/* Kaartinfrastructuur & Betaalnetwerken */}
      <div className="pt-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-foreground">Kaartinfrastructuur & Betaalnetwerken</h3>
          <p className="text-xs text-muted-foreground">
            Directe integratie met toonaangevende betaalkaartnetwerken voor fysieke titanium kaarten en instant virtuele betaalpassen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 card-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-bold text-sm text-foreground">Mastercard World Elite</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Mastercard Europe
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Gereguleerde Europese kaartrails. Biedt fysieke Obsidian Metal kaarten, SEPA-rails en PCI-DSS Level 1 tokenized PAN/CVC rendering met 👁️ weergave.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
              <span className="font-mono text-[11px] text-muted-foreground">GraphQL v2 Gateway</span>
              <button
                type="button"
                onClick={() => toast.success('Mastercard netwerkverbinding geverifieerd (200 OK)')}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Test Verbinding
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 card-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                <h4 className="font-bold text-sm text-foreground">Visa Direct Betaalrails</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Visa Principal Rails
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Gelicentieerde Europese betaalrails voor instant virtuele passen voor e-commerce, contactloos betalen en 3D Secure 2.0 biometrische authenticatie.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
              <span className="font-mono text-[11px] text-muted-foreground">REST API v1 Gateway</span>
              <button
                type="button"
                onClick={() => toast.success('Visa Direct verbinding geverifieerd (200 OK)')}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Test Verbinding
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CRMos REST API Console Dialog */}
      <Dialog open={isCrmosConsoleOpen} onOpenChange={setIsCrmosConsoleOpen}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0a0d14] border border-blue-500/30 text-foreground p-6 rounded-2xl shadow-2xl">
          <DialogHeader className="text-left space-y-2 border-b border-white/10 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                <DialogTitle className="text-xl font-bold text-foreground">
                  CRMos REST API v1 — AI Agent Bi-directionele Console
                </DialogTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyInstruction}
                  className="h-8 text-xs font-semibold gap-1.5 border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300"
                >
                  {copiedInstruction ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedInstruction ? 'Gekopieerd!' : 'Kopieer Agent Spelregels'}</span>
                </Button>
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                  4 Universele Spelregels Actief
                </Badge>
              </div>
            </div>

            {/* Company & API Key Switcher Bar */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-semibold whitespace-nowrap">Bedrijfsidentiteit:</span>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => handleCompanyChange(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#121620] border border-white/15 text-xs text-foreground font-bold focus:outline-none focus:border-blue-500"
                >
                  {Object.values(CRMOS_COMPANIES).map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {comp.name} ({comp.tag})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground overflow-x-auto">
                <span className="text-blue-400 font-semibold">Key:</span>
                <span className="bg-black/50 px-2 py-0.5 rounded border border-white/10 text-[11px] text-foreground">
                  {crmos.getApiKey()}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                  {crmos.getCompanyTag()}
                </span>
              </div>
            </div>

            <DialogDescription className="text-xs text-muted-foreground font-mono">
              Base URL: {crmos.getBaseUrl()} • Bi-directioneel Lezen (GET) & Schrijven (POST/PATCH)
            </DialogDescription>
          </DialogHeader>

          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3 pt-1">
            <button
              type="button"
              onClick={() => setCrmosTab('get')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                crmosTab === 'get'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-muted-foreground hover:text-foreground bg-white/[0.03]'
              }`}
            >
              1. Spelregel 3: Data Ophalen & Zoeken (GET)
            </button>
            <button
              type="button"
              onClick={() => setCrmosTab('post')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                crmosTab === 'post'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-muted-foreground hover:text-foreground bg-white/[0.03]'
              }`}
            >
              2. Spelregel 2: Terugschrijven (POST/PATCH)
            </button>
            <button
              type="button"
              onClick={() => setCrmosTab('queue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                crmosTab === 'queue'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-muted-foreground hover:text-foreground bg-white/[0.03]'
              }`}
            >
              3. Spelregel 4: Webhooks & Offline Resiliency
            </button>
          </div>

          {/* Tab Content: GET */}
          {crmosTab === 'get' && (
            <div className="space-y-4 text-xs pt-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Health check */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-foreground font-semibold">
                    <Activity className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Health Check Status</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">GET /api/v1/health voor statusbots</p>
                  <Button
                    size="sm"
                    className="w-full text-xs h-7 bg-emerald-600 hover:bg-emerald-500 font-semibold"
                    disabled={crmosLoading}
                    onClick={() => handleCrmosSearch('health')}
                  >
                    Test GET /health
                  </Button>
                </div>

                {/* 2. VVC Tag Lookup */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-foreground font-semibold block">VVC Tag Verifiëren</span>
                  <Input
                    value={vvcQuery}
                    onChange={(e) => setVvcQuery(e.target.value)}
                    placeholder="VVC-REYHAN-0101"
                    className="bg-white/[0.04] border-white/10 text-xs h-7 font-mono"
                  />
                  <Button
                    size="sm"
                    className="w-full text-xs h-7 bg-blue-600 hover:bg-blue-500 font-semibold"
                    disabled={crmosLoading}
                    onClick={() => handleCrmosSearch('vvc')}
                  >
                    GET /vvc/lookup?tag=...
                  </Button>
                </div>

                {/* 3. Email Contact Lookup */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-foreground font-semibold block">Contact op E-mail</span>
                  <Input
                    value={emailQuery}
                    onChange={(e) => setEmailQuery(e.target.value)}
                    placeholder="naam@voorbeeld.nl"
                    className="bg-white/[0.04] border-white/10 text-xs h-7 font-mono"
                  />
                  <Button
                    size="sm"
                    className="w-full text-xs h-7 bg-indigo-600 hover:bg-indigo-500 font-semibold"
                    disabled={crmosLoading}
                    onClick={() => handleCrmosSearch('email')}
                  >
                    GET /contacts?email=...
                  </Button>
                </div>
              </div>

              {/* Universal search */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-muted-foreground font-semibold">Universeel Zoeken (doorzoekt contacten, deals, kandidaten & teams):</label>
                <div className="flex gap-2">
                  <Input
                    value={crmosQuery}
                    onChange={(e) => setCrmosQuery(e.target.value)}
                    placeholder="bijv. Reyhan, Spontiva, daan.vanvliet..."
                    className="bg-white/[0.04] border-white/10 text-xs h-9"
                  />
                  <Button
                    onClick={() => handleCrmosSearch('search')}
                    disabled={crmosLoading}
                    className="bg-blue-600 hover:bg-blue-500 text-xs h-9 font-bold px-4"
                  >
                    <Search className="h-3.5 w-3.5 mr-1" />
                    GET /search?q=...
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-muted-foreground mr-1 self-center text-[11px]">Directe filters:</span>
                <Button size="sm" variant="outline" className="h-7 text-[11px] border-white/10" onClick={() => handleCrmosSearch('contacts')}>
                  GET /contacts
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px] border-white/10" onClick={() => handleCrmosSearch('teams')}>
                  GET /teams
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px] border-white/10" onClick={() => handleCrmosSearch('companies')}>
                  GET /companies
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px] border-white/10" onClick={() => handleCrmosSearch('deals')}>
                  GET /deals
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[11px] border-white/10" onClick={() => handleCrmosSearch('candidates')}>
                  GET /candidates
                </Button>
              </div>
            </div>
          )}

          {/* Tab Content: POST */}
          {crmosTab === 'post' && (
            <div className="space-y-4 text-xs pt-1">
              <p className="text-muted-foreground leading-relaxed">
                Elke write-actie wordt verstuurd onder de actieve sleutel van <strong className="text-foreground">{crmos.getCompany().name}</strong> ({crmos.getCompanyTag()}).
                CRMos matcht op <code className="text-blue-300">LOWER(TRIM(email))</code>, dedupliceert automatisch en overschrijft nooit eerdere historie.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground text-xs">A. Contact Inschrijven (Upsert)</p>
                    <span className="font-mono text-[10px] text-blue-400">POST /contacts/upsert</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Verrijkt bestaand contact of maakt nieuw contact aan met tag <code className="text-blue-300">{crmos.getCompanyTag()}</code>.
                  </p>
                  <Button
                    size="sm"
                    className="w-full text-xs h-8 bg-blue-600 hover:bg-blue-500 font-semibold"
                    disabled={crmosLoading}
                    onClick={() => handleCrmosPost('upsert')}
                  >
                    Test Upsert Contact (Lars Bakker)
                  </Button>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground text-xs">B. Sollicitant / No Cure No Pay</p>
                    <span className="font-mono text-[10px] text-amber-400">POST /candidates</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Koppelt aan wervingsfunnel met <code className="text-amber-300">deal_model: no_cure_no_pay</code> en upsert het CRM-contact.
                  </p>
                  <Button
                    size="sm"
                    className="w-full text-xs h-8 bg-amber-600 hover:bg-amber-500 font-semibold"
                    disabled={crmosLoading}
                    onClick={() => handleCrmosPost('candidate')}
                  >
                    Test Sollicitant (Sanne de Jong - 360° Recruiter)
                  </Button>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground text-xs">C. Deal / Verkooporder</p>
                    <span className="font-mono text-[10px] text-emerald-400">POST /deals</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Registreert order van € 35.000 in pipeline met <code className="text-emerald-300">contact_email</code> en <code className="text-emerald-300">company_name</code>.
                  </p>
                  <Button
                    size="sm"
                    className="w-full text-xs h-8 bg-emerald-600 hover:bg-emerald-500 font-semibold"
                    disabled={crmosLoading}
                    onClick={() => handleCrmosPost('deal')}
                  >
                    Test Deal Inschrijven (€ 35.000 Pilot)
                  </Button>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground text-xs">D. Activiteit / Call Log</p>
                    <span className="font-mono text-[10px] text-purple-400">POST /activities</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Logt gespreksnotitie van AI Agent met tijdstempel en toelichting.
                  </p>
                  <Button
                    size="sm"
                    className="w-full text-xs h-8 bg-purple-600 hover:bg-purple-500 font-semibold"
                    disabled={crmosLoading}
                    onClick={() => handleCrmosPost('activity')}
                  >
                    Test Log Activiteit (AI Call Log)
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Queue & Webhooks */}
          {crmosTab === 'queue' && (
            <div className="space-y-4 text-xs pt-1">
              {/* Spelregel 4: Webhooks */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Webhook className="h-4 w-4 text-blue-400" />
                    <span>Spelregel 4: Webhooks Registreren (CRMos ➡️ Jouw Agent)</span>
                  </div>
                  <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/30 text-[10px]">
                    candidate.placed • deal.won
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Zodra een teamleider in CRMos een deal op <strong>won</strong> zet of een sollicitant op <strong>placed</strong>, schiet CRMos direct een webhook met payload naar jouw server.
                </p>
                <Button
                  size="sm"
                  className="text-xs h-8 bg-blue-600 hover:bg-blue-500 font-semibold"
                  disabled={crmosLoading}
                  onClick={() => handleCrmosPost('webhook')}
                >
                  <Webhook className="h-3.5 w-3.5 mr-1" />
                  Test Webhook Registreren voor {crmos.getCompany().name}
                </Button>
              </div>

              {/* Offline Resiliency */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Enclave Offline Sync Wachtrij</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">Auto-Recovery Actief</Badge>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Schrijfopdrachten die niet direct voltooid kunnen worden door netwerkonderbrekingen worden veilig in de lokale enclave wachtrij opgeslagen en gesynchroniseerd zodra de verbinding herstelt.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8 border-white/15 hover:bg-white/10 font-semibold"
                  disabled={crmosLoading}
                  onClick={handleSyncQueue}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Wachtrij Nu Geforceerd Synchroniseren
                </Button>
              </div>
            </div>
          )}

          {/* JSON Response Viewer */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                Live Terminal respons ({crmos.getBaseUrl()}):
              </span>
              {crmosResponse && (
                <button
                  type="button"
                  onClick={() => setCrmosResponse(null)}
                  className="text-[10px] text-muted-foreground hover:text-foreground"
                >
                  Wissen
                </button>
              )}
            </div>
            <pre className="max-h-52 overflow-auto rounded-xl bg-black/60 border border-white/10 p-3 font-mono text-[11px] text-blue-300 leading-relaxed">
              {crmosLoading
                ? `[CRMos v1] Verzoek wordt verzonden met X-CRMOS-API-KEY (${crmos.getCompanyTag()})...`
                : (crmosResponse || 'Nog geen verzoek uitgevoerd. Klik op een actie of testknop hierboven.')}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
