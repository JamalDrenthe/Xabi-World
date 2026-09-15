import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, PieChart, RefreshCw, Apple, Smartphone, Car } from 'lucide-react';
import Chart from 'chart.js/auto';

// Stat Card
function InvestmentStat({ icon: Icon, label, value, subtext, color }: { icon: any, label: string, value: string, subtext: string, color: string }) {
  return (
    <Card className="card-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{subtext}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Yearly Investment Chart
function YearlyInvestmentChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['2016', '2017', '2018', '2019', '2020', '2021'],
            datasets: [
              {
                label: 'Investment',
                data: [10000, 25000, 18000, 38000, 22000, 30000],
                borderColor: '#F9A826',
                backgroundColor: 'rgba(249, 168, 38, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#F9A826',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 40000,
                ticks: {
                  callback: (value) => `$${Number(value).toLocaleString()}`,
                },
                grid: {
                  color: 'rgba(0,0,0,0.05)',
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          },
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="h-64">
      <canvas ref={chartRef} />
    </div>
  );
}

// Monthly Revenue Chart
function MonthlyRevenueChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['2016', '2017', '2018', '2019', '2020', '2021'],
            datasets: [
              {
                label: 'Revenue',
                data: [12000, 20000, 28000, 22000, 32000, 26000],
                borderColor: '#0A5C4A',
                backgroundColor: 'rgba(10, 92, 74, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#0A5C4A',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 35000,
                ticks: {
                  callback: (value) => `$${Number(value).toLocaleString()}`,
                },
                grid: {
                  color: 'rgba(0,0,0,0.05)',
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          },
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="h-64">
      <canvas ref={chartRef} />
    </div>
  );
}

// My Investment List
function MyInvestments() {
  const investments = [
    { icon: Apple, name: 'Apple Store', category: 'E-commerce, Marketplace', value: 54000, return: 16, color: 'bg-gray-100 text-gray-700' },
    { icon: Smartphone, name: 'Samsung Mobile', category: 'E-commerce, Marketplace', value: 25300, return: -4, color: 'bg-blue-100 text-blue-600' },
    { icon: Car, name: 'Tesla Motors', category: 'Electric Vehicles', value: 8200, return: 25, color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="space-y-4">
      {investments.map((inv, index) => {
        const Icon = inv.icon;
        const isPositive = inv.return > 0;
        
        return (
          <div key={index} className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors border border-border">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${inv.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{inv.name}</p>
              <p className="text-sm text-muted-foreground">{inv.category}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">${inv.value.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Investment Value</p>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{inv.return}%
              </p>
              <p className="text-sm text-muted-foreground">Return Value</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Trending Stock Table
function TrendingStock() {
  const stocks = [
    { sl: '01.', name: 'Trivago', price: 520, return: 5 },
    { sl: '02.', name: 'Canon', price: 480, return: 10 },
    { sl: '03.', name: 'Uber Food', price: 350, return: -3 },
    { sl: '04.', name: 'Nokia', price: 940, return: 2 },
    { sl: '05.', name: 'Tiktok', price: 670, return: -12 },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-muted-foreground border-b border-border">
            <th className="pb-3 font-medium">SL No</th>
            <th className="pb-3 font-medium">Name</th>
            <th className="pb-3 font-medium text-right">Price</th>
            <th className="pb-3 font-medium text-right">Return</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => {
            const isPositive = stock.return > 0;
            
            return (
              <tr key={index} className="border-b border-border last:border-0">
                <td className="py-4 text-muted-foreground">{stock.sl}</td>
                <td className="py-4 font-medium text-foreground">{stock.name}</td>
                <td className="py-4 text-right font-medium">${stock.price}</td>
                <td className="py-4 text-right">
                  <span className={`${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{stock.return}%
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
  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-foreground">Investments</h2>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InvestmentStat 
          icon={DollarSign} 
          label="Total Invested Amount" 
          value="$150,000" 
          subtext=""
          color="bg-green-100 text-green-600" 
        />
        <InvestmentStat 
          icon={PieChart} 
          label="Number of Investments" 
          value="1,250" 
          subtext=""
          color="bg-pink-100 text-pink-600" 
        />
        <InvestmentStat 
          icon={RefreshCw} 
          label="Rate of Return" 
          value="+5.80%" 
          subtext=""
          color="bg-blue-100 text-blue-600" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Yearly Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <YearlyInvestmentChart />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyRevenueChart />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">My Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <MyInvestments />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Trending Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendingStock />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
