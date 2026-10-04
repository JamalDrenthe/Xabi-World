import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Lock, Key, Wallet, Smartphone, Snowflake, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Chart from 'chart.js/auto';
import { useLanguage } from '@/lib/use-language';
import { cards, eur, type BankCard } from '@/lib/data';

function CreditCardDisplay({ card, variant }: { card: BankCard; variant: 'primary' | 'outline' }) {
  const isDark = variant === 'primary';

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 ${isDark ? 'gradient-card' : 'border-2 border-border bg-card'}`}>
      {isDark && (
        <div className="absolute right-0 top-0 h-24 w-24 opacity-10">
          <div className="absolute right-2 top-2 h-16 w-16 rounded-full border-4 border-white" />
        </div>
      )}

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className={`text-sm ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}>{card.label}</p>
            <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-foreground'}`}>{eur(card.balance)}</p>
          </div>
          <div className={`h-6 w-8 rounded ${isDark ? 'bg-white/20' : 'bg-muted'}`} />
        </div>

        <div className="mb-4 flex justify-between text-sm">
          <div>
            <p className={`text-xs uppercase ${isDark ? 'text-white/50' : 'text-muted-foreground'}`}>Card Holder</p>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-foreground'}`}>{card.holder}</p>
          </div>
          <div>
            <p className={`text-xs uppercase ${isDark ? 'text-white/50' : 'text-muted-foreground'}`}>Valid Thru</p>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-foreground'}`}>{card.validThru}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className={`font-mono tracking-wider ${isDark ? 'text-white' : 'text-foreground'}`}>{card.maskedNumber}</p>
          <span className={`text-xs font-semibold uppercase ${isDark ? 'text-white/60' : 'text-muted-foreground'}`}>{card.network}</span>
        </div>
      </div>
    </div>
  );
}

function CardExpenseChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current?.destroy();
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Signature ****8901', 'Business ****4127'],
            datasets: [{ data: [68, 32], backgroundColor: ['#14563f', '#9bc24a'], borderWidth: 0, hoverOffset: 4 }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '55%',
            plugins: {
              legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', padding: 15 } },
              tooltip: { callbacks: { label: (item) => ` ${item.label}: ${item.parsed}%` } },
            },
          },
        });
      }
    }
    return () => chartInstance.current?.destroy();
  }, []);

  return <div className="h-56"><canvas ref={chartRef} /></div>;
}

function CardList() {
  const { t } = useLanguage();
  return (
    <div className="space-y-3">
      {cards.map((card) => (
        <div key={card.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CreditCard className="h-5 w-5" />
          </div>
          <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <p className="text-sm text-muted-foreground">{t('cardType')}</p>
              <p className="font-medium text-foreground">{card.label}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('network')}</p>
              <p className="font-medium text-foreground">{card.network}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('cardNumber')}</p>
              <p className="font-medium text-foreground">**** {card.maskedNumber.slice(-4)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('holder')}</p>
              <p className="font-medium text-foreground">{card.holder}</p>
            </div>
          </div>
          <Button variant="ghost" className="text-primary" onClick={() => toast.info(`${card.label} — ${eur(card.balance)}`)}>
            {t('viewDetails')}
          </Button>
        </div>
      ))}
    </div>
  );
}

function AddNewCard() {
  const { t } = useLanguage();

  const handleAddCard = () => {
    toast.success(t('cardAdded'));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t('addCardDescription')}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('cardType')}</Label>
          <Select defaultValue="signature">
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="signature">Xabi Signature</SelectItem>
              <SelectItem value="business">Xabi Business</SelectItem>
              <SelectItem value="platinum">Xabi Platinum</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('nameOnCard')}</Label>
          <Input defaultValue="D. Vermeulen" />
        </div>

        <div className="space-y-2">
          <Label>{t('cardNumber')}</Label>
          <Input placeholder="**** **** **** ****" inputMode="numeric" />
        </div>

        <div className="space-y-2">
          <Label>{t('expirationDate')}</Label>
          <Input type="month" />
        </div>
      </div>

      <Button onClick={handleAddCard} className="gradient-primary">
        {t('addCard')}
      </Button>
    </div>
  );
}

function CardSettings() {
  const { t } = useLanguage();
  const settings = [
    { icon: Lock, title: t('blockCard'), description: t('blockCardDescription') },
    { icon: Key, title: t('changePin'), description: t('changePinDescription') },
    { icon: Wallet, title: t('addToGooglePay'), description: t('walletDescription') },
    { icon: Smartphone, title: t('addToApplePay'), description: t('walletDescription') },
    { icon: Snowflake, title: t('freezeCard'), description: t('freezeDescription') },
  ];

  return (
    <div className="space-y-3">
      {settings.map((setting) => {
        const Icon = setting.icon;
        return (
          <button
            key={setting.title}
            onClick={() => toast.success(`${setting.title} ${t('cardActionReady')}`)}
            className="flex w-full items-center gap-4 rounded-xl border border-border p-4 text-left transition-colors hover:bg-muted/50"
            type="button"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{setting.title}</p>
              <p className="text-sm text-muted-foreground">{setting.description}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        );
      })}
    </div>
  );
}

export function CreditCards() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <p className="dashboard-overline">{t('yourWorld')}</p>
        <h2 className="dashboard-section-title">{t('creditCards')}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CreditCardDisplay card={cards[0]} variant="primary" />
        <CreditCardDisplay card={cards[1]} variant="outline" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('cardExpenseSplit')}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardExpenseChart />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('cardList')}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardList />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('addNewCard')}</CardTitle>
          </CardHeader>
          <CardContent>
            <AddNewCard />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('cardSettings')}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardSettings />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
