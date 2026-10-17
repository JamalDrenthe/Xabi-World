import { useState, useEffect, useRef } from 'react';
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Wifi,
  RotateCw,
  Snowflake,
} from 'lucide-react';
import { toast } from 'sonner';
import type { ExtendedBankCard } from '@/lib/financial-store';
import { useFinancial } from '@/lib/financial-store';
import { eur } from '@/lib/data';

interface BankCardVisualProps {
  card: ExtendedBankCard;
  isInteractive?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
  showProviderBadge?: boolean;
}

export function BankCardVisual({
  card,
  isInteractive = true,
  isSelected = false,
  onSelect,
  className = '',
  showProviderBadge = true,
}: BankCardVisualProps) {
  // Information is HIDDEN by default as requested by user
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<number>(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { privacyMode } = useFinancial();
  const isDark = card.variant === 'dark';
  const provider = card.provider || (card.network?.toLowerCase().includes('mastercard') ? 'swan' : 'wallester');
  const isSwan = provider === 'swan';

  // Format 16 digits
  const unmaskedNumber = card.fullCardNumber || card.maskedNumber.replace(/\*/g, '8');
  const maskedDisplayNumber = card.maskedNumber ? `•••• •••• •••• ${card.maskedNumber.slice(-4)}` : '•••• •••• •••• 0001';

  // Handle Reveal with PCI-DSS 30-second security countdown
  const handleToggleReveal = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (!isRevealed) {
      setIsRevealed(true);
      setCountdown(30);
      toast.success(
        `Kaartgegevens beveiligd onthuld via ${isSwan ? 'Swan BaaS (Mastercard)' : 'Wallester (Visa)'} Secure Enclave.`,
        { description: 'Zichtbaar voor 30 seconden (PCI-DSS compliant).' }
      );

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsRevealed(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setIsRevealed(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleCopyNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanNumber = (isRevealed ? unmaskedNumber : card.maskedNumber).replace(/\s+/g, '');
    navigator.clipboard.writeText(cleanNumber);
    setCopied(true);
    toast.success('Kaartnummer gekopieerd naar klembord!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped((f) => !f);
  };

  return (
    <div className={`relative perspective-1000 select-none ${className}`}>
      {/* 3D Flip Card Container */}
      <div
        onClick={onSelect}
        className={`relative w-full rounded-2xl transition-all duration-500 transform-style-3d ${
          isInteractive ? 'cursor-pointer hover:-translate-y-1' : ''
        } ${isSelected ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-background' : ''}`}
      >
        {/* Card Shell */}
        <div
          className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 shadow-xl ${
            isDark
              ? 'bg-gradient-to-br from-[#121c17] via-[#09110d] to-[#040806] text-white border border-emerald-500/20 shadow-emerald-950/30'
              : 'bg-gradient-to-br from-[#ffffff] via-[#f7faf8] to-[#e8efe9] text-slate-900 border border-slate-300 shadow-slate-300/50'
          } ${card.isFrozen ? 'saturate-50 contrast-90' : ''}`}
          style={{ minHeight: '220px' }}
        >
          {/* Holographic Watermark Glow */}
          <div className="absolute right-0 top-0 h-44 w-44 pointer-events-none opacity-20 overflow-hidden">
            <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full border-[6px] border-emerald-400/40 animate-pulse" />
            <div className="absolute -right-2 -top-2 h-24 w-24 rounded-full border-2 border-emerald-300/30" />
          </div>

          {/* Frozen State Overlay */}
          {card.isFrozen && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/70 backdrop-blur-[3px] rounded-2xl">
              <div className="flex items-center gap-2 rounded-xl bg-blue-500/20 px-4 py-2 border border-blue-400/40 text-blue-200">
                <Snowflake className="h-4 w-4 animate-spin text-blue-300" />
                <span className="text-xs font-bold tracking-wide">
                  BEVROREN VIA {isSwan ? 'SWAN BAAS' : 'WALLESTER'}
                </span>
              </div>
            </div>
          )}

          {!isFlipped ? (
            /* FRONT OF CARD */
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[175px]">
              {/* Header: Label, BaaS Provider Badge, and Eye Toggle */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                      {card.label}
                    </span>
                    {showProviderBadge && (
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase tracking-wider ${
                        isSwan
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                      }`}>
                        {isSwan ? 'Swan BaaS' : 'Wallester API'}
                      </span>
                    )}
                  </div>
                  <p className={`text-2xl font-black tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'} ${privacyMode ? 'privacy-blur' : ''}`}>
                    {eur(card.balance)}
                  </p>
                </div>

                {/* Interactive Action Controls (Eye 👁️ Reveal & Flip) */}
                <div className="flex items-center gap-1.5 z-20">
                  {/* Eye 👁️ Toggle Button */}
                  <button
                    type="button"
                    onClick={handleToggleReveal}
                    aria-label={isRevealed ? 'Verberg kaartgegevens' : 'Toon kaartgegevens'}
                    title={isRevealed ? 'Verberg gevoelige informatie' : 'Toon volledige kaartgegevens (👁️)'}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm ${
                      isRevealed
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30'
                        : isDark
                        ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                        : 'bg-slate-200 text-slate-800 hover:bg-slate-300 border border-slate-300'
                    }`}
                  >
                    {isRevealed ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-mono font-bold">{countdown}s</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        <span className="text-[10px] hidden sm:inline">Toon info</span>
                      </>
                    )}
                  </button>

                  {/* Flip to Back Button */}
                  <button
                    type="button"
                    onClick={handleFlip}
                    title="Draai kaart om (achterkant)"
                    aria-label="Draai kaart om"
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* EMV Chip & Contactless Indicator */}
              <div className="flex items-center gap-3 my-2">
                {/* Metallic EMV Chip */}
                <div className="relative h-8 w-10 rounded-md bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-300 shadow-md border border-amber-400/60 p-1 flex flex-col justify-around overflow-hidden">
                  <div className="h-0.5 bg-amber-700/40 w-full" />
                  <div className="h-0.5 bg-amber-700/40 w-full" />
                  <div className="absolute right-2 top-0 bottom-0 w-0.5 bg-amber-700/30" />
                </div>
                <Wifi className={`h-4 w-4 rotate-90 ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
              </div>

              {/* Card Number & Copy */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-base sm:text-lg font-bold tracking-[0.18em] transition-all duration-300 ${
                      isRevealed
                        ? isDark ? 'text-emerald-300' : 'text-emerald-800'
                        : isDark ? 'text-white/80' : 'text-slate-800'
                    } ${privacyMode ? 'privacy-blur' : ''}`}
                  >
                    {isRevealed ? unmaskedNumber : maskedDisplayNumber}
                  </span>

                  {isRevealed && (
                    <button
                      type="button"
                      onClick={handleCopyNumber}
                      title="Kopieer 16-cijferig kaartnummer"
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Footer: Cardholder, Expiry, CVV and Scheme Network */}
              <div className="flex items-end justify-between pt-2 border-t border-white/10 text-xs">
                <div>
                  <p className={`uppercase tracking-wider text-[9px] ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                    Kaarthouder
                  </p>
                  <p className={`font-semibold tracking-wide text-xs sm:text-sm mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {card.holder}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`uppercase tracking-wider text-[9px] ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                    Vervalt
                  </p>
                  <p className={`font-mono font-semibold text-xs sm:text-sm mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isRevealed ? card.validThru : '••/••'}
                  </p>
                </div>

                {isRevealed && (
                  <div className="text-right">
                    <p className={`uppercase tracking-wider text-[9px] ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      CVC / CVV
                    </p>
                    <p className={`font-mono font-bold text-xs sm:text-sm mt-0.5 ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>
                      {card.cvv || '883'}
                    </p>
                  </div>
                )}

                <div className="text-right">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                    {card.network}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* BACK OF CARD */
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[175px]">
              {/* Back Top: Magnetic Stripe */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                    {isSwan ? 'SWAN BAAS ENCLAVE' : 'WALLESTER EMI VISA'}
                  </span>
                  <button
                    type="button"
                    onClick={handleFlip}
                    className="p-1 rounded text-white/60 hover:text-white"
                  >
                    <RotateCw className="h-3 w-3" />
                  </button>
                </div>
                <div className="-mx-6 h-10 bg-[#0a0d0c] border-y border-white/10" />
              </div>

              {/* Signature Strip & CVC Box */}
              <div className="my-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-8 bg-slate-200 text-slate-800 rounded px-3 flex items-center font-serif italic text-xs tracking-wider select-none">
                    {card.holder}
                  </div>
                  <div className="w-14 h-8 bg-white text-slate-900 rounded flex flex-col items-center justify-center font-mono font-black text-xs border border-slate-300">
                    <span className="text-[8px] text-slate-500 leading-none">CVC</span>
                    <span>{isRevealed ? card.cvv || '918' : '•••'}</span>
                  </div>
                </div>
              </div>

              {/* Legal BaaS Text */}
              <div className="text-[9px] leading-tight text-white/40 font-sans border-t border-white/10 pt-2">
                <p>
                  {isSwan
                    ? 'Uitgegeven door Swan SAS (RCS Nanterre 853 827 103), erkend door ACPR. Mastercard® is een geregistreerd handelsmerk. Noodnummer 24/7: +31 20 890 1200.'
                    : 'Uitgegeven door Wallester AS onder toezicht van de Financiële Inspectie (FSA) onder Visa® licentie. Noodnummer 24/7: +31 20 890 1200.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
