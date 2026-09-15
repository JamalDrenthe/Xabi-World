import { useMemo, useState, type ReactNode } from 'react';
import { LanguageContext, type LanguageContextValue } from './language-context';

export type Language = 'en' | 'nl';

const copy: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    accounts: 'Accounts',
    investments: 'Investments',
    creditCards: 'Credit Cards',
    loans: 'Loans',
    services: 'Services',
    settings: 'Settings',
    overview: 'Overview',
    financialClarity: 'Financial clarity',
    yourWorld: 'Your world',
    search: 'Search your dashboard',
    notifications: 'Notifications',
    logout: 'Log out',
    premiumMember: 'Premium Member',
    seeAll: 'See all',
    viewAll: 'View all',
    viewDetails: 'View details',
    send: 'Send',
    save: 'Save changes',
    previous: 'Previous',
    next: 'Next',
    download: 'Download',
    repay: 'Repay',
    language: 'Language',
    profile: 'Edit profile',
    preferences: 'Preferences',
    security: 'Security',
    cardDetails: 'Card details',
    comingSoon: 'This action is ready for the next connected account.',
    transferInitiated: 'Transfer initiated successfully.',
    receiptDownloaded: 'Receipt download started.',
    repaymentInitiated: 'Repayment request initiated.',
    settingsOpened: 'Settings opened.',
    languageChanged: 'Language changed to English.',
    viewAllReady: 'Everything is already visible in this workspace.',
    serviceListReady: 'The full service list is already visible.',
    searchReady: 'Search is ready for',
    profilePhotoReady: 'Profile photo controls are ready.',
    cardActionReady: 'ready to configure.',
  },
  nl: {
    dashboard: 'Dashboard',
    transactions: 'Transacties',
    accounts: 'Rekeningen',
    investments: 'Investeringen',
    creditCards: 'Creditcards',
    loans: 'Leningen',
    services: 'Diensten',
    settings: 'Instellingen',
    overview: 'Overzicht',
    financialClarity: 'Financiële helderheid',
    yourWorld: 'Jouw wereld',
    search: 'Zoek in je dashboard',
    notifications: 'Meldingen',
    logout: 'Uitloggen',
    premiumMember: 'Premium member',
    seeAll: 'Bekijk alles',
    viewAll: 'Alles bekijken',
    viewDetails: 'Details bekijken',
    send: 'Versturen',
    save: 'Wijzigingen opslaan',
    previous: 'Vorige',
    next: 'Volgende',
    download: 'Downloaden',
    repay: 'Aflossen',
    language: 'Taal',
    profile: 'Profiel bewerken',
    preferences: 'Voorkeuren',
    security: 'Beveiliging',
    cardDetails: 'Kaartdetails',
    comingSoon: 'Deze actie is klaar voor een volgende gekoppelde rekening.',
    transferInitiated: 'Overboeking gestart.',
    receiptDownloaded: 'Download van bon gestart.',
    repaymentInitiated: 'Aflosverzoek gestart.',
    settingsOpened: 'Instellingen geopend.',
    languageChanged: 'Taal gewijzigd naar Nederlands.',
    viewAllReady: 'Alles is al zichtbaar in deze omgeving.',
    serviceListReady: 'De volledige dienstenlijst is al zichtbaar.',
    searchReady: 'Zoeken is klaar voor',
    profilePhotoReady: 'De profielfotobediening staat klaar.',
    cardActionReady: 'klaar om in te stellen.',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem('xabi-language') as Language) || 'nl',
  );

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem('xabi-language', nextLanguage);
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage(language === 'nl' ? 'en' : 'nl'),
      t: (key, fallback) => copy[language][key] || fallback || key,
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
