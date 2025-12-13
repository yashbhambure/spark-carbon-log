import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Leaf, 
  BarChart3, 
  Sparkles, 
  Target, 
  TrendingDown, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function Index() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Tracking',
      description: 'Just describe your activity in natural language. Our AI classifies and estimates emissions instantly.',
    },
    {
      icon: BarChart3,
      title: 'Beautiful Visualizations',
      description: 'Track your progress with charts, heatmaps, and personalized insights that make data meaningful.',
    },
    {
      icon: Target,
      title: 'Set Weekly Goals',
      description: 'Define targets and get progress updates. Stay motivated with achievement badges and streaks.',
    },
    {
      icon: TrendingDown,
      title: 'Smart Recommendations',
      description: 'Receive personalized tips based on your habits to reduce your environmental impact.',
    },
  ];

  const benefits = [
    'Free for students',
    'No complex calculations',
    'Privacy-first design',
    'Export your data anytime',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
              <Leaf className="w-4 h-4" />
              <span className="text-sm font-medium">Student-friendly carbon tracking</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
              Track Your <span className="text-gradient">Carbon Footprint</span>
              <br />with AI Simplicity
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto opacity-0 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
              Describe your daily activities in plain English. Our AI automatically classifies, 
              calculates emissions, and gives you personalized tips to live greener.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
              <Link to="/auth">
                <Button variant="hero" size="xl" className="group">
                  Start Tracking Free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="lg">
                  View Demo Dashboard
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 opacity-0 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Go Green</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive suite of tools designed specifically for students who want to understand 
            and reduce their environmental impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title}
                className="glass-card rounded-xl p-6 opacity-0 animate-slide-up hover:scale-105 transition-transform"
                style={{ animationDelay: `${500 + index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="glass-card rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-primary opacity-5" />
          <div className="relative">
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of students tracking their carbon footprint. 
              It only takes 2 minutes to set up and start logging.
            </p>
            <Link to="/auth">
              <Button variant="hero" size="xl" className="group">
                Get Started — It's Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg gradient-primary">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold">CarbonTrack</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 CarbonTrack. Made with 💚 for the planet.
          </p>
        </div>
      </footer>
    </div>
  );
}
