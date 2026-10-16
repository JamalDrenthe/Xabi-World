import { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
  Sun,
  Moon,
  Settings2,
  Globe2,
  ShieldCheck,
  LogOut,
  Check,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/use-language';
import { useAuth } from '@/lib/auth-context';
import { useFinancial } from '@/lib/financial-store';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onMenuClick: () => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  onSettingsClick: () => void;
}

export function Header({ onMenuClick, darkMode, onDarkModeToggle, onSettingsClick }: HeaderProps) {
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, isAdmin, demoAccounts, switchUser, logout } = useAuth();
  const { privacyMode, togglePrivacyMode, resetDemoData, totalBalance } = useFinancial();
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  const initials = currentUser?.initials || 'DV';
  const displayName = currentUser?.fullName || 'Gebruiker';

  const markNotificationsRead = () => {
    setUnreadNotifications(0);
    toast.success('Alle meldingen gemarkeerd als gelezen');
  };

  return (
    <header className="dashboard-header sticky top-0 z-40 bg-card/85 border-b border-border px-4 py-3.5 backdrop-blur-xl md:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <p className="dashboard-overline text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                {t('yourWorld')}
              </p>
              {isAdmin ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3 w-3" />
                  ADMIN PANEL
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  {currentUser?.membershipTier ? currentUser.membershipTier.toUpperCase() : 'MEMBER'}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold tracking-[-0.04em] text-foreground md:text-2xl flex items-center gap-2">
              {t('dashboard')}
              <span className="text-xs font-normal text-muted-foreground hidden md:inline-flex items-center gap-1.5 ml-2 border border-border/80 rounded-full px-2.5 py-0.5 bg-muted/50">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </h1>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5 md:gap-3.5">
          {/* Global Search Bar */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              className="h-10 w-64 rounded-full border border-border/80 bg-muted/60 pl-10 text-xs shadow-none focus-visible:ring-1 focus-visible:ring-primary/40"
              onKeyDown={(event) => {
                if (event.key === 'Enter' && event.currentTarget.value.trim()) {
                  toast.info(`${t('searchReady')} “${event.currentTarget.value.trim()}”`);
                }
              }}
            />
          </div>

          {/* Privacy Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePrivacyMode}
            className={`rounded-full border border-border/70 hover:bg-muted ${
              privacyMode ? 'bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400' : 'bg-card/70'
            }`}
            title={privacyMode ? 'Privacy-modus uitschakelen (bedragen tonen)' : 'Privacy-modus inschakelen (bedragen verbergen)'}
          >
            {privacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="rounded-full border border-border/70 bg-card/70 px-3 text-xs font-semibold uppercase tracking-[0.12em] hover:bg-muted h-10"
            title={`${t('language')}: ${language === 'nl' ? 'Nederlands' : 'English'}`}
          >
            <Globe2 className="h-3.5 w-3.5 mr-1" />
            {language === 'nl' ? 'EN' : 'NL'}
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onDarkModeToggle}
            className="rounded-full border border-border/70 bg-card/70 hover:bg-muted"
            title={darkMode ? 'Lichte modus' : 'Donkere modus'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Settings Shortcut */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className="hidden sm:flex rounded-full border border-border/70 bg-card/70 hover:bg-muted"
            title={t('settings')}
          >
            <Settings2 className="h-4 w-4" />
          </Button>

          {/* Interactive Notifications Drawer */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full border border-border/70 bg-card/70 hover:bg-muted"
                title="Notificaties"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-card" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2">
              <div className="flex items-center justify-between p-2">
                <DropdownMenuLabel className="p-0 font-semibold text-sm">
                  Meldingen & Activiteit
                </DropdownMenuLabel>
                {unreadNotifications > 0 && (
                  <button
                    onClick={markNotificationsRead}
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    Gelezen markeren
                  </button>
                )}
              </div>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer p-2.5 rounded-lg">
                <div className="flex gap-3 items-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-xs text-foreground">Dividend bijgeschreven</span>
                    <span className="text-[11px] text-muted-foreground">ASML Holding keerde dividend uit op jouw beleggersrekening.</span>
                    <span className="text-[10px] text-muted-foreground/70">Zojuist</span>
                  </div>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer p-2.5 rounded-lg">
                <div className="flex gap-3 items-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-xs text-foreground">Veiligheid & Firebase</span>
                    <span className="text-[11px] text-muted-foreground">Firestore Security Rules actief & geautoriseerd voor xabi.world.</span>
                    <span className="text-[10px] text-muted-foreground/70">12m geleden</span>
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile & Demo Switcher Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border-2 border-card bg-card p-0.5 shadow-sm ring-1 ring-primary/20 hover:ring-primary/50 transition-all"
                title={displayName}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {initials}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-2">
              <DropdownMenuLabel className="font-normal p-2">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground">{displayName}</p>
                    {isAdmin ? (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                        ADMIN
                      </span>
                    ) : (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {currentUser?.membershipTier ? currentUser.membershipTier.toUpperCase() : 'USER'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{currentUser?.email || 'geen e-mail'}</p>
                  <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 pt-1">
                    Actief Saldo: <span className={privacyMode ? 'privacy-blur' : ''}>€ {totalBalance.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Wissel Persona / Demo Account
                </div>
                {demoAccounts.map((acc) => {
                  const isActive = acc.email.toLowerCase() === currentUser?.email?.toLowerCase();
                  return (
                    <DropdownMenuItem
                      key={acc.id}
                      onClick={() => {
                        switchUser(acc.id);
                        toast.success(`Gewisseld naar ${acc.fullName} (${acc.role === 'admin' ? 'Admin' : 'Normale gebruiker'})`);
                      }}
                      className="flex items-center justify-between cursor-pointer p-2 rounded-lg"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          {acc.role === 'admin' && '👑'} {acc.fullName}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{acc.badge}</span>
                      </div>
                      {isActive && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={resetDemoData}
                className="cursor-pointer text-xs p-2 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5" />
                <span>Herstel demo-data</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer text-xs p-2">
                <Settings2 className="mr-2 h-3.5 w-3.5" />
                <span>Instellingen & Beheer</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={async () => {
                  await logout();
                  window.location.hash = '#login';
                  toast.info('Je bent uitgelogd');
                }}
                className="cursor-pointer text-xs p-2 text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                <span>Uitloggen</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
