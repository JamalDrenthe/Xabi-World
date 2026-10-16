import { useRef, useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import Chart from 'chart.js/auto';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/use-language';
import { useFinancial } from '@/lib/financial-store';
import { eur, pct, type Holding } from '@/lib/data';

function AssetAllocationChart() {
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
            labels: ['Halfgeleiders & Tech', 'Duurzame ETFs', 'Global All-World', 'Vastgoed & Participaties'],
            datasets: [
              {
                data: [42, 28, 20, 10],
                backgroundColor: ['#14563f', '#2ead4b', '#9fe870', '#c9a53a'],
                borderWidth: 0,
                hoverOffset: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: { usePointStyle: true, pointStyle: 'circle', font: { size: 10 }, padding: 12 },
              },
            },
          },
        });
      }
    }
    return () => chartInstance.current?.destroy();
  }, []);

  return <div className="h-60"><canvas ref={chartRef} /></div>;
}

function PortfolioGrowthChart() {
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
            labels: ['2022', '2023', '2024', '2025', '2026 (Heden)'],
            datasets: [
              {
                label: 'Xabi Portefeuille (+64%)',
                data: [32000, 48500, 68000, 94000, 128500],
                borderColor: '#2ead4b',
                backgroundColor: 'rgba(46, 173, 75, 0.12)',
                fill: true,
                tension: 0.38,
                pointRadius: 4,
                pointBackgroundColor: '#2ead4b',
              },
              {
                label: 'AEX Benchmark (+31%)',
                data: [32000, 36000, 41000, 48000, 54000],
                borderColor: '#c9a53a',
                borderDash: [5, 5],
                fill: false,
                tension: 0.38,
                pointRadius: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', align: 'end', labels: { usePointStyle: true, font: { size: 10 } } },
            },
            scales: {
              y: { ticks: { callback: (v) => `€${(Number(v) / 1000).toLocaleString('nl-NL')}k`, font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
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

export function Investments() {
  const { t } = useLanguage();
  const { holdings, portfolioTotal, buyHolding, privacyMode } = useFinancial();
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const [buyAmount, setBuyAmount] = useState('500');

  const totalProfitEstimated = useMemo(
    () => holdings.reduce((s, h) => s + (h.value * (h.change / 100)), 0),
    [holdings]
  );

  const handleExecuteBuy = () => {
    if (!selectedHolding) return;
    const val = parseFloat(buyAmount);
    if (!val || val <= 0) {
      toast.error('Voer een geldig orderbedrag in.');
      return;
    }
    buyHolding(selectedHolding.id, val);
    setSelectedHolding(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="dashboard-overline text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
            Vermogensopbouw & Markten
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.04em] text-foreground">
            {t('investments')}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 font-bold">
            <TrendingUp className="h-3.5 w-3.5 mr-1" />
            +14,8% Jaarrendement
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="gradient-card text-white p-5 rounded-2xl shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Totale Portefeuillewaarde</p>
          <p className={`text-2xl font-black mt-1 ${privacyMode ? 'privacy-blur' : ''}`}>
            {eur(portfolioTotal)}
          </p>
          <p className="text-[11px] text-emerald-300 mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="h-3 w-3" /> Gespreid over {holdings.length} toonaangevende posities
          </p>
        </Card>

        <Card className="border border-border bg-card p-5 rounded-2xl shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ongerealiseerd Resultaat</p>
          <p className={`text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400 ${privacyMode ? 'privacy-blur' : ''}`}>
            +{eur(totalProfitEstimated)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-2">Winst op basis van huidige marktkoersen</p>
        </Card>

        <Card className="bg-muted/60 border border-border p-5 rounded-2xl shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verwacht Dividend (12m)</p>
          <p className={`text-2xl font-black mt-1 text-foreground ${privacyMode ? 'privacy-blur' : ''}`}>
            {eur(portfolioTotal * 0.032)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-2">Gem. dividendrendement ~ 3,2% op jaarbasis</p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="card-shadow lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Historische Portefeuille Groei vs Benchmark</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioGrowthChart />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Vermogensallocatie</CardTitle>
          </CardHeader>
          <CardContent>
            <AssetAllocationChart />
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card className="card-shadow overflow-hidden">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold">Actieve Posities & Koersprestaties</CardTitle>
          <span className="text-xs text-muted-foreground">Realtime beurskoers updates gesimuleerd</span>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Instrument / Fonds</th>
                <th className="py-3 px-4">Ticker</th>
                <th className="py-3 px-4">Totale Waarde</th>
                <th className="py-3 px-4">24u Rendement</th>
                <th className="py-3 px-4 text-right">Actie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {holdings.map((h) => {
                const isPositive = h.change >= 0;
                return (
                  <tr key={h.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground text-sm">{h.name}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">{h.ticker}</td>
                    <td className={`py-3 px-4 font-bold text-sm ${privacyMode ? 'privacy-blur' : ''}`}>
                      {eur(h.value)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                      }`}>
                        {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        {pct(h.change)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedHolding(h)}
                        className="h-8 rounded-lg text-xs font-semibold hover:bg-primary hover:text-white"
                      >
                        Bijkopen <Plus className="ml-1 h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Buy Order Dialog */}
      {selectedHolding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-6 bg-card border-border shadow-2xl rounded-2xl">
            <h3 className="text-lg font-bold text-foreground">Positie Bijkopen: {selectedHolding.name}</h3>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              Symbool: {selectedHolding.ticker} · Huidig bezit: {eur(selectedHolding.value)}
            </p>

            <div className="space-y-4 mt-5">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Inlegbedrag (€)</label>
                <Input
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  type="number"
                  step="50"
                  className="rounded-xl font-bold text-base"
                />
              </div>

              <div className="flex gap-2">
                {[250, 500, 1000, 2500].map((amt) => (
                  <Button
                    key={amt}
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setBuyAmount(String(amt))}
                    className="flex-1 text-xs rounded-lg"
                  >
                    €{amt}
                  </Button>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedHolding(null)}
                  className="rounded-xl text-xs"
                >
                  Annuleren
                </Button>
                <Button onClick={handleExecuteBuy} className="gradient-primary rounded-xl text-xs px-5">
                  Order Bevestigen <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
