import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, CreditCard, Wallet, ArrowDownLeft } from 'lucide-react';
import { toast } from 'sonner';
import Chart from 'chart.js/auto';
import { useLanguage } from '@/lib/use-language';

// Credit Card Component
function CreditCardComponent({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const isDark = variant === 'dark';
  
  return (
    <div className={`relative rounded-2xl p-6 overflow-hidden ${isDark ? 'gradient-card' : 'bg-card border border-border'}`}>
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-4 border-white" />
        <div className="absolute top-8 right-8 w-16 h-16 rounded-full border-4 border-white" />
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className={`text-sm ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}>Balance</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-foreground'}`}>$5,756</p>
          </div>
          <div className={`w-10 h-8 rounded flex items-center justify-center ${isDark ? 'bg-white/20' : 'bg-muted'}`}>
            <div className="flex gap-0.5">
              <div className={`w-4 h-4 rounded-full ${isDark ? 'bg-white/60' : 'bg-muted-foreground/40'}`} />
              <div className={`w-4 h-4 rounded-full ${isDark ? 'bg-white/40' : 'bg-muted-foreground/20'} -ml-2`} />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mb-6">
          <div>
            <p className={`text-xs uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-muted-foreground'}`}>Card Holder</p>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-foreground'}`}>Eddy Cusuma</p>
          </div>
          <div>
            <p className={`text-xs uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-muted-foreground'}`}>Valid Thru</p>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-foreground'}`}>12/22</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <p className={`text-lg font-mono tracking-wider ${isDark ? 'text-white' : 'text-foreground'}`}>
            3778 **** **** 1234
          </p>
          <div className="flex -space-x-2">
            <div className={`w-6 h-6 rounded-full ${isDark ? 'bg-white/40' : 'bg-muted-foreground/30'}`} />
            <div className={`w-6 h-6 rounded-full ${isDark ? 'bg-white/60' : 'bg-muted-foreground/50'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Weekly Activity Chart
function WeeklyActivityChart() {
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
          type: 'bar',
          data: {
            labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [
              {
                label: 'Deposit',
                data: [250, 150, 280, 380, 250, 260, 350],
                backgroundColor: '#0A5C4A',
                borderRadius: 6,
                barPercentage: 0.6,
              },
              {
                label: 'Withdraw',
                data: [480, 350, 330, 480, 160, 400, 400],
                backgroundColor: '#F9A826',
                borderRadius: 6,
                barPercentage: 0.6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                align: 'end',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: 20,
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 500,
                ticks: {
                  stepSize: 100,
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

// Expense Statistics Chart
function ExpenseStatisticsChart() {
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
          type: 'doughnut',
          data: {
            labels: ['Entertainment', 'Bill Expense', 'Investment', 'Others'],
            datasets: [
              {
                data: [30, 15, 20, 35],
                backgroundColor: [
                  '#0A5C4A',
                  '#F9A826',
                  '#3B82F6',
                  '#EF4444',
                ],
                borderWidth: 0,
                hoverOffset: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: 15,
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

// Balance History Chart
function BalanceHistoryChart() {
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
            labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
            datasets: [
              {
                label: 'Balance',
                data: [200, 350, 500, 800, 600, 450, 650],
                borderColor: '#0A5C4A',
                backgroundColor: 'rgba(10, 92, 74, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
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
                max: 800,
                ticks: {
                  stepSize: 200,
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
    <div className="h-48">
      <canvas ref={chartRef} />
    </div>
  );
}

// Quick Transfer Component
function QuickTransfer() {
  const contacts = [
    { name: 'Livia Bator', role: 'CEO', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
    { name: 'Randy Press', role: 'Director', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
    { name: 'Workman', role: 'Designer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
  ];

  const handleSend = () => {
    toast.success('Transfer initiated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Contacts */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {contacts.map((contact, index) => (
          <button
            key={index}
            className="flex flex-col items-center gap-2 min-w-[80px] group"
            onClick={() => toast.info(`Selected ${contact.name}`)}
          >
            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary transition-all">
              <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{contact.name}</p>
              <p className="text-xs text-muted-foreground">{contact.role}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Amount Input */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Write Amount</span>
        <div className="flex-1 relative">
          <Input 
            type="number" 
            defaultValue="525.50" 
            className="pr-24 bg-muted border-0"
          />
          <Button 
            onClick={handleSend}
            className="absolute right-1 top-1/2 -translate-y-1/2 gradient-primary hover:opacity-90"
            size="sm"
          >
            Send <Send className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Recent Transactions
function RecentTransactions() {
  const transactions = [
    { icon: CreditCard, label: 'Deposit from my Card', date: '28 January 2021', amount: -850, color: 'bg-orange-100 text-orange-600' },
    { icon: Wallet, label: 'Deposit Paypal', date: '25 January 2021', amount: 2500, color: 'bg-blue-100 text-blue-600' },
    { icon: ArrowDownLeft, label: 'Jemi Wilson', date: '21 January 2021', amount: 5400, color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div className="space-y-4">
      {transactions.map((tx, index) => {
        const Icon = tx.icon;
        const isPositive = tx.amount > 0;
        
        return (
          <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{tx.label}</p>
              <p className="text-sm text-muted-foreground">{tx.date}</p>
            </div>
            <p className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// Main Overview Component
export function Overview() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="dashboard-overline">{t('yourWorld')}</p>
          <h2 className="dashboard-section-title">{t('overview')}</h2>
        </div>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">My Cards</h3>
            <Button variant="ghost" className="text-primary" onClick={() => toast.info(t('viewAllReady'))}>
              {t('seeAll')}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CreditCardComponent variant="dark" />
            <CreditCardComponent variant="light" />
          </div>
        </div>

        {/* Recent Transactions */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Recent Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyActivityChart />
          </CardContent>
        </Card>

        {/* Expense Statistics */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Expense Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseStatisticsChart />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Transfer */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Quick Transfer</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickTransfer />
          </CardContent>
        </Card>

        {/* Balance History */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Balance History</CardTitle>
          </CardHeader>
          <CardContent>
            <BalanceHistoryChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
