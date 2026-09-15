import { Search, Bell, Menu, Sun, Moon, Settings2, Globe2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/use-language';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onMenuClick: () => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  onSettingsClick: () => void;
}

export function Header({ onMenuClick, darkMode, onDarkModeToggle, onSettingsClick }: HeaderProps) {
  const { language, toggleLanguage, t } = useLanguage();

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
            <p className="dashboard-overline">{t('yourWorld')}</p>
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
                  <span className="font-medium">New transaction received</span>
                  <span className="text-xs text-muted-foreground">You received $2,500 from PayPal</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Card payment successful</span>
                  <span className="text-xs text-muted-foreground">Spotify subscription paid</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <button
            type="button"
            onClick={onSettingsClick}
            className="h-10 w-10 overflow-hidden rounded-full border-2 border-card bg-card p-0.5 shadow-sm ring-1 ring-primary/15"
            title={t('profile')}
          >
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
