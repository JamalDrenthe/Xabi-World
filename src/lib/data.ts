// Shared mock dataset — one coherent financial picture across the whole dashboard.
// All amounts are in EUR, dates are relative to October 2026.

export const userProfile = {
  firstName: 'Daan',
  lastName: 'Vermeulen',
  fullName: 'Daan Vermeulen',
  initials: 'DV',
  email: 'daan.vermeulen@gmail.com',
  phone: '+31 6 2947 18 35',
  dateOfBirth: '1990-05-14',
  address: 'Herengracht 420',
  city: 'Amsterdam',
  postalCode: '1017 BZ',
  country: 'Nederland',
  iban: 'NL82 XABI 0123 4567 89',
};

export interface Account {
  id: string;
  name: string;
  iban: string;
  balance: number;
  type: 'checking' | 'savings' | 'business';
  change: number; // % this month
}

export const accounts: Account[] = [
  { id: 'checking', name: 'Betaalrekening', iban: 'NL82 XABI 0123 4567 89', balance: 8412.3, type: 'checking', change: 6.4 },
  { id: 'savings', name: 'Spaarrekening', iban: 'NL44 XABI 9876 5432 10', balance: 24500.0, type: 'savings', change: 2.1 },
  { id: 'business', name: 'Zakelijke rekening', iban: 'NL61 XABI 4455 6677 88', balance: 6275.4, type: 'business', change: 11.9 },
];

export const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0); // €39.187,70

export interface Transaction {
  id: string;
  description: string;
  transactionId: string;
  category: 'shopping' | 'transfer' | 'service' | 'income' | 'food' | 'transport';
  card: string;
  date: string; // display label
  sortDate: string;
  amount: number; // positive = income
}

export const transactions: Transaction[] = [
  { id: 't1', description: 'Salaris Quantum Initium B.V.', transactionId: '#TXN-90124', category: 'income', card: '**** 8901', date: '30 sep 2026', sortDate: '2026-09-30', amount: 4850.0 },
  { id: 't2', description: 'Albert Heijn', transactionId: '#TXN-90118', category: 'food', card: '**** 8901', date: '29 sep 2026', sortDate: '2026-09-29', amount: -86.42 },
  { id: 't3', description: 'Rabobank overboeking', transactionId: '#TXN-90115', category: 'transfer', card: '**** 8901', date: '28 sep 2026', sortDate: '2026-09-28', amount: -1200.0 },
  { id: 't4', description: 'KPN Factuur', transactionId: '#TXN-90112', category: 'service', card: '**** 8901', date: '27 sep 2026', sortDate: '2026-09-27', amount: -59.99 },
  { id: 't5', description: 'Bol.com bestelling', transactionId: '#TXN-90109', category: 'shopping', card: '**** 4127', date: '26 sep 2026', sortDate: '2026-09-26', amount: -128.5 },
  { id: 't6', description: 'NS Jaarabonnement', transactionId: '#TXN-90105', category: 'transport', card: '**** 8901', date: '25 sep 2026', sortDate: '2026-09-25', amount: -245.0 },
  { id: 't7', description: 'Spotify Premium', transactionId: '#TXN-90102', category: 'service', card: '**** 4127', date: '24 sep 2026', sortDate: '2026-09-24', amount: -10.99 },
  { id: 't8', description: 'Terugbetaling Belastingdienst', transactionId: '#TXN-90098', category: 'income', card: '**** 8901', date: '23 sep 2026', sortDate: '2026-09-23', amount: 412.75 },
  { id: 't9', description: 'HEMA Rotterdam', transactionId: '#TXN-90095', category: 'shopping', card: '**** 4127', date: '22 sep 2026', sortDate: '2026-09-22', amount: -34.2 },
  { id: 't10', description: 'Interesse spaarrekening', transactionId: '#TXN-90091', category: 'income', card: '**** 8901', date: '21 sep 2026', sortDate: '2026-09-21', amount: 51.02 },
  { id: 't11', description: 'VandeBron energie', transactionId: '#TXN-90088', category: 'service', card: '**** 8901', date: '20 sep 2026', sortDate: '2026-09-20', amount: -118.3 },
  { id: 't12', description: 'Freelance project QIV', transactionId: '#TXN-90084', category: 'income', card: '**** 8901', date: '18 sep 2026', sortDate: '2026-09-18', amount: 2750.0 },
];

export const recentTransactions = transactions.slice(0, 3);

// Weekly activity — deposits/withdrawals in EUR per day
export const weeklyActivity = {
  labels: ['za', 'zo', 'ma', 'di', 'wo', 'do', 'vr'],
  deposits: [220, 140, 4862, 310, 85, 120, 90],
  withdrawals: [380, 240, 295, 445, 160, 360, 128],
};

export const expenseBreakdown = [
  { label: 'Vaste lasten', value: 34 },
  { label: 'Boodschappen', value: 22 },
  { label: 'Vrije tijd', value: 18 },
  { label: 'Transport', value: 15 },
  { label: 'Overig', value: 11 },
];

// Balance history (total balance over the last 7 months)
export const balanceHistory = {
  labels: ['apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt'],
  values: [31240, 32410, 33895, 34120, 36580, 37210, 39188],
};

export interface BankCard {
  id: string;
  label: string;
  network: string;
  balance: number;
  holder: string;
  validThru: string;
  maskedNumber: string;
  variant: 'dark' | 'light';
}

export const cards: BankCard[] = [
  { id: 'c1', label: 'Xabi Signature', network: 'Mastercard', balance: 8412.3, holder: 'D. Vermeulen', validThru: '09/29', maskedNumber: '5273 **** **** 8901', variant: 'dark' },
  { id: 'c2', label: 'Xabi Business', network: 'Visa', balance: 6275.4, holder: 'D. Vermeulen', validThru: '03/28', maskedNumber: '4726 **** **** 4127', variant: 'light' },
];

export interface Holding {
  id: string;
  name: string;
  ticker: string;
  value: number;
  change: number; // %
}

export const holdings: Holding[] = [
  { id: 'h1', name: 'ASML Holding', ticker: 'AMS:ASML', value: 18420.0, change: 4.8 },
  { id: 'h2', name: 'Adyen', ticker: 'AMS:ADYEN', value: 12960.0, change: -1.2 },
  { id: 'h3', name: 'Shell plc', ticker: 'AMS:SHELL', value: 9840.0, change: 2.3 },
  { id: 'h4', name: 'ING Groep', ticker: 'AMS:INGA', value: 7215.45, change: 1.6 },
  { id: 'h5', name: 'VWCE (ETF)', ticker: 'AMS:VWCE', value: 3945.0, change: 3.1 },
];

export const portfolioTotal = holdings.reduce((s, h) => s + h.value, 0); // €52.380,45

export interface Loan {
  id: string;
  name: string;
  principal: number;
  remaining: number;
  duration: string;
  rate: string;
  installment: number;
}

export const loans: Loan[] = [
  { id: 'l1', name: 'Persoonlijke lening', principal: 42500, remaining: 12400, duration: '18 maanden', rate: '4,8%', installment: 720 },
  { id: 'l2', name: 'Zakelijke lening', principal: 95000, remaining: 41250, duration: '36 maanden', rate: '5,6%', installment: 1180 },
  { id: 'l3', name: 'Hypotheek', principal: 385000, remaining: 302480, duration: '27 jaar', rate: '3,9%', installment: 1420 },
  { id: 'l4', name: 'Creditcard afbetaling', principal: 4800, remaining: 1180, duration: '6 maanden', rate: '12,4%', installment: 210 },
];

export const loanTotals = {
  principal: loans.reduce((s, l) => s + l.principal, 0),
  remaining: loans.reduce((s, l) => s + l.remaining, 0),
  installment: loans.reduce((s, l) => s + l.installment, 0),
};

export const contacts = [
  { name: 'Sanne de Vries', role: 'Partner', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  { name: 'Mark Jansen', role: 'Zakelijk', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  { name: 'Lotte Bakker', role: 'Familie', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
];

export const savingsGoal = {
  name: 'Wereldreis 2027',
  target: 25000,
  saved: 18050,
};

export const netWorth = totalBalance + portfolioTotal - loanTotals.remaining; // € -265.742 approx (incl. hypotheek)

export function eur(value: number, options?: { signed?: boolean }): string {
  const formatted = new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(Math.abs(value));
  if (options?.signed) return value >= 0 ? `+${formatted}` : `-${formatted}`;
  return value < 0 ? `-${formatted}` : formatted;
}

export function pct(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toLocaleString('nl-NL', { maximumFractionDigits: 1 })}%`;
}
