import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface UserState {
  profile: {
    id: string;
    name: string;
    avatar: string;
    tier: 'free' | 'premium' | 'professional';
    preferredLanguage: string;
    timezone: string;
    email?: string;
    age?: number;
    location?: string;
    bio?: string;
    mentalHealthGoals?: string[];
    therapyPreferences?: string[];
    emergencyContact?: string;
    preferredTherapistGender?: string;
    allowDataSharing?: boolean;
    allowAnalytics?: boolean;
    storeBiometricData?: boolean;
    notifications?: {
      moodReminders?: boolean;
      therapyReminders?: boolean;
      crisisAlerts?: boolean;
      progressUpdates?: boolean;
    };
    joinDate?: string;
  };
  usage: {
    artTherapyToday: number;
    tictacMinutesToday: number;
    aiAnalysesToday: number;
  };
  limits: {
    artTherapy: number;
    tictacMinutes: number;
    aiAnalyses: number;
  };
  moodHistory: Array<{
    date: string;
    timestamp?: string;
    mood: number;
    anxiety: number;
    energy: number;
    notes?: string;
    voiceAnalysis?: any;
  }>;
  subscription: {
    tier: string;
    expiresAt?: string;
    autoRenew: boolean;
  };
}

interface UserContextType {
  user: UserState;
  updateUser: (updates: Partial<UserState>) => void;
  checkUsageLimit: (feature: string) => { allowed: boolean; remaining: number };
  trackUsage: (feature: string, amount?: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const initialState: UserState = {
  profile: {
    id: 'user_123',
    name: 'Demo User',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    tier: 'free',
    preferredLanguage: 'en',
    timezone: 'Asia/Kolkata',
    email: 'demo@mindcare.ai',
    age: 28,
    location: 'Mumbai, India',
    bio: 'Exploring mental wellness through AI-powered tools and therapy.',
    mentalHealthGoals: ['Reduce anxiety', 'Improve mood', 'Better sleep'],
    therapyPreferences: ['Cognitive Behavioral Therapy (CBT)', 'Art Therapy'],
    allowDataSharing: false,
    allowAnalytics: true,
    storeBiometricData: true,
    notifications: {
      moodReminders: true,
      therapyReminders: true,
      crisisAlerts: true,
      progressUpdates: false,
    },
    joinDate: '2024-01-01',
  },
  usage: {
    artTherapyToday: 0,
    tictacMinutesToday: 0,
    aiAnalysesToday: 0,
  },
  limits: {
    artTherapy: 1,
    tictacMinutes: 30,
    aiAnalyses: 10,
  },
  moodHistory: [
    { 
      date: '2024-01-15', 
      timestamp: '2024-01-15T14:30:00Z',
      mood: 7, 
      anxiety: 4, 
      energy: 6,
      notes: 'Had a productive day at work, feeling optimistic about the project.'
    },
    { 
      date: '2024-01-14', 
      timestamp: '2024-01-14T16:45:00Z',
      mood: 5, 
      anxiety: 6, 
      energy: 4,
      notes: 'Feeling a bit overwhelmed with deadlines.'
    },
    { 
      date: '2024-01-13', 
      timestamp: '2024-01-13T10:20:00Z',
      mood: 8, 
      anxiety: 3, 
      energy: 7,
      notes: 'Great morning meditation session, feeling centered.'
    },
    { 
      date: '2024-01-12', 
      timestamp: '2024-01-12T18:15:00Z',
      mood: 6, 
      anxiety: 5, 
      energy: 5,
      notes: 'Neutral day, nothing particularly good or bad.'
    },
    { 
      date: '2024-01-11', 
      timestamp: '2024-01-11T12:30:00Z',
      mood: 4, 
      anxiety: 7, 
      energy: 3,
      notes: 'Struggling with sleep issues, feeling tired and anxious.'
    },
  ],
  subscription: {
    tier: 'free',
    autoRenew: false,
  },
};

function userReducer(state: UserState, action: any): UserState {
  switch (action.type) {
    case 'UPDATE_USER':
      return { ...state, ...action.payload };
    case 'TRACK_USAGE':
      return {
        ...state,
        usage: {
          ...state.usage,
          [action.feature]: state.usage[action.feature as keyof typeof state.usage] + (action.amount || 1),
        },
      };
    case 'ADD_MOOD_ENTRY':
      return {
        ...state,
        moodHistory: [action.payload, ...state.moodHistory.slice(0, 29)], // Keep last 30 entries
      };
    case 'RESET_DAILY_USAGE':
      return {
        ...state,
        usage: {
          artTherapyToday: 0,
          tictacMinutesToday: 0,
          aiAnalysesToday: 0,
        },
      };
    default:
      return state;
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, dispatch] = useReducer(userReducer, initialState);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('mindcare_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        dispatch({ type: 'UPDATE_USER', payload: userData });
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mindcare_user', JSON.stringify(user));
  }, [user]);

  // Reset daily usage at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      dispatch({ type: 'RESET_DAILY_USAGE' });
      
      // Set up daily reset interval
      const dailyInterval = setInterval(() => {
        dispatch({ type: 'RESET_DAILY_USAGE' });
      }, 24 * 60 * 60 * 1000); // 24 hours
      
      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  const updateUser = (updates: Partial<UserState>) => {
    dispatch({ type: 'UPDATE_USER', payload: updates });
  };

  const checkUsageLimit = (feature: string) => {
    const used = user.usage[feature as keyof typeof user.usage] || 0;
    const limit = user.limits[feature as keyof typeof user.limits] || 0;
    
    if (user.profile.tier === 'premium' || user.profile.tier === 'professional') {
      return { allowed: true, remaining: -1 }; // Unlimited
    }
    
    return {
      allowed: used < limit,
      remaining: Math.max(0, limit - used),
    };
  };

  const trackUsage = (feature: string, amount = 1) => {
    dispatch({ type: 'TRACK_USAGE', feature, amount });
    
    // Also track in localStorage for persistence
    const usageKey = `mindcare_usage_${feature}`;
    const today = new Date().toISOString().split('T')[0];
    const savedUsage = JSON.parse(localStorage.getItem(usageKey) || '{}');
    
    if (savedUsage.date !== today) {
      savedUsage.date = today;
      savedUsage.count = 0;
    }
    
    savedUsage.count += amount;
    localStorage.setItem(usageKey, JSON.stringify(savedUsage));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, checkUsageLimit, trackUsage }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}