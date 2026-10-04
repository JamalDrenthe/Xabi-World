import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ShoppingBag, Lock, Briefcase, Wallet, PiggyBank, CreditCard, Heart, ArrowRight, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/use-language';

function ServiceCard({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle: string }) {
  const { t } = useLanguage();
  return (
    <Card className="card-shadow hover:card-shadow-hover cursor-pointer transition-all hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Icon className="h-6 w-6" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary"
            onClick={() => toast.info(`${title}: ${t('serviceInfo')}`)}
          >
            {t('viewDetails')} <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <h3 className="mt-6 font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function BankServiceItem({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="hidden flex-1 grid-cols-3 gap-8 text-sm text-muted-foreground sm:grid">
        <span>{t('selfService')}</span>
        <span>{t('secureSetup')}</span>
        <span>{t('support247')}</span>
      </div>
      <Button variant="outline" size="sm" onClick={() => toast.info(`${title}: ${t('serviceInfo')}`)}>
        {t('viewDetails')}
      </Button>
    </div>
  );
}

export function Services() {
  const { t } = useLanguage();
  const featuredServices = [
    { icon: Shield, title: 'Levensverzekering', subtitle: 'Bescherming zonder grenzen' },
    { icon: ShoppingBag, title: 'Shoppen', subtitle: 'Kopen. Denken. Groeien.' },
    { icon: Lock, title: 'Veiligheid', subtitle: 'Jouw gegevens zijn afgeschermd' },
  ];

  const bankServices = [
    { icon: Briefcase, title: 'Zakelijke leningen', description: 'Flexibele financiering voor je volgende stap.' },
    { icon: Wallet, title: 'Betaalrekeningen', description: 'Dagelijks betalen met helder overzicht.' },
    { icon: PiggyBank, title: 'Spaarrekeningen', description: 'Bouw een buffer met doelgericht sparen.' },
    { icon: CreditCard, title: 'Betaal- en creditcards', description: 'Kaarten ontworpen rond jouw manier van werken.' },
    { icon: Heart, title: 'Levensverzekering', description: 'Bescherming die je plannen in beweging houdt.' },
    { icon: Briefcase, title: 'Bedrijfsfinanciering', description: 'Werkkapitaal wanneer je het nodig hebt.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="dashboard-overline">{t('yourWorld')}</p>
        <h2 className="dashboard-section-title">{t('services')}</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {featuredServices.map((service) => (
          <ServiceCard key={service.title} icon={service.icon} title={service.title} subtitle={service.subtitle} />
        ))}
      </div>

      <Card className="card-shadow">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">{t('bankServices')}</h3>
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => toast.info(t('serviceListReady'))}>
              {t('viewAll')} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {bankServices.map((service, index) => (
              <BankServiceItem key={index} icon={service.icon} title={service.title} description={service.description} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
