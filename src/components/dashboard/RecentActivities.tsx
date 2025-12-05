import { mockActivities } from '@/lib/mockData';
import { CATEGORY_ICONS } from '@/types/carbon';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function RecentActivities() {
  const sortedActivities = [...mockActivities]
    .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
    .slice(0, 5);

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
              {CATEGORY_ICONS[activity.category]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{activity.description}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(activity.datetime), 'MMM d, h:mm a')}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold">{activity.estimatedEmissionKgCo2.toFixed(1)} kg</p>
              <p className="text-xs text-muted-foreground capitalize">{activity.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
