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
import { Zap, TrendingDown, Target, Calendar, Download, Loader2, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as XLSX from 'xlsx';

export default function Dashboard() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();
  const { weeklySummary, activities, loading } = useCarbonEmissions();

  const firstName = profile?.name?.split(' ')[0] || 'there';

  const generateReportData = () => {
    // Create structured tabular data
    const reportRows = activities.map(a => ({
      Date: a.activity_date,
      Time: format(new Date(a.created_at), 'HH:mm'),
      'Activity Name': a.description,
      Category: a.category.charAt(0).toUpperCase() + a.category.slice(1),
      'Carbon Emissions (kg CO₂)': Number(a.emission_kg).toFixed(2),
    }));

    // Add summary row
    const summaryData = {
      'Report Generated': format(new Date(), 'yyyy-MM-dd HH:mm'),
      'User': profile?.name || 'User',
      'Period': 'This Week',
      'Total Emissions (kg CO₂)': weeklySummary.totalEmissionKg.toFixed(2),
      'Daily Average (kg CO₂)': weeklySummary.averageDailyEmissionKg.toFixed(2),
      'Weekly Target (kg CO₂)': profile?.weekly_target || 50,
      'Change vs Previous Week': `${weeklySummary.comparisonToPrevWeek >= 0 ? '+' : ''}${weeklySummary.comparisonToPrevWeek.toFixed(1)}%`,
      'Activities Logged': weeklySummary.activityCount,
    };

    return { reportRows, summaryData };
  };

  const handleDownloadCSV = async () => {
    setIsDownloading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { reportRows, summaryData } = generateReportData();
      
      // Build CSV content
      let csvContent = '';
      
      // Add summary section
      csvContent += 'CARBON FOOTPRINT REPORT SUMMARY\n';
      Object.entries(summaryData).forEach(([key, value]) => {
        csvContent += `${key},${value}\n`;
      });
      csvContent += '\n';
      
      // Add activities section
      if (reportRows.length > 0) {
        csvContent += 'ACTIVITY DETAILS\n';
        const headers = Object.keys(reportRows[0]);
        csvContent += headers.join(',') + '\n';
        
        reportRows.forEach(row => {
          const values = headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escape values containing commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          });
          csvContent += values.join(',') + '\n';
        });
      } else {
        csvContent += 'No activities logged this week.\n';
      }

      // Create and download CSV file
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `carbon_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Report downloaded successfully!",
        description: "Your carbon footprint report has been downloaded successfully in CSV format.",
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

  const handleDownloadExcel = async () => {
    setIsDownloading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { reportRows, summaryData } = generateReportData();
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Create summary sheet data
      const summarySheetData = [
        ['CARBON FOOTPRINT REPORT'],
        [],
        ...Object.entries(summaryData).map(([key, value]) => [key, value]),
      ];
      
      // Create activities sheet data
      const activitiesSheetData = reportRows.length > 0 
        ? [Object.keys(reportRows[0]), ...reportRows.map(row => Object.values(row))]
        : [['No activities logged this week.']];
      
      // Add Summary sheet
      const summaryWs = XLSX.utils.aoa_to_sheet(summarySheetData);
      summaryWs['!cols'] = [{ wch: 25 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
      
      // Add Carbon Report sheet with activities
      const activitiesWs = XLSX.utils.aoa_to_sheet(activitiesSheetData);
      activitiesWs['!cols'] = [
        { wch: 12 }, // Date
        { wch: 8 },  // Time
        { wch: 40 }, // Activity Name
        { wch: 15 }, // Category
        { wch: 22 }, // Carbon Emissions
      ];
      XLSX.utils.book_append_sheet(wb, activitiesWs, 'Carbon Report');

      // Generate and download Excel file
      XLSX.writeFile(wb, `carbon_report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);

      toast({
        title: "Report downloaded successfully!",
        description: "Your carbon footprint report has been downloaded successfully in Excel format.",
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="hero" 
              className="gap-2 opacity-0 animate-fade-in" 
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
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
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDownloadCSV} className="gap-2 cursor-pointer">
              <FileText className="w-4 h-4" />
              Download as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadExcel} className="gap-2 cursor-pointer">
              <FileSpreadsheet className="w-4 h-4" />
              Download as Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
