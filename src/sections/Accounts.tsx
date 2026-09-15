import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Music, Smartphone, User, Apple, Gamepad2 } from 'lucide-react';
import Chart from 'chart.js/auto';

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  return (
    <Card className="card-shadow hover:card-shadow-hover transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Debit Credit Chart
function DebitCreditChart() {
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
                label: 'Debit',
                data: [450, 320, 280, 520, 380, 420, 480],
                backgroundColor: '#0A5C4A',
                borderRadius: 4,
                barPercentage: 0.7,
              },
              {
                label: 'Credit',
                data: [280, 420, 350, 280, 480, 320, 380],
                backgroundColor: '#F9A826',
                borderRadius: 4,
                barPercentage: 0.7,
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
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
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

// Last Transactions
function LastTransactions() {
  const transactions = [
    { icon: Music, name: 'Spotify Subscription', date: '25 Jan 2021', type: 'Shopping', card: '1234 ****', status: 'Pending', amount: -150, color: 'bg-green-100 text-green-600' },
    { icon: Smartphone, name: 'Mobile Service', date: '25 Jan 2021', type: 'Service', card: '1234 ****', status: 'Completed', amount: -340, color: 'bg-blue-100 text-blue-600' },
    { icon: User, name: 'Emilly Wilson', date: '25 Jan 2021', type: 'Transfer', card: '1234 ****', status: 'Completed', amount: 780, color: 'bg-pink-100 text-pink-600' },
  ];

  return (
    <div className="space-y-3">
      {transactions.map((tx, index) => {
        const Icon = tx.icon;
        const isPositive = tx.amount > 0;
        
        return (
          <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{tx.name}</p>
              <p className="text-sm text-muted-foreground">{tx.date}</p>
            </div>
            <div className="hidden sm:block">
              <Badge variant="outline" className="font-normal">{tx.type}</Badge>
            </div>
            <div className="hidden sm:block text-muted-foreground">{tx.card}</div>
            <div>
              <Badge className={tx.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                {tx.status}
              </Badge>
            </div>
            <p className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}${Math.abs(tx.amount)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// Invoices Sent
function InvoicesSent() {
  const invoices = [
    { icon: Apple, name: 'Apple Store', time: '5h ago', amount: 450, color: 'bg-gray-100 text-gray-700' },
    { icon: User, name: 'Michael', time: '2 days ago', amount: 160, color: 'bg-orange-100 text-orange-600' },
    { icon: Gamepad2, name: 'Playstation', time: '5 days ago', amount: 1085, color: 'bg-blue-100 text-blue-600' },
    { icon: User, name: 'William', time: '10 days ago', amount: 90, color: 'bg-pink-100 text-pink-600' },
  ];

  return (
    <div className="space-y-3">
      {invoices.map((inv, index) => {
        const Icon = inv.icon;
        
        return (
          <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${inv.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{inv.name}</p>
              <p className="text-sm text-muted-foreground">{inv.time}</p>
            </div>
            <p className="font-semibold text-foreground">${inv.amount}</p>
          </div>
        );
      })}
    </div>
  );
}

// Credit Card Component
function CreditCardSmall() {
  return (
    <div className="gradient-card rounded-2xl p-5 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
        <div className="absolute top-2 right-2 w-16 h-16 rounded-full border-4 border-white" />
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-white/70 text-sm">Balance</p>
            <p className="text-xl font-bold">$5,756</p>
          </div>
          <div className="w-8 h-6 rounded bg-white/20" />
        </div>
        
        <div className="flex justify-between text-sm mb-4">
          <div>
            <p className="text-white/50 text-xs uppercase">Card Holder</p>
            <p className="font-medium">Eddy Cusuma</p>
          </div>
          <div>
            <p className="text-white/50 text-xs uppercase">Valid Thru</p>
            <p className="font-medium">12/22</p>
          </div>
        </div>
        
        <p className="font-mono tracking-wider">3778 **** **** 1234</p>
      </div>
    </div>
  );
}

export function Accounts() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-foreground">Accounts</h2>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Wallet} 
          label="My Balance" 
          value="$12,750" 
          color="bg-yellow-100 text-yellow-600" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Income" 
          value="$5,600" 
          color="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          icon={TrendingDown} 
          label="Expense" 
          value="$3,460" 
          color="bg-pink-100 text-pink-600" 
        />
        <StatCard 
          icon={PiggyBank} 
          label="Total Saving" 
          value="$7,920" 
          color="bg-green-100 text-green-600" 
        />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Last Transaction */}
        <Card className="lg:col-span-2 card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Last Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <LastTransactions />
          </CardContent>
        </Card>

        {/* My Card */}
        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">My Card</CardTitle>
            <Button variant="ghost" className="text-primary text-sm">See All</Button>
          </CardHeader>
          <CardContent>
            <CreditCardSmall />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Debit & Credit Overview */}
        <Card className="card-shadow">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <CardTitle className="text-lg">Debit & Credit Overview</CardTitle>
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-semibold">$7,560</span> Debited & 
                <span className="text-secondary font-semibold"> $5,420</span> Credited in this Week
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <DebitCreditChart />
          </CardContent>
        </Card>

        {/* Invoices Sent */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Invoices Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <InvoicesSent />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
