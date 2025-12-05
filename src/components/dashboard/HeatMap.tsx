import { generateHeatmapData } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const data = generateHeatmapData();
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
                    title={`${item?.value || 0} kg CO2`}
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
