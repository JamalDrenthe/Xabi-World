import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { useAuth } from './auth-context';
import type { Account, BankCard, Holding, Transaction } from './data';

export interface ExtendedBankCard extends BankCard {
  isFrozen?: boolean;
  spendingLimit?: number;
  pinCode?: string;
  cvv?: string;
}

export interface SavingsGoalData {
  name: string;
  target: number;
  saved: number;
  deadline?: string;
  category?: string;
}

export interface FinancialHealth {
  score: number; // 0 - 100
  label: string;
  savingsRate: number; // percentage
  runwayMonths: number;
  diversification: number; // percentage
}

interface FinancialContextType {
  accounts: Account[];
  totalBalance: number;
  transactions: Transaction[];
  cards: ExtendedBankCard[];
  holdings: Holding[];
  portfolioTotal: number;
  savingsGoal: SavingsGoalData;
  netWorth: number;
  financialHealth: FinancialHealth;
  aiInsight: { title: string; message: string; tag: string; actionLabel?: string };
  privacyMode: boolean;
  togglePrivacyMode: () => void;
  transferMoney: (recipientName: string, amount: number, fromAccountId?: string, note?: string) => boolean;
  addTransaction: (tx: Omit<Transaction, 'id' | 'transactionId' | 'sortDate'>) => void;
  toggleFreezeCard: (cardId: string) => void;
  updateCardLimit: (cardId: string, limit: number) => void;
  contributeToGoal: (amount: number) => void;
  buyHolding: (holdingId: string, shares: number) => void;
  exportTransactionsCsv: () => void;
  resetDemoData: () => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

// Initial datasets per persona
function getDefaultDatasetForEmail(email: string) {
  const clean = email.toLowerCase();

  if (clean === 'info@jamaldrenthe.com') {
    return {
      accounts: [
        { id: 'acc-holding', name: 'Holding Beheerrekening', iban: 'NL91 XABI 0001 0000 01', balance: 92450.0, type: 'business' as const, change: 14.2 },
        { id: 'acc-ventures', name: 'Quantum Initium Participaties', iban: 'NL45 XABI 0002 0000 02', balance: 45000.0, type: 'savings' as const, change: 8.5 },
        { id: 'acc-vault', name: 'Private Vault Betaal', iban: 'NL12 XABI 0003 0000 03', balance: 11070.0, type: 'checking' as const, change: 5.1 },
      ],
      cards: [
        { id: 'c-admin-1', label: 'Xabi Obsidian Metal', network: 'Mastercard World Elite', balance: 9850.0, holder: 'Jamal Drenthe', validThru: '12/30', maskedNumber: '5500 **** **** 0001', variant: 'dark' as const, isFrozen: false, spendingLimit: 25000, pinCode: '4921', cvv: '918' },
        { id: 'c-admin-2', label: 'Quantum Executive Corporate', network: 'Visa Infinite', balance: 4520.0, holder: 'Jamal Drenthe', validThru: '08/29', maskedNumber: '4929 **** **** 8888', variant: 'light' as const, isFrozen: false, spendingLimit: 15000, pinCode: '1840', cvv: '442' },
      ],
      holdings: [
        { id: 'h1', name: 'ASML Holding', ticker: 'AMS:ASML', value: 48200.0, change: 5.8 },
        { id: 'h2', name: 'Adyen N.V.', ticker: 'AMS:ADYEN', value: 24500.0, change: 3.2 },
        { id: 'h3', name: 'Nvidia Corp', ticker: 'NASDAQ:NVDA', value: 32800.0, change: 8.4 },
        { id: 'h4', name: 'Quantum Initium Tech Fund', ticker: 'QIV:VENTURE', value: 42000.0, change: 12.1 },
      ],
      savingsGoal: {
        name: 'Quantum Ventures Seed Fund',
        target: 250000,
        saved: 185000,
        deadline: 'Q4 2027',
        category: 'Investeringen',
      },
      aiInsight: {
        tag: '👑 Beheerders Inzicht',
        title: 'Holding liquiditeit optimaal',
        message: 'Jouw totale vermogen is gegroeid naar € 296.020. De kwartaalreservering voor de participatieportefeuille is ruim voldoende gedekt.',
        actionLabel: 'Bekijk kasstromen',
      },
      financialHealth: {
        score: 98,
        label: 'Uitzonderlijk sterk',
        savingsRate: 46,
        runwayMonths: 28,
        diversification: 94,
      },
      transactions: [
        { id: 'tx-a1', description: 'Quantum Initium B.V. Dividend', transactionId: '#TXN-98401', category: 'income' as const, card: '**** 0001', date: 'Vandaag, 09:15', sortDate: '2026-10-16', amount: 12500.0 },
        { id: 'tx-a2', description: 'AWS Cloud Services EU', transactionId: '#TXN-98399', category: 'service' as const, card: '**** 8888', date: 'Gisteren, 14:20', sortDate: '2026-10-15', amount: -385.4 },
        { id: 'tx-a3', description: 'ASML Holding Dividend Uitkering', transactionId: '#TXN-98375', category: 'income' as const, card: '**** 0001', date: '14 okt 2026', sortDate: '2026-10-14', amount: 840.0 },
        { id: 'tx-a4', description: 'De Brauw Blackstone Notariaat', transactionId: '#TXN-98350', category: 'service' as const, card: '**** 8888', date: '12 okt 2026', sortDate: '2026-10-12', amount: -1450.0 },
        { id: 'tx-a5', description: 'Stripe Uitbetaling Platform Fees', transactionId: '#TXN-98310', category: 'income' as const, card: '**** 0001', date: '10 okt 2026', sortDate: '2026-10-10', amount: 6420.0 },
        { id: 'tx-a6', description: 'The Grand Amsterdam Zakendiner', transactionId: '#TXN-98280', category: 'food' as const, card: '**** 0001', date: '08 okt 2026', sortDate: '2026-10-08', amount: -340.5 },
      ],
    };
  }

  if (clean.includes('sophie') || clean.includes('dijk')) {
    return {
      accounts: [
        { id: 'acc-checking-s', name: 'Hoofd-Betaalrekening', iban: 'NL55 XABI 4589 1234 77', balance: 6830.5, type: 'checking' as const, change: 4.2 },
        { id: 'acc-invest-s', name: 'Duurzaam Beleggersdepot', iban: 'NL78 XABI 1122 3344 55', balance: 58000.0, type: 'savings' as const, change: 16.8 },
        { id: 'acc-buffer-s', name: 'Liquiditeitsreserve & Buffer', iban: 'NL90 XABI 6677 8899 00', balance: 15000.0, type: 'savings' as const, change: 2.0 },
      ],
      cards: [
        { id: 'c-sophie-1', label: 'Xabi Gold Reserve', network: 'Mastercard Platinum', balance: 6830.5, holder: 'Sophie van Dijk', validThru: '05/30', maskedNumber: '5310 **** **** 4490', variant: 'dark' as const, isFrozen: false, spendingLimit: 12500, pinCode: '2981', cvv: '761' },
        { id: 'c-sophie-2', label: 'Xabi Green Impact Card', network: 'Visa Signature', balance: 3200.0, holder: 'Sophie van Dijk', validThru: '11/29', maskedNumber: '4111 **** **** 9032', variant: 'light' as const, isFrozen: false, spendingLimit: 7500, pinCode: '5512', cvv: '319' },
      ],
      holdings: [
        { id: 'h1', name: 'ASML Holding', ticker: 'AMS:ASML', value: 28500.0, change: 5.2 },
        { id: 'h2', name: 'Microsoft Corp', ticker: 'NASDAQ:MSFT', value: 22400.0, change: 3.9 },
        { id: 'h3', name: 'iShares Clean Energy', ticker: 'AMS:INRG', value: 18200.0, change: 7.4 },
        { id: 'h4', name: 'Vanguard All-World ETF', ticker: 'AMS:VWCE', value: 35100.0, change: 4.1 },
        { id: 'h5', name: 'Novo Nordisk A/S', ticker: 'CPH:NOVO', value: 14800.0, change: 6.3 },
      ],
      savingsGoal: {
        name: 'Duurzaam Vastgoed Investering',
        target: 100000,
        saved: 64000,
        deadline: 'Zomer 2027',
        category: 'Vastgoed',
      },
      aiInsight: {
        tag: '💎 Beleggers Inzicht',
        title: 'Portefeuille outperformance (+4,2%)',
        message: 'Jouw aandelen & ETF spreiding verslaat de AEX benchmark deze maand met +4,2%. Dividendherbelegging is ingeschakeld.',
        actionLabel: 'Bekijk dividendkalender',
      },
      financialHealth: {
        score: 95,
        label: 'Zeer gezond',
        savingsRate: 38,
        runwayMonths: 22,
        diversification: 91,
      },
      transactions: [
        { id: 'tx-s1', description: 'Salaris Partner & Beheer', transactionId: '#TXN-87110', category: 'income' as const, card: '**** 4490', date: 'Vandaag, 11:30', sortDate: '2026-10-16', amount: 5600.0 },
        { id: 'tx-s2', description: 'Maandelijkse ETF Aankoop VWCE', transactionId: '#TXN-87095', category: 'transfer' as const, card: '**** 4490', date: '15 okt 2026', sortDate: '2026-10-15', amount: -750.0 },
        { id: 'tx-s3', description: 'Eneco Duurzame Energie', transactionId: '#TXN-87050', category: 'service' as const, card: '**** 9032', date: '13 okt 2026', sortDate: '2026-10-13', amount: -115.4 },
        { id: 'tx-s4', description: 'Marqt Biologische Boodschappen', transactionId: '#TXN-87010', category: 'food' as const, card: '**** 4490', date: '11 okt 2026', sortDate: '2026-10-11', amount: -84.2 },
        { id: 'tx-s5', description: 'De Bijenkorf Utrecht', transactionId: '#TXN-86990', category: 'shopping' as const, card: '**** 4490', date: '09 okt 2026', sortDate: '2026-10-09', amount: -195.0 },
      ],
    };
  }

  if (clean.includes('lucas') || clean.includes('boer')) {
    return {
      accounts: [
        { id: 'acc-biz-l', name: 'Zakelijk Rekening-Courant', iban: 'NL33 XABI 9012 3456 99', balance: 52410.0, type: 'business' as const, change: 18.4 },
        { id: 'acc-vat-l', name: 'Btw- & Belastingreservering', iban: 'NL21 XABI 5566 7788 99', balance: 18900.0, type: 'savings' as const, change: 4.0 },
        { id: 'acc-spar-l', name: 'Bedrijfsspaarrekening Zakelijk', iban: 'NL67 XABI 3344 5566 77', balance: 32000.0, type: 'savings' as const, change: 3.2 },
      ],
      cards: [
        { id: 'c-lucas-1', label: 'Xabi Corporate Platinum', network: 'Mastercard Corporate', balance: 12450.0, holder: 'Lucas de Boer', validThru: '04/29', maskedNumber: '5199 **** **** 7744', variant: 'dark' as const, isFrozen: false, spendingLimit: 20000, pinCode: '6192', cvv: '822' },
        { id: 'c-lucas-2', label: 'Xabi Business Expense & Fuel', network: 'Visa Corporate', balance: 2180.0, holder: 'Lucas de Boer', validThru: '09/28', maskedNumber: '4800 **** **** 3321', variant: 'light' as const, isFrozen: false, spendingLimit: 5000, pinCode: '4019', cvv: '190' },
      ],
      holdings: [
        { id: 'h1', name: 'Dutch Real Estate Fund', ticker: 'AMS:REIT', value: 34000.0, change: 2.8 },
        { id: 'h2', name: 'ASML Holding', ticker: 'AMS:ASML', value: 21000.0, change: 4.8 },
        { id: 'h3', name: 'Tech Sector Growth ETF', ticker: 'AMS:QDVE', value: 28500.0, change: 5.1 },
      ],
      savingsGoal: {
        name: 'Nieuwe Kantoorruimte & Studio',
        target: 80000,
        saved: 54000,
        deadline: 'Voorjaar 2027',
        category: 'Bedrijfsuitbreiding',
      },
      aiInsight: {
        tag: '🏢 Zakelijk Ondernemer',
        title: 'Runway: 16,4 maanden',
        message: 'Uitstekende liquiditeit. Jouw btw-reservering voor Q3 is met € 18.900 volledig afgedekt. Geen liquiditeitsrisico.',
        actionLabel: 'Facturatie inzien',
      },
      financialHealth: {
        score: 93,
        label: 'Kerngezond',
        savingsRate: 32,
        runwayMonths: 16.4,
        diversification: 85,
      },
      transactions: [
        { id: 'tx-l1', description: 'Factuurbetaling Project Quantum Tech', transactionId: '#TXN-74910', category: 'income' as const, card: '**** 7744', date: 'Vandaag, 14:10', sortDate: '2026-10-16', amount: 8900.0 },
        { id: 'tx-l2', description: 'Salarisbetaling Freelancers & Team', transactionId: '#TXN-74880', category: 'transfer' as const, card: '**** 7744', date: '15 okt 2026', sortDate: '2026-10-15', amount: -3200.0 },
        { id: 'tx-l3', description: 'Apple Store Amsterdam (Hardware)', transactionId: '#TXN-74850', category: 'shopping' as const, card: '**** 7744', date: '13 okt 2026', sortDate: '2026-10-13', amount: -2149.0 },
        { id: 'tx-l4', description: 'Shell Tankstation Laadpalen Fastned', transactionId: '#TXN-74820', category: 'transport' as const, card: '**** 3321', date: '11 okt 2026', sortDate: '2026-10-11', amount: -68.4 },
        { id: 'tx-l5', description: 'KPN Zakelijk Glasvezel 1Gbps', transactionId: '#TXN-74800', category: 'service' as const, card: '**** 7744', date: '09 okt 2026', sortDate: '2026-10-09', amount: -89.95 },
      ],
    };
  }

  // Default: Daan Vermeulen (Particulier)
  return {
    accounts: [
      { id: 'checking', name: 'Betaalrekening Dagelijks', iban: 'NL82 XABI 0123 4567 89', balance: 8412.3, type: 'checking' as const, change: 6.4 },
      { id: 'savings', name: 'Spaarrekening Doelen', iban: 'NL44 XABI 9876 5432 10', balance: 24500.0, type: 'savings' as const, change: 2.1 },
      { id: 'business', name: 'Zakelijke rekening ZZP', iban: 'NL61 XABI 4455 6677 88', balance: 6275.4, type: 'business' as const, change: 11.9 },
    ],
    cards: [
      { id: 'c1', label: 'Xabi Signature Metal', network: 'Mastercard', balance: 8412.3, holder: 'Daan Vermeulen', validThru: '09/29', maskedNumber: '5273 **** **** 8901', variant: 'dark' as const, isFrozen: false, spendingLimit: 5000, pinCode: '7134', cvv: '482' },
      { id: 'c2', label: 'Xabi Classic Card', network: 'Visa', balance: 6275.4, holder: 'Daan Vermeulen', validThru: '03/28', maskedNumber: '4726 **** **** 4127', variant: 'light' as const, isFrozen: false, spendingLimit: 3000, pinCode: '9012', cvv: '127' },
    ],
    holdings: [
      { id: 'h1', name: 'ASML Holding', ticker: 'AMS:ASML', value: 18420.0, change: 4.8 },
      { id: 'h2', name: 'Adyen', ticker: 'AMS:ADYEN', value: 12960.0, change: -1.2 },
      { id: 'h3', name: 'Shell plc', ticker: 'AMS:SHELL', value: 9840.0, change: 2.3 },
      { id: 'h4', name: 'ING Groep', ticker: 'AMS:INGA', value: 7215.45, change: 1.6 },
      { id: 'h5', name: 'VWCE All-World ETF', ticker: 'AMS:VWCE', value: 3945.0, change: 3.1 },
    ],
    savingsGoal: {
      name: 'Wereldreis 2027',
      target: 25000,
      saved: 18050,
      deadline: 'Zomer 2027',
      category: 'Reizen',
    },
    aiInsight: {
      tag: '💡 Slim Sparen',
      title: '72% van reisdoel bereikt',
      message: 'Je spaart deze maand 14% meer dan je gemiddelde van vorig kwartaal. Door maandelijks € 350 opzij te zetten is je doel 3 maanden eerder gehaald!',
      actionLabel: 'Bereken snellere datum',
    },
    financialHealth: {
      score: 88,
      label: 'Gezond & Groeiend',
      savingsRate: 26,
      runwayMonths: 11.2,
      diversification: 78,
    },
    transactions: [
      { id: 't1', description: 'Salaris Quantum Initium B.V.', transactionId: '#TXN-90124', category: 'income' as const, card: '**** 8901', date: 'Vandaag, 10:00', sortDate: '2026-10-16', amount: 4850.0 },
      { id: 't2', description: 'Albert Heijn Herengracht', transactionId: '#TXN-90118', category: 'food' as const, card: '**** 8901', date: 'Gisteren, 18:32', sortDate: '2026-10-15', amount: -86.42 },
      { id: 't3', description: 'Overboeking naar Spaarrekening', transactionId: '#TXN-90115', category: 'transfer' as const, card: '**** 8901', date: '14 okt 2026', sortDate: '2026-10-14', amount: -1200.0 },
      { id: 't4', description: 'KPN Thuis Glasvezel', transactionId: '#TXN-90112', category: 'service' as const, card: '**** 8901', date: '13 okt 2026', sortDate: '2026-10-13', amount: -59.99 },
      { id: 't5', description: 'Bol.com Select Bestelling', transactionId: '#TXN-90109', category: 'shopping' as const, card: '**** 4127', date: '12 okt 2026', sortDate: '2026-10-12', amount: -128.5 },
      { id: 't6', description: 'NS Jaarabonnement Altijd Vrij', transactionId: '#TXN-90105', category: 'transport' as const, card: '**** 8901', date: '10 okt 2026', sortDate: '2026-10-10', amount: -245.0 },
      { id: 't7', description: 'Spotify Premium Family', transactionId: '#TXN-90102', category: 'service' as const, card: '**** 4127', date: '08 okt 2026', sortDate: '2026-10-08', amount: -17.99 },
    ],
  };
}

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const userKey = currentUser?.email?.toLowerCase() || 'default-user';

  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(`xabi-finance-${userKey}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return getDefaultDatasetForEmail(userKey);
  });

  const [privacyMode, setPrivacyMode] = useState(() => {
    try {
      return localStorage.getItem('xabi-privacy-mode') === 'true';
    } catch {
      return false;
    }
  });

  // Re-sync when switching personas
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`xabi-finance-${userKey}`);
      if (saved) {
        setState(JSON.parse(saved));
        return;
      }
    } catch {
      // fallback
    }
    setState(getDefaultDatasetForEmail(userKey));
  }, [userKey]);

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(`xabi-finance-${userKey}`, JSON.stringify(state));
    } catch {
      // storage unavailable
    }
  }, [state, userKey]);

  const togglePrivacyMode = () => {
    setPrivacyMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('xabi-privacy-mode', String(next));
      } catch {
        // ignore
      }
      toast.info(next ? '👁️ Privacy-modus geactiveerd (bedragen verborgen)' : '👁️ Privacy-modus uitgeschakeld');
      return next;
    });
  };

  const totalBalance = useMemo(
    () => state.accounts.reduce((sum: number, a: Account) => sum + a.balance, 0),
    [state.accounts]
  );

  const portfolioTotal = useMemo(
    () => state.holdings.reduce((sum: number, h: Holding) => sum + h.value, 0),
    [state.holdings]
  );

  const netWorth = totalBalance + portfolioTotal;

  const transferMoney = (recipientName: string, amount: number, fromAccountId?: string, note?: string): boolean => {
    if (!amount || amount <= 0) {
      toast.error('Ongeldig bedrag opgegeven.');
      return false;
    }

    const sourceAccount = state.accounts.find((a: Account) => a.id === fromAccountId) || state.accounts[0];
    if (sourceAccount.balance < amount) {
      toast.error(`Onvoldoende saldo op ${sourceAccount.name} (€ ${sourceAccount.balance.toFixed(2)} beschikbaar).`);
      return false;
    }

    // Deduct from source account
    const updatedAccounts = state.accounts.map((acc: Account) => {
      if (acc.id === sourceAccount.id) {
        return { ...acc, balance: Math.round((acc.balance - amount) * 100) / 100 };
      }
      return acc;
    });

    // Create new transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      description: `${note ? note + ' — ' : ''}Overboeking naar ${recipientName}`,
      transactionId: `#TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      category: 'transfer',
      card: state.cards[0]?.maskedNumber.slice(-9) || 'Betaal',
      date: 'Zojuist',
      sortDate: new Date().toISOString(),
      amount: -amount,
    };

    setState((prev: any) => ({
      ...prev,
      accounts: updatedAccounts,
      transactions: [newTx, ...prev.transactions],
    }));

    // Trigger joyful celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#2ead4b', '#9fe870', '#ffffff', '#14563f'],
      });
    } catch {
      // ignore
    }

    return true;
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'transactionId' | 'sortDate'>) => {
    const fullTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      transactionId: `#TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      sortDate: new Date().toISOString(),
    };

    setState((prev: any) => ({
      ...prev,
      transactions: [fullTx, ...prev.transactions],
      accounts: prev.accounts.map((acc: Account, i: number) =>
        i === 0 ? { ...acc, balance: Math.round((acc.balance + tx.amount) * 100) / 100 } : acc
      ),
    }));
  };

  const toggleFreezeCard = (cardId: string) => {
    setState((prev: any) => {
      const nextCards = prev.cards.map((c: ExtendedBankCard) => {
        if (c.id === cardId) {
          const nextFrozen = !c.isFrozen;
          toast.info(nextFrozen ? `❄️ Kaart ${c.label} is geblokkeerd.` : `✅ Kaart ${c.label} is weer gedeblokkeerd.`);
          return { ...c, isFrozen: nextFrozen };
        }
        return c;
      });
      return { ...prev, cards: nextCards };
    });
  };

  const updateCardLimit = (cardId: string, limit: number) => {
    setState((prev: any) => {
      const nextCards = prev.cards.map((c: ExtendedBankCard) => {
        if (c.id === cardId) {
          return { ...c, spendingLimit: limit };
        }
        return c;
      });
      return { ...prev, cards: nextCards };
    });
    toast.success(`Nieuwe maandlimiet ingesteld op € ${limit.toLocaleString('nl-NL')}`);
  };

  const contributeToGoal = (amount: number) => {
    if (!amount || amount <= 0) return;
    setState((prev: any) => {
      const nextSaved = prev.savingsGoal.saved + amount;
      const target = prev.savingsGoal.target;
      if (nextSaved >= target && prev.savingsGoal.saved < target) {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#ffd700', '#2ead4b', '#ffffff'],
        });
        toast.success(`🎉 Gefeliciteerd! Je hebt je doel '${prev.savingsGoal.name}' van € ${target.toLocaleString('nl-NL')} behaald!`);
      } else {
        toast.success(`€ ${amount.toLocaleString('nl-NL')} overgeboekt naar ${prev.savingsGoal.name}`);
      }
      return {
        ...prev,
        savingsGoal: { ...prev.savingsGoal, saved: nextSaved },
      };
    });
  };

  const buyHolding = (holdingId: string, additionalAmount: number) => {
    setState((prev: any) => {
      const nextHoldings = prev.holdings.map((h: Holding) => {
        if (h.id === holdingId) {
          return { ...h, value: h.value + additionalAmount };
        }
        return h;
      });
      return { ...prev, holdings: nextHoldings };
    });
    toast.success(`Order uitgevoerd: € ${additionalAmount.toLocaleString('nl-NL')} bijgekocht.`);
  };

  const exportTransactionsCsv = () => {
    const headers = ['TransactieID', 'Datum', 'Omschrijving', 'Categorie', 'Pas', 'Bedrag_EUR'];
    const rows = state.transactions.map((t: Transaction) => [
      t.transactionId,
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.category,
      t.card,
      t.amount.toFixed(2),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r: string[]) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `xabi-world-transacties-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Transactieoverzicht als CSV gedownload.');
  };

  const resetDemoData = () => {
    const def = getDefaultDatasetForEmail(userKey);
    setState(def);
    try {
      localStorage.removeItem(`xabi-finance-${userKey}`);
    } catch {
      // ignore
    }
    toast.success('Financiële data hersteld naar standaardinstellingen.');
  };

  return (
    <FinancialContext.Provider
      value={{
        accounts: state.accounts,
        totalBalance,
        transactions: state.transactions,
        cards: state.cards,
        holdings: state.holdings,
        portfolioTotal,
        savingsGoal: state.savingsGoal,
        netWorth,
        financialHealth: state.financialHealth,
        aiInsight: state.aiInsight,
        privacyMode,
        togglePrivacyMode,
        transferMoney,
        addTransaction,
        toggleFreezeCard,
        updateCardLimit,
        contributeToGoal,
        buyHolding,
        exportTransactionsCsv,
        resetDemoData,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
}
