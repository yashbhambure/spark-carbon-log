import { mockUser } from '@/lib/mockData';
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
  Calendar,
  Save
} from 'lucide-react';
import { format } from 'date-fns';

export default function Profile() {
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
            {mockUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-xl font-bold">{mockUser.name}</h2>
            <p className="text-muted-foreground">{mockUser.email}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Member since {format(new Date(mockUser.createdAt), 'MMMM yyyy')}
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input id="name" defaultValue={mockUser.name} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input id="email" type="email" defaultValue={mockUser.email} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timezone" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timezone
            </Label>
            <Input id="timezone" defaultValue={mockUser.timezone} disabled />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="target" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Weekly Target (kg CO₂)
            </Label>
            <Input id="target" type="number" defaultValue={mockUser.weeklyTarget} />
          </div>
        </div>

        <Button className="w-full mt-6" variant="hero">
          <Save className="w-4 h-4" />
          Save Changes
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
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive weekly reports via email</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily Logging Reminder</p>
              <p className="text-sm text-muted-foreground">Reminder to log activities at end of day</p>
            </div>
            <Switch defaultChecked />
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
          <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
            Export All Data
          </Button>
          <Button variant="destructive">
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
