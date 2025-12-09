import { cn } from '@/lib/utils';
import { useCarbonEmissions } from '@/hooks/useCarbonEmissions';
import { useAuth } from '@/hooks/useAuth';

export function ProgressBar() {
  const { weeklySummary, loading } = useCarbonEmissions();
  const { profile } = useAuth();

  const current = weeklySummary.totalEmissionKg;
  const target = profile?.weekly_target || 50;
  const percentage = Math.min((current / target) * 100, 100);
  const isOnTrack = current <= target;

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-5 animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-3"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg">Weekly Progress</h3>
          <p className="text-sm text-muted-foreground">
            {current === 0 
              ? '🌱 Start logging activities to track progress!' 
              : isOnTrack 
                ? '🎉 On track to meet your goal!' 
                : '⚠️ Consider reducing emissions'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold">{current.toFixed(1)}</span>
          <span className="text-muted-foreground">/{target} kg</span>
        </div>
      </div>
      
      <div className="relative h-4 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            current === 0 ? "bg-muted" : isOnTrack ? "gradient-success" : "bg-destructive"
          )}
          style={{ width: `${percentage}%` }}
        />
        <div 
          className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-slow"
        />
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>0 kg</span>
        <span className={cn(
          "font-medium",
          percentage >= 80 && percentage < 100 && "text-warning",
          percentage >= 100 && "text-destructive"
        )}>
          {percentage.toFixed(0)}% used
        </span>
        <span>{target} kg</span>
      </div>
    </div>
  );
}
