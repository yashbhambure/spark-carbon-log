import { useCarbonEmissions } from '@/hooks/useCarbonEmissions';
import { CATEGORY_ICONS } from '@/types/carbon';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function RecentActivities() {
  const { activities, loading } = useCarbonEmissions();
  
  const sortedActivities = [...activities]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-5 animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (sortedActivities.length === 0) {
    return (
      <div className="glass-card rounded-xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
        <h3 className="font-semibold text-lg mb-4">Recent Activities</h3>
        
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <p className="text-4xl mb-2">📝</p>
          <p className="text-sm">No activities logged yet</p>
          <p className="text-xs">Start by logging your first activity!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
      <h3 className="font-semibold text-lg mb-4">Recent Activities</h3>
      
      <div className="space-y-3">
        {sortedActivities.map((activity, index) => (
          <div 
            key={activity.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer",
              "opacity-0 animate-slide-in-right"
            )}
            style={{ animationDelay: `${400 + index * 100}ms`, animationFillMode: 'forwards' }}
          >
            <div className="text-2xl flex-shrink-0">
              {CATEGORY_ICONS[activity.category] || '📦'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{activity.description}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(activity.created_at), 'MMM d, h:mm a')}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold">{Number(activity.emission_kg).toFixed(1)} kg</p>
              <p className="text-xs text-muted-foreground capitalize">{activity.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
