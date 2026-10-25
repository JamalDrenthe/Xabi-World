import { useEffect, useState, lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import {
  AboutPage,
  CompanyPage,
  ContactPage,
  LandingPage,
  LoginPage,
  PlatformPage,
  PricingPage,
  PartnershipsPage,
  CareersPage,
  RegisterPage,
  type PublicRoute,
} from './components/PublicSite';
import { useAuth } from './lib/auth-context';

const DashboardView = lazy(() => import('./components/DashboardView'));

type AppRoute = PublicRoute | 'dashboard';

function getRoute(): AppRoute {
  const hash = window.location.hash.replace('#', '').trim();
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').trim();
  const candidate = hash || path;
  const validRoutes: AppRoute[] = [
    'home',
    'about',
    'platform',
    'company',
    'pricing',
    'partnerships',
    'careers',
    'register',
    'login',
    'contact',
    'dashboard',
  ];
  return validRoutes.includes(candidate as AppRoute) ? (candidate as AppRoute) : 'home';
}

function LoadingSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0b1714]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        <span className="text-xs font-mono text-emerald-400/80">Xabi World laden...</span>
      </div>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState<AppRoute>(getRoute);
  const [darkMode, setDarkMode] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleRouteChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    document.title =
      route === 'dashboard'
        ? 'Xabi World Dashboard'
        : 'Xabi World — Meer overzicht voor de volgende stap';
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
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
    navigate('dashboard');
  };

  const handleLogout = async () => {
    await logout();
    navigate('home');
  };

  if (route === 'dashboard' && isAuthenticated) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardView
          darkMode={darkMode}
          onDarkModeToggle={() => setDarkMode((val) => !val)}
          onLogout={handleLogout}
        />
      </Suspense>
    );
  }

  if (route === 'login') return <LoginPage navigate={(nextRoute) => navigate(nextRoute)} onLogin={handleLogin} />;
  if (route === 'about') return <AboutPage navigate={(nextRoute) => navigate(nextRoute)} />;
  if (route === 'platform') return <PlatformPage navigate={(nextRoute) => navigate(nextRoute)} />;
  if (route === 'pricing') return <PricingPage navigate={(nextRoute) => navigate(nextRoute)} />;
  if (route === 'partnerships') return <PartnershipsPage navigate={(nextRoute) => navigate(nextRoute)} />;
  if (route === 'careers') return <CareersPage navigate={(nextRoute) => navigate(nextRoute)} />;
  if (route === 'register') {
    return (
      <>
        <RegisterPage navigate={(nextRoute) => navigate(nextRoute)} />
        <Toaster position="top-right" theme="light" />
      </>
    );
  }
  if (route === 'company') return <CompanyPage navigate={(nextRoute) => navigate(nextRoute)} />;
  if (route === 'contact') return <ContactPage navigate={(nextRoute) => navigate(nextRoute)} />;
  return <LandingPage navigate={(nextRoute) => navigate(nextRoute)} />;
}

export default App;
