import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/use-language';
import { userProfile } from '@/lib/data';

function EditProfile() {
  const { t } = useLanguage();

  const handleSave = () => {
    toast.success(t('profileSaved'));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-primary/20">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => toast.info(t('profilePhotoReady'))}
            className="gradient-primary absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full text-white"
            aria-label="Edit profile photo"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">{userProfile.fullName}</p>
          <p className="text-sm text-muted-foreground">{userProfile.iban}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('firstName')}</Label>
          <Input defaultValue={userProfile.firstName} />
        </div>

        <div className="space-y-2">
          <Label>{t('lastName')}</Label>
          <Input defaultValue={userProfile.lastName} />
        </div>

        <div className="space-y-2">
          <Label>E-mail</Label>
          <Input type="email" defaultValue={userProfile.email} />
        </div>

        <div className="space-y-2">
          <Label>{t('phone')}</Label>
          <Input defaultValue={userProfile.phone} />
        </div>

        <div className="space-y-2">
          <Label>{t('dateOfBirth')}</Label>
          <Input type="date" defaultValue={userProfile.dateOfBirth} />
        </div>

        <div className="space-y-2">
          <Label>{t('address')}</Label>
          <Input defaultValue={userProfile.address} />
        </div>

        <div className="space-y-2">
          <Label>{t('city')}</Label>
          <Input defaultValue={userProfile.city} />
        </div>

        <div className="space-y-2">
          <Label>{t('postalCode')}</Label>
          <Input defaultValue={userProfile.postalCode} />
        </div>

        <div className="space-y-2">
          <Label>{t('country')}</Label>
          <Input defaultValue={userProfile.country} />
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('currency')}</Label>
          <Select defaultValue="eur">
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eur">EUR — Euro</SelectItem>
              <SelectItem value="usd">USD — US Dollar</SelectItem>
              <SelectItem value="gbp">GBP — British Pound</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('timeZone')}</Label>
          <Select defaultValue="cet">
            <SelectTrigger>
              <SelectValue placeholder="Select time zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cet">(GMT+1:00) Central European Time — Amsterdam</SelectItem>
              <SelectItem value="gmt">(GMT+0:00) London</SelectItem>
              <SelectItem value="est">(GMT-5:00) Eastern Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base">{t('notifications')}</Label>

        <div className="flex items-center justify-between border-b border-border py-3">
          <div>
            <p className="font-medium text-foreground">{t('notifyTransactions')}</p>
          </div>
          <Switch
            checked={notifications.transactions}
            onCheckedChange={(checked) => setNotifications({ ...notifications, transactions: checked })}
          />
        </div>

        <div className="flex items-center justify-between border-b border-border py-3">
          <div>
            <p className="font-medium text-foreground">{t('notifyMerchant')}</p>
          </div>
          <Switch
            checked={notifications.merchantOrder}
            onCheckedChange={(checked) => setNotifications({ ...notifications, merchantOrder: checked })}
          />
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium text-foreground">{t('notifyRecommendations')}</p>
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

export function Settings() {
  const { t } = useLanguage();
  type SettingsTab = 'profile' | 'preferences' | 'security';
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: 'profile', label: t('profile') },
    { id: 'preferences', label: t('preferences') },
    { id: 'security', label: t('security') },
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
                  activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>

          {activeTab === 'profile' && <EditProfile />}
          {activeTab === 'preferences' && <Preferences />}
          {activeTab === 'security' && <Security />}
        </CardContent>
      </Card>
    </div>
  );
}
