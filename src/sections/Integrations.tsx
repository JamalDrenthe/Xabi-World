import { useState } from 'react';
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

export function Integrations() {
  const { t } = useLanguage();
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    } catch {
      return {};
    }
  });

  const handleToggle = (integration: Integration, next: boolean) => {
    setEnabled((current) => {
      const updated = { ...current, [integration.id]: next };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // opslag niet beschikbaar — toggles blijven sessie-lokaal
      }
      return updated;
    });
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
    </div>
  );
}
