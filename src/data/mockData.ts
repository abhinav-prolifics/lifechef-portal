import { Alert, AnalyticsReport, BiometricReading, CarePlan, Conversation, Message, Patient, User } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: 'u1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@lifechef.health',
    role: 'clinician',
    avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'u2',
    name: 'Mark Wilson',
    email: 'mark.wilson@lifechef.health',
    role: 'care_team',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'u3',
    name: 'Dr. Emily Chen',
    email: 'emily.chen@lifechef.health',
    role: 'clinician',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

// Mock Patients
export const patients: Patient[] = [
  {
    id: 'p1',
    name: 'John Doe',
    age: 58,
    gender: 'Male',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    adherenceRate: 78,
    lastActivity: '2025-06-15T14:30:00Z',
    alerts: [
      {
        id: 'a1',
        patientId: 'p1',
        type: 'abnormal_reading',
        severity: 'medium',
        message: 'Elevated blood glucose reading',
        timestamp: '2025-06-15T08:45:00Z',
        isRead: false,
      },
      {
        id: 'a2',
        patientId: 'p1',
        type: 'missed_meal',
        severity: 'low',
        message: 'Missed lunch meal',
        timestamp: '2025-06-14T13:00:00Z',
        isRead: true,
      },
    ],
    biometrics: [
      {
        id: 'b1',
        type: 'glucose',
        value: 182,
        unit: 'mg/dL',
        timestamp: '2025-06-15T08:30:00Z',
        isAbnormal: true,
      },
      {
        id: 'b2',
        type: 'blood_pressure',
        value: '138/88',
        unit: 'mmHg',
        timestamp: '2025-06-15T08:35:00Z',
        isAbnormal: true,
      },
      {
        id: 'b3',
        type: 'weight',
        value: 192,
        unit: 'lbs',
        timestamp: '2025-06-15T08:40:00Z',
        isAbnormal: false,
      },
    ],
    careTeam: ['u1', 'u2'],
  },
  {
    id: 'p2',
    name: 'Jane Smith',
    age: 62,
    gender: 'Female',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    conditions: ['Coronary Artery Disease', 'COPD'],
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=300',
    adherenceRate: 92,
    lastActivity: '2025-06-16T09:15:00Z',
    alerts: [],
    biometrics: [
      {
        id: 'b4',
        type: 'heart_rate',
        value: 72,
        unit: 'bpm',
        timestamp: '2025-06-16T09:00:00Z',
        isAbnormal: false,
      },
      {
        id: 'b5',
        type: 'weight',
        value: 145,
        unit: 'lbs',
        timestamp: '2025-06-16T09:05:00Z',
        isAbnormal: false,
      },
    ],
    careTeam: ['u3'],
  },
  {
    id: 'p3',
    name: 'Robert Johnson',
    age: 45,
    gender: 'Male',
    email: 'robert.johnson@example.com',
    phone: '(555) 456-7890',
    conditions: ['Obesity', 'Pre-diabetes'],
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
    adherenceRate: 65,
    lastActivity: '2025-06-14T18:20:00Z',
    alerts: [
      {
        id: 'a3',
        patientId: 'p3',
        type: 'low_adherence',
        severity: 'high',
        message: 'Adherence rate below 70%',
        timestamp: '2025-06-14T19:00:00Z',
        isRead: false,
      },
    ],
    biometrics: [
      {
        id: 'b6',
        type: 'weight',
        value: 238,
        unit: 'lbs',
        timestamp: '2025-06-14T18:00:00Z',
        isAbnormal: true,
      },
    ],
    careTeam: ['u1', 'u3'],
  },
  {
    id: 'p4',
    name: 'Maria Garcia',
    age: 52,
    gender: 'Female',
    email: 'maria.garcia@example.com',
    phone: '(555) 789-0123',
    conditions: ['Type 1 Diabetes', 'Celiac Disease'],
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300',
    adherenceRate: 88,
    lastActivity: '2025-06-16T07:45:00Z',
    alerts: [],
    biometrics: [
      {
        id: 'b7',
        type: 'glucose',
        value: 112,
        unit: 'mg/dL',
        timestamp: '2025-06-16T07:30:00Z',
        isAbnormal: false,
      },
    ],
    careTeam: ['u2'],
  },
];

// Mock Care Plans
export const carePlans: CarePlan[] = [
  {
    id: 'cp1',
    patientId: 'p1',
    title: 'Diabetes Management Plan',
    description: 'Comprehensive plan to manage Type 2 Diabetes and reduce HbA1c levels',
    createdAt: '2025-05-10T09:00:00Z',
    updatedAt: '2025-06-12T14:30:00Z',
    startDate: '',
    endDate: '',
    status: 'active',
    goals: [
      {
        id: 'g1',
        description: 'Reduce HbA1c to below 7.0%',
        targetDate: '',
        status: 'in_progress',
      },
      {
        id: 'g2',
        description: 'Lose 15 pounds',
        targetDate: '',
        status: 'in_progress',
      },
      {
        id: 'g3',
        description: 'Walk 7,000 steps daily',
        targetDate: '',
        status: 'achieved',
      },
    ],
    meals: [
      {
        id: 'm1',
        name: 'Low-Carb Mediterranean Plan',
        description: 'Mediterranean-inspired meals with controlled carbohydrates',
        schedule: 'weekly',
        meals: [
          {
            id: 'meal1',
            name: 'Greek Chicken Bowl',
            description: 'Grilled chicken with quinoa, olives, feta, and vegetables',
            nutritionalInfo: {
              calories: 420,
              protein: 38,
              carbs: 28,
              fat: 16,
            },
            image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300',
          },
          {
            id: 'meal2',
            name: 'Salmon with Roasted Vegetables',
            description: 'Baked salmon with a variety of season vegetables',
            nutritionalInfo: {
              calories: 380,
              protein: 32,
              carbs: 18,
              fat: 20,
            },
            image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg?auto=compress&cs=tinysrgb&w=300',
          }
        ]
      }
    ],
    createdBy: 'u1',
  },
  {
    id: 'cp2',
    patientId: 'p2',
    title: 'Heart Health Improvement',
    description: 'Dietary and lifestyle plan to improve cardiovascular health',
    createdAt: '2025-04-20T10:15:00Z',
    updatedAt: '2025-06-10T11:45:00Z',
    startDate: '',
    endDate: '',
    status: 'active',
    goals: [
      {
        id: 'g4',
        description: 'Reduce blood pressure to normal range',
        targetDate: '',
        status: 'in_progress',
      },
      {
        id: 'g5',
        description: 'Complete cardiac rehabilitation program',
        targetDate: '',
        status: 'in_progress',
      },
    ],
    meals: [
      {
        id: 'm2',
        name: 'Heart-Healthy DASH Diet',
        description: 'Low-sodium meals following DASH diet principles',
        schedule: 'daily',
        meals: [
          {
            id: 'meal3',
            name: 'Vegetable Grain Bowl',
            description: 'Brown rice with roasted vegetables and lean protein',
            nutritionalInfo: {
              calories: 350,
              protein: 25,
              carbs: 45,
              fat: 10,
            },
            image: 'https://images.pexels.com/photos/1095550/pexels-photo-1095550.jpeg?auto=compress&cs=tinysrgb&w=300',
          }
        ]
      }
    ],
    createdBy: 'u3',
  },
  {
    id: 'cp3',
    patientId: 'p3',
    title: 'Weight Management Program',
    description: 'Calorie-controlled meal plan with physical activity recommendations',
    createdAt: '2025-06-01T13:30:00Z',
    updatedAt: '2025-06-15T16:20:00Z',
    startDate: '',
    endDate: '',
    status: 'active',
    goals: [
      {
        id: 'g6',
        description: 'Lose 30 pounds',
        targetDate: '',
        status: 'pending',
      },
      {
        id: 'g7',
        description: 'Exercise 150 minutes weekly',
        targetDate: '',
        status: 'in_progress',
      },
    ],
    meals: [
      {
        id: 'm3',
        name: 'Calorie-Controlled Plan',
        description: 'Balanced meals with portion control',
        schedule: 'weekly',
        meals: [
          {
            id: 'meal4',
            name: 'Lean Protein Plate',
            description: 'Grilled chicken breast with steamed vegetables and quinoa',
            nutritionalInfo: {
              calories: 410,
              protein: 40,
              carbs: 30,
              fat: 12,
            },
            image: 'https://images.pexels.com/photos/1833336/pexels-photo-1833336.jpeg?auto=compress&cs=tinysrgb&w=300',
          }
        ]
      }
    ],
    createdBy: 'u1',
  },
];


export const allMealPlans = carePlans.flatMap((plan) =>
  plan.meals.map((mealPlan) => ({
    ...mealPlan,
    category: plan.title, 
  }))
);


// Mock Messages
export const messages: Message[] = [
  {
    id: 'msg1',
    senderId: 'u1',
    recipientId: 'p1',
    content: 'How are you feeling after starting the new meal plan?',
    timestamp: '2025-06-15T10:15:00Z',
    isRead: true,
  },
  {
    id: 'msg2',
    senderId: 'p1',
    recipientId: 'u1',
    content: 'I\'m doing well, but I have a question about the dinner portions.',
    timestamp: '2025-06-15T10:30:00Z',
    isRead: true,
  },
  {
    id: 'msg3',
    senderId: 'u1',
    recipientId: 'p1',
    content: 'What questions do you have? I\'m happy to clarify.',
    timestamp: '2025-06-15T10:32:00Z',
    isRead: false,
  },
  {
    id: 'msg4',
    senderId: 'u3',
    recipientId: 'p2',
    content: 'Your latest readings look good. Keep up the great work!',
    timestamp: '2025-06-16T09:45:00Z',
    isRead: true,
  },
  {
    id: 'msg5',
    senderId: 'u1',
    recipientId: 'p3',
    content: 'We need to discuss your adherence to the meal plan. Can we schedule a call?',
    timestamp: '2025-06-14T19:30:00Z',
    isRead: false,
  },
];

// Mock Conversations
export const conversations: Conversation[] = [
  {
    id: 'conv1',
    participants: ['u1', 'p1'],
    lastMessage: messages[2],
    unreadCount: 1,
  },
  {
    id: 'conv2',
    participants: ['u3', 'p2'],
    lastMessage: messages[3],
    unreadCount: 0,
  },
  {
    id: 'conv3',
    participants: ['u1', 'p3'],
    lastMessage: messages[4],
    unreadCount: 1,
  },
];

// Mock Analytics Reports
export const analyticsReports: AnalyticsReport[] = [
  {
    id: 'ar1',
    title: 'Monthly Adherence Report',
    description: 'Overview of patient adherence to meal plans and recommendations',
    generatedAt: '2025-06-01T00:00:00Z',
    type: 'adherence',
    data: {
      averageAdherence: 82,
      patientCount: 24,
      lowAdherenceCount: 5,
      improvementRate: 8,
      monthlyTrend: [78, 80, 81, 82, 83, 82],
    },
  },
  {
    id: 'ar2',
    title: 'Health Improvements Tracking Quarterly',
    description: 'Analysis of patient biometric changes over the last quarter',
    generatedAt: '2025-06-15T00:00:00Z',
    type: 'biometrics',
    data: {
      weightLossAverage: 4.2,
      bloodPressureImprovement: 7.5,
      glucoseLevelImprovement: 12.3,
      cholesterolImprovement: 8.7,
    },
  },
  {
    id: 'ar3',
    title: 'Predictive Analysis Outcomes',
    description: 'Effectiveness of diabetes management plans across all patients',
    generatedAt: '2025-05-30T00:00:00Z',
    type: 'progress',
    data: {
      hba1cReduction: 0.8,
      diabeticPatients: 18,
      significantImprovement: 12,
      minorImprovement: 4,
      noChange: 2,
    },
  },
];

// Mock Alerts
export const alerts: Alert[] = [
  ...patients.flatMap(patient => patient.alerts),
  {
    id: 'a4',
    patientId: 'p4',
    type: 'message',
    severity: 'low',
    message: 'New message from Maria Garcia',
    timestamp: '2025-06-16T08:10:00Z',
    isRead: false,
  },
  {
    id: 'a5',
    patientId: 'p2',
    type: 'abnormal_reading',
    severity: 'high',
    message: 'Abnormal heart rate detected',
    timestamp: '2025-06-15T22:30:00Z',
    isRead: false,
  },
];

// Generate additional biometric readings for trending data
export const generatePatientBiometricHistory = (patientId: string, type: BiometricReading['type'], days: number = 14): BiometricReading[] => {
  const readings: BiometricReading[] = [];
  const patient = patients.find(p => p.id === patientId);
  
  if (!patient) return readings;
  
  const now = new Date();
  const baseValue = type === 'glucose' ? 120 : 
                   type === 'weight' ? (patient.gender === 'Male' ? 190 : 150) : 
                   type === 'blood_pressure' ? '120/80' : 72;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some random variation to create realistic data
    let value: number | string;
    let isAbnormal = false;
    
    if (type === 'glucose') {
      value = Math.round((baseValue as number) + (Math.random() * 40 - 20));
      isAbnormal = value > 140;
    } else if (type === 'weight') {
      // Slight downward trend for weight
      value = Math.round((baseValue as number) - (i * 0.2) + (Math.random() * 2 - 1));
    } else if (type === 'blood_pressure') {
      const systolic = Math.round(120 + (Math.random() * 30 - 15));
      const diastolic = Math.round(80 + (Math.random() * 20 - 10));
      value = `${systolic}/${diastolic}`;
      isAbnormal = systolic > 140 || diastolic > 90;
    } else {
      value = Math.round((baseValue as number) + (Math.random() * 10 - 5));
      isAbnormal = (value as number) > 100;
    }
    
    readings.push({
      id: `hist-${patientId}-${type}-${i}`,
      type,
      value,
      unit: type === 'glucose' ? 'mg/dL' : 
            type === 'weight' ? 'lbs' : 
            type === 'blood_pressure' ? 'mmHg' : 'bpm',
      timestamp: date.toISOString(),
      isAbnormal,
    });
  }
  
  return readings;
};

// Generate adherence history data
export const generateAdherenceHistory = (days: number = 30): { date: string; average: number }[] => {
  const data: { date: string; average: number }[] = [];
  const now = new Date();
  let trend = 75;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Create a slightly improving trend with random variation
    trend = Math.min(95, trend + (Math.random() * 0.4 - 0.1));
    data.push({
      date: date.toISOString().split('T')[0],
      average: Math.round(trend),
    });
  }
  
  return data;
};

export const adherenceHistory = generateAdherenceHistory();

// For patient detail pages
export const patientDetailData = {
  p1: {
    glucoseReadings: generatePatientBiometricHistory('p1', 'glucose'),
    weightReadings: generatePatientBiometricHistory('p1', 'weight'),
    bloodPressureReadings: generatePatientBiometricHistory('p1', 'blood_pressure'),
    heartRateReadings: generatePatientBiometricHistory('p1', 'heart_rate'),
  },
  p2: {
    glucoseReadings: generatePatientBiometricHistory('p2', 'glucose'),
    weightReadings: generatePatientBiometricHistory('p2', 'weight'),
    bloodPressureReadings: generatePatientBiometricHistory('p2', 'blood_pressure'),
    heartRateReadings: generatePatientBiometricHistory('p2', 'heart_rate'),
  },
  p3: {
    glucoseReadings: generatePatientBiometricHistory('p3', 'glucose'),
    weightReadings: generatePatientBiometricHistory('p3', 'weight'),
    bloodPressureReadings: generatePatientBiometricHistory('p3', 'blood_pressure'),
    heartRateReadings: generatePatientBiometricHistory('p3', 'heart_rate'),
  },
  p4: {
    glucoseReadings: generatePatientBiometricHistory('p4', 'glucose'),
    weightReadings: generatePatientBiometricHistory('p4', 'weight'),
    bloodPressureReadings: generatePatientBiometricHistory('p4', 'blood_pressure'),
    heartRateReadings: generatePatientBiometricHistory('p4', 'heart_rate'),
  },
};