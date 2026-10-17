import { useRef, useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import Chart from 'chart.js/auto';
import { useLanguage } from '@/lib/use-language';
import { useFinancial, type ExtendedBankCard } from '@/lib/financial-store';
import { eur } from '@/lib/data';
import { BankCardVisual } from '@/components/BankCardVisual';

type TimeRange = '1W' | '1M' | '6M' | '1J' | 'MAX';

function InteractiveCreditCard({ card }: { card: ExtendedBankCard }) {
  return <BankCardVisual card={card} isInteractive={true} />;
}

function DynamicBalanceHistoryChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [range, setRange] = useState<TimeRange>('6M');
  const { totalBalance, portfolioTotal } = useFinancial();

  const currentTotal = totalBalance + portfolioTotal;

  const chartData = useMemo(() => {
    switch (range) {
      case '1W':
        return {
          labels: ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'],
          values: [
            currentTotal * 0.985,
            currentTotal * 0.989,
            currentTotal * 0.992,
            currentTotal * 0.99,
            currentTotal * 0.996,
            currentTotal * 0.998,
            currentTotal,
          ],
        };
      case '1M':
        return {
          labels: ['W1', 'W2', 'W3', 'W4'],
          values: [currentTotal * 0.95, currentTotal * 0.965, currentTotal * 0.98, currentTotal],
        };
      case '1J':
        return {
          labels: ['Nov', 'Jan', 'Mrt', 'Mei', 'Jul', 'Sep', 'Okt'],
          values: [
            currentTotal * 0.78,
            currentTotal * 0.82,
            currentTotal * 0.86,
            currentTotal * 0.89,
            currentTotal * 0.93,
            currentTotal * 0.97,
            currentTotal,
          ],
        };
      case 'MAX':
        return {
          labels: ['2022', '2023', '2024', '2025', '2026'],
          values: [currentTotal * 0.52, currentTotal * 0.65, currentTotal * 0.76, currentTotal * 0.88, currentTotal],
        };
      case '6M':
      default:
        return {
          labels: ['Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt'],
          values: [
            currentTotal * 0.88,
            currentTotal * 0.9,
            currentTotal * 0.93,
            currentTotal * 0.95,
            currentTotal * 0.975,
            currentTotal,
          ],
        };
    }
  }, [range, currentTotal]);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current?.destroy();
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(46, 173, 75, 0.28)');
        gradient.addColorStop(1, 'rgba(46, 173, 75, 0.0)');

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartData.labels,
            datasets: [
              {
                label: 'Totale Waarde',
                data: chartData.values,
                borderColor: '#2ead4b',
                borderWidth: 2.5,
                backgroundColor: gradient,
                fill: true,
                tension: 0.42,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#2ead4b',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#0b1714',
                titleColor: '#ffffff',
                bodyColor: '#9fe870',
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                  label: (item) => ` Totale Waarde: ${eur(item.parsed.y ?? 0)}`,
                },
              },
            },
            scales: {
              y: {
                ticks: {
                  callback: (v) => `€${(Number(v) / 1000).toLocaleString('nl-NL')}k`,
                  font: { size: 10 },
                },
                grid: { color: 'rgba(0,0,0,0.05)' },
              },
              x: {
                grid: { display: false },
                ticks: { font: { size: 10 } },
              },
            },
          },
        });
      }
    }
    return () => chartInstance.current?.destroy();
  }, [chartData]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Koersverloop Vermogen</p>
          <p className="text-xl font-bold text-foreground mt-0.5">{eur(currentTotal)}</p>
        </div>
        {/* Timeframe switchers */}
        <div className="flex items-center gap-1 rounded-xl bg-muted/70 p-1 border border-border/60">
          {(['1W', '1M', '6M', '1J', 'MAX'] as TimeRange[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setRange(tab)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                range === tab
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="h-52">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}

function LiveQuickTransfer() {
  const { contacts } = useMemo(() => ({
    contacts: [
      { name: 'Sanne Verbruggen', role: 'Partner / VVC', iban: 'NL44 INGB 0123 4567 89' },
      { name: 'Mark Jansen', role: 'Zakelijk / Leverancier', iban: 'NL88 ABNA 9876 5432 10' },
      { name: 'Lotte Bakker', role: 'Familie', iban: 'NL12 RABO 4455 6677 88' },
      { name: 'Quantum B.V.', role: 'Holding Participatie', iban: 'NL91 XABI 0001 0000 01' },
    ],
  }), []);

  const [selectedContact, setSelectedContact] = useState(0);
  const [amount, setAmount] = useState('150.00');
  const [note, setNote] = useState('');
  const { accounts, transferMoney, privacyMode } = useFinancial();
  const [sourceAccountId, setSourceAccountId] = useState(accounts[0]?.id || '');

  const handleSend = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      toast.error('Voer een geldig overboekingsbedrag in.');
      return;
    }

    const contact = contacts[selectedContact];
    const success = transferMoney(contact.name, val, sourceAccountId, note || undefined);
    if (success) {
      toast.success(`€ ${val.toFixed(2)} succesvol overgemaakt naar ${contact.name}!`);
      setNote('');
    }
  };

  const setPreset = (preset: number) => {
    setAmount(preset.toFixed(2));
  };

  return (
    <div className="space-y-5">
      {/* Contact chips */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Selecteer Begunstigde
        </p>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {contacts.map((c, index) => {
            const isSelected = selectedContact === index;
            const initials = c.name
              .split(' ')
              .map((p) => p[0])
              .join('')
              .slice(0, 2);
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedContact(index)}
                className={`group flex min-w-[90px] flex-col items-center gap-1.5 rounded-2xl p-2.5 transition-all text-center ${
                  isSelected
                    ? 'bg-primary/10 ring-2 ring-primary shadow-sm'
                    : 'hover:bg-muted/60'
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-xs transition-all ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                  }`}
                >
                  {initials}
                </div>
                <p className="text-xs font-semibold text-foreground truncate w-full">{c.name.split(' ')[0]}</p>
                <p className="text-[10px] text-muted-foreground truncate w-full">{c.role.split('/')[0]}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Account & Amount Form */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Afschrijven van</label>
            <select
              value={sourceAccountId || accounts[0]?.id}
              onChange={(e) => setSourceAccountId(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-medium text-foreground focus:ring-1 focus:ring-primary shadow-sm"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({privacyMode ? '••••' : eur(acc.balance)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Omschrijving (optioneel)</label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Bijv. Declaratie of lunch"
              className="h-9 text-xs rounded-xl"
            />
          </div>
        </div>

        {/* Quick Amount presets */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs text-muted-foreground font-medium">Snelkeuze:</span>
          {[25, 50, 100, 250, 500].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setPreset(preset)}
              className="rounded-lg border border-border/80 bg-muted/60 px-2 py-1 text-[11px] font-semibold text-foreground hover:bg-primary hover:text-white transition-colors"
            >
              +€{preset}
            </button>
          ))}
        </div>

        {/* Transfer Button Input bar */}
        <div className="relative mt-2">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">€</div>
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            step="0.01"
            className="pl-8 pr-28 h-12 text-base font-bold rounded-xl border-border bg-muted/40 shadow-inner"
          />
          <Button
            onClick={handleSend}
            className="gradient-primary absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-4 rounded-lg text-xs font-semibold shadow hover:opacity-95"
          >
            Overmaken <Send className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function InteractiveSavingsGoalWidget() {
  const { savingsGoal, contributeToGoal, privacyMode } = useFinancial();
  const percentage = Math.min(100, Math.round((savingsGoal.saved / savingsGoal.target) * 100));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            {savingsGoal.category || 'Doel'}
          </span>
          <h4 className="font-bold text-foreground text-base mt-1">{savingsGoal.name}</h4>
          <p className="text-xs text-muted-foreground">
            Streefdatum: {savingsGoal.deadline || '2027'}
          </p>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" fill="none" r="15.9155" stroke="hsl(var(--muted))" strokeWidth="3.2" />
            <circle
              cx="18"
              cy="18"
              fill="none"
              r="15.9155"
              stroke="#2ead4b"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeDasharray={`${percentage} ${100 - percentage}`}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="absolute text-xs font-black text-foreground">{percentage}%</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Gespaard</span>
          <span className={`font-bold text-foreground ${privacyMode ? 'privacy-blur' : ''}`}>
            {eur(savingsGoal.saved)} van {eur(savingsGoal.target)}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-600 to-[#9fe870] h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Quick Inleg Buttons */}
      <div className="pt-2 border-t border-border/60">
        <p className="text-[11px] font-medium text-muted-foreground mb-2">Direct sparen voor dit doel:</p>
        <div className="grid grid-cols-3 gap-2">
          {[50, 100, 250].map((amt) => (
            <Button
              key={amt}
              variant="outline"
              size="sm"
              onClick={() => contributeToGoal(amt)}
              className="h-8 text-xs font-semibold rounded-lg hover:bg-primary/10 hover:border-primary/40"
            >
              +€{amt}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryBreakdownChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const breakdownData = [
    { label: 'Vaste lasten & Wonen', value: 32, color: '#14563f' },
    { label: 'Boodschappen & Leven', value: 24, color: '#2ead4b' },
    { label: 'Beleggingen & Groei', value: 22, color: '#9fe870' },
    { label: 'Vrije Tijd & Reizen', value: 14, color: '#c9a53a' },
    { label: 'Overig & Abonnementen', value: 8, color: '#3d8063' },
  ];

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current?.destroy();
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: breakdownData.map((b) => b.label),
            datasets: [
              {
                data: breakdownData.map((b) => b.value),
                backgroundColor: breakdownData.map((b) => b.color),
                borderWidth: 0,
                hoverOffset: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: 10,
                  boxWidth: 6,
                  font: { size: 10 },
                },
              },
              tooltip: {
                callbacks: { label: (item) => ` ${item.label}: ${item.parsed}%` },
              },
            },
          },
        });
      }
    }
    return () => chartInstance.current?.destroy();
  }, []);

  return (
    <div className="h-60 relative flex items-center justify-center">
      <canvas ref={chartRef} />
    </div>
  );
}

export function Overview() {
  const { t } = useLanguage();
  const {
    cards,
    transactions,
    netWorth,
    aiInsight,
    financialHealth,
    privacyMode,
  } = useFinancial();

  return (
    <div className="space-y-6">
      {/* 1. Header Overview & KPIs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="dashboard-overline text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
            Vermogensoverzicht
          </p>
          <div className="flex items-baseline gap-3 mt-1">
            <h2 className={`text-3xl sm:text-4xl font-black tracking-[-0.05em] text-foreground ${privacyMode ? 'privacy-blur' : ''}`}>
              {eur(netWorth)}
            </h2>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
              +8,4% deze maand
            </div>
          </div>
        </div>

        {/* Financial Health Score Pill */}
        <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-3 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
            {financialHealth.score}
          </div>
          <div className="text-xs">
            <p className="font-semibold text-foreground">Gezondheidsscore: {financialHealth.label}</p>
            <p className="text-muted-foreground">{financialHealth.savingsRate}% spaarquote · {financialHealth.runwayMonths} mnd buffer</p>
          </div>
        </div>
      </div>

      {/* 2. AI Financial Copilot Insight Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/10 via-emerald-900/5 to-transparent p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-[#9fe870] text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {aiInsight.tag}
                </span>
                <span className="text-xs font-bold text-foreground">· {aiInsight.title}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl leading-relaxed">
                {aiInsight.message}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => toast.info('AI Analyse geladen in financieel rapport.')}
            className="gradient-primary text-xs shrink-0 rounded-xl px-4"
          >
            {aiInsight.actionLabel || 'Bekijk analyse'} <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* 3. Cards & Live Transactions Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Actieve Betaalkaarten
            </h3>
            <span className="text-xs text-muted-foreground">Gegevens standaard verborgen · Klik op 👁️ om te onthullen</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {cards.slice(0, 2).map((c) => (
              <InteractiveCreditCard key={c.id} card={c} />
            ))}
          </div>
        </div>

        {/* Recent Transactions Widget */}
        <Card className="card-shadow">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold">{t('recentTransactions')}</CardTitle>
            <Badge variant="outline" className="text-[10px] font-normal">Live feed</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactions.slice(0, 4).map((tx) => {
              const isPositive = tx.amount > 0;
              return (
                <div key={tx.id} className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/60">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isPositive ? 'bg-emerald-500/15 text-emerald-600' : 'bg-muted text-muted-foreground'
                  }`}>
                    {isPositive ? <ArrowDownLeft className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate">{tx.description}</p>
                    <p className="text-[10px] text-muted-foreground">{tx.date}</p>
                  </div>
                  <p className={`text-xs font-bold shrink-0 ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'} ${privacyMode ? 'privacy-blur' : ''}`}>
                    {eur(tx.amount, { signed: true })}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* 4. Dynamic Balance Curve & Expense Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="card-shadow lg:col-span-2">
          <CardContent className="p-6">
            <DynamicBalanceHistoryChart />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">{t('expenseStatistics')}</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBreakdownChart />
          </CardContent>
        </Card>
      </div>

      {/* 5. Live Quick Transfer & Savings Goal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="card-shadow lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">{t('quickTransfer')}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Direct overmaken met realtime saldobijwerking</p>
            </div>
            <Zap className="h-4 w-4 text-emerald-600 animate-pulse" />
          </CardHeader>
          <CardContent>
            <LiveQuickTransfer />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">{t('savingsGoal')}</CardTitle>
          </CardHeader>
          <CardContent>
            <InteractiveSavingsGoalWidget />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
