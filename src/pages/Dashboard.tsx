import { useState } from 'react';
import { DailyScore } from '@/components/dashboard/DailyScore';
import { StatCard } from '@/components/dashboard/StatCard';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart';
import { ProgressBar } from '@/components/dashboard/ProgressBar';
import { HeatMap } from '@/components/dashboard/HeatMap';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { Recommendations } from '@/components/dashboard/Recommendations';
import { useAuth } from '@/hooks/useAuth';
import { useCarbonEmissions } from '@/hooks/useCarbonEmissions';
import { Zap, TrendingDown, Target, Calendar, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function Dashboard() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();
  const { weeklySummary, activities, loading } = useCarbonEmissions();

  const firstName = profile?.name?.split(' ')[0] || 'there';

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate report data
      const reportData = {
        generatedAt: new Date().toISOString(),
        user: profile?.name || 'User',
        period: 'This Week',
        summary: {
          totalEmissions: mockWeeklySummary.totalEmissionKg,
          averageDaily: mockWeeklySummary.averageDailyEmissionKg,
          weeklyTarget: profile?.weekly_target || 50,
          comparisonToPrevWeek: mockWeeklySummary.comparisonToPrevWeek,
        },
        activities: mockActivities.map(a => ({
          date: format(new Date(a.datetime), 'yyyy-MM-dd'),
          time: format(new Date(a.datetime), 'HH:mm'),
          description: a.description,
          category: a.category,
          emissionKg: a.estimatedEmissionKgCo2,
        })),
        recommendations: mockWeeklySummary.recommendations,
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `carbon-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Report downloaded! 📊",
        description: "Your weekly carbon report has been saved.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="text-gradient">{firstName}</span>! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your carbon footprint overview for this week
          </p>
        </div>
        <Button 
          variant="hero" 
          className="gap-2 opacity-0 animate-fade-in" 
          style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          onClick={handleDownloadReport}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download Report
            </>
          )}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DailyScore />
        <StatCard
          title="Weekly Total"
          value={weeklySummary.totalEmissionKg.toFixed(1)}
          unit="kg CO₂"
          change={weeklySummary.comparisonToPrevWeek}
          icon={<Calendar className="w-5 h-5" />}
          delay={100}
          loading={loading}
        />
        <StatCard
          title="Daily Average"
          value={weeklySummary.averageDailyEmissionKg.toFixed(1)}
          unit="kg CO₂"
          icon={<TrendingDown className="w-5 h-5" />}
          delay={150}
          loading={loading}
        />
        <StatCard
          title="Activities Logged"
          value={weeklySummary.activityCount}
          icon={<Zap className="w-5 h-5" />}
          delay={200}
          loading={loading}
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
