import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, PieChart, RefreshCw, TrendingUp, type LucideIcon } from 'lucide-react';
import Chart from 'chart.js/auto';
import { useLanguage } from '@/lib/use-language';
import { eur, holdings, pct, portfolioTotal } from '@/lib/data';

function InvestmentStat({ icon: Icon, label, value, subtext }: { icon: LucideIcon; label: string; value: string; subtext?: string }) {
  return (
    <Card className="card-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtext && <p className="text-sm text-muted-foreground">{subtext}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const portfolioGrowth = {
  labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
  values: [18400, 26900, 31250, 38900, 46120, 52380],
};

function YearlyInvestmentChart() {
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
            labels: portfolioGrowth.labels,
            datasets: [{
              label: 'Portefeuille',
              data: portfolioGrowth.values,
              borderColor: '#14563f',
              backgroundColor: 'rgba(20, 86, 63, 0.08)',
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: '#14563f',
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

  return <div className="h-64"><canvas ref={chartRef} /></div>;
}

function MonthlyRevenueChart() {
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
            labels: ['mei', 'jun', 'jul', 'aug', 'sep', 'okt'],
            datasets: [{
              label: 'Opbrengst',
              data: [1860, 2140, 1980, 2420, 2310, 2580],
              borderColor: '#9bc24a',
              backgroundColor: 'rgba(155, 194, 74, 0.12)',
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: '#7da534',
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
              y: { ticks: { callback: (v) => `€${Number(v).toLocaleString('nl-NL')}` }, grid: { color: 'rgba(0,0,0,0.05)' } },
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

function MyInvestments() {
  return (
    <div className="space-y-4">
      {holdings.map((inv) => {
        const isPositive = inv.change > 0;
        return (
          <div key={inv.id} className="flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{inv.name}</p>
              <p className="font-mono text-xs text-muted-foreground">{inv.ticker}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">{eur(inv.value)}</p>
              <p className="text-xs text-muted-foreground">Waarde</p>
            </div>
            <div className="w-20 text-right">
              <p className={`font-semibold ${isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {pct(inv.change)}
              </p>
              <p className="text-xs text-muted-foreground">Rendement</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrendingStock() {
  const stocks = [
    { sl: '01.', name: 'ASML', price: 728.4, change: 4.8 },
    { sl: '02.', name: 'Adyen', price: 1620.0, change: -1.2 },
    { sl: '03.', name: 'Shell', price: 32.8, change: 2.3 },
    { sl: '04.', name: 'ING', price: 18.45, change: 1.6 },
    { sl: '05.', name: 'Prosus', price: 41.9, change: -0.8 },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left text-sm text-muted-foreground">
            <th className="pb-3 font-medium">Nr.</th>
            <th className="pb-3 font-medium">Naam</th>
            <th className="pb-3 text-right font-medium">Koers</th>
            <th className="pb-3 text-right font-medium">Mutatie</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => {
            const isPositive = stock.change > 0;
            return (
              <tr key={stock.sl} className="border-b border-border last:border-0">
                <td className="py-4 text-muted-foreground">{stock.sl}</td>
                <td className="py-4 font-medium text-foreground">{stock.name}</td>
                <td className="py-4 text-right font-medium">{eur(stock.price)}</td>
                <td className="py-4 text-right">
                  <span className={isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                    {pct(stock.change)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function Investments() {
  const { t } = useLanguage();
  const avgReturn = holdings.reduce((s, h) => s + h.change, 0) / holdings.length;

  return (
    <div className="space-y-6">
      <div>
        <p className="dashboard-overline">{t('yourWorld')}</p>
        <h2 className="dashboard-section-title">{t('investments')}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InvestmentStat icon={Wallet} label={t('totalInvested')} value={eur(portfolioTotal)} />
        <InvestmentStat icon={PieChart} label={t('numberOfHoldings')} value={String(holdings.length)} subtext={t('diversified')} />
        <InvestmentStat icon={RefreshCw} label={t('avgReturn')} value={pct(avgReturn)} subtext={t('thisYear')} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('portfolioGrowth')}</CardTitle>
          </CardHeader>
          <CardContent>
            <YearlyInvestmentChart />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('monthlyRevenue')}</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyRevenueChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('myHoldings')}</CardTitle>
          </CardHeader>
          <CardContent>
            <MyInvestments />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('watchlist')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendingStock />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
