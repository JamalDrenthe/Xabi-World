import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  UserCircle, 
  TrendingUp, 
  CreditCard, 
  Wallet, 
  Wrench, 
  Settings,
  Shield,
  X,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'accounts', label: 'Accounts', icon: UserCircle },
  { id: 'investments', label: 'Investments', icon: TrendingUp },
  { id: 'credit-cards', label: 'Credit Cards', icon: CreditCard },
  { id: 'loans', label: 'Loans', icon: Wallet },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeSection, onSectionChange, isOpen, onClose, onLogout }: SidebarProps) {
  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card/95 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:static",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-border px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="block text-lg font-semibold tracking-[-0.04em] text-foreground">Xabi World</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Financial clarity</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-muted lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/10"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:translate-x-0.5"
                )} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="rounded-2xl border border-border/70 bg-muted/60 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-semibold text-primary">EC</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Eddy Cusuma</p>
                <p className="text-xs text-muted-foreground">Premium Member</p>
              </div>
            </div>
            <button
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              onClick={onLogout}
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Uitloggen
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
