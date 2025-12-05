import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
  delay?: number;
}

export function StatCard({ title, value, unit, change, icon, className, delay = 0 }: StatCardProps) {
  const getChangeColor = () => {
    if (change === undefined || change === 0) return 'text-muted-foreground';
    return change < 0 ? 'text-success' : 'text-destructive';
  };

  const getChangeIcon = () => {
    if (change === undefined || change === 0) return <Minus className="w-3 h-3" />;
    return change < 0 ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />;
  };

  const getEmoji = () => {
    if (change === undefined) return null;
    if (change < -5) return '🟢';
    if (change > 5) return '🔴';
    return '🟡';
  };

  return (
    <div 
      className={cn(
        "glass-card rounded-xl p-5 opacity-0 animate-slide-up",
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold counter-number">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
      
      {change !== undefined && (
        <div className={cn("flex items-center gap-1 mt-3 text-sm font-medium", getChangeColor())}>
          <span className="flex items-center gap-0.5">
            {getChangeIcon()}
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-muted-foreground">vs last week</span>
          <span className="ml-auto text-lg">{getEmoji()}</span>
        </div>
      )}
    </div>
  );
}
