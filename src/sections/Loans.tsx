import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Briefcase, Home, CreditCard, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/use-language';
import { eur, loans, loanTotals } from '@/lib/data';

const loanIcons: Record<string, LucideIcon> = {
  l1: User,
  l2: Briefcase,
  l3: Home,
  l4: CreditCard,
};

function LoanTypeCard({ icon: Icon, label, amount }: { icon: LucideIcon; label: string; amount: string }) {
  return (
    <Card className="card-shadow hover:card-shadow-hover transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-xl font-bold text-foreground">{amount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActiveLoansTable() {
  const { t } = useLanguage();

  const handleRepay = (amount: number, name: string) => {
    toast.success(`${t('repaymentInitiated')} ${name} — ${eur(amount)}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px]">
        <thead>
          <tr className="border-b border-border text-left text-sm text-muted-foreground">
            <th className="pb-4 font-medium">Nr.</th>
            <th className="pb-4 font-medium">{t('loanName')}</th>
            <th className="pb-4 font-medium">{t('principal')}</th>
            <th className="pb-4 font-medium">{t('leftToRepay')}</th>
            <th className="pb-4 font-medium">{t('duration')}</th>
            <th className="pb-4 font-medium">{t('interestRate')}</th>
            <th className="pb-4 font-medium">{t('installment')}</th>
            <th className="pb-4 text-right font-medium">{t('repay')}</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan, index) => (
            <tr key={loan.id} className="border-b border-border last:border-0">
              <td className="py-4 text-muted-foreground">{String(index + 1).padStart(2, '0')}.</td>
              <td className="py-4 font-medium text-foreground">{loan.name}</td>
              <td className="py-4 text-muted-foreground">{eur(loan.principal)}</td>
              <td className="py-4 font-medium text-foreground">{eur(loan.remaining)}</td>
              <td className="py-4 text-muted-foreground">{loan.duration}</td>
              <td className="py-4 text-muted-foreground">{loan.rate}</td>
              <td className="py-4 text-muted-foreground">{eur(loan.installment)}/mnd</td>
              <td className="py-4 text-right">
                <Button variant="outline" size="sm" onClick={() => handleRepay(loan.installment, loan.name)}>
                  {t('repay')}
                </Button>
              </td>
            </tr>
          ))}
          <tr className="bg-muted/50 font-semibold">
            <td className="py-4 text-primary">{t('total')}</td>
            <td className="py-4" />
            <td className="py-4 text-primary">{eur(loanTotals.principal)}</td>
            <td className="py-4 text-primary">{eur(loanTotals.remaining)}</td>
            <td className="py-4" />
            <td className="py-4" />
            <td className="py-4 text-primary">{eur(loanTotals.installment)}/mnd</td>
            <td className="py-4" />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function Loans() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <p className="dashboard-overline">{t('yourWorld')}</p>
        <h2 className="dashboard-section-title">{t('loans')}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loans.map((loan) => {
          const Icon = loanIcons[loan.id] || User;
          return <LoanTypeCard key={loan.id} icon={Icon} label={loan.name} amount={eur(loan.remaining)} />;
        })}
      </div>

      <Card className="card-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t('activeLoans')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ActiveLoansTable />
        </CardContent>
      </Card>
    </div>
  );
}
