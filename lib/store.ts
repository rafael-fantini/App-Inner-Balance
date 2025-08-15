import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isGuest: boolean
}

export interface SobrietyData {
  startDate: Date
  substance: string
  dailySpending: number
  reason: string
}

export interface Goal {
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  deadline: Date
  category: 'health' | 'financial' | 'social' | 'personal'
  isCompleted: boolean
}

export interface HealthData {
  steps: number
  date: string
  heartRate?: number
  sleep?: number
  exercise?: number
}

interface AppState {
  // User
  user: User | null
  isAuthenticated: boolean
  isFirstTime: boolean
  
  // Sobriety
  sobrietyData: SobrietyData | null
  
  // Goals
  goals: Goal[]
  
  // Health
  healthData: HealthData[]
  
  // Actions
  setUser: (user: User) => void
  logout: () => void
  setSobrietyData: (data: SobrietyData) => void
  setIsFirstTime: (value: boolean) => void
  addGoal: (goal: Goal) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  addHealthData: (data: HealthData) => void
  updateHealthData: (date: string, data: Partial<HealthData>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isFirstTime: true,
      sobrietyData: null,
      goals: [],
      healthData: [],

      // Actions
      setUser: (user) => set({ user, isAuthenticated: true }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        sobrietyData: null,
        goals: [],
        healthData: []
      }),
      
      setSobrietyData: (data) => set({ sobrietyData: data }),
      
      setIsFirstTime: (value) => set({ isFirstTime: value }),
      
      addGoal: (goal) => set((state) => ({ 
        goals: [...state.goals, goal] 
      })),
      
      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map(goal => 
          goal.id === id ? { ...goal, ...updates } : goal
        )
      })),
      
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter(goal => goal.id !== id)
      })),
      
      addHealthData: (data) => set((state) => {
        const existingIndex = state.healthData.findIndex(d => d.date === data.date);
        if (existingIndex >= 0) {
          const newHealthData = [...state.healthData];
          newHealthData[existingIndex] = data;
          return { healthData: newHealthData };
        }
        return { healthData: [...state.healthData, data] };
      }),
      
      updateHealthData: (date, data) => set((state) => ({
        healthData: state.healthData.map(item => 
          item.date === date ? { ...item, ...data } : item
        )
      })),
    }),
    {
      name: 'recovery-app-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isFirstTime: state.isFirstTime,
        sobrietyData: state.sobrietyData,
        goals: state.goals,
        healthData: state.healthData,
      }),
    }
  )
)