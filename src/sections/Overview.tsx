import { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, CreditCard, Wallet, ArrowDownLeft, ShoppingBag, Landmark, Target } from 'lucide-react';
import { toast } from 'sonner';
import Chart from 'chart.js/auto';
import { useLanguage } from '@/lib/use-language';
import {
  cards,
  contacts,
  eur,
  recentTransactions,
  weeklyActivity,
  expenseBreakdown,
  balanceHistory,
  savingsGoal,
  pct,
  type BankCard,
} from '@/lib/data';

const BRAND_GREEN = '#14563f';
const BRAND_LIME = '#9bc24a';
const BRAND_BLUE = '#3d8063';
const BRAND_AMBER = '#c9a53a';
const BRAND_RED = '#c0524d';

function CreditCardComponent({ card }: { card: BankCard }) {
  const isDark = card.variant === 'dark';

  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 ${isDark ? 'gradient-card' : 'border border-border bg-card'}`}>
      <div className="absolute right-0 top-0 h-32 w-32 opacity-10">
        <div className="absolute right-4 top-4 h-20 w-20 rounded-full border-4 border-white" />
        <div className="absolute right-8 top-8 h-16 w-16 rounded-full border-4 border-white" />
      </div>

      <div className="relative z-10">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className={`text-sm ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}>{card.label}</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-foreground'}`}>{eur(card.balance)}</p>
          </div>
          <div className={`flex h-8 w-10 items-center justify-center rounded ${isDark ? 'bg-white/20' : 'bg-muted'}`}>
            <div className="flex gap-0.5">
              <div className={`h-4 w-4 rounded-full ${isDark ? 'bg-white/60' : 'bg-muted-foreground/40'}`} />
              <div className={`-ml-2 h-4 w-4 rounded-full ${isDark ? 'bg-white/40' : 'bg-muted-foreground/20'}`} />
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-between">
          <div>
            <p className={`text-xs uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-muted-foreground'}`}>Card Holder</p>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-foreground'}`}>{card.holder}</p>
          </div>
          <div>
            <p className={`text-xs uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-muted-foreground'}`}>Valid Thru</p>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-foreground'}`}>{card.validThru}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className={`font-mono text-lg tracking-wider ${isDark ? 'text-white' : 'text-foreground'}`}>
            {card.maskedNumber}
          </p>
          <span className={`text-xs font-semibold uppercase ${isDark ? 'text-white/60' : 'text-muted-foreground'}`}>{card.network}</span>
        </div>
      </div>
    </div>
  );
}

function WeeklyActivityChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current?.destroy();
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: weeklyActivity.labels,
            datasets: [
              { label: 'Ontvangen', data: weeklyActivity.deposits, backgroundColor: BRAND_GREEN, borderRadius: 6, barPercentage: 0.6 },
              { label: 'Uitgegeven', data: weeklyActivity.withdrawals, backgroundColor: BRAND_AMBER, borderRadius: 6, barPercentage: 0.6 },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', align: 'end', labels: { usePointStyle: true, pointStyle: 'circle', padding: 20 } },
              tooltip: { callbacks: { label: (item) => ` ${item.dataset.label}: ${eur(item.parsed.y ?? 0)}` } },
            },
            scales: {
              y: { beginAtZero: true, ticks: { callback: (v) => `€${Number(v).toLocaleString('nl-NL')}` }, grid: { color: 'rgba(0,0,0,0.05)' } },
              x: { grid: { display: false } },
            },
          },
        });
      }
    }
    return () => chartInstance.current?.destroy();
  }, []);

  return <div className="h-64"><canvas ref={chartRef} /></div>;
}

function ExpenseStatisticsChart() {
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
            labels: expenseBreakdown.map((e) => e.label),
            datasets: [{ data: expenseBreakdown.map((e) => e.value), backgroundColor: [BRAND_GREEN, BRAND_LIME, BRAND_BLUE, BRAND_AMBER, BRAND_RED], borderWidth: 0, hoverOffset: 8 }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '62%',
            plugins: {
              legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', padding: 12, boxWidth: 8 } },
              tooltip: { callbacks: { label: (item) => ` ${item.label}: ${item.parsed}%` } },
            },
          },
        });
      }
    }
    return () => chartInstance.current?.destroy();
  }, []);

  return <div className="h-64"><canvas ref={chartRef} /></div>;
}

function BalanceHistoryChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current?.destroy();
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: balanceHistory.labels,
            datasets: [{
              label: 'Totale balans',
              data: balanceHistory.values,
              borderColor: BRAND_GREEN,
              backgroundColor: 'rgba(20, 86, 63, 0.08)',
              fill: true,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: BRAND_GREEN,
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: (item) => ` ${eur(item.parsed.y ?? 0)}` } },
            },
            scales: {
              y: { ticks: { callback: (v) => `€${(Number(v) / 1000).toLocaleString('nl-NL')}k` }, grid: { color: 'rgba(0,0,0,0.05)' } },
              x: { grid: { display: false } },
            },
          },
        });
      }
    }
    return () => chartInstance.current?.destroy();
  }, []);

  return <div className="h-48"><canvas ref={chartRef} /></div>;
}

function QuickTransfer() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(0);
  const [amount, setAmount] = useState('125.00');

  const handleSend = () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      toast.error(t('invalidAmount'));
      return;
    }
    toast.success(`${t('transferTo')} ${contacts[selected].name} — ${eur(value)}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {contacts.map((contact, index) => (
          <button
            key={contact.name}
            className="group flex min-w-[80px] flex-col items-center gap-2"
            onClick={() => setSelected(index)}
            type="button"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-2 transition-all ${selected === index ? 'ring-primary' : 'ring-transparent group-hover:ring-primary/50'}`}>
              <span className="text-sm font-semibold text-primary">
                {contact.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{contact.name}</p>
              <p className="text-xs text-muted-foreground">{contact.role}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="whitespace-nowrap text-sm text-muted-foreground">{t('amount')}</span>
        <div className="relative flex-1">
          <Input
            className="border-0 bg-muted pr-24"
            inputMode="decimal"
            onChange={(e) => setAmount(e.target.value)}
            type="text"
            value={amount}
          />
          <Button onClick={handleSend} className="gradient-primary absolute right-1 top-1/2 -translate-y-1/2 hover:opacity-90" size="sm">
            {t('send')} <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const txIcons: Record<string, typeof CreditCard> = {
  income: ArrowDownLeft,
  transfer: Wallet,
  service: ShoppingBag,
  shopping: ShoppingBag,
  food: ShoppingBag,
  transport: Landmark,
};

function RecentTransactions() {
  return (
    <div className="space-y-4">
      {recentTransactions.map((tx) => {
        const Icon = txIcons[tx.category] || Wallet;
        const isPositive = tx.amount > 0;
        return (
          <div key={tx.id} className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-muted/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{tx.description}</p>
              <p className="text-sm text-muted-foreground">{tx.date}</p>
            </div>
            <p className={`font-semibold ${isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>
              {eur(tx.amount, { signed: true })}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function SavingsGoal() {
  const percentage = Math.round((savingsGoal.saved / savingsGoal.target) * 100);
  return (
    <div className="flex items-center gap-5">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" fill="none" r="15.9155" stroke="hsl(var(--muted))" strokeWidth="3.4" />
          <circle
            cx="18" cy="18" fill="none" r="15.9155"
            stroke={BRAND_LIME} strokeWidth="3.4" strokeLinecap="round"
            strokeDasharray={`${percentage} ${100 - percentage}`}
          />
        </svg>
        <span className="absolute text-sm font-bold text-foreground">{percentage}%</span>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{savingsGoal.name}</p>
        <p className="text-xl font-bold text-foreground">{eur(savingsGoal.saved)}</p>
        <p className="text-xs text-muted-foreground">van {eur(savingsGoal.target)}</p>
      </div>
    </div>
  );
}

export function Overview() {
  const { t } = useLanguage();
  const checking = cards[0];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="dashboard-overline">{t('yourWorld')}</p>
          <h2 className="dashboard-section-title">{t('overview')}</h2>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-2 sm:flex">
          <Target className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">{t('monthlyChange')}</span>
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{pct(8.4)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">{t('myCards')}</h3>
            <Button variant="ghost" className="text-primary" onClick={() => toast.info(t('viewAllReady'))}>
              {t('seeAll')}
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CreditCardComponent card={checking} />
            <CreditCardComponent card={cards[1]} />
          </div>
        </div>

        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('recentTransactions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('weeklyActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyActivityChart />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('expenseStatistics')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseStatisticsChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="card-shadow lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('quickTransfer')}</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickTransfer />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('savingsGoal')}</CardTitle>
          </CardHeader>
          <CardContent>
            <SavingsGoal />
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t('balanceHistory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <BalanceHistoryChart />
        </CardContent>
      </Card>
    </div>
  );
}
