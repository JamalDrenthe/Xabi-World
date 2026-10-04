import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/use-language';
import { cards, eur, transactions, weeklyActivity } from '@/lib/data';

type Filter = 'all' | 'income' | 'expense';

const PAGE_SIZE = 8;

export function Transactions() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<Filter>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const handleDownload = (description: string) => {
    toast.success(`${t('receiptDownloaded')} ${description}`);
  };

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((tx) => {
        if (filter === 'income') return tx.amount > 0;
        if (filter === 'expense') return tx.amount < 0;
        return true;
      }),
    [filter],
  );

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageItems = filteredTransactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const monthExpense = transactions.filter((tx) => tx.amount < 0).reduce((s, tx) => s + Math.abs(tx.amount), 0);
  const filterTabs: { id: Filter; label: string }[] = [
    { id: 'all', label: t('allTransactions') },
    { id: 'income', label: t('income') },
    { id: 'expense', label: t('expense') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="dashboard-overline">{t('yourWorld')}</p>
        <h2 className="dashboard-section-title">{t('transactions')}</h2>
      </div>

      {/* Cards Preview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="gradient-card text-white">
          <CardContent className="p-6">
            <p className="text-sm text-white/70">{cards[0].label}</p>
            <p className="text-2xl font-bold">{eur(cards[0].balance)}</p>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-white/60">**** {cards[0].maskedNumber.slice(-4)}</span>
              <span className="text-white/60">{cards[0].validThru}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">{cards[1].label}</p>
            <p className="text-2xl font-bold text-foreground">{eur(cards[1].balance)}</p>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-muted-foreground">**** {cards[1].maskedNumber.slice(-4)}</span>
              <span className="text-muted-foreground">{cards[1].validThru}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-muted">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">{t('monthExpense')}</p>
            <p className="text-2xl font-bold text-foreground">{eur(monthExpense)}</p>
            <div className="mt-4 flex h-8 items-end gap-1">
              {weeklyActivity.withdrawals.map((value, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-primary/25"
                  style={{ height: `${Math.min(100, (value / Math.max(...weeklyActivity.withdrawals)) * 100)}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 overflow-x-auto border-b border-border">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setFilter(tab.id);
              setCurrentPage(1);
            }}
            className={`relative pb-3 text-sm font-medium transition-colors ${
              filter === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {filter === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <Card className="card-shadow min-w-[920px] overflow-hidden">
          <CardHeader className="bg-muted/50">
            <div className="grid grid-cols-8 gap-4 text-sm font-medium text-muted-foreground">
              <div className="col-span-2">{t('description')}</div>
              <div>{t('transactionId')}</div>
              <div>{t('type')}</div>
              <div>{t('card')}</div>
              <div>{t('date')}</div>
              <div className="text-right">{t('amountLabel')}</div>
              <div className="text-right">{t('receipt')}</div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {pageItems.map((tx, index) => (
              <div
                key={tx.id}
                className={`grid grid-cols-8 items-center gap-4 p-4 transition-colors hover:bg-muted/30 ${
                  index !== pageItems.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      tx.amount > 0 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {tx.amount > 0 ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                  </div>
                  <span className="font-medium text-foreground">{tx.description}</span>
                </div>
                <div className="text-muted-foreground">{tx.transactionId}</div>
                <div>
                  <Badge variant="secondary" className="font-normal">
                    {t(`cat.${tx.category}`)}
                  </Badge>
                </div>
                <div className="text-muted-foreground">{tx.card}</div>
                <div className="text-muted-foreground">{tx.date}</div>
                <div className={`text-right font-semibold ${tx.amount > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>
                  {eur(tx.amount, { signed: true })}
                </div>
                <div className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleDownload(tx.description)}>
                    <Download className="mr-1 h-4 w-4" /> {t('download')}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          <ChevronLeft className="mr-1 h-4 w-4" /> {t('previous')}
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={page === p ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentPage(p)}
            className={page === p ? 'gradient-primary' : ''}
          >
            {p}
          </Button>
        ))}
        <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          {t('next')} <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
