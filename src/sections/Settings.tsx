import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/use-language';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, Database, Globe, Github, Users, CheckCircle2, CreditCard } from 'lucide-react';

function EditProfile() {
  const { t } = useLanguage();
  const { currentUser, updateProfile } = useAuth();

  const [form, setForm] = useState({
    firstName: currentUser?.firstName || 'Daan',
    lastName: currentUser?.lastName || 'Vermeulen',
    email: currentUser?.email || 'daan.vermeulen@gmail.com',
    phone: currentUser?.phone || '+31 6 2947 18 35',
    dateOfBirth: currentUser?.dateOfBirth || '1990-05-14',
    address: currentUser?.address || 'Herengracht 420',
    city: currentUser?.city || 'Amsterdam',
    postalCode: currentUser?.postalCode || '1017 BZ',
    country: currentUser?.country || 'Nederland',
  });

  const handleSave = () => {
    updateProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      fullName: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      phone: form.phone,
      dateOfBirth: form.dateOfBirth,
      address: form.address,
      city: form.city,
      postalCode: form.postalCode,
      country: form.country,
    });
    toast.success(t('profileSaved'));
  };

  const initials = currentUser?.initials || 'DV';
  const fullName = currentUser?.fullName || `${form.firstName} ${form.lastName}`;
  const iban = currentUser?.iban || 'NL82 XABI 0123 4567 89';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/10">
          <span className="text-2xl font-semibold text-primary">{initials}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-foreground">{fullName}</p>
            {currentUser?.role === 'admin' && (
              <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                ADMIN
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{iban}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('firstName')}</Label>
          <Input
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('lastName')}</Label>
          <Input
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>E-mail</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('phone')}</Label>
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('dateOfBirth')}</Label>
          <Input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('address')}</Label>
          <Input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('city')}</Label>
          <Input
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('postalCode')}</Label>
          <Input
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('country')}</Label>
          <Input
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gradient-primary px-8">
          {t('save')}
        </Button>
      </div>
    </div>
  );
}

function Preferences() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState({
    transactions: true,
    merchantOrder: false,
    recommendations: true,
  });

  const handleSave = () => {
    toast.success(t('preferencesSaved'));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-foreground">{t('notifications')}</h4>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">{t('transactionAlerts')}</p>
            <p className="text-sm text-muted-foreground">{t('transactionAlertsDescription')}</p>
          </div>
          <Switch
            checked={notifications.transactions}
            onCheckedChange={(checked) => setNotifications({ ...notifications, transactions: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">{t('merchantAlerts')}</p>
            <p className="text-sm text-muted-foreground">{t('merchantAlertsDescription')}</p>
          </div>
          <Switch
            checked={notifications.merchantOrder}
            onCheckedChange={(checked) => setNotifications({ ...notifications, merchantOrder: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">{t('recommendations')}</p>
            <p className="text-sm text-muted-foreground">{t('recommendationsDescription')}</p>
          </div>
          <Switch
            checked={notifications.recommendations}
            onCheckedChange={(checked) => setNotifications({ ...notifications, recommendations: checked })}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gradient-primary px-8">
          {t('save')}
        </Button>
      </div>
    </div>
  );
}

function Security() {
  const { t } = useLanguage();
  const [twoFactor, setTwoFactor] = useState(true);

  const handleSave = () => {
    toast.success(t('securitySaved'));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-foreground">{t('twoFactor')}</h4>
          </div>
          <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
        </div>
        <p className="text-muted-foreground">{t('twoFactorDescription')}</p>
      </div>

      <div className="space-y-4 border-t border-border pt-4">
        <h4 className="text-lg font-semibold text-foreground">{t('changePassword')}</h4>

        <div className="space-y-2">
          <Label>{t('currentPassword')}</Label>
          <Input type="password" defaultValue="**********" />
        </div>

        <div className="space-y-2">
          <Label>{t('newPassword')}</Label>
          <Input type="password" placeholder={t('newPasswordPlaceholder')} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gradient-primary px-8">
          {t('save')}
        </Button>
      </div>
    </div>
  );
}

function AdminSection() {
  const { demoAccounts, switchUser } = useAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-6 dark:bg-emerald-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Beheerderspaneel (Admin Status)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Beheerdersaccount: <span className="font-semibold">info@xabi.world</span> (of info@jamaldrenthe.com) met volledige beheerdersrechten.
            </p>
          </div>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border p-4 bg-card">
          <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
            <Globe className="h-4 w-4" /> Website & Hosting
          </div>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex justify-between">
              <span>Website:</span>
              <span className="font-medium text-foreground">xabi.world</span>
            </li>
            <li className="flex justify-between">
              <span>Hosting:</span>
              <span className="font-medium text-foreground">Vercel Production</span>
            </li>
            <li className="flex justify-between">
              <span>Status:</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 className="h-3 w-3" /> Live
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-border p-4 bg-card">
          <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
            <Github className="h-4 w-4" /> Git Repository
          </div>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex justify-between">
              <span>Repository:</span>
              <span className="font-medium text-foreground">JamalDrenthe/Xabi-World</span>
            </li>
            <li className="flex justify-between">
              <span>Push Toegang:</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 className="h-3 w-3" /> Geconfigureerd & Actief
              </span>
            </li>
            <li className="flex justify-between">
              <span>Tak:</span>
              <span className="font-medium text-foreground">main</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-border p-4 bg-card">
          <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
            <Database className="h-4 w-4" /> Firebase Projecten
          </div>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex justify-between">
              <span>Account:</span>
              <span className="font-medium text-foreground">info@xabi.world / info@jamaldrenthe.com</span>
            </li>
            <li className="flex justify-between">
              <span>Development:</span>
              <span className="font-medium text-foreground">xabi-world-dev</span>
            </li>
            <li className="flex justify-between">
              <span>Production:</span>
              <span className="font-medium text-foreground">xabi-world-prod</span>
            </li>
            <li className="flex justify-between">
              <span>Firestore Rules:</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 className="h-3 w-3" /> Gedeployd (Admin bypass)
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-border p-4 bg-card">
          <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
            <CreditCard className="h-4 w-4" /> BaaS Kaartinfrastructuur (Swan / Wallester)
          </div>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex justify-between">
              <span>BaaS Partners:</span>
              <span className="font-medium text-foreground">Swan (Mastercard) & Wallester (Visa)</span>
            </li>
            <li className="flex justify-between">
              <span>PCI-DSS Beveiliging:</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 className="h-3 w-3" /> Standaard gemaskeerd + 👁️ Enclave
              </span>
            </li>
            <li className="flex justify-between">
              <span>Webhook Endpoints:</span>
              <span className="font-mono text-[11px] text-foreground">/api/webhooks/[swan|wallester]</span>
            </li>
            <li className="flex justify-between">
              <span>Apple / Google Pay:</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 className="h-3 w-3" /> Tokenisatie gereed
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-border p-4 bg-card">
          <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
            <Users className="h-4 w-4" /> Demo Accounts Beheer
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Wissel direct naar een demo-account om de weergave voor normale gebruikers te testen:
          </p>
          <div className="space-y-1.5">
            {demoAccounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => {
                  switchUser(acc.id);
                  toast.success(`Gewisseld naar ${acc.fullName}`);
                }}
                className="w-full flex items-center justify-between rounded-lg border border-border/80 px-2.5 py-1.5 text-xs hover:bg-muted text-left transition"
              >
                <span className="font-medium text-foreground">
                  {acc.role === 'admin' ? '👑 ' : ''}{acc.fullName} ({acc.badge})
                </span>
                <span className="text-[10px] text-muted-foreground">Wissel</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Settings() {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  type SettingsTab = 'profile' | 'preferences' | 'security' | 'admin';
  const [activeTab, setActiveTab] = useState<SettingsTab>(isAdmin ? 'admin' : 'profile');

  const tabs: { id: SettingsTab; label: string; icon?: React.ReactNode }[] = [
    ...(isAdmin
      ? [{ id: 'admin' as SettingsTab, label: '👑 Beheer & Status' }]
      : []),
    { id: 'profile' as SettingsTab, label: t('profile') },
    { id: 'preferences' as SettingsTab, label: t('preferences') },
    { id: 'security' as SettingsTab, label: t('security') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="dashboard-overline">{t('yourWorld')}</p>
        <h2 className="dashboard-section-title">{t('settings')}</h2>
      </div>

      <Card className="card-shadow">
        <CardContent className="p-6">
          <div className="mb-6 flex gap-6 overflow-x-auto border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>

          {activeTab === 'admin' && <AdminSection />}
          {activeTab === 'profile' && <EditProfile />}
          {activeTab === 'preferences' && <Preferences />}
          {activeTab === 'security' && <Security />}
        </CardContent>
      </Card>
    </div>
  );
}
