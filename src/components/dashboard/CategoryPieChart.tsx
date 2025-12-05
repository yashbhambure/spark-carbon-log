import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { mockWeeklySummary } from '@/lib/mockData';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/types/carbon';

const data = mockWeeklySummary.topActivities.map(activity => ({
  name: activity.category,
  value: activity.totalEmission,
  percentage: activity.percentage,
  icon: CATEGORY_ICONS[activity.category],
}));

const COLORS = Object.values(CATEGORY_COLORS);

export function CategoryPieChart() {
  return (
    <div className="glass-card rounded-xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
      <h3 className="font-semibold text-lg mb-4">Emissions by Category</h3>
      
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CATEGORY_COLORS[entry.name] || COLORS[index % COLORS.length]}
                  strokeWidth={0}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => [`${value.toFixed(1)} kg`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: CATEGORY_COLORS[item.name] || COLORS[index] }}
            />
            <span className="text-lg">{item.icon}</span>
            <span className="capitalize truncate">{item.name}</span>
            <span className="text-muted-foreground ml-auto">{item.percentage.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
