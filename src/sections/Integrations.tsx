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
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/use-language';

export type IntegrationCategory = 'all' | 'holding' | 'business' | 'realestate' | 'lifestyle';

export interface Integration {
  id: string;
  name: string;
  domain: string;
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
          const Icon = integration.icon;
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
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br border transition-all ${
                        isOn
                          ? integration.accentClass
                          : 'bg-muted text-muted-foreground border-border/40'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

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

                <div className="flex items-center justify-between pt-3 border-t border-border/70 text-xs">
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {integration.category}
                  </span>

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
    </div>
  );
}
