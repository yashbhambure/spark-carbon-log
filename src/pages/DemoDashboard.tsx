import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertCircle, Leaf, TrendingDown, TrendingUp, Zap, Car, Utensils, Plug } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockWeeklySummary, mockActivities, generateWeeklyData, generateHeatmapData } from '@/lib/mockData';
import { toast } from 'sonner';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, ReferenceLine, Legend
} from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--muted))'];

const categoryIcons: Record<string, React.ElementType> = {
  transport: Car,
  food: Utensils,
  energy: Plug,
  other: Zap,
};

export default function DemoDashboard() {
  const weeklyData = generateWeeklyData();
  const todayEmissions = 5.0;
  const weeklyTarget = 50;
  const weeklyTotal = mockWeeklySummary.totalEmissionKg;
  const percentChange = mockWeeklySummary.comparisonToPrevWeek;

  const handleRestrictedAction = () => {
    toast.info('This feature is available after signing up.');
  };

  const pieData = mockWeeklySummary.topActivities.map(a => ({
    name: a.category.charAt(0).toUpperCase() + a.category.slice(1),
    value: a.totalEmission,
    percentage: a.percentage,
  }));

  const getEmissionStatus = (value: number) => {
    if (value <= 5) return { emoji: '🟢', label: 'Great', color: 'text-success' };
    if (value <= 8) return { emoji: '🟡', label: 'Average', color: 'text-warning' };
    return { emoji: '🔴', label: 'High', color: 'text-destructive' };
  };

  const status = getEmissionStatus(todayEmissions);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg gradient-primary">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">CarbonTrack</span>
          </div>
          <Link to="/auth">
            <Button variant="hero" size="sm">
              Start Tracking Free
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Demo Banner */}
        <Alert className="border-primary/50 bg-primary/10">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-foreground">
            <strong>Demo Dashboard – Sample Data Only</strong>
            <span className="ml-2 text-muted-foreground">
              This is a preview with sample data. Sign up to track your real carbon footprint!
            </span>
          </AlertDescription>
        </Alert>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Emissions</p>
                  <p className="text-3xl font-bold">{todayEmissions.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">kg CO₂</p>
                </div>
                <div className="text-4xl">{status.emoji}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Total</p>
                  <p className="text-3xl font-bold">{weeklyTotal.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">of {weeklyTarget} kg target</p>
                </div>
                <div className={`flex items-center gap-1 ${percentChange < 0 ? 'text-success' : 'text-destructive'}`}>
                  {percentChange < 0 ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                  <span className="font-semibold">{percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div>
                <p className="text-sm text-muted-foreground">Daily Average</p>
                <p className="text-3xl font-bold">{mockWeeklySummary.averageDailyEmissionKg.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">kg CO₂ per day</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div>
                <p className="text-sm text-muted-foreground">Target Progress</p>
                <div className="mt-2">
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full gradient-primary transition-all duration-500"
                      style={{ width: `${Math.min((weeklyTotal / weeklyTarget) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((weeklyTotal / weeklyTarget) * 100).toFixed(0)}% of weekly target
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly Chart */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Weekly Emissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="emission" fill="hsl(var(--primary))" name="Emissions (kg)" radius={[4, 4, 0, 0]} />
                    <ReferenceLine y={7} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Emissions by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center">
                <div className="w-1/2">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-2">
                  {pieData.map((item, index) => {
                    const Icon = categoryIcons[item.name.toLowerCase()] || Zap;
                    return (
                      <div key={item.name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{item.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{item.percentage.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities & Recommendations */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Activities</CardTitle>
              <Button variant="outline" size="sm" onClick={handleRestrictedAction}>
                Add Activity
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockActivities.slice(0, 4).map((activity) => {
                  const Icon = categoryIcons[activity.category] || Zap;
                  return (
                    <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.description}</p>
                        <p className="text-xs text-muted-foreground capitalize">{activity.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{activity.estimatedEmissionKgCo2.toFixed(1)} kg</p>
                        <p className="text-xs text-muted-foreground">CO₂</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockWeeklySummary.recommendations.map((rec, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                    <div className="p-1.5 rounded-full bg-success/20 h-fit">
                      <Leaf className="w-3 h-3 text-success" />
                    </div>
                    <p className="text-sm text-foreground">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="glass-card border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to Track Your Real Footprint?</h2>
            <p className="text-muted-foreground mb-6">
              Sign up now to start logging your activities and get personalized AI recommendations.
            </p>
            <Link to="/auth">
              <Button variant="hero" size="lg">
                Start Tracking Free
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
