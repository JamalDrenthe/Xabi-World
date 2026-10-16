import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  ShoppingBag,
  Wallet,
  Landmark,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/use-language';
import { useFinancial } from '@/lib/financial-store';
import { eur } from '@/lib/data';

type FilterType = 'all' | 'income' | 'expense' | 'transfer' | 'food' | 'service';

const PAGE_SIZE = 8;

export function Transactions() {
  const { t } = useLanguage();
  const { transactions, cards, addTransaction, exportTransactionsCsv, privacyMode } = useFinancial();

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding custom transaction
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<'income' | 'shopping' | 'food' | 'service' | 'transfer'>('shopping');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Category filter
      if (filter === 'income' && tx.amount <= 0) return false;
      if (filter === 'expense' && tx.amount >= 0) return false;
      if (filter === 'transfer' && tx.category !== 'transfer') return false;
      if (filter === 'food' && tx.category !== 'food') return false;
      if (filter === 'service' && tx.category !== 'service') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(q);
        const matchesCat = tx.category.toLowerCase().includes(q);
        const matchesCard = tx.card.toLowerCase().includes(q);
        const matchesAmount = tx.amount.toString().includes(q);
        return matchesDesc || matchesCat || matchesCard || matchesAmount;
      }
      return true;
    });
  }, [transactions, filter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageItems = filteredTransactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Totals
  const totalInflow = useMemo(
    () => transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const totalOutflow = useMemo(
    () => transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0),
    [transactions]
  );

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newAmount);
    if (!newDesc.trim() || !val) {
      toast.error('Vul een geldige omschrijving en bedrag in.');
      return;
    }

    const finalAmount = newCategory === 'income' ? Math.abs(val) : -Math.abs(val);

    addTransaction({
      description: newDesc.trim(),
      amount: finalAmount,
      category: newCategory,
      card: cards[0]?.maskedNumber.slice(-9) || 'Betaalpas',
      date: 'Zojuist',
    });

    toast.success(`Transactie '${newDesc}' succesvol toegevoegd.`);
    setNewDesc('');
    setNewAmount('');
    setShowAddModal(false);
  };

  const categoryIcons: Record<string, any> = {
    income: ArrowDownLeft,
    food: ShoppingBag,
    shopping: ShoppingBag,
    service: Wallet,
    transfer: Landmark,
    transport: Landmark,
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="dashboard-overline text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
            Kasstroom & Mutaties
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.04em] text-foreground">
            {t('transactions')}
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={exportTransactionsCsv}
            className="rounded-xl text-xs font-semibold gap-1.5 h-10 border-border/80"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Exporteer CSV
          </Button>

          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="gradient-primary rounded-xl text-xs font-semibold gap-1.5 h-10 px-4"
          >
            <Plus className="h-4 w-4" />
            Nieuwe Boeking
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="gradient-card text-white p-5 rounded-2xl shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Totale Bijschrijvingen</p>
          <p className={`text-2xl font-black mt-1 ${privacyMode ? 'privacy-blur' : ''}`}>
            +{eur(totalInflow)}
          </p>
          <p className="text-[11px] text-white/60 mt-2">Deze periode ontvangen op alle rekeningen</p>
        </Card>

        <Card className="border border-border bg-card p-5 rounded-2xl shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Totale Afschrijvingen</p>
          <p className={`text-2xl font-black mt-1 text-foreground ${privacyMode ? 'privacy-blur' : ''}`}>
            -{eur(totalOutflow)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-2">Vaste lasten, uitgaven en overboekingen</p>
        </Card>

        <Card className="bg-muted/70 border border-border p-5 rounded-2xl shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Netto Resultaat</p>
          <p className={`text-2xl font-black mt-1 ${totalInflow - totalOutflow >= 0 ? 'text-emerald-600' : 'text-red-500'} ${privacyMode ? 'privacy-blur' : ''}`}>
            {eur(totalInflow - totalOutflow, { signed: true })}
          </p>
          <p className="text-[11px] text-muted-foreground mt-2">Netto liquiditeitsoverschot deze maand</p>
        </Card>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/80 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Zoek op handelaar, categorie, pas of bedrag..."
            className="pl-10 h-10 text-xs rounded-xl border-border/70 bg-muted/40"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all' as FilterType, label: 'Alles' },
            { id: 'income' as FilterType, label: 'Inkomsten' },
            { id: 'expense' as FilterType, label: 'Uitgaven' },
            { id: 'transfer' as FilterType, label: 'Overboekingen' },
            { id: 'food' as FilterType, label: 'Boodschappen' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => {
                setFilter(pill.id);
                setCurrentPage(1);
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                filter === pill.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <Card className="card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Omschrijving</th>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Categorie</th>
                <th className="py-3 px-4">Betaalmiddel</th>
                <th className="py-3 px-4">Datum</th>
                <th className="py-3 px-4 text-right">Bedrag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    Geen transacties gevonden die voldoen aan je zoekcriteria.
                  </td>
                </tr>
              ) : (
                pageItems.map((tx) => {
                  const Icon = categoryIcons[tx.category] || Wallet;
                  const isPositive = tx.amount > 0;
                  return (
                    <tr key={tx.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-semibold text-foreground">{tx.description}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">{tx.transactionId}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[10px] capitalize font-medium">
                          {tx.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{tx.card}</td>
                      <td className="py-3 px-4 text-muted-foreground">{tx.date}</td>
                      <td className={`py-3 px-4 text-right font-bold text-sm ${
                        isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'
                      } ${privacyMode ? 'privacy-blur' : ''}`}>
                        {eur(tx.amount, { signed: true })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-card">
          <p className="text-xs text-muted-foreground">
            Getoond <span className="font-semibold text-foreground">{pageItems.length}</span> van{' '}
            <span className="font-semibold text-foreground">{filteredTransactions.length}</span> mutaties
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 p-0 rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-semibold px-2">
              Pagina {page} van {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 w-8 p-0 rounded-lg"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Add Custom Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-6 bg-card border-border shadow-2xl rounded-2xl">
            <h3 className="text-lg font-bold text-foreground">Nieuwe Boeking Toevoegen</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Test een bijschrijving of uitgave direct op jouw actieve rekeningen.
            </p>

            <form onSubmit={handleCreateTransaction} className="space-y-4 mt-5">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Omschrijving</label>
                <Input
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Bijv. Teruggave belastingdienst, Diner"
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Bedrag (€)</label>
                  <Input
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    type="number"
                    step="0.01"
                    placeholder="150.00"
                    required
                    className="rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Type / Categorie</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground focus:ring-1 focus:ring-primary shadow-sm"
                  >
                    <option value="shopping">Winkelen (Uitgave)</option>
                    <option value="food">Eten / Horeca (Uitgave)</option>
                    <option value="service">Dienst / Abonnement</option>
                    <option value="income">Salaris / Dividend (Inkomst)</option>
                    <option value="transfer">Interne Overboeking</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl text-xs"
                >
                  Annuleren
                </Button>
                <Button type="submit" className="gradient-primary rounded-xl text-xs px-5">
                  Boeking Opslaan
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
