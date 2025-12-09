import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useCarbonEmissions } from '@/hooks/useCarbonEmissions';
import { CATEGORY_ICONS } from '@/types/carbon';
import { Send, Sparkles, Clock, Copy, Loader2, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function LogActivity() {
  const [activity, setActivity] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<{ description: string; category: string; emission: number }[]>([]);
  
  const { logActivity, calculateEmission, activities } = useCarbonEmissions();

  // Get yesterday's activities for quick add
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const yesterdayActivities = activities.filter(a => a.activity_date === yesterdayStr);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity.trim()) return;

    setIsProcessing(true);
    
    // Calculate emission using AI classification
    const { category, emission } = calculateEmission(activity);
    
    // Log to database
    const { error } = await logActivity(activity, category, emission);
    
    if (!error) {
      setRecentlyAdded(prev => [...prev, { description: activity, category, emission }]);
    }
    
    setActivity('');
    setIsProcessing(false);
  };

  const useYesterdayActivity = async (act: typeof activities[0]) => {
    const { error } = await logActivity(act.description, act.category, Number(act.emission_kg));
    
    if (!error) {
      setRecentlyAdded(prev => [...prev, { 
        description: act.description, 
        category: act.category, 
        emission: Number(act.emission_kg) 
      }]);
      toast({
        title: "Activity cloned! ⚡",
        description: `"${act.description}" added for today`,
      });
    }
  };

  const suggestions = [
    "Drove 10km to work",
    "Had vegetarian lunch",
    "Took metro for 30 mins",
    "Used AC for 3 hours",
    "Ordered food delivery",
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
        <h1 className="text-3xl font-bold">Log Activity</h1>
        <p className="text-muted-foreground mt-1">
          Describe your activity in natural language — our AI will do the rest!
        </p>
      </div>

      {/* Main Input */}
      <Card className="p-6 opacity-0 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="e.g., Drove 15km to college in my petrol car, had a chicken burger for lunch..."
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="min-h-[120px] pr-12 resize-none text-base"
              disabled={isProcessing}
            />
            <div className="absolute bottom-3 right-3">
              <Sparkles className="w-5 h-5 text-primary/50" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion}
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setActivity(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            variant="hero"
            disabled={!activity.trim() || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                AI is analyzing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Log Activity
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Recently Added */}
      {recentlyAdded.length > 0 && (
        <Card className="p-4 bg-success/5 border-success/20 opacity-0 animate-scale-in" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-success" />
            <h3 className="font-semibold">Recently Added</h3>
          </div>
          <div className="space-y-2">
            {recentlyAdded.slice(-3).reverse().map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded bg-background/50">
                <span className="text-success">✓</span>
                <span className="text-lg">{CATEGORY_ICONS[item.category] || '📦'}</span>
                <span className="text-sm flex-1 truncate">{item.description}</span>
                <span className="text-sm text-muted-foreground">{item.emission.toFixed(1)} kg</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Use Yesterday's Activities */}
      {yesterdayActivities.length > 0 && (
        <Card className="p-4 opacity-0 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Use Yesterday's Activities</h3>
            <span className="text-xs text-muted-foreground">(Quick add)</span>
          </div>
          
          <div className="space-y-2">
            {yesterdayActivities.map((act) => (
              <div 
                key={act.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
              >
                <span className="text-xl">{CATEGORY_ICONS[act.category] || '📦'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{act.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {Number(act.emission_kg).toFixed(1)} kg CO₂
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => useYesterdayActivity(act)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="w-4 h-4" />
                  Use
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* How it works */}
      <Card className="p-4 bg-primary/5 border-primary/20 opacity-0 animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          How AI Classification Works
        </h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Write naturally — "drove to work", "ate pizza for dinner"</li>
          <li>• AI identifies the category, estimates emissions, and logs it</li>
          <li>• Transport activities auto-detect distance, mode, and fuel type</li>
          <li>• You can always edit classified activities in History</li>
        </ul>
      </Card>
    </div>
  );
}
