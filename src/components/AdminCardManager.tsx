import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CreditCard,
  Edit3,
  Trash2,
  Plus,
  RefreshCw,
  CloudCheck,
  Snowflake,
  User,
  Database,
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useAuth } from '@/lib/auth-context';
import { useFinancial, type ExtendedBankCard } from '@/lib/financial-store';
import {
  fetchAllCardsForAdmin,
  saveCardToFirestore,
  deleteCardFromFirestore,
  seedAllCardsToFirestore,
} from '@/lib/cards/firestore-cards';

export function AdminCardManager() {
  const { currentUser, isAdmin } = useAuth();
  const { updateCard: updateStoreCard } = useFinancial();

  // All accounts known to the system
  const accounts = [
    { email: 'info@xabi.world', name: 'Jamal Drenthe', role: 'Hoofdbeheerder (Admin)', badge: 'Admin' },
    { email: 'daan.vermeulen@xabi.world', name: 'Daan Vermeulen', role: 'Particulier Lid', badge: 'Basis' },
    { email: 'sophie.vandijk@xabi.world', name: 'Sophie van Dijk', role: 'Premium Belegger', badge: 'Premium' },
    { email: 'lucas.deboer@xabi.world', name: 'Lucas de Boer', role: 'Zakelijk Ondernemer', badge: 'Business' },
  ];

  const [selectedEmail, setSelectedEmail] = useState<string>('info@xabi.world');
  const [allCardsMap, setAllCardsMap] = useState<Record<string, ExtendedBankCard[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Edit Card Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ExtendedBankCard | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load all cards from Firestore on mount
  const loadCards = async () => {
    setIsLoading(true);
    try {
      const grouped = await fetchAllCardsForAdmin();
      setAllCardsMap(grouped);
    } catch (e: any) {
      toast.error('Kon kaarten niet ophalen uit Firestore: ' + (e?.message || 'Onbekende fout'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  // Cards for currently selected account
  const currentAccountCards: ExtendedBankCard[] = allCardsMap[selectedEmail.toLowerCase()] || [];

  // Open edit modal for a specific card
  const handleOpenEdit = (card: ExtendedBankCard) => {
    setEditingCard({ ...card });
    setIsEditDialogOpen(true);
  };

  // Save edited card to Firestore
  const handleSaveCard = async () => {
    if (!editingCard) return;

    if (!editingCard.label.trim()) {
      toast.error('Vul een geldige kaartnaam in.');
      return;
    }
    if (!editingCard.holder.trim()) {
      toast.error('Vul een kaarthouder in.');
      return;
    }

    setIsSaving(true);
    try {
      // Ensure masked number is synchronized
      const cleanDigits = (editingCard.fullCardNumber || '').replace(/\s+/g, '');
      const last4 = cleanDigits.slice(-4) || '0000';
      const first4 = cleanDigits.slice(0, 4) || (editingCard.provider === 'wallester' ? '4929' : '5500');
      const updatedCard: ExtendedBankCard = {
        ...editingCard,
        userEmail: selectedEmail.toLowerCase().trim(),
        maskedNumber: `${first4} **** **** ${last4}`,
      };

      const res = await saveCardToFirestore(updatedCard);
      if (!res.success && res.error) {
        toast.warning(`Kaart lokaal bijgewerkt (${res.error}).`);
      } else {
        toast.success(`Kaart "${updatedCard.label}" succesvol opgeslagen in Firestore!`);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#2ead4b', '#9fe870', '#ffffff'],
        });
      }

      // Update local state map
      setAllCardsMap((prev) => {
        const list = prev[selectedEmail.toLowerCase()] || [];
        const idx = list.findIndex((c) => c.id === updatedCard.id);
        const nextList = [...list];
        if (idx >= 0) {
          nextList[idx] = updatedCard;
        } else {
          nextList.push(updatedCard);
        }
        return { ...prev, [selectedEmail.toLowerCase()]: nextList };
      });

      // If active user is the selected account, sync live store
      if (currentUser?.email?.toLowerCase() === selectedEmail.toLowerCase()) {
        updateStoreCard(updatedCard);
      }

      setIsEditDialogOpen(false);
      setEditingCard(null);
    } catch (err: any) {
      toast.error('Fout bij opslaan in Firestore: ' + (err?.message || 'Onbekend'));
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a card
  const handleDeleteCard = async (cardId: string, label: string) => {
    if (!confirm(`Weet je zeker dat je de kaart "${label}" wilt verwijderen uit Firestore?`)) {
      return;
    }

    try {
      await deleteCardFromFirestore(cardId, selectedEmail);
      toast.info(`Kaart "${label}" verwijderd uit Firestore.`);

      setAllCardsMap((prev) => {
        const list = prev[selectedEmail.toLowerCase()] || [];
        return {
          ...prev,
          [selectedEmail.toLowerCase()]: list.filter((c) => c.id !== cardId),
        };
      });
    } catch (e: any) {
      toast.error('Fout bij verwijderen: ' + (e?.message || 'Onbekend'));
    }
  };

  // Toggle freeze on a specific card directly
  const handleQuickToggleFreeze = async (card: ExtendedBankCard) => {
    const nextFrozen = !card.isFrozen;
    const updated: ExtendedBankCard = { ...card, isFrozen: nextFrozen };

    try {
      await saveCardToFirestore(updated);
      toast.info(nextFrozen ? `❄️ Kaart "${card.label}" is geblokkeerd in Firestore.` : `✅ Kaart "${card.label}" is weer actief.`);

      setAllCardsMap((prev) => {
        const list = prev[selectedEmail.toLowerCase()] || [];
        return {
          ...prev,
          [selectedEmail.toLowerCase()]: list.map((c) => (c.id === card.id ? updated : c)),
        };
      });

      if (currentUser?.email?.toLowerCase() === selectedEmail.toLowerCase()) {
        updateStoreCard(updated);
      }
    } catch (e: any) {
      toast.error('Fout bij blokkeren/deblokkeren in Firestore: ' + e?.message);
    }
  };

  // Seed default cards into Firestore
  const handleSeedAllToFirestore = async () => {
    setIsSeeding(true);
    try {
      const res = await seedAllCardsToFirestore();
      if (res.error) {
        toast.warning('Firestore synchronisatie deels mislukt: ' + res.error);
      } else {
        toast.success(`🎉 ${res.count} standaardkaarten succesvol gesynchroniseerd naar Cloud Firestore!`);
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#2ead4b', '#3b82f6', '#ffd700'],
        });
      }
      await loadCards();
    } catch (e: any) {
      toast.error('Fout bij synchroniseren naar Firestore: ' + e?.message);
    } finally {
      setIsSeeding(false);
    }
  };

  // Create a brand new card for the selected account
  const handleCreateNewCardForAccount = async () => {
    const selectedAcc = accounts.find((a) => a.email.toLowerCase() === selectedEmail.toLowerCase());
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const randomMid1 = Math.floor(1000 + Math.random() * 9000).toString();
    const randomMid2 = Math.floor(1000 + Math.random() * 9000).toString();

    const newCard: ExtendedBankCard = {
      id: `c-${Date.now().toString(36)}`,
      label: 'Xabi Obsidian Metal',
      network: 'Mastercard World Elite',
      balance: 5000.0,
      holder: selectedAcc?.name || 'Kaarthouder',
      validThru: '10/30',
      maskedNumber: `5500 **** **** ${randomSuffix}`,
      fullCardNumber: `5500 ${randomMid1} ${randomMid2} ${randomSuffix}`,
      variant: 'dark',
      isFrozen: false,
      spendingLimit: 10000,
      pinCode: Math.floor(1000 + Math.random() * 9000).toString(),
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      provider: 'swan',
      cardType: 'physical',
      userEmail: selectedEmail.toLowerCase(),
      userId: `user-${selectedEmail.split('@')[0]}`,
      controls: {
        contactless: true,
        onlinePayments: true,
        atmWithdrawals: true,
        international: true,
      },
    };

    setEditingCard(newCard);
    setIsEditDialogOpen(true);
  };

  if (!isAdmin) {
    return null;
  }

  const selectedAccObj = accounts.find((a) => a.email.toLowerCase() === selectedEmail.toLowerCase());

  return (
    <div className="rounded-2xl border-2 border-emerald-500/30 bg-card p-6 shadow-xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-500/20">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black tracking-tight text-foreground">
                Admin Kaartbeheer & Cloud Firestore
              </h3>
              <Badge className="bg-emerald-500 text-white text-[10px] font-bold">
                Live Cloud Sync
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
              Beheer alle bankkaarten per account, kaart voor kaart. Wijzigingen worden rechtstreeks opgeslagen in de Cloud Firestore collectie <code className="font-mono text-emerald-600 dark:text-emerald-400">cards</code>.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={loadCards}
            disabled={isLoading}
            className="rounded-xl text-xs font-semibold gap-1.5 h-9"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Verversen
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleSeedAllToFirestore}
            disabled={isSeeding}
            className="rounded-xl text-xs font-semibold gap-1.5 h-9 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
          >
            <CloudCheck className={`h-3.5 w-3.5 ${isSeeding ? 'animate-bounce' : ''}`} />
            Synchroniseer Alle Accounts naar Firestore
          </Button>

          <Button
            size="sm"
            onClick={handleCreateNewCardForAccount}
            className="gradient-primary rounded-xl text-xs font-semibold gap-1.5 h-9 shadow-md"
          >
            <Plus className="h-3.5 w-3.5" />
            Nieuwe Kaart voor {selectedAccObj?.name.split(' ')[0]}
          </Button>
        </div>
      </div>

      {/* Account Selector Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Selecteer Account om Kaarten te Beheren:
          </Label>
          <span className="text-[11px] text-muted-foreground font-mono">
            {currentAccountCards.length} {currentAccountCards.length === 1 ? 'kaart' : 'kaarten'} in Firestore
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {accounts.map((acc) => {
            const isSelected = selectedEmail.toLowerCase() === acc.email.toLowerCase();
            const cardCount = (allCardsMap[acc.email.toLowerCase()] || []).length;

            return (
              <button
                key={acc.email}
                type="button"
                onClick={() => setSelectedEmail(acc.email)}
                className={`flex flex-col p-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-border bg-card/60 hover:bg-muted hover:border-muted-foreground/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground truncate">{acc.name}</span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] font-mono px-1.5 py-0 ${
                      isSelected ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-black' : ''
                    }`}
                  >
                    {acc.badge}
                  </Badge>
                </div>
                <span className="text-[11px] text-muted-foreground truncate font-mono mt-0.5">{acc.email}</span>
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/50 text-[10px] text-muted-foreground">
                  <span>{acc.role}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{cardCount} {cardCount === 1 ? 'pas' : 'passen'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Account Cards List */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-bold text-sm text-foreground">
              Kaarten voor {selectedAccObj?.name} ({selectedEmail}):
            </h4>
          </div>
          <span className="text-xs text-muted-foreground">
            Klik op <strong className="text-foreground">"Bewerken"</strong> om elk veld in Firestore aan te passen
          </span>
        </div>

        {currentAccountCards.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center bg-muted/20">
            <CreditCard className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="font-semibold text-sm text-foreground">Geen kaarten gevonden in Firestore voor dit account</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Je kunt direct een nieuwe kaart aanmaken of op "Synchroniseer Alle Accounts naar Firestore" klikken.
            </p>
            <Button
              size="sm"
              onClick={handleCreateNewCardForAccount}
              className="mt-4 text-xs font-semibold gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Eerste Kaart Toevoegen
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentAccountCards.map((card) => (
              <div
                key={card.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Top Info */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-foreground tracking-tight">
                          {card.label}
                        </span>
                        {card.isFrozen ? (
                          <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px]">
                            ❄️ Geblokkeerd
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                            Actief
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {card.network} · {card.provider === 'swan' ? 'Mastercard' : 'Visa'} ({card.cardType === 'physical' ? 'Fysiek Titanium' : 'Virtueel'})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Saldo
                      </span>
                      <span className="font-mono text-base font-black text-foreground">
                        € {Number(card.balance || 0).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Card Meta Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 p-3 rounded-xl bg-muted/40 border border-border/60 text-[11px] font-mono">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Nummer</span>
                      <span className="font-bold text-foreground">{card.maskedNumber}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Vervaldatum</span>
                      <span className="font-bold text-foreground">{card.validThru}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">CVC / PIN</span>
                      <span className="font-bold text-foreground">{card.cvv || '***'} · {card.pinCode || '****'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Limiet</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">€ {Number(card.spendingLimit || 0).toLocaleString('nl-NL')}</span>
                    </div>
                  </div>

                  {/* Controls Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[10px]">
                    <span className={`px-2 py-0.5 rounded-md border ${card.controls?.contactless ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'}`}>
                      NFC {card.controls?.contactless ? '✓' : '✗'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md border ${card.controls?.onlinePayments ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'}`}>
                      Online {card.controls?.onlinePayments ? '✓' : '✗'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md border ${card.controls?.atmWithdrawals ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'}`}>
                      ATM {card.controls?.atmWithdrawals ? '✓' : '✗'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md border ${card.controls?.international ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'}`}>
                      Buitenland {card.controls?.international ? '✓' : '✗'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickToggleFreeze(card)}
                    className="text-xs h-8 rounded-lg gap-1.5"
                  >
                    <Snowflake className="h-3.5 w-3.5 text-blue-500" />
                    {card.isFrozen ? 'Deblokkeren' : 'Blokkeren'}
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCard(card.id, card.label)}
                      className="text-xs h-8 rounded-lg text-destructive hover:bg-destructive/10 border-destructive/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleOpenEdit(card)}
                      className="text-xs h-8 rounded-lg gap-1.5 gradient-primary"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Kaart Bewerken in Firestore
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT CARD DIALOG (Kaart voor kaart bewerken in Firestore) */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Kaart Bewerken in Cloud Firestore
            </DialogTitle>
            <DialogDescription>
              Pas de kaartgegevens aan voor account <strong className="text-foreground">{selectedEmail}</strong>. Wijzigingen worden direct in Firestore opgeslagen.
            </DialogDescription>
          </DialogHeader>

          {editingCard && (
            <div className="space-y-4 py-2">
              {/* Row 1: Label & Holder */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Kaartnaam / Label</Label>
                  <Input
                    value={editingCard.label}
                    onChange={(e) => setEditingCard({ ...editingCard, label: e.target.value })}
                    placeholder="bijv. Xabi Obsidian Metal"
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Kaarthouder</Label>
                  <Input
                    value={editingCard.holder}
                    onChange={(e) => setEditingCard({ ...editingCard, holder: e.target.value })}
                    placeholder="Volledige naam"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Row 2: Full Card Number & Masked */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">16-Cijferig Kaartnummer (PAN)</Label>
                  <span className="text-[10px] text-muted-foreground font-mono">Wordt veilig versleuteld</span>
                </div>
                <Input
                  value={editingCard.fullCardNumber || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, fullCardNumber: e.target.value })}
                  placeholder="5500 0000 0000 0000"
                  className="font-mono text-xs h-9 tracking-wider"
                />
              </div>

              {/* Row 3: Expiry, CVV, PIN */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Vervaldatum</Label>
                  <Input
                    value={editingCard.validThru}
                    onChange={(e) => setEditingCard({ ...editingCard, validThru: e.target.value })}
                    placeholder="MM/YY (bijv. 12/30)"
                    className="font-mono text-xs h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">CVC / CVV</Label>
                  <Input
                    value={editingCard.cvv || ''}
                    onChange={(e) => setEditingCard({ ...editingCard, cvv: e.target.value })}
                    placeholder="3 cijfers"
                    maxLength={4}
                    className="font-mono text-xs h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Pincode</Label>
                  <Input
                    value={editingCard.pinCode || ''}
                    onChange={(e) => setEditingCard({ ...editingCard, pinCode: e.target.value })}
                    placeholder="4 cijfers"
                    maxLength={6}
                    className="font-mono text-xs h-9"
                  />
                </div>
              </div>

              {/* Row 4: Network, Provider, Form Factor */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Kaartnetwerk</Label>
                  <select
                    value={editingCard.network}
                    onChange={(e) => setEditingCard({ ...editingCard, network: e.target.value })}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                  >
                    <option value="Mastercard World Elite">Mastercard World Elite</option>
                    <option value="Mastercard Platinum">Mastercard Platinum</option>
                    <option value="Visa Infinite">Visa Infinite</option>
                    <option value="Visa Signature">Visa Signature</option>
                    <option value="Visa Corporate">Visa Corporate</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">BaaS Provider</Label>
                  <select
                    value={editingCard.provider || 'swan'}
                    onChange={(e) => setEditingCard({ ...editingCard, provider: e.target.value as any })}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                  >
                    <option value="swan">Swan (Mastercard)</option>
                    <option value="wallester">Wallester (Visa)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Vormfactor & Kleur</Label>
                  <select
                    value={`${editingCard.cardType}-${editingCard.variant}`}
                    onChange={(e) => {
                      const [cardType, variant] = e.target.value.split('-') as [any, any];
                      setEditingCard({ ...editingCard, cardType, variant });
                    }}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                  >
                    <option value="physical-dark">Fysiek Titanium (Donker)</option>
                    <option value="physical-light">Fysiek Titanium (Licht)</option>
                    <option value="virtual-dark">Virtueel (Donker)</option>
                    <option value="virtual-light">Virtueel (Licht)</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Limits & Balance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/30 border border-border">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Maandlimiet (€)</Label>
                    <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                      € {Number(editingCard.spendingLimit || 0).toLocaleString('nl-NL')}
                    </span>
                  </div>
                  <Input
                    type="number"
                    step="500"
                    value={editingCard.spendingLimit || 5000}
                    onChange={(e) => setEditingCard({ ...editingCard, spendingLimit: Number(e.target.value) })}
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Kaart Saldo (€)</Label>
                    <span className="font-mono font-bold text-xs text-foreground">
                      € {Number(editingCard.balance || 0).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <Input
                    type="number"
                    step="100"
                    value={editingCard.balance || 0}
                    onChange={(e) => setEditingCard({ ...editingCard, balance: Number(e.target.value) })}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Row 6: Freeze Switch & BaaS Security Controls */}
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card">
                  <div>
                    <span className="text-xs font-bold text-foreground block">Kaartstatus: {editingCard.isFrozen ? '❄️ Geblokkeerd' : '✅ Actief'}</span>
                    <span className="text-[11px] text-muted-foreground">Blokkeer direct alle transacties voor deze kaart</span>
                  </div>
                  <Switch
                    checked={editingCard.isFrozen || false}
                    onCheckedChange={(val) => setEditingCard({ ...editingCard, isFrozen: val })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/50">
                    <span>Contactloos (NFC)</span>
                    <Switch
                      checked={editingCard.controls?.contactless ?? true}
                      onCheckedChange={(val) =>
                        setEditingCard({
                          ...editingCard,
                          controls: { ...(editingCard.controls || { contactless: true, onlinePayments: true, atmWithdrawals: true, international: true }), contactless: val },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/50">
                    <span>Online betalingen (3DS2)</span>
                    <Switch
                      checked={editingCard.controls?.onlinePayments ?? true}
                      onCheckedChange={(val) =>
                        setEditingCard({
                          ...editingCard,
                          controls: { ...(editingCard.controls || { contactless: true, onlinePayments: true, atmWithdrawals: true, international: true }), onlinePayments: val },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/50">
                    <span>Geldautomaat (ATM)</span>
                    <Switch
                      checked={editingCard.controls?.atmWithdrawals ?? true}
                      onCheckedChange={(val) =>
                        setEditingCard({
                          ...editingCard,
                          controls: { ...(editingCard.controls || { contactless: true, onlinePayments: true, atmWithdrawals: true, international: true }), atmWithdrawals: val },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/50">
                    <span>Buitenland</span>
                    <Switch
                      checked={editingCard.controls?.international ?? true}
                      onCheckedChange={(val) =>
                        setEditingCard({
                          ...editingCard,
                          controls: { ...(editingCard.controls || { contactless: true, onlinePayments: true, atmWithdrawals: true, international: true }), international: val },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSaving}
              className="text-xs h-9"
            >
              Annuleren
            </Button>
            <Button
              type="button"
              onClick={handleSaveCard}
              disabled={isSaving}
              className="text-xs h-9 gradient-primary font-bold gap-1.5"
            >
              <Database className="h-3.5 w-3.5" />
              {isSaving ? 'Opslaan in Firestore...' : 'Opslaan in Firestore'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
