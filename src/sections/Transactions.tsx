import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  description: string;
  transactionId: string;
  type: string;
  card: string;
  date: string;
  amount: number;
}

const transactions: Transaction[] = [
  { id: '1', description: 'Spotify Subscription', transactionId: '#12548796', type: 'Shopping', card: '1234 ****', date: '28 Jan, 12.30 AM', amount: -2500 },
  { id: '2', description: 'Freepik Sales', transactionId: '#12548796', type: 'Transfer', card: '1234 ****', date: '25 Jan, 10.40 PM', amount: 750 },
  { id: '3', description: 'Mobile Service', transactionId: '#12548796', type: 'Service', card: '1234 ****', date: '20 Jan, 10.40 PM', amount: -150 },
  { id: '4', description: 'Wilson', transactionId: '#12548796', type: 'Transfer', card: '1234 ****', date: '15 Jan, 03.29 PM', amount: -1050 },
  { id: '5', description: 'Emilly', transactionId: '#12548796', type: 'Transfer', card: '1234 ****', date: '14 Jan, 10.40 PM', amount: 840 },
];

const tabs = ['All Transactions', 'Income', 'Expense'];

export function Transactions() {
  const [activeTab, setActiveTab] = useState('All Transactions');
  const [currentPage, setCurrentPage] = useState(1);

  const handleDownload = (description: string) => {
    toast.success(`Downloading receipt for ${description}`);
  };

  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'Income') return tx.amount > 0;
    if (activeTab === 'Expense') return tx.amount < 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-foreground">Transactions</h2>

      {/* Cards Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-card text-white">
          <CardContent className="p-6">
            <p className="text-white/70 text-sm">Balance</p>
            <p className="text-2xl font-bold">$5,756</p>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-white/60">**** 1234</span>
              <span className="text-white/60">12/22</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border">
          <CardContent className="p-6">
            <p className="text-muted-foreground text-sm">Balance</p>
            <p className="text-2xl font-bold text-foreground">$5,756</p>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-muted-foreground">**** 1234</span>
              <span className="text-muted-foreground">12/22</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-muted">
          <CardContent className="p-6">
            <p className="text-muted-foreground text-sm">My Expense</p>
            <p className="text-2xl font-bold text-foreground">$12,500</p>
            <div className="mt-4 h-8 flex items-end gap-1">
              {[40, 60, 45, 70, 50, 80, 55].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-primary/20 rounded-t"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === tab 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <Card className="card-shadow overflow-hidden">
        <CardHeader className="bg-muted/50">
          <div className="grid grid-cols-7 gap-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-2">Description</div>
            <div>Transaction ID</div>
            <div>Type</div>
            <div>Card</div>
            <div>Date</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Receipt</div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTransactions.map((tx, index) => (
            <div 
              key={tx.id}
              className={`grid grid-cols-7 gap-4 p-4 items-center hover:bg-muted/30 transition-colors ${
                index !== filteredTransactions.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div className="col-span-2 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                }`}>
                  {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <span className="font-medium text-foreground">{tx.description}</span>
              </div>
              <div className="text-muted-foreground">{tx.transactionId}</div>
              <div>
                <Badge variant="secondary" className="font-normal">
                  {tx.type}
                </Badge>
              </div>
              <div className="text-muted-foreground">{tx.card}</div>
              <div className="text-muted-foreground">{tx.date}</div>
              <div className={`text-right font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
              </div>
              <div className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownload(tx.description)}
                >
                  <Download className="w-4 h-4 mr-1" /> Download
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        {[1, 2, 3, 4].map(page => (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentPage(page)}
            className={currentPage === page ? 'gradient-primary' : ''}
          >
            {page}
          </Button>
        ))}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setCurrentPage(p => Math.min(4, p + 1))}
          disabled={currentPage === 4}
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
