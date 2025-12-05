import { useState } from 'react';
import { mockActivities } from '@/lib/mockData';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '@/types/carbon';
import { format, subDays, isWithinInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, Filter, Download, Pencil, Trash2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function History() {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['transport', 'food', 'energy', 'waste', 'shopping', 'other'];

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedByDate = filteredActivities.reduce((acc, activity) => {
    const date = format(new Date(activity.datetime), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, typeof mockActivities>);

  const totalEmissions = filteredActivities.reduce((sum, a) => sum + a.estimatedEmissionKgCo2, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
          <h1 className="text-3xl font-bold">Activity History</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your logged activities
          </p>
        </div>
        <Button variant="secondary" className="gap-2 opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 opacity-0 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="gap-1"
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                <span className="capitalize hidden sm:inline">{cat}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Summary */}
      <div className="flex items-center gap-4 text-sm opacity-0 animate-fade-in" style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
        <span className="text-muted-foreground">
          Showing <strong className="text-foreground">{filteredActivities.length}</strong> activities
        </span>
        <span className="text-muted-foreground">•</span>
        <span className="text-muted-foreground">
          Total: <strong className="text-foreground">{totalEmissions.toFixed(1)} kg CO₂</strong>
        </span>
      </div>

      {/* Activity List */}
      <div className="space-y-6">
        {Object.entries(groupedByDate)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
          .map(([date, activities], groupIndex) => (
            <div 
              key={date}
              className="opacity-0 animate-slide-up"
              style={{ animationDelay: `${200 + groupIndex * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">
                  {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                </h3>
                <span className="text-sm text-muted-foreground">
                  ({activities.reduce((sum, a) => sum + a.estimatedEmissionKgCo2, 0).toFixed(1)} kg)
                </span>
              </div>
              
              <div className="space-y-2">
                {activities.map((activity, index) => (
                  <Card 
                    key={activity.id}
                    className="p-4 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${CATEGORY_COLORS[activity.category]}20` }}
                      >
                        {CATEGORY_ICONS[activity.category]}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span className="capitalize">{activity.category}</span>
                          <span>•</span>
                          <span>{format(new Date(activity.datetime), 'h:mm a')}</span>
                          {activity.source === 'gemini' && (
                            <>
                              <span>•</span>
                              <span className="text-primary">AI classified</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-lg">{activity.estimatedEmissionKgCo2.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">kg CO₂</p>
                      </div>
                      
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
          <p className="text-muted-foreground">No activities found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
