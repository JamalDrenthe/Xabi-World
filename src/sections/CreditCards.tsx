import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Lock, Key, Wallet, Apple, Store, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Chart from 'chart.js/auto';

// Credit Card Component
function CreditCardDisplay({ variant = 'primary' }: { variant?: 'primary' | 'secondary' | 'outline' }) {
  const gradients = {
    primary: 'gradient-card',
    secondary: 'bg-gradient-to-br from-blue-500 to-blue-700',
    outline: 'bg-white border-2 border-border',
  };

  const isDark = variant !== 'outline';

  return (
    <div className={`relative rounded-2xl p-5 overflow-hidden ${gradients[variant]}`}>
      {isDark && (
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
          <div className="absolute top-2 right-2 w-16 h-16 rounded-full border-4 border-white" />
        </div>
      )}
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className={`text-sm ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}>Balance</p>
            <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-foreground'}`}>$5,756</p>
          </div>
          <div className={`w-8 h-6 rounded ${isDark ? 'bg-white/20' : 'bg-muted'}`} />
        </div>
        
        <div className="flex justify-between text-sm mb-4">
          <div>
            <p className={`text-xs uppercase ${isDark ? 'text-white/50' : 'text-muted-foreground'}`}>Card Holder</p>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-foreground'}`}>Eddy Cusuma</p>
          </div>
          <div>
            <p className={`text-xs uppercase ${isDark ? 'text-white/50' : 'text-muted-foreground'}`}>Valid Thru</p>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-foreground'}`}>12/22</p>
          </div>
        </div>
        
        <p className={`font-mono tracking-wider ${isDark ? 'text-white' : 'text-foreground'}`}>
          3778 **** **** 1234
        </p>
      </div>
    </div>
  );
}

// Card Expense Chart
function CardExpenseChart() {
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
            labels: ['DBL Bank', 'BRC Bank', 'ABM Bank', 'MCP Bank'],
            datasets: [
              {
                data: [30, 25, 25, 20],
                backgroundColor: [
                  '#3B82F6',
                  '#F472B6',
                  '#10B981',
                  '#F59E0B',
                ],
                borderWidth: 0,
                hoverOffset: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '50%',
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
    <div className="h-48">
      <canvas ref={chartRef} />
    </div>
  );
}

// Card List
function CardList() {
  const cards = [
    { type: 'Secondary', bank: 'DBL Bank', number: '**** **** 5600', name: 'William', color: 'bg-blue-100 text-blue-600' },
    { type: 'Secondary', bank: 'BRC Bank', number: '**** **** 4300', name: 'Michel', color: 'bg-pink-100 text-pink-600' },
    { type: 'Secondary', bank: 'ABM Bank', number: '**** **** 7560', name: 'Edward', color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div className="space-y-3">
      {cards.map((card, index) => (
        <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex-1 grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Card Type</p>
              <p className="font-medium text-foreground">{card.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bank</p>
              <p className="font-medium text-foreground">{card.bank}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Card Number</p>
              <p className="font-medium text-foreground">{card.number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Namain Card</p>
              <p className="font-medium text-foreground">{card.name}</p>
            </div>
          </div>
          <Button variant="ghost" className="text-primary" onClick={() => toast.info('Viewing card details')}>
            View Details
          </Button>
        </div>
      ))}
    </div>
  );
}

// Add New Card Form
function AddNewCard() {
  const handleAddCard = () => {
    toast.success('Card added successfully!');
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Credit Card generally means a plastic card issued by Scheduled Commercial Banks assigned to a Cardholder, 
        with a credit limit, that can be used to purchase goods and services on credit or obtain cash advances.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Card Type</Label>
          <Select defaultValue="classic">
            <SelectTrigger>
              <SelectValue placeholder="Select card type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="platinum">Platinum</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Name On Card</Label>
          <Input placeholder="My Cards" defaultValue="My Cards" />
        </div>
        
        <div className="space-y-2">
          <Label>Card Number</Label>
          <Input placeholder="**** **** **** ****" />
        </div>
        
        <div className="space-y-2">
          <Label>Expiration Date</Label>
          <Input type="date" defaultValue="2025-01-25" />
        </div>
      </div>
      
      <Button onClick={handleAddCard} className="gradient-primary">
        Add Card
      </Button>
    </div>
  );
}

// Card Settings
function CardSettings() {
  const settings = [
    { icon: Lock, title: 'Block Card', description: 'Instantly block your card', color: 'bg-yellow-100 text-yellow-600' },
    { icon: Key, title: 'Change Pin Code', description: 'Choose another pin code', color: 'bg-blue-100 text-blue-600' },
    { icon: Wallet, title: 'Add to Google Pay', description: 'Withdraw without any card', color: 'bg-red-100 text-red-600' },
    { icon: Apple, title: 'Add to Apple Pay', description: 'Withdraw without any card', color: 'bg-gray-100 text-gray-700' },
    { icon: Store, title: 'Add to Apple Store', description: 'Withdraw without any card', color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div className="space-y-3">
      {settings.map((setting, index) => {
        const Icon = setting.icon;
        
        return (
          <button
            key={index}
            onClick={() => toast.info(`${setting.title} - Coming soon`)}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors text-left"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${setting.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{setting.title}</p>
              <p className="text-sm text-muted-foreground">{setting.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        );
      })}
    </div>
  );
}

export function CreditCards() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-foreground">Credit Cards</h2>

      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CreditCardDisplay variant="primary" />
        <CreditCardDisplay variant="secondary" />
        <CreditCardDisplay variant="outline" />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Expense Statistics */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Card Expense Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <CardExpenseChart />
          </CardContent>
        </Card>

        {/* Card List */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Card List</CardTitle>
          </CardHeader>
          <CardContent>
            <CardList />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add New Card */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Add New Card</CardTitle>
          </CardHeader>
          <CardContent>
            <AddNewCard />
          </CardContent>
        </Card>

        {/* Card Setting */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Card Setting</CardTitle>
          </CardHeader>
          <CardContent>
            <CardSettings />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
