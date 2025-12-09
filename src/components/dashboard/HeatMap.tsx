import { useCarbonEmissions } from '@/hooks/useCarbonEmissions';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getColor(value: number) {
  if (value === 0) return 'bg-muted';
  if (value < 3) return 'bg-success/30';
  if (value < 5) return 'bg-success/50';
  if (value < 7) return 'bg-warning/50';
  if (value < 9) return 'bg-warning/70';
  return 'bg-destructive/70';
}

export function HeatMap() {
  const { activities, weeklyHistory, loading } = useCarbonEmissions();

  // Generate heatmap data from activities and history
  const data = useMemo(() => {
    const heatmapData = [];
    
    // Create a map of date -> emission total
    const emissionsByDate: Record<string, number> = {};
    
    // Add from weekly history
    weeklyHistory.forEach(h => {
      emissionsByDate[h.date] = Number(h.total_emission_kg);
    });
    
    // Add from current week activities
    activities.forEach(a => {
      if (!emissionsByDate[a.activity_date]) {
        emissionsByDate[a.activity_date] = 0;
      }
      emissionsByDate[a.activity_date] += Number(a.emission_kg);
    });
    
    // Generate 12 weeks of data
    for (let week = 0; week < 12; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date();
        date.setDate(date.getDate() - ((11 - week) * 7 + (6 - day)));
        const dateStr = date.toISOString().split('T')[0];
        
        heatmapData.push({
          week,
          day,
          value: Math.round((emissionsByDate[dateStr] || 0) * 10) / 10,
          date: dateStr,
        });
      }
    }
    
    return heatmapData;
  }, [activities, weeklyHistory]);

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-5 animate-pulse">
        <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
        <div className="h-32 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">Activity Heatmap</h3>
          <p className="text-sm text-muted-foreground">Last 12 weeks of emissions</p>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-muted-foreground">Less</span>
          <div className="w-3 h-3 rounded-sm bg-success/30"></div>
          <div className="w-3 h-3 rounded-sm bg-success/50"></div>
          <div className="w-3 h-3 rounded-sm bg-warning/50"></div>
          <div className="w-3 h-3 rounded-sm bg-warning/70"></div>
          <div className="w-3 h-3 rounded-sm bg-destructive/70"></div>
          <span className="text-muted-foreground">More</span>
        </div>
      </div>

      <div className="flex gap-1">
        <div className="flex flex-col gap-1 text-xs text-muted-foreground mr-2">
          {days.map(day => (
            <div key={day} className="h-4 flex items-center">{day}</div>
          ))}
        </div>
        
        <div className="flex gap-1 overflow-x-auto pb-2">
          {Array.from({ length: 12 }, (_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {days.map((day, dayIndex) => {
                const item = data.find(d => d.week === weekIndex && d.day === dayIndex);
                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={cn(
                      "w-4 h-4 rounded-sm transition-all hover:scale-125 cursor-pointer",
                      getColor(item?.value || 0)
                    )}
                    title={`${item?.date}: ${item?.value || 0} kg CO₂`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
