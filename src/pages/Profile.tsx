import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Mail, 
  Clock, 
  Target, 
  Bell, 
  Shield, 
  LogIn,
  Save,
  Loader2,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { profile, updateProfile, user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    weeklyTarget: 50,
  });
  const [notifications, setNotifications] = useState({
    weeklyReminder: true,
    emailNotifications: false,
    dailyReminder: true,
  });
  const { toast } = useToast();

  // Load profile data when it becomes available
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        weeklyTarget: profile.weekly_target || 50,
      });
      setNotifications({
        weeklyReminder: profile.notifications_weekly_reminder ?? true,
        emailNotifications: profile.notifications_email ?? false,
        dailyReminder: profile.notifications_daily_reminder ?? true,
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.email.includes('@')) {
        throw new Error('Please enter a valid email');
      }
      if (formData.weeklyTarget < 1 || formData.weeklyTarget > 1000) {
        throw new Error('Weekly target must be between 1 and 1000 kg');
      }

      const { error } = await updateProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
        weekly_target: formData.weeklyTarget,
        notifications_weekly_reminder: notifications.weeklyReminder,
        notifications_email: notifications.emailNotifications,
        notifications_daily_reminder: notifications.dailyReminder,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Settings saved! ✓",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "There was an error saving your settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const exportData = {
        profile: formData,
        notifications,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `profile-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported! 📁",
        description: "Your profile data has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Delete account",
      description: "Account deletion requires additional confirmation. This feature will be available soon.",
      variant: "destructive",
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card className="p-6 opacity-0 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-3xl font-bold text-primary-foreground">
            {getInitials(formData.name)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{formData.name || 'Your Name'}</h2>
            <p className="text-muted-foreground">{formData.email || 'your@email.com'}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Member since {profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : 'Recently'}
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input 
              id="email" 
              type="email" 
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timezone" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timezone
            </Label>
            <Input id="timezone" defaultValue={profile?.timezone || 'UTC'} disabled />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="target" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Weekly Target (kg CO₂)
            </Label>
            <Input 
              id="target" 
              type="number" 
              value={formData.weeklyTarget}
              onChange={(e) => handleInputChange('weeklyTarget', Number(e.target.value))}
              min={1}
              max={1000}
            />
          </div>
        </div>

        <Button 
          className="w-full mt-6" 
          variant="hero"
          onClick={handleSaveChanges}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </Card>

      {/* Notifications */}
      <Card className="p-6 opacity-0 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Reminder</p>
              <p className="text-sm text-muted-foreground">Get reminded to check your weekly summary</p>
            </div>
            <Switch 
              checked={notifications.weeklyReminder}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReminder: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive weekly reports via email</p>
            </div>
            <Switch 
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily Logging Reminder</p>
              <p className="text-sm text-muted-foreground">Reminder to log activities at end of day</p>
            </div>
            <Switch 
              checked={notifications.dailyReminder}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, dailyReminder: checked }))}
            />
          </div>
        </div>
      </Card>

      {/* Login History */}
      <Card className="p-6 opacity-0 animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Login Activity
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <LogIn className="w-5 h-5 text-success" />
            <div className="flex-1">
              <p className="font-medium">Current session</p>
              <p className="text-sm text-muted-foreground">Chrome on Windows</p>
            </div>
            <span className="text-sm text-muted-foreground">Just now</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <LogIn className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">Previous login</p>
              <p className="text-sm text-muted-foreground">Mobile Safari on iOS</p>
            </div>
            <span className="text-sm text-muted-foreground">Yesterday, 3:24 PM</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <LogIn className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">Earlier login</p>
              <p className="text-sm text-muted-foreground">Chrome on Windows</p>
            </div>
            <span className="text-sm text-muted-foreground">Dec 3, 9:15 AM</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total logins this month</span>
            <span className="font-semibold">24</span>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive/30 bg-destructive/5 opacity-0 animate-slide-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
        <h3 className="font-semibold text-lg mb-2 text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Irreversible actions - proceed with caution
        </p>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
            onClick={handleExportData}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export All Data
              </>
            )}
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
