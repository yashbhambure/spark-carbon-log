import { useState } from 'react';
import { mockWeeklySummary } from '@/lib/mockData';
import { Lightbulb, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const additionalTips = [
  "Consider meal prepping to reduce food waste and energy used for multiple cooking sessions.",
  "Use public transit or carpool at least twice a week to cut transport emissions by 30%.",
  "Switch to LED bulbs throughout your home - they use 75% less energy than incandescent.",
  "Buy local produce to reduce the carbon footprint from food transportation.",
  "Unplug electronics when not in use - standby power can account for 10% of household energy.",
  "Use a reusable water bottle and coffee cup to eliminate single-use plastic waste.",
];

export function Recommendations() {
  const [tips, setTips] = useState(mockWeeklySummary.recommendations);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const { toast } = useToast();

  const handleLoadMoreTips = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Add more tips
    const newTips = additionalTips.slice(0, 3);
    setTips(prev => [...prev, ...newTips]);
    setHasLoadedMore(true);
    setIsLoading(false);
    
    toast({
      title: "New tips loaded! 🌱",
      description: "Here are 3 more AI-generated recommendations for you.",
    });
  };

  return (
    <div className="glass-card rounded-xl p-5 opacity-0 animate-slide-up" style={{ animationDelay: '450ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg gradient-accent">
          <Lightbulb className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">AI Recommendations</h3>
          <p className="text-sm text-muted-foreground">Personalized tips to reduce your footprint</p>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {tips.map((rec, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20 animate-fade-in"
          >
            <span className="text-accent font-bold">#{index + 1}</span>
            <p className="text-sm flex-1">{rec}</p>
          </div>
        ))}
      </div>

      <Button 
        variant="ghost" 
        className="w-full mt-4 group"
        onClick={handleLoadMoreTips}
        disabled={isLoading || hasLoadedMore}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating tips...
          </>
        ) : hasLoadedMore ? (
          "All tips loaded ✓"
        ) : (
          <>
            See more tips
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </div>
  );
}
