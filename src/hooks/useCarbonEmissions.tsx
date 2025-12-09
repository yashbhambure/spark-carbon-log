import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

// Emission factors in kg CO2 per unit
const EMISSION_FACTORS = {
  transport: {
    car_petrol: 0.21, // per km
    car_diesel: 0.27,
    car_electric: 0.05,
    motorcycle: 0.12,
    bus: 0.089,
    train: 0.041,
    flight: 0.255,
    walk: 0,
    bike: 0,
  },
  food: {
    beef: 27, // per meal
    chicken: 6.9,
    vegetarian: 2.0,
    vegan: 1.5,
    fish: 6.1,
    default: 4.0,
  },
  energy: {
    electricity: 0.5, // per hour of AC/heating
    gas: 0.2,
    default: 0.4,
  },
  shopping: {
    clothing: 10,
    electronics: 50,
    default: 5,
  },
  waste: {
    default: 0.5,
  },
  other: {
    default: 1.0,
  },
};

interface Activity {
  id: string;
  user_id: string;
  description: string;
  category: string;
  emission_kg: number;
  created_at: string;
  activity_date: string;
}

interface DailyHistory {
  id: string;
  user_id: string;
  date: string;
  total_emission_kg: number;
  activity_count: number;
}

interface DailySummary {
  date: string;
  totalEmission: number;
  activityCount: number;
  activities: Activity[];
}

interface WeeklySummary {
  totalEmissionKg: number;
  averageDailyEmissionKg: number;
  activityCount: number;
  categoryBreakdown: { category: string; totalEmission: number; percentage: number }[];
  comparisonToPrevWeek: number;
  dailyData: { day: string; emission: number; date: string }[];
}

interface CarbonContextType {
  activities: Activity[];
  todayActivities: Activity[];
  dailySummary: DailySummary;
  weeklySummary: WeeklySummary;
  weeklyHistory: DailyHistory[];
  loading: boolean;
  logActivity: (description: string, category: string, emissionKg: number) => Promise<{ error: Error | null }>;
  deleteActivity: (id: string) => Promise<{ error: Error | null }>;
  refreshData: () => Promise<void>;
  calculateEmission: (description: string) => { category: string; emission: number };
}

const CarbonContext = createContext<CarbonContextType | undefined>(undefined);

export function CarbonProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [weeklyHistory, setWeeklyHistory] = useState<DailyHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  // Calculate emission based on description using keyword matching
  const calculateEmission = useCallback((description: string): { category: string; emission: number } => {
    const desc = description.toLowerCase();
    
    // Transport detection with distance extraction
    const distanceMatch = desc.match(/(\d+)\s*km/);
    const distance = distanceMatch ? parseFloat(distanceMatch[1]) : 10;
    const hoursMatch = desc.match(/(\d+)\s*hour/);
    const hours = hoursMatch ? parseFloat(hoursMatch[1]) : 1;

    if (desc.includes('drove') || desc.includes('car') || desc.includes('drive')) {
      if (desc.includes('electric')) {
        return { category: 'transport', emission: distance * EMISSION_FACTORS.transport.car_electric };
      }
      if (desc.includes('diesel')) {
        return { category: 'transport', emission: distance * EMISSION_FACTORS.transport.car_diesel };
      }
      return { category: 'transport', emission: distance * EMISSION_FACTORS.transport.car_petrol };
    }
    if (desc.includes('motorcycle') || desc.includes('bike') || desc.includes('scooter')) {
      if (desc.includes('cycle') || desc.includes('bicycle')) {
        return { category: 'transport', emission: 0 };
      }
      return { category: 'transport', emission: distance * EMISSION_FACTORS.transport.motorcycle };
    }
    if (desc.includes('bus')) {
      return { category: 'transport', emission: distance * EMISSION_FACTORS.transport.bus };
    }
    if (desc.includes('train') || desc.includes('metro') || desc.includes('subway')) {
      return { category: 'transport', emission: distance * EMISSION_FACTORS.transport.train };
    }
    if (desc.includes('flight') || desc.includes('flew') || desc.includes('plane')) {
      return { category: 'transport', emission: distance * EMISSION_FACTORS.transport.flight };
    }
    if (desc.includes('walk') || desc.includes('walked')) {
      return { category: 'transport', emission: 0 };
    }

    // Food detection
    if (desc.includes('beef') || desc.includes('steak') || desc.includes('burger')) {
      return { category: 'food', emission: EMISSION_FACTORS.food.beef };
    }
    if (desc.includes('chicken')) {
      return { category: 'food', emission: EMISSION_FACTORS.food.chicken };
    }
    if (desc.includes('vegetarian') || desc.includes('veggie') || desc.includes('salad')) {
      return { category: 'food', emission: EMISSION_FACTORS.food.vegetarian };
    }
    if (desc.includes('vegan')) {
      return { category: 'food', emission: EMISSION_FACTORS.food.vegan };
    }
    if (desc.includes('fish') || desc.includes('seafood')) {
      return { category: 'food', emission: EMISSION_FACTORS.food.fish };
    }
    if (desc.includes('lunch') || desc.includes('dinner') || desc.includes('breakfast') || 
        desc.includes('meal') || desc.includes('ate') || desc.includes('food') || desc.includes('pizza')) {
      return { category: 'food', emission: EMISSION_FACTORS.food.default };
    }

    // Energy detection
    if (desc.includes('ac') || desc.includes('air condition') || desc.includes('heating') || 
        desc.includes('electricity') || desc.includes('power')) {
      return { category: 'energy', emission: hours * EMISSION_FACTORS.energy.electricity };
    }

    // Shopping detection
    if (desc.includes('bought') || desc.includes('shopping') || desc.includes('purchased')) {
      if (desc.includes('cloth') || desc.includes('shirt') || desc.includes('pants') || desc.includes('dress')) {
        return { category: 'shopping', emission: EMISSION_FACTORS.shopping.clothing };
      }
      if (desc.includes('electronic') || desc.includes('phone') || desc.includes('laptop') || desc.includes('computer')) {
        return { category: 'shopping', emission: EMISSION_FACTORS.shopping.electronics };
      }
      return { category: 'shopping', emission: EMISSION_FACTORS.shopping.default };
    }

    // Default
    return { category: 'other', emission: EMISSION_FACTORS.other.default };
  }, []);

  // Fetch all activities for the user
  const fetchActivities = useCallback(async () => {
    if (!user) return;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .gte('activity_date', oneWeekAgo.toISOString().split('T')[0])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching activities:', error);
    } else {
      setActivities(data || []);
    }
  }, [user]);

  // Fetch weekly history
  const fetchWeeklyHistory = useCallback(async () => {
    if (!user) return;

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const { data, error } = await supabase
      .from('daily_history')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', twoWeeksAgo.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching weekly history:', error);
    } else {
      setWeeklyHistory(data || []);
    }
  }, [user]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchActivities(), fetchWeeklyHistory()]);
    setLoading(false);
  }, [fetchActivities, fetchWeeklyHistory]);

  // Log a new activity
  const logActivity = async (description: string, category: string, emissionKg: number) => {
    if (!user) {
      return { error: new Error('Not authenticated') };
    }

    const { error } = await supabase
      .from('activities')
      .insert({
        user_id: user.id,
        description,
        category,
        emission_kg: emissionKg,
        activity_date: today,
      });

    if (error) {
      return { error: new Error(error.message) };
    }

    await refreshData();
    
    toast({
      title: "Your carbon emissions have been updated. 🌱",
      description: `Added ${emissionKg.toFixed(1)} kg CO₂ for ${category}`,
    });

    return { error: null };
  };

  // Delete an activity
  const deleteActivity = async (id: string) => {
    if (!user) {
      return { error: new Error('Not authenticated') };
    }

    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { error: new Error(error.message) };
    }

    await refreshData();
    return { error: null };
  };

  // Set up realtime subscription
  useEffect(() => {
    if (!user) {
      setActivities([]);
      setWeeklyHistory([]);
      setLoading(false);
      return;
    }

    refreshData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('activities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          refreshData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refreshData]);

  // Compute today's activities
  const todayActivities = activities.filter(a => a.activity_date === today);

  // Compute daily summary
  const dailySummary: DailySummary = {
    date: today,
    totalEmission: todayActivities.reduce((sum, a) => sum + Number(a.emission_kg), 0),
    activityCount: todayActivities.length,
    activities: todayActivities,
  };

  // Compute weekly summary
  const weeklySummary: WeeklySummary = (() => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    
    const thisWeekActivities = activities.filter(a => {
      const actDate = new Date(a.activity_date);
      return actDate >= weekStart;
    });

    const totalEmissionKg = thisWeekActivities.reduce((sum, a) => sum + Number(a.emission_kg), 0);
    const activityCount = thisWeekActivities.length;

    // Category breakdown
    const categoryTotals: Record<string, number> = {};
    thisWeekActivities.forEach(a => {
      categoryTotals[a.category] = (categoryTotals[a.category] || 0) + Number(a.emission_kg);
    });

    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([category, totalEmission]) => ({
        category,
        totalEmission,
        percentage: totalEmissionKg > 0 ? (totalEmission / totalEmissionKg) * 100 : 0,
      }))
      .sort((a, b) => b.totalEmission - a.totalEmission);

    // Daily data for chart
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dailyData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayActivities = activities.filter(a => a.activity_date === dateStr);
      const emission = dayActivities.reduce((sum, a) => sum + Number(a.emission_kg), 0);
      
      dailyData.push({
        day: days[date.getDay() === 0 ? 6 : date.getDay() - 1],
        emission: Math.round(emission * 10) / 10,
        date: dateStr,
      });
    }

    // Comparison to previous week from history
    const prevWeekTotal = weeklyHistory
      .filter(h => {
        const histDate = new Date(h.date);
        const prevWeekStart = new Date();
        prevWeekStart.setDate(prevWeekStart.getDate() - 13);
        const prevWeekEnd = new Date();
        prevWeekEnd.setDate(prevWeekEnd.getDate() - 7);
        return histDate >= prevWeekStart && histDate < prevWeekEnd;
      })
      .reduce((sum, h) => sum + Number(h.total_emission_kg), 0);

    const comparisonToPrevWeek = prevWeekTotal > 0 
      ? ((totalEmissionKg - prevWeekTotal) / prevWeekTotal) * 100 
      : 0;

    return {
      totalEmissionKg,
      averageDailyEmissionKg: totalEmissionKg / 7,
      activityCount,
      categoryBreakdown,
      comparisonToPrevWeek,
      dailyData,
    };
  })();

  return (
    <CarbonContext.Provider value={{
      activities,
      todayActivities,
      dailySummary,
      weeklySummary,
      weeklyHistory,
      loading,
      logActivity,
      deleteActivity,
      refreshData,
      calculateEmission,
    }}>
      {children}
    </CarbonContext.Provider>
  );
}

export function useCarbonEmissions() {
  const context = useContext(CarbonContext);
  if (context === undefined) {
    throw new Error('useCarbonEmissions must be used within a CarbonProvider');
  }
  return context;
}
