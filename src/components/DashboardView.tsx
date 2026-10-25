import { useState } from 'react';
import { Toaster } from 'sonner';
import { FinancialProvider } from '@/lib/financial-store';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Overview } from '@/sections/Overview';
import { Transactions } from '@/sections/Transactions';
import { Accounts } from '@/sections/Accounts';
import { Investments } from '@/sections/Investments';
import { CreditCards } from '@/sections/CreditCards';
import { Integrations } from '@/sections/Integrations';
import { Settings } from '@/sections/Settings';

export type Section =
  | 'overview'
  | 'transactions'
  | 'accounts'
  | 'investments'
  | 'credit-cards'
  | 'integrations'
  | 'settings';

interface DashboardViewProps {
  darkMode: boolean;
  onDarkModeToggle: () => void;
  onLogout: () => void;
}

export function DashboardView({ darkMode, onDarkModeToggle, onLogout }: DashboardViewProps) {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'transactions':
        return <Transactions />;
      case 'accounts':
        return <Accounts />;
      case 'investments':
        return <Investments />;
      case 'credit-cards':
        return <CreditCards />;
      case 'integrations':
        return <Integrations />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <FinancialProvider>
      <div className={`dashboard-shell min-h-screen bg-background ${darkMode ? 'dark' : ''}`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar
            activeSection={activeSection}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onLogout={onLogout}
            onSectionChange={(section) => {
              setActiveSection(section as Section);
              setSidebarOpen(false);
            }}
          />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header
              darkMode={darkMode}
              onDarkModeToggle={onDarkModeToggle}
              onMenuClick={() => setSidebarOpen(true)}
              onSettingsClick={() => setActiveSection('settings')}
            />
            <main className="dashboard-main flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              <div className="mx-auto max-w-7xl">{renderSection()}</div>
            </main>
          </div>
        </div>
        <Toaster position="top-right" theme={darkMode ? 'dark' : 'light'} />
      </div>
    </FinancialProvider>
  );
}

export default DashboardView;
