import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { useCarbonEmissions } from '@/hooks/useCarbonEmissions';
import { useAuth } from '@/hooks/useAuth';

export function WeeklyChart() {
  const { weeklySummary, loading } = useCarbonEmissions();
  const { profile } = useAuth();
  
  const data = weeklySummary.dailyData;
  const dailyTarget = (profile?.weekly_target || 50) / 7;

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-5 animate-pulse">
        <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Weekly Trend</h3>
          <p className="text-sm text-muted-foreground">Your carbon emissions this week</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-muted-foreground">Emissions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent/50 border-2 border-accent border-dashed"></div>
            <span className="text-muted-foreground">Target</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEmission" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
              unit=" kg"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ fontWeight: 600 }}
            />
            <ReferenceLine 
              y={dailyTarget} 
              stroke="hsl(var(--accent))" 
              strokeDasharray="5 5" 
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="emission"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="url(#colorEmission)"
            />
            <Line
              type="monotone"
              dataKey="emission"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
