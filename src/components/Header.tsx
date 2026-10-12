import { Search, Bell, Menu, Sun, Moon, Settings2, Globe2, ShieldCheck, LogOut, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/use-language';
import { useAuth } from '@/lib/auth-context';
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

  const initials = currentUser?.initials || 'DV';
  const displayName = currentUser?.fullName || 'Gebruiker';

  return (
    <header className="dashboard-header bg-card/80 border-b border-border px-4 py-4 backdrop-blur-xl md:px-6 lg:px-8">
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
              <p className="dashboard-overline">{t('yourWorld')}</p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3 w-3" />
                  Admin
                </span>
              )}
            </div>
            <h1 className="text-xl font-semibold tracking-[-0.04em] text-foreground md:text-2xl">
              {t('dashboard')}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              className="h-11 w-64 rounded-full border border-border/70 bg-muted/70 pl-10 shadow-none"
              onKeyDown={(event) => {
                if (event.key === 'Enter' && event.currentTarget.value.trim()) {
                  toast.info(`${t('searchReady')} “${event.currentTarget.value.trim()}”`);
                }
              }}
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="rounded-full border border-border/70 bg-card/70 px-3 font-semibold uppercase tracking-[0.12em] hover:bg-muted"
            title={`${t('language')}: ${language === 'nl' ? 'Nederlands' : 'English'}`}
          >
            <Globe2 className="h-4 w-4" />
            {language === 'nl' ? 'EN' : 'NL'}
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onDarkModeToggle}
            className="rounded-full border border-border/70 bg-card/70 hover:bg-muted"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className="hidden rounded-full border border-border/70 bg-card/70 hover:bg-muted sm:flex"
            title={t('settings')}
          >
            <Settings2 className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full border border-border/70 bg-card/70 hover:bg-muted">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>{t('notifications')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Nieuwe transactie ontvangen</span>
                  <span className="text-xs text-muted-foreground">€ 4.850,00 salaris bijgeschreven</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Beveiligingsupdate</span>
                  <span className="text-xs text-muted-foreground">Firebase sessie actief & beveiligd</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown & Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border-2 border-card bg-card p-0.5 shadow-sm ring-1 ring-primary/20 hover:ring-primary/40"
                title={displayName}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {initials}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold leading-none">{displayName}</p>
                    {isAdmin ? (
                      <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        ADMIN
                      </span>
                    ) : (
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        {currentUser?.membershipTier ? currentUser.membershipTier.toUpperCase() : 'USER'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{currentUser?.email || 'geen e-mail'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Wissel account (Demo)
                </DropdownMenuLabel>
                {demoAccounts.map((acc) => {
                  const isActive = acc.email.toLowerCase() === currentUser?.email?.toLowerCase();
                  return (
                    <DropdownMenuItem
                      key={acc.id}
                      onClick={() => {
                        switchUser(acc.id);
                        toast.success(`Gewisseld naar ${acc.fullName} (${acc.role === 'admin' ? 'Admin' : 'Normale gebruiker'})`);
                      }}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-medium flex items-center gap-1.5">
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
              <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
                <Settings2 className="mr-2 h-4 w-4" />
                <span>Instellingen</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await logout();
                  window.location.hash = '#login';
                  toast.info('Je bent uitgelogd');
                }}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Uitloggen</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
