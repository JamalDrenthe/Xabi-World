import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Overview } from './sections/Overview';
import { Transactions } from './sections/Transactions';
import { Accounts } from './sections/Accounts';
import { Investments } from './sections/Investments';
import { CreditCards } from './sections/CreditCards';
import { Loans } from './sections/Loans';
import { Services } from './sections/Services';
import { Settings } from './sections/Settings';
import { Toaster } from '@/components/ui/sonner';

type Section = 'overview' | 'transactions' | 'accounts' | 'investments' | 'credit-cards' | 'loans' | 'services' | 'settings';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'transactions':
        return <Transactions />;
      case 'accounts':
        return <Accounts />;
      case 'investments':
        return <Investments />;
      case 'credit-cards':
        return <CreditCards />;
      case 'loans':
        return <Loans />;
      case 'services':
        return <Services />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className={`min-h-screen bg-background ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={(section) => {
            setActiveSection(section as Section);
            setSidebarOpen(false);
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onMenuClick={() => setSidebarOpen(true)}
            darkMode={darkMode}
            onDarkModeToggle={toggleDarkMode}
          />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {renderSection()}
            </div>
          </main>
        </div>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
