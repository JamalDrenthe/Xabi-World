import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Briefcase, TrendingUp, Wrench } from 'lucide-react';
import { toast } from 'sonner';

// Loan Type Card
function LoanTypeCard({ icon: Icon, label, amount, color }: { icon: any, label: string, amount: string, color: string }) {
  return (
    <Card className="card-shadow hover:card-shadow-hover transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">{label}</p>
            <p className="text-xl font-bold text-foreground">{amount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Active Loans Table
function ActiveLoansTable() {
  const loans = [
    { sl: '01.', amount: 100000, left: 40500, duration: '8 Months', rate: '12%', installment: 2000 },
    { sl: '02.', amount: 500000, left: 250000, duration: '36 Months', rate: '10%', installment: 8000 },
    { sl: '03.', amount: 900000, left: 40500, duration: '12 Months', rate: '12%', installment: 5000 },
    { sl: '04.', amount: 50000, left: 40500, duration: '25 Months', rate: '5%', installment: 2000 },
    { sl: '05.', amount: 50000, left: 40500, duration: '5 Months', rate: '16%', installment: 10000 },
    { sl: '06.', amount: 80000, left: 25500, duration: '14 Months', rate: '8%', installment: 2000 },
    { sl: '07.', amount: 12000, left: 5500, duration: '9 Months', rate: '13%', installment: 500 },
    { sl: '08.', amount: 160000, left: 100800, duration: '3 Months', rate: '12%', installment: 900 },
  ];

  const handleRepay = (amount: number) => {
    toast.success(`Repayment of $${amount.toLocaleString()} initiated!`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-muted-foreground border-b border-border">
            <th className="pb-4 font-medium">SL No</th>
            <th className="pb-4 font-medium">Loan Money</th>
            <th className="pb-4 font-medium">Left to repay</th>
            <th className="pb-4 font-medium">Duration</th>
            <th className="pb-4 font-medium">Interest rate</th>
            <th className="pb-4 font-medium">Installment</th>
            <th className="pb-4 font-medium text-right">Repay</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan, index) => (
            <tr key={index} className="border-b border-border last:border-0">
              <td className="py-4 text-muted-foreground">{loan.sl}</td>
              <td className="py-4 font-medium text-foreground">${loan.amount.toLocaleString()}</td>
              <td className="py-4 text-muted-foreground">${loan.left.toLocaleString()}</td>
              <td className="py-4 text-muted-foreground">{loan.duration}</td>
              <td className="py-4 text-muted-foreground">{loan.rate}</td>
              <td className="py-4 text-muted-foreground">${loan.installment.toLocaleString()}/month</td>
              <td className="py-4 text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRepay(loan.installment)}
                >
                  Repay
                </Button>
              </td>
            </tr>
          ))}
          {/* Total Row */}
          <tr className="bg-muted/50 font-semibold">
            <td className="py-4 text-primary">Total</td>
            <td className="py-4 text-primary">$1,250,000</td>
            <td className="py-4 text-primary">$750,000</td>
            <td className="py-4"></td>
            <td className="py-4"></td>
            <td className="py-4 text-primary">$50,000/month</td>
            <td className="py-4"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function Loans() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-foreground">Loans</h2>

      {/* Loan Types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LoanTypeCard 
          icon={User} 
          label="Personal Loans" 
          amount="$50,000" 
          color="bg-blue-100 text-blue-600" 
        />
        <LoanTypeCard 
          icon={Briefcase} 
          label="Corporate Loans" 
          amount="$100,000" 
          color="bg-yellow-100 text-yellow-600" 
        />
        <LoanTypeCard 
          icon={TrendingUp} 
          label="Business Loans" 
          amount="$500,000" 
          color="bg-pink-100 text-pink-600" 
        />
        <LoanTypeCard 
          icon={Wrench} 
          label="Custom Loans" 
          amount="Choose Money" 
          color="bg-green-100 text-green-600" 
        />
      </div>

      {/* Active Loans Table */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Active Loans Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ActiveLoansTable />
        </CardContent>
      </Card>
    </div>
  );
}
