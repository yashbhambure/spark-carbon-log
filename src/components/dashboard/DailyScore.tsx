import { useCarbonEmissions } from '@/hooks/useCarbonEmissions';
import { cn } from '@/lib/utils';
import { Leaf } from 'lucide-react';

export function DailyScore() {
  const { dailySummary, loading } = useCarbonEmissions();
  
  const score = dailySummary.totalEmission;
  const maxScore = 10;
  const percentage = (score / maxScore) * 100;
  
  const getScoreLevel = () => {
    if (score === 0) return { label: 'No emissions', color: 'text-success', bgColor: 'bg-success/20', emoji: '🌟' };
    if (score < 4) return { label: 'Excellent', color: 'text-success', bgColor: 'bg-success/20', emoji: '🌟' };
    if (score < 6) return { label: 'Good', color: 'text-success', bgColor: 'bg-success/10', emoji: '👍' };
    if (score < 8) return { label: 'Average', color: 'text-warning', bgColor: 'bg-warning/10', emoji: '💪' };
    return { label: 'High', color: 'text-destructive', bgColor: 'bg-destructive/10', emoji: '⚠️' };
  };

  const level = getScoreLevel();

  const getTip = () => {
    if (score === 0) return 'Start logging your activities to track your carbon footprint!';
    if (score < 4) return 'Great job keeping emissions low today! Keep up the good work.';
    if (score < 6) return 'Good progress! Consider using public transport for even lower emissions.';
    if (score < 8) return 'Try reducing car usage or opting for plant-based meals.';
    return 'High emissions today. Consider carpooling or reducing energy usage.';
  };

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
        <div className="h-12 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div 
      className="glass-card rounded-xl p-6 opacity-0 animate-slide-up relative overflow-hidden"
      style={{ animationDelay: '50ms', animationFillMode: 'forwards' }}
    >
      <div className="absolute -right-4 -top-4 opacity-10">
        <Leaf className="w-32 h-32 text-primary" />
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Today's Score</p>
          <p className={cn("text-sm font-semibold", level.color)}>
            {level.emoji} {level.label}
          </p>
        </div>
        <div className={cn("px-3 py-1 rounded-full text-xs font-semibold", level.bgColor, level.color)}>
          {dailySummary.activityCount} activities
        </div>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-5xl font-bold counter-number text-gradient">{score.toFixed(1)}</span>
        <span className="text-xl text-muted-foreground mb-1">kg CO₂</span>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground">{getTip()}</p>
      </div>
    </div>
  );
}
