import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  EyeOff,
  Snowflake,
  Sliders,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/use-language';
import { useFinancial, type ExtendedBankCard } from '@/lib/financial-store';
import { eur } from '@/lib/data';

function InteractiveCardHero({
  card,
  isSelected,
  onSelect,
}: {
  card: ExtendedBankCard;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isDark = card.variant === 'dark';
  const { privacyMode } = useFinancial();

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full text-left relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
        isDark
          ? 'gradient-card text-white shadow-xl shadow-emerald-950/20'
          : 'border-2 border-border bg-card text-card-foreground shadow-lg'
      } ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:-translate-y-1'}`}
    >
      {/* Background Holographic Glow */}
      <div className="absolute right-0 top-0 h-36 w-36 opacity-15 pointer-events-none">
        <div className="absolute right-4 top-4 h-24 w-24 rounded-full border-4 border-white animate-pulse" />
      </div>

      {card.isFrozen && (
        <div className="absolute top-3 right-3 z-20">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/40 text-[10px]">
            ❄️ Geblokkeerd
          </Badge>
        </div>
      )}

      <div className="relative z-10 flex flex-col justify-between h-44">
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-white/60' : 'text-muted-foreground'}`}>
              {card.label}
            </p>
            <p className={`text-2xl font-black mt-1 ${isDark ? 'text-white' : 'text-foreground'} ${privacyMode ? 'privacy-blur' : ''}`}>
              {eur(card.balance)}
            </p>
          </div>

          <div className="h-7 w-9 rounded-md bg-gradient-to-tr from-amber-300/80 to-amber-100/90 shadow-inner flex flex-col justify-around p-1 border border-amber-400/50">
            <div className="h-0.5 bg-amber-600/40 w-full" />
            <div className="h-0.5 bg-amber-600/40 w-full" />
          </div>
        </div>

        <div className="flex justify-between items-end text-xs">
          <div>
            <p className={`uppercase tracking-wider text-[10px] ${isDark ? 'text-white/50' : 'text-muted-foreground'}`}>Kaarthouder</p>
            <p className={`font-semibold tracking-wide text-sm mt-0.5 ${isDark ? 'text-white' : 'text-foreground'}`}>
              {card.holder}
            </p>
          </div>
          <div>
            <p className={`uppercase tracking-wider text-[10px] ${isDark ? 'text-white/50' : 'text-muted-foreground'}`}>Vervalt</p>
            <p className={`font-semibold tracking-wide text-sm mt-0.5 ${isDark ? 'text-white' : 'text-foreground'}`}>
              {card.validThru}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className={`font-mono text-sm tracking-widest ${isDark ? 'text-white/90' : 'text-foreground'} ${privacyMode ? 'privacy-blur' : ''}`}>
            {card.maskedNumber}
          </span>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}>
            {card.network}
          </span>
        </div>
      </div>
    </button>
  );
}

function CardControls({ card }: { card: ExtendedBankCard }) {
  const { toggleFreezeCard, updateCardLimit } = useFinancial();
  const [showPin, setShowPin] = useState(false);
  const [limit, setLimit] = useState(card.spendingLimit || 5000);
  const [contactless, setContactless] = useState(true);
  const [onlinePayments, setOnlinePayments] = useState(true);

  useEffect(() => {
    setLimit(card.spendingLimit || 5000);
    setShowPin(false);
  }, [card.id, card.spendingLimit]);

  const handleLimitCommit = () => {
    updateCardLimit(card.id, limit);
  };

  const togglePinReveal = () => {
    if (!showPin) {
      toast.success('Pincode en beveiligingscode geverifieerd via Xabi Secure Enclave.');
    }
    setShowPin((v) => !v);
  };

  return (
    <Card className="card-shadow p-6 rounded-2xl space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-lg text-foreground">Kaartbeheer: {card.label}</h4>
          <Badge variant={card.isFrozen ? 'destructive' : 'outline'} className="text-xs">
            {card.isFrozen ? '❄️ Geblokkeerd' : '✅ Actief'}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1 font-mono">{card.maskedNumber}</p>
      </div>

      {/* Sensitive details reveal */}
      <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-muted/60 border border-border">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
            Pincode (ATM/Winkel)
          </span>
          <p className="font-mono text-lg font-bold text-foreground mt-0.5">
            {showPin ? card.pinCode || '4921' : '••••'}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
            CVC / Beveiligingscode
          </span>
          <p className="font-mono text-lg font-bold text-foreground mt-0.5">
            {showPin ? card.cvv || '883' : '•••'}
          </p>
        </div>

        <div className="col-span-2 pt-2 border-t border-border">
          <Button
            size="sm"
            variant="outline"
            onClick={togglePinReveal}
            className="w-full text-xs font-semibold rounded-lg h-8"
          >
            {showPin ? <EyeOff className="mr-1.5 h-3.5 w-3.5" /> : <Eye className="mr-1.5 h-3.5 w-3.5" />}
            {showPin ? 'Verberg geheime gegevens' : 'Toon Pincode & CVC'}
          </Button>
        </div>
      </div>

      {/* Freeze Card Action */}
      <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            card.isFrozen ? 'bg-blue-500/20 text-blue-500' : 'bg-muted text-muted-foreground'
          }`}>
            <Snowflake className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-xs text-foreground">Kaart Tijdelijk Blokkeren</p>
            <p className="text-[11px] text-muted-foreground">Blokkeer direct alle betalingen en pintransacties</p>
          </div>
        </div>
        <Switch
          checked={Boolean(card.isFrozen)}
          onCheckedChange={() => toggleFreezeCard(card.id)}
        />
      </div>

      {/* Spending Limit Slider */}
      <div className="space-y-2 p-3.5 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-primary" />
            Maandelijkse Uitgavenlimiet
          </span>
          <span className="font-bold text-primary text-sm font-mono">
            € {limit.toLocaleString('nl-NL')}
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="25000"
          step="500"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          onMouseUp={handleLimitCommit}
          onTouchEnd={handleLimitCommit}
          className="w-full accent-[#2ead4b] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Min. € 1.000</span>
          <span>Max. € 25.000</span>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">Contactloos betalen (NFC & Apple/Google Pay)</span>
          <Switch checked={contactless} onCheckedChange={setContactless} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">Online betalingen & Internationale transacties</span>
          <Switch checked={onlinePayments} onCheckedChange={setOnlinePayments} />
        </div>
      </div>
    </Card>
  );
}

export function CreditCards() {
  const { t } = useLanguage();
  const { cards } = useFinancial();
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || '');

  const activeCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="dashboard-overline text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
            Veiligheid & Betaalpassen
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-[-0.04em] text-foreground">
            {t('creditCards')}
          </h2>
        </div>

        <Button
          onClick={() => toast.success('Nieuwe Xabi Metal betaalpas aanvraag ingediend.')}
          className="gradient-primary rounded-xl text-xs font-semibold gap-1.5 h-10 px-4"
        >
          <Plus className="h-4 w-4" />
          Nieuwe Pas Aanvragen
        </Button>
      </div>

      {/* Cards List & Control Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Selecteer een pas om te beheren:
          </p>
          <div className="space-y-4">
            {cards.map((c) => (
              <InteractiveCardHero
                key={c.id}
                card={c}
                isSelected={c.id === activeCard.id}
                onSelect={() => setSelectedCardId(c.id)}
              />
            ))}
          </div>
        </div>

        <div>
          {activeCard && <CardControls card={activeCard} />}
        </div>
      </div>
    </div>
  );
}
