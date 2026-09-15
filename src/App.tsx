import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { Header } from './components/Header';
import {
  AboutPage,
  CompanyPage,
  LandingPage,
  LoginPage,
  PlatformPage,
  type PublicRoute,
} from './components/PublicSite';
import { Sidebar } from './components/Sidebar';
import { Accounts } from './sections/Accounts';
import { CreditCards } from './sections/CreditCards';
import { Investments } from './sections/Investments';
import { Loans } from './sections/Loans';
import { Overview } from './sections/Overview';
import { Services } from './sections/Services';
import { Settings } from './sections/Settings';
import { Transactions } from './sections/Transactions';

type Section =
  | 'overview'
  | 'transactions'
  | 'accounts'
  | 'investments'
  | 'credit-cards'
  | 'loans'
  | 'services'
  | 'settings';

type AppRoute = PublicRoute | 'dashboard';

function getRoute(): AppRoute {
  const route = window.location.hash.replace('#', '');
  const validRoutes: AppRoute[] = ['home', 'about', 'platform', 'company', 'login', 'dashboard'];
  return validRoutes.includes(route as AppRoute) ? (route as AppRoute) : 'home';
}

function App() {
  const [route, setRoute] = useState<AppRoute>(getRoute);
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('xabi-authenticated') === 'true');

  useEffect(() => {
    const handleHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', handleHashChange);
    document.title = route === 'dashboard' ? 'Xabi World Dashboard' : 'Xabi World — Meer overzicht voor de volgende stap';
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [route]);

  useEffect(() => {
    if (route === 'dashboard' && !isAuthenticated) window.location.hash = '#login';
  }, [isAuthenticated, route]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', route === 'dashboard' && darkMode);

    return () => {
      root.classList.remove('dark');
    };
  }, [darkMode, route]);

  const navigate = (nextRoute: AppRoute) => {
    window.location.hash = `#${nextRoute}`;
  };

  const handleLogin = () => {
    localStorage.setItem('xabi-authenticated', 'true');
    setIsAuthenticated(true);
    navigate('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('xabi-authenticated');
    setIsAuthenticated(false);
    navigate('home');
  };

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

  if (route === 'dashboard' && isAuthenticated) {
    return (
      <div className={`dashboard-shell min-h-screen bg-background ${darkMode ? 'dark' : ''}`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar
            activeSection={activeSection}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onLogout={handleLogout}
            onSectionChange={(section) => {
              setActiveSection(section as Section);
              setSidebarOpen(false);
            }}
          />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header darkMode={darkMode} onDarkModeToggle={() => setDarkMode((value) => !value)} onMenuClick={() => setSidebarOpen(true)} />
            <main className="dashboard-main flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              <div className="mx-auto max-w-7xl">{renderSection()}</div>
            </main>
          </div>
        </div>
        <Toaster position="top-right" theme={darkMode ? 'dark' : 'light'} />
      </div>
    );
  }

  if (route === 'login') return <LoginPage navigate={(nextRoute) => navigate(nextRoute)} onLogin={handleLogin} />;
  if (route === 'about') return <AboutPage navigate={(nextRoute) => navigate(nextRoute)} />;
  if (route === 'platform') return <PlatformPage navigate={(nextRoute) => navigate(nextRoute)} />;
  if (route === 'company') return <CompanyPage navigate={(nextRoute) => navigate(nextRoute)} />;
  return <LandingPage navigate={(nextRoute) => navigate(nextRoute)} />;
}

export default App;
