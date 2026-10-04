import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ShoppingBag, ArrowDownLeft, FileText, type LucideIcon } from 'lucide-react';
import Chart from 'chart.js/auto';
import { useLanguage } from '@/lib/use-language';
import { toast } from 'sonner';
import { accounts, cards, eur, pct, transactions, weeklyActivity, totalBalance } from '@/lib/data';

function StatCard({ icon: Icon, label, value, subtext }: { icon: LucideIcon; label: string; value: string; subtext?: string }) {
  return (
    <Card className="card-shadow hover:card-shadow-hover transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtext && <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{subtext}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DebitCreditChart() {
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
              { label: 'Bijgeschreven', data: weeklyActivity.deposits, backgroundColor: '#14563f', borderRadius: 4, barPercentage: 0.7 },
              { label: 'Afgeschreven', data: weeklyActivity.withdrawals, backgroundColor: '#c9a53a', borderRadius: 4, barPercentage: 0.7 },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', align: 'end', labels: { usePointStyle: true, pointStyle: 'circle' } },
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

const categoryIcon: Record<string, LucideIcon> = {
  income: ArrowDownLeft,
  shopping: ShoppingBag,
  service: Wallet,
  food: ShoppingBag,
  transport: Wallet,
  transfer: ArrowDownLeft,
};

function LastTransactions() {
  return (
    <div className="space-y-3">
      {transactions.slice(0, 4).map((tx) => {
        const Icon = categoryIcon[tx.category] || Wallet;
        return (
          <div key={tx.id} className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-muted/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{tx.description}</p>
              <p className="text-sm text-muted-foreground">{tx.date}</p>
            </div>
            <div className="hidden sm:block">
              <Badge variant="outline" className="font-normal">{tx.transactionId}</Badge>
            </div>
            <div className="hidden text-muted-foreground sm:block">{tx.card}</div>
            <div>
              <Badge className="bg-accent text-accent-foreground">Afgerond</Badge>
            </div>
            <p className={`font-semibold ${tx.amount > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>
              {eur(tx.amount, { signed: true })}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function InvoicesSent() {
  const invoices = [
    { name: 'QIV-2026-042 · Quantum Initium', time: '2 uur geleden', amount: 1850.0 },
    { name: 'QIV-2026-041 · Studio Nova', time: '2 dagen geleden', amount: 640.0 },
    { name: 'QIV-2026-039 · Maison Verte', time: '5 dagen geleden', amount: 1085.0 },
    { name: 'QIV-2026-038 · Van den Berg BV', time: '10 dagen geleden', amount: 390.0 },
  ];

  return (
    <div className="space-y-3">
      {invoices.map((inv) => (
        <div key={inv.name} className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-muted/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{inv.name}</p>
            <p className="text-sm text-muted-foreground">{inv.time}</p>
          </div>
          <p className="font-semibold text-foreground">{eur(inv.amount)}</p>
        </div>
      ))}
    </div>
  );
}

function CreditCardSmall() {
  const card = cards[0];
  return (
    <div className="gradient-card relative overflow-hidden rounded-2xl p-5 text-white">
      <div className="absolute right-0 top-0 h-24 w-24 opacity-10">
        <div className="absolute right-2 top-2 h-16 w-16 rounded-full border-4 border-white" />
      </div>

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-sm text-white/70">{card.label}</p>
            <p className="text-xl font-bold">{eur(card.balance)}</p>
          </div>
          <div className="h-6 w-8 rounded bg-white/20" />
        </div>

        <div className="mb-4 flex justify-between text-sm">
          <div>
            <p className="text-xs uppercase text-white/50">Card Holder</p>
            <p className="font-medium">{card.holder}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-white/50">Valid Thru</p>
            <p className="font-medium">{card.validThru}</p>
          </div>
        </div>

        <p className="font-mono tracking-wider">{card.maskedNumber}</p>
      </div>
    </div>
  );
}

function AccountRow() {
  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <div key={account.id} className="flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-muted/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{account.name}</p>
            <p className="font-mono text-xs text-muted-foreground">{account.iban}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-foreground">{eur(account.balance)}</p>
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{pct(account.change)} deze maand</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Accounts() {
  const { t } = useLanguage();
  const monthIncome = transactions.filter((tx) => tx.amount > 0).reduce((s, tx) => s + tx.amount, 0);
  const monthExpense = transactions.filter((tx) => tx.amount < 0).reduce((s, tx) => s + Math.abs(tx.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="dashboard-overline">{t('yourWorld')}</p>
        <h2 className="dashboard-section-title">{t('accounts')}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Wallet} label={t('myBalance')} value={eur(totalBalance)} subtext={`${pct(6.4)} ${t('thisMonth')}`} />
        <StatCard icon={TrendingUp} label={t('income')} value={eur(monthIncome)} subtext={`${t('thisMonth')}`} />
        <StatCard icon={TrendingDown} label={t('expense')} value={eur(monthExpense)} subtext={`${t('thisMonth')}`} />
        <StatCard icon={PiggyBank} label={t('totalSaving')} value={eur(accounts[1].balance)} subtext={`${pct(2.1)} ${t('thisMonth')}`} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="card-shadow lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('yourAccounts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <AccountRow />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">{t('myCard')}</CardTitle>
            <Button variant="ghost" className="text-sm text-primary" onClick={() => toast.info(t('viewAllReady'))}>
              {t('seeAll')}
            </Button>
          </CardHeader>
          <CardContent>
            <CreditCardSmall />
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t('lastTransactions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <LastTransactions />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <CardTitle className="text-lg">{t('debitCredit')}</CardTitle>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">{eur(weeklyActivity.withdrawals.reduce((a, b) => a + b, 0))}</span> uit ·
                <span className="font-semibold text-emerald-700 dark:text-emerald-400"> {eur(weeklyActivity.deposits.reduce((a, b) => a + b, 0))}</span> in
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <DebitCreditChart />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('invoicesSent')}</CardTitle>
          </CardHeader>
          <CardContent>
            <InvoicesSent />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
