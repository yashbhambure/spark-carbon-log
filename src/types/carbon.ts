export interface User {
  id: string;
  name: string;
  email: string;
  profilePhotoUrl?: string;
  createdAt: string;
  lastLoginAt: string;
  timezone: string;
  weeklyTarget?: number;
}

export interface ActivityEntry {
  id: string;
  userId: string;
  datetime: string;
  category: 'transport' | 'food' | 'energy' | 'waste' | 'shopping' | 'other';
  subcategory: string;
  description: string;
  estimatedEmissionKgCo2: number;
  source: 'user' | 'manual' | 'gemini';
  createdAt: string;
  transportDetails?: TransportDetails;
}

export interface TransportDetails {
  mode: 'car' | 'bike' | 'bus' | 'train' | 'flight' | 'walk' | 'motorcycle';
  distanceKm: number;
  fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  passengersCount?: number;
}

export interface WeeklySummary {
  id: string;
  userId: string;
  weekStartDate: string;
  weekEndDate: string;
  totalEmissionKg: number;
  averageDailyEmissionKg: number;
  topActivities: TopActivity[];
  recommendations: string[];
  comparisonToPrevWeek: number;
}

export interface TopActivity {
  category: string;
  totalEmission: number;
  percentage: number;
}

export interface DailySummary {
  date: string;
  totalEmission: number;
  activities: ActivityEntry[];
  tip?: string;
  explanation?: string;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
  icon: string;
}

export const CATEGORY_COLORS: Record<string, string> = {
  transport: 'hsl(200, 70%, 50%)',
  food: 'hsl(35, 90%, 55%)',
  energy: 'hsl(280, 60%, 55%)',
  waste: 'hsl(0, 72%, 51%)',
  shopping: 'hsl(320, 70%, 50%)',
  other: 'hsl(160, 30%, 50%)',
};

export const CATEGORY_ICONS: Record<string, string> = {
  transport: '🚗',
  food: '🍽️',
  energy: '⚡',
  waste: '🗑️',
  shopping: '🛒',
  other: '📦',
};
