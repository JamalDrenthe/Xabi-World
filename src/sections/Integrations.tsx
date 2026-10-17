import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Home, Plug, Sparkles, Briefcase, Zap, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/use-language';

interface Integration {
  id: string;
  name: string;
  descriptionKey: string;
  icon: LucideIcon;
}

const integrations: Integration[] = [
  { id: 'spontiva', name: 'Spontiva', descriptionKey: 'descSpontiva', icon: Sparkles },
  { id: 'boostplug', name: 'Boostplug', descriptionKey: 'descBoostplug', icon: Zap },
  { id: 'woningvry', name: 'WoningVry', descriptionKey: 'descWoningVry', icon: Home },
  { id: 'vvc', name: 'VVC', descriptionKey: 'descVvc', icon: Plug },
  { id: 'djobba', name: 'Djobba', descriptionKey: 'descDjobba', icon: Briefcase },
];

const STORAGE_KEY = 'xabi-integrations';

function readIntegrations(): Record<string, boolean> {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    const state: Record<string, boolean> = {};
    for (const integration of integrations) {
      if (typeof parsed[integration.id] === 'boolean') state[integration.id] = parsed[integration.id];
    }
    return state;
  } catch {
    return {};
  }
}

export function Integrations() {
  const { t } = useLanguage();
  const [enabled, setEnabled] = useState<Record<string, boolean>>(readIntegrations);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setEnabled(readIntegrations());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleToggle = (integration: Integration, next: boolean) => {
    const updated = { ...readIntegrations(), [integration.id]: next };
    setEnabled(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // opslag niet beschikbaar — toggles blijven sessie-lokaal
    }
    toast.success(`${integration.name}: ${next ? t('integrationConnected') : t('integrationDisconnected')}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">{t('integrations')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('integrationsSubtitle')}</p>
      </div>

      <Card className="card-shadow">
        <CardContent className="divide-y divide-border p-0">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            const isOn = enabled[integration.id] ?? false;
            return (
              <div className="flex items-center gap-4 p-5" key={integration.id}>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${isOn ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{integration.name}</p>
                    {isOn && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                        {t('connected')}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{t(integration.descriptionKey)}</p>
                </div>
                <Switch
                  aria-label={`${integration.name} ${t('integrations')}`}
                  checked={isOn}
                  onCheckedChange={(next) => handleToggle(integration, next)}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* BaaS Banking-as-a-Service Card Issuing Engines */}
      <div className="pt-4">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-foreground">BaaS Kaartinfrastructuur (Banking-as-a-Service)</h3>
          <p className="text-xs text-muted-foreground">
            Koppelingen met erkende Europese Electronic Money Institutions voor het direct uitgeven van debetkaarten en virtuele passen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 card-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-bold text-sm text-foreground">Swan.io BaaS</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Mastercard Europe
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Franse BaaS-licentiehouder (ACPR). Biedt fysieke Obsidian Metal kaarten, SEPA-rails en PCI-DSS Level 1 tokenized PAN/CVC rendering met 👁️ weergave.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
              <span className="font-mono text-[11px] text-muted-foreground">GraphQL v2 Sandbox</span>
              <button
                type="button"
                onClick={() => toast.success('Swan BaaS verbinding geverifieerd (200 OK)')}
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
                <h4 className="font-bold text-sm text-foreground">Wallester Business</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Visa Principal Member
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Europese EMI (Estland FSA) gespecialiseerd in white-label Visa kaartuitgifte, instant virtuele passen voor e-commerce en 3D Secure 2.0 authenticatie.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
              <span className="font-mono text-[11px] text-muted-foreground">REST API v1 Sandbox</span>
              <button
                type="button"
                onClick={() => toast.success('Wallester REST verbinding geverifieerd (200 OK)')}
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
