import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface UserState {
  profile: {
    id: string;
    name: string;
    avatar: string;
    tier: 'free' | 'premium' | 'professional';
    preferredLanguage: string;
    timezone: string;
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
    mood: number;
    anxiety: number;
    energy: number;
    notes?: string;
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
    { date: '2024-01-15', mood: 7, anxiety: 4, energy: 6 },
    { date: '2024-01-14', mood: 5, anxiety: 6, energy: 4 },
    { date: '2024-01-13', mood: 8, anxiety: 3, energy: 7 },
    { date: '2024-01-12', mood: 6, anxiety: 5, energy: 5 },
    { date: '2024-01-11', mood: 4, anxiety: 7, energy: 3 },
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
    default:
      return state;
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, dispatch] = useReducer(userReducer, initialState);

  // Reset daily usage at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      dispatch({
        type: 'UPDATE_USER',
        payload: {
          usage: {
            artTherapyToday: 0,
            tictacMinutesToday: 0,
            aiAnalysesToday: 0,
          },
        },
      });
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