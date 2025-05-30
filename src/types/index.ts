// Type definitions for the application

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'clinician' | 'care_team' | 'admin';
  avatar?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  conditions: string[];
  avatar?: string;
  adherenceRate: number;
  lastActivity: string;
  alerts: Alert[];
  biometrics: BiometricReading[];
  careTeam: string[];
}

export interface BiometricReading {
  id: string;
  type: 'weight' | 'blood_pressure' | 'glucose' | 'heart_rate';
  value: number | string;
  unit: string;
  timestamp: string;
  isAbnormal?: boolean;
}

export interface Alert {
  id: string;
  patientId: string;
  type: 'missed_meal' | 'abnormal_reading' | 'low_adherence' | 'message';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface CarePlan {
  id: string;
  patientId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'draft';
  goals: CarePlanGoal[];
  meals: MealPlan[];
  createdBy: string;
}

export interface CarePlanGoal {
  id: string;
  description: string;
  targetDate: string;
  status: 'pending' | 'in_progress' | 'achieved';
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  schedule: 'daily' | 'weekly';
  meals: Meal[];
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  image?: string;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
}

export interface AnalyticsReport {
  id: string;
  title: string;
  description: string;
  generatedAt: string;
  data: any;
  type: 'adherence' | 'progress' | 'biometrics' | 'custom';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}


