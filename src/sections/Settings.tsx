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

// Edit Profile Tab
function EditProfile() {
  const { t } = useLanguage();
  const handleSave = () => {
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => toast.info(t('profilePhotoReady'))}
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-white"
            aria-label="Edit profile photo"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Your Name</Label>
          <Input defaultValue="Charlene Reed" />
        </div>
        
        <div className="space-y-2">
          <Label>User Name</Label>
          <Input defaultValue="Charlene Reed" />
        </div>
        
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" defaultValue="charlenereed@gmail.com" />
        </div>
        
        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" defaultValue="**********" />
        </div>
        
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Input type="date" defaultValue="1990-01-25" />
        </div>
        
        <div className="space-y-2">
          <Label>Present Address</Label>
          <Input defaultValue="San Jose, California, USA" />
        </div>
        
        <div className="space-y-2">
          <Label>Permanent Address</Label>
          <Input defaultValue="San Jose, California, USA" />
        </div>
        
        <div className="space-y-2">
          <Label>City</Label>
          <Input defaultValue="San Jose" />
        </div>
        
        <div className="space-y-2">
          <Label>Postal Code</Label>
          <Input defaultValue="45962" />
        </div>
        
        <div className="space-y-2">
          <Label>Country</Label>
          <Input defaultValue="USA" />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gradient-primary px-8">
          Save
        </Button>
      </div>
    </div>
  );
}

// Preferences Tab
function Preferences() {
  const [notifications, setNotifications] = useState({
    digitalCurrency: true,
    merchantOrder: false,
    recommendations: true,
  });

  const handleSave = () => {
    toast.success('Preferences saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Currency</Label>
          <Select defaultValue="usd">
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD - US Dollar</SelectItem>
              <SelectItem value="eur">EUR - Euro</SelectItem>
              <SelectItem value="gbp">GBP - British Pound</SelectItem>
              <SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Time Zone</Label>
          <Select defaultValue="gmt-12">
            <SelectTrigger>
              <SelectValue placeholder="Select time zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gmt-12">(GMT-12:00) International Date Line West</SelectItem>
              <SelectItem value="gmt-8">(GMT-8:00) Pacific Time</SelectItem>
              <SelectItem value="gmt-5">(GMT-5:00) Eastern Time</SelectItem>
              <SelectItem value="gmt+0">(GMT+0:00) London</SelectItem>
              <SelectItem value="gmt+1">(GMT+1:00) Central European Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        <Label className="text-base">Notification</Label>
        
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="font-medium text-foreground">I send or receive digital currency</p>
          </div>
          <Switch 
            checked={notifications.digitalCurrency}
            onCheckedChange={(checked) => setNotifications({...notifications, digitalCurrency: checked})}
          />
        </div>
        
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="font-medium text-foreground">I receive merchant order</p>
          </div>
          <Switch 
            checked={notifications.merchantOrder}
            onCheckedChange={(checked) => setNotifications({...notifications, merchantOrder: checked})}
          />
        </div>
        
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium text-foreground">There are recommendations for my account</p>
          </div>
          <Switch 
            checked={notifications.recommendations}
            onCheckedChange={(checked) => setNotifications({...notifications, recommendations: checked})}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gradient-primary px-8">
          Save
        </Button>
      </div>
    </div>
  );
}

// Security Tab
function Security() {
  const [twoFactor, setTwoFactor] = useState(true);

  const handleSave = () => {
    toast.success('Security settings updated!');
  };

  return (
    <div className="space-y-6">
      {/* Two-factor Authentication */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-foreground text-lg">Two-factor Authentication</h4>
          </div>
          <Switch 
            checked={twoFactor}
            onCheckedChange={setTwoFactor}
          />
        </div>
        <p className="text-muted-foreground">Enable or disable two factor authentication</p>
      </div>

      {/* Change Password */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h4 className="font-semibold text-foreground text-lg">Change Password</h4>
        
        <div className="space-y-2">
          <Label>Current Password</Label>
          <Input type="password" defaultValue="**********" />
        </div>
        
        <div className="space-y-2">
          <Label>New Password</Label>
          <Input type="password" placeholder="Enter new password" />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gradient-primary px-8">
          Save
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
      {/* Header */}
      <div>
        <p className="dashboard-overline">{t('yourWorld')}</p>
        <h2 className="dashboard-section-title">{t('settings')}</h2>
      </div>

      {/* Tabs */}
      <Card className="card-shadow">
        <CardContent className="p-6">
          <div className="flex gap-6 border-b border-border mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && <EditProfile />}
          {activeTab === 'preferences' && <Preferences />}
          {activeTab === 'security' && <Security />}
        </CardContent>
      </Card>
    </div>
  );
}
