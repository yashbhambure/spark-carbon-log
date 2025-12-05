import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: isLogin ? "Welcome back! 🌱" : "Account created! 🎉",
      description: isLogin ? "Redirecting to dashboard..." : "Let's start tracking your carbon footprint!",
    });
    
    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <Card className="w-full max-w-md p-8 glass-card opacity-0 animate-scale-in" style={{ animationFillMode: 'forwards' }}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 animate-bounce-subtle">
            <Leaf className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">
            {isLogin ? 'Welcome Back!' : 'Join CarbonTrack'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isLogin 
              ? 'Sign in to continue tracking your footprint' 
              : 'Start your journey to a greener lifestyle'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid gap-2 opacity-0 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input 
                id="name" 
                placeholder="Alex Chen" 
                required={!isLogin}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@university.edu" 
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              required
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <Button variant="link" className="px-0 h-auto text-sm">
                Forgot password?
              </Button>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            variant="hero"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <Button 
              variant="link" 
              className="px-1 h-auto"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Button>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            <br />
            🌱 Track your carbon footprint, one activity at a time.
          </p>
        </div>
      </Card>
    </div>
  );
}
