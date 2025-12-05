import { ActivityEntry, WeeklySummary, DailySummary, User } from '@/types/carbon';

export const mockUser: User = {
  id: '1',
  name: 'Alex Chen',
  email: 'alex@university.edu',
  createdAt: '2024-01-15',
  lastLoginAt: new Date().toISOString(),
  timezone: 'Asia/Kolkata',
  weeklyTarget: 50,
};

export const mockActivities: ActivityEntry[] = [
  {
    id: '1',
    userId: '1',
    datetime: new Date().toISOString(),
    category: 'transport',
    subcategory: 'car',
    description: 'Drove 15km to college in petrol car',
    estimatedEmissionKgCo2: 3.2,
    source: 'gemini',
    createdAt: new Date().toISOString(),
    transportDetails: {
      mode: 'car',
      distanceKm: 15,
      fuelType: 'petrol',
      passengersCount: 1,
    },
  },
  {
    id: '2',
    userId: '1',
    datetime: new Date().toISOString(),
    category: 'food',
    subcategory: 'meal',
    description: 'Had a chicken sandwich for lunch',
    estimatedEmissionKgCo2: 1.8,
    source: 'gemini',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: '1',
    datetime: new Date(Date.now() - 86400000).toISOString(),
    category: 'energy',
    subcategory: 'electricity',
    description: 'Used AC for 4 hours',
    estimatedEmissionKgCo2: 2.4,
    source: 'gemini',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '4',
    userId: '1',
    datetime: new Date(Date.now() - 86400000).toISOString(),
    category: 'transport',
    subcategory: 'bus',
    description: 'Took bus to market and back',
    estimatedEmissionKgCo2: 0.8,
    source: 'gemini',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    transportDetails: {
      mode: 'bus',
      distanceKm: 10,
    },
  },
];

export const generateWeeklyData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, index) => ({
    day,
    emission: Math.round((3 + Math.random() * 8) * 10) / 10,
    target: 7,
  }));
};

export const mockWeeklySummary: WeeklySummary = {
  id: '1',
  userId: '1',
  weekStartDate: '2024-12-02',
  weekEndDate: '2024-12-08',
  totalEmissionKg: 42.5,
  averageDailyEmissionKg: 6.1,
  topActivities: [
    { category: 'transport', totalEmission: 18.5, percentage: 43.5 },
    { category: 'food', totalEmission: 12.2, percentage: 28.7 },
    { category: 'energy', totalEmission: 8.3, percentage: 19.5 },
    { category: 'other', totalEmission: 3.5, percentage: 8.3 },
  ],
  recommendations: [
    'Consider carpooling or using public transport 2-3 times this week to reduce transport emissions by ~30%',
    'Try having 2 plant-based meals this week - it could save up to 3kg CO2',
    'Reduce AC usage by 1 hour daily to save ~1.5kg CO2 per week',
  ],
  comparisonToPrevWeek: -8.5,
};

export const mockDailySummary: DailySummary = {
  date: new Date().toISOString().split('T')[0],
  totalEmission: 5.0,
  activities: mockActivities.filter(a => 
    a.datetime.split('T')[0] === new Date().toISOString().split('T')[0]
  ),
  tip: 'Great job keeping emissions low today! Walking or cycling for short trips can reduce your transport footprint even more.',
  explanation: 'Your main emissions today came from driving to college. The chicken lunch added some food-related emissions. Overall, you\'re below the average student footprint!',
};

export const generateHeatmapData = () => {
  const data = [];
  for (let week = 0; week < 12; week++) {
    for (let day = 0; day < 7; day++) {
      data.push({
        week,
        day,
        value: Math.round(Math.random() * 10 * 10) / 10,
      });
    }
  }
  return data;
};

export const yesterdayActivities = mockActivities.filter(a => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return a.datetime.split('T')[0] === yesterday.toISOString().split('T')[0];
});
