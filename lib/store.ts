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

export interface Video {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl?: string
  duration?: number
  uploadedBy: 'gedalias' | 'patient'
  authorName: string
  uploadDate: Date
  views: number
  likes: number
  tags: string[]
}

export interface Class {
  id: string
  title: string
  description: string
  topic: string
  videoUrl: string
  thumbnailUrl?: string
  duration: number
  uploadDate: Date
  views: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  materials?: string[]
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
  
  // Videos
  videos: Video[]
  
  // Classes
  classes: Class[]
  
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
  addVideo: (video: Video) => void
  updateVideo: (id: string, updates: Partial<Video>) => void
  deleteVideo: (id: string) => void
  likeVideo: (id: string) => void
  addView: (videoId: string) => void
  addClass: (classItem: Class) => void
  updateClass: (id: string, updates: Partial<Class>) => void
  deleteClass: (id: string) => void
  addClassView: (classId: string) => void
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
      videos: [],
      classes: [],

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
        
        addVideo: (video) => set((state) => ({ 
          videos: [...state.videos, video] 
        })),
        
        updateVideo: (id, updates) => set((state) => ({
          videos: state.videos.map(video => 
            video.id === id ? { ...video, ...updates } : video
          )
        })),
        
        deleteVideo: (id) => set((state) => ({
          videos: state.videos.filter(video => video.id !== id)
        })),
        
        likeVideo: (id) => set((state) => ({
          videos: state.videos.map(video => 
            video.id === id ? { ...video, likes: video.likes + 1 } : video
          )
        })),
        
        addView: (videoId) => set((state) => ({
          videos: state.videos.map(video => 
            video.id === videoId ? { ...video, views: video.views + 1 } : video
          )
        })),
        
        addClass: (classItem) => set((state) => ({ 
          classes: [...state.classes, classItem] 
        })),
        
        updateClass: (id, updates) => set((state) => ({
          classes: state.classes.map(classItem => 
            classItem.id === id ? { ...classItem, ...updates } : classItem
          )
        })),
        
        deleteClass: (id) => set((state) => ({
          classes: state.classes.filter(classItem => classItem.id !== id)
        })),
        
        addClassView: (classId) => set((state) => ({
          classes: state.classes.map(classItem => 
            classItem.id === classId ? { ...classItem, views: classItem.views + 1 } : classItem
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
        videos: state.videos,
        classes: state.classes,
      }),
    }
  )
)