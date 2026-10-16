import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Wallet,
  TrendingUp,
  PiggyBank,
  ArrowRightLeft,
  Copy,
  Check,
  Building2,
} from 'lucide-react';
import Chart from 'chart.js/auto';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/use-language';
import { useFinancial } from '@/lib/financial-store';
import { eur, pct, type Account } from '@/lib/data';

function AccountCard({ account }: { account: Account }) {
  const [copied, setCopied] = useState(false);
  const { privacyMode } = useFinancial();

  const handleCopy = () => {
    navigator.clipboard.writeText(account.iban);
    setCopied(true);
    toast.success(`IBAN ${account.iban} gekopieerd!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBusiness = account.type === 'business';
  const isSavings = account.type === 'savings';

  return (
    <Card className="card-shadow hover:card-shadow-hover transition-all duration-300 rounded-2xl border-border/80">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              isBusiness ? 'bg-amber-500/10 text-amber-600' : isSavings ? 'bg-emerald-500/10 text-emerald-600' : 'bg-primary/10 text-primary'
            }`}>
              {isBusiness ? <Building2 className="h-6 w-6" /> : isSavings ? <PiggyBank className="h-6 w-6" /> : <Wallet className="h-6 w-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-foreground text-base">{account.name}</h4>
                <Badge variant="outline" className="text-[10px] font-semibold uppercase">
                  {account.type}
                </Badge>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-muted-foreground font-mono flex items-center gap-1.5 mt-0.5 hover:text-foreground transition-colors"
                title="Klik om IBAN te kopiëren"
              >
                {account.iban}
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 opacity-40" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            {pct(account.change)}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border flex items-baseline justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Beschikbaar Saldo</p>
            <p className={`text-2xl font-black text-foreground mt-0.5 ${privacyMode ? 'privacy-blur' : ''}`}>
              {eur(account.balance)}
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-medium">Valuta: EUR (€)</span>
        </div>
      </CardContent>
    </Card>
  );
}

function InterAccountTransfer() {
  const { accounts, transferMoney, privacyMode } = useFinancial();
  const [fromId, setFromId] = useState(accounts[0]?.id || '');
  const [toId, setToId] = useState(accounts[1]?.id || '');
  const [amount, setAmount] = useState('250.00');

  const handleTransfer = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      toast.error('Voer een geldig bedrag in.');
      return;
    }
    if (fromId === toId) {
      toast.error('Selecteer twee verschillende rekeningen.');
      return;
    }

    const fromAcc = accounts.find((a) => a.id === fromId) || accounts[0];
    const toAcc = accounts.find((a) => a.id === toId) || accounts[1];

    if (fromAcc.balance < val) {
      toast.error(`Onvoldoende saldo op ${fromAcc.name}.`);
      return;
    }

    const ok = transferMoney(toAcc.name, val, fromAcc.id, `Interne overboeking naar ${toAcc.name}`);
    if (ok) {
      toast.success(`€ ${val.toFixed(2)} succesvol overgeboekt van ${fromAcc.name} naar ${toAcc.name}!`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Van rekening</label>
          <select
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
            className="w-full h-11 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground focus:ring-1 focus:ring-primary shadow-sm"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({privacyMode ? '••••' : eur(a.balance)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Naar rekening</label>
          <select
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            className="w-full h-11 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground focus:ring-1 focus:ring-primary shadow-sm"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({privacyMode ? '••••' : eur(a.balance)})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">€</span>
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            step="0.01"
            className="pl-8 h-11 text-base font-bold rounded-xl border-border bg-muted/40"
          />
        </div>
        <Button onClick={handleTransfer} className="gradient-primary h-11 px-5 rounded-xl text-xs font-semibold">
          <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" /> Direct Boeken
        </Button>
      </div>
    </div>
  );
}

function CashflowBreakdownChart() {
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
            labels: ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'],
            datasets: [
              { label: 'Inkomend', data: [1420, 650, 4850, 920, 1100, 340, 200], backgroundColor: '#2ead4b', borderRadius: 5, barPercentage: 0.6 },
              { label: 'Uitgaand', data: [380, 240, 680, 445, 820, 260, 140], backgroundColor: '#c9a53a', borderRadius: 5, barPercentage: 0.6 },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', align: 'end', labels: { usePointStyle: true, pointStyle: 'circle', font: { size: 10 } } },
            },
            scales: {
              y: { beginAtZero: true, ticks: { callback: (v) => `€${Number(v).toLocaleString('nl-NL')}`, font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
              x: { grid: { display: false }, ticks: { font: { size: 10 } } },
            },
          },
        });
      }
    }
    return () => chartInstance.current?.destroy();
  }, []);

  return <div className="h-64"><canvas ref={chartRef} /></div>;
}

export function Accounts() {
  const { t } = useLanguage();
  const { accounts, totalBalance, privacyMode } = useFinancial();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="dashboard-overline text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
            Geld & Liquiditeit
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.04em] text-foreground">
            {t('accounts')}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Totaal Vrij Opneembaar</span>
            <span className={`text-xl font-black text-foreground ${privacyMode ? 'privacy-blur' : ''}`}>
              {eur(totalBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((acc) => (
          <AccountCard key={acc.id} account={acc} />
        ))}
      </div>

      {/* Inter-Account Transfer & Cashflow Analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="card-shadow lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-primary" />
              Intern Geld Overboeken
            </CardTitle>
            <p className="text-xs text-muted-foreground">Verplaats direct saldo tussen jouw eigen rekeningen</p>
          </CardHeader>
          <CardContent>
            <InterAccountTransfer />
          </CardContent>
        </Card>

        <Card className="card-shadow lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Wekelijkse Debit & Credit Dynamiek</CardTitle>
          </CardHeader>
          <CardContent>
            <CashflowBreakdownChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
