import { DailyScore } from '@/components/dashboard/DailyScore';
import { StatCard } from '@/components/dashboard/StatCard';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart';
import { ProgressBar } from '@/components/dashboard/ProgressBar';
import { HeatMap } from '@/components/dashboard/HeatMap';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { Recommendations } from '@/components/dashboard/Recommendations';
import { mockWeeklySummary, mockUser } from '@/lib/mockData';
import { Zap, TrendingDown, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="text-gradient">{mockUser.name.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your carbon footprint overview for this week
          </p>
        </div>
        <Button variant="hero" className="gap-2 opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <Download className="w-4 h-4" />
          Download Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DailyScore />
        <StatCard
          title="Weekly Total"
          value={mockWeeklySummary.totalEmissionKg.toFixed(1)}
          unit="kg CO₂"
          change={mockWeeklySummary.comparisonToPrevWeek}
          icon={<Calendar className="w-5 h-5" />}
          delay={100}
        />
        <StatCard
          title="Daily Average"
          value={mockWeeklySummary.averageDailyEmissionKg.toFixed(1)}
          unit="kg CO₂"
          change={-5.2}
          icon={<TrendingDown className="w-5 h-5" />}
          delay={150}
        />
        <StatCard
          title="Activities Logged"
          value={12}
          change={15}
          icon={<Zap className="w-5 h-5" />}
          delay={200}
        />
      </div>

      {/* Progress Bar */}
      <ProgressBar />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <WeeklyChart />
        </div>
        <CategoryPieChart />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentActivities />
        <Recommendations />
      </div>

      {/* Heatmap */}
      <HeatMap />
    </div>
  );
}
