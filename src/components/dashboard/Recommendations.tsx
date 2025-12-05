import { mockWeeklySummary } from '@/lib/mockData';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Recommendations() {
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

      <div className="space-y-3">
        {mockWeeklySummary.recommendations.map((rec, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20"
          >
            <span className="text-accent font-bold">#{index + 1}</span>
            <p className="text-sm flex-1">{rec}</p>
          </div>
        ))}
      </div>

      <Button variant="ghost" className="w-full mt-4 group">
        See more tips
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
}
