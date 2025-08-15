// Health API Integration for Android and iOS
export interface HealthData {
  steps: number
  heartRate?: number
  sleep?: number
  exercise?: number
  date: string
}

export interface HealthPermissions {
  steps: boolean
  heartRate: boolean
  sleep: boolean
  exercise: boolean
}

class HealthService {
  private isAvailable = false
  private permissions: HealthPermissions = {
    steps: false,
    heartRate: false,
    sleep: false,
    exercise: false
  }

  constructor() {
    this.checkAvailability()
  }

  private checkAvailability() {
    // Check if running in mobile environment with health APIs
    if (typeof window !== 'undefined') {
      // iOS HealthKit detection
      const hasHealthKit = 'webkit' in window && 'messageHandlers' in (window as any).webkit
      
      // Android Health Connect / Google Fit detection
      const hasAndroidHealth = 'Android' in window || navigator.userAgent.includes('Android')
      
      // Web Health API (experimental)
      const hasWebHealth = 'health' in navigator
      
      this.isAvailable = hasHealthKit || hasAndroidHealth || hasWebHealth
    }
  }

  async requestPermissions(): Promise<HealthPermissions> {
    if (!this.isAvailable) {
      throw new Error('Health APIs not available on this device')
    }

    try {
      // iOS HealthKit
      if (this.isIOS()) {
        return await this.requestIOSPermissions()
      }
      
      // Android Health Connect
      if (this.isAndroid()) {
        return await this.requestAndroidPermissions()
      }
      
      // Web Health API (fallback/simulation)
      return await this.requestWebPermissions()
      
    } catch (error) {
      console.error('Error requesting health permissions:', error)
      throw error
    }
  }

  private isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
  }

  private isAndroid(): boolean {
    return /Android/.test(navigator.userAgent)
  }

  private async requestIOSPermissions(): Promise<HealthPermissions> {
    // iOS HealthKit integration
    try {
      // Simulate HealthKit permission request
      const permissions = await new Promise<HealthPermissions>((resolve) => {
        // In a real app, this would use the HealthKit bridge
        setTimeout(() => {
          resolve({
            steps: true,
            heartRate: true,
            sleep: true,
            exercise: true
          })
        }, 1000)
      })
      
      this.permissions = permissions
      return permissions
    } catch (error) {
      throw new Error('Failed to request iOS HealthKit permissions')
    }
  }

  private async requestAndroidPermissions(): Promise<HealthPermissions> {
    // Android Health Connect integration
    try {
      // Simulate Health Connect permission request
      const permissions = await new Promise<HealthPermissions>((resolve) => {
        // In a real app, this would use the Health Connect API
        setTimeout(() => {
          resolve({
            steps: true,
            heartRate: true,
            sleep: false, // User denied
            exercise: true
          })
        }, 1000)
      })
      
      this.permissions = permissions
      return permissions
    } catch (error) {
      throw new Error('Failed to request Android Health Connect permissions')
    }
  }

  private async requestWebPermissions(): Promise<HealthPermissions> {
    // Web-based health tracking (simulation)
    try {
      const permissions: HealthPermissions = {
        steps: true, // Can estimate from device motion
        heartRate: false, // Not available in web
        sleep: false, // Not available in web
        exercise: true // Can estimate from activity
      }
      
      this.permissions = permissions
      return permissions
    } catch (error) {
      throw new Error('Failed to request web health permissions')
    }
  }

  async getTodaySteps(): Promise<number> {
    if (!this.permissions.steps) {
      throw new Error('Steps permission not granted')
    }

    try {
      if (this.isIOS()) {
        return await this.getIOSSteps()
      }
      
      if (this.isAndroid()) {
        return await this.getAndroidSteps()
      }
      
      return await this.getWebSteps()
      
    } catch (error) {
      console.error('Error getting steps:', error)
      // Return simulated data in case of error
      return this.getSimulatedSteps()
    }
  }

  private async getIOSSteps(): Promise<number> {
    // iOS HealthKit steps query
    return new Promise((resolve) => {
      // In a real app, this would query HealthKit
      const simulatedSteps = Math.floor(Math.random() * 15000) + 2000
      setTimeout(() => resolve(simulatedSteps), 500)
    })
  }

  private async getAndroidSteps(): Promise<number> {
    // Android Health Connect steps query
    return new Promise((resolve) => {
      // In a real app, this would query Health Connect
      const simulatedSteps = Math.floor(Math.random() * 12000) + 3000
      setTimeout(() => resolve(simulatedSteps), 500)
    })
  }

  private async getWebSteps(): Promise<number> {
    // Web-based step estimation using device motion
    if ('DeviceMotionEvent' in window) {
      try {
        // Request permission for device motion (iOS 13+)
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
          const permission = await (DeviceMotionEvent as any).requestPermission()
          if (permission !== 'granted') {
            throw new Error('Device motion permission denied')
          }
        }
        
        // Return simulated steps for demo
        return Math.floor(Math.random() * 8000) + 2000
      } catch (error) {
        throw new Error('Device motion not available')
      }
    }
    
    throw new Error('Device motion not supported')
  }

  private getSimulatedSteps(): number {
    // Fallback: generate realistic step count for demo
    const now = new Date()
    const hour = now.getHours()
    
    // Simulate realistic step patterns throughout the day
    let baseSteps = 0
    
    if (hour < 8) {
      baseSteps = Math.floor(Math.random() * 1000) // Early morning
    } else if (hour < 12) {
      baseSteps = Math.floor(Math.random() * 4000) + 2000 // Morning
    } else if (hour < 17) {
      baseSteps = Math.floor(Math.random() * 6000) + 4000 // Afternoon
    } else if (hour < 22) {
      baseSteps = Math.floor(Math.random() * 8000) + 6000 // Evening
    } else {
      baseSteps = Math.floor(Math.random() * 10000) + 7000 // Night
    }
    
    return baseSteps
  }

  async getWeeklySteps(): Promise<HealthData[]> {
    const weekData: HealthData[] = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      const steps = Math.floor(Math.random() * 12000) + 3000
      
      weekData.push({
        steps,
        heartRate: Math.floor(Math.random() * 40) + 60,
        sleep: Math.floor(Math.random() * 4) + 6,
        exercise: Math.floor(Math.random() * 60) + 20,
        date: date.toISOString().split('T')[0]
      })
    }
    
    return weekData
  }

  async getHeartRate(): Promise<number | null> {
    if (!this.permissions.heartRate) {
      return null
    }
    
    // Simulate heart rate reading
    return new Promise((resolve) => {
      const heartRate = Math.floor(Math.random() * 40) + 60 // 60-100 bpm
      setTimeout(() => resolve(heartRate), 800)
    })
  }

  async startStepTracking(callback: (steps: number) => void): Promise<void> {
    if (!this.permissions.steps) {
      throw new Error('Steps permission not granted')
    }

    // Start real-time step tracking
    let currentSteps = await this.getTodaySteps()
    
    const interval = setInterval(async () => {
      // Simulate step increments
      const increment = Math.floor(Math.random() * 10)
      currentSteps += increment
      callback(currentSteps)
    }, 5000) // Update every 5 seconds

    // Store interval for cleanup
    ;(window as any).__stepTrackingInterval = interval
  }

  stopStepTracking(): void {
    if ((window as any).__stepTrackingInterval) {
      clearInterval((window as any).__stepTrackingInterval)
      delete (window as any).__stepTrackingInterval
    }
  }

  // Goal tracking
  async checkStepGoal(targetSteps: number): Promise<{ achieved: boolean; progress: number }> {
    const currentSteps = await this.getTodaySteps()
    const progress = Math.min((currentSteps / targetSteps) * 100, 100)
    
    return {
      achieved: currentSteps >= targetSteps,
      progress
    }
  }

  isHealthAPIAvailable(): boolean {
    return this.isAvailable
  }

  getPermissions(): HealthPermissions {
    return { ...this.permissions }
  }
}

// Export singleton instance
export const healthService = new HealthService()

// Utility functions
export function formatSteps(steps: number): string {
  if (steps >= 1000) {
    return `${(steps / 1000).toFixed(1)}k`
  }
  return steps.toString()
}

export function getStepGoalProgress(current: number, target: number): {
  percentage: number
  remaining: number
  achieved: boolean
} {
  const percentage = Math.min((current / target) * 100, 100)
  const remaining = Math.max(target - current, 0)
  const achieved = current >= target

  return { percentage, remaining, achieved }
}

export function getActivityLevel(steps: number): {
  level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active'
  label: string
  color: string
} {
  if (steps < 3000) {
    return {
      level: 'sedentary',
      label: 'Sedentário',
      color: 'text-red-500'
    }
  } else if (steps < 7000) {
    return {
      level: 'lightly_active',
      label: 'Pouco Ativo',
      color: 'text-yellow-500'
    }
  } else if (steps < 12000) {
    return {
      level: 'moderately_active',
      label: 'Moderadamente Ativo',
      color: 'text-blue-500'
    }
  } else {
    return {
      level: 'very_active',
      label: 'Muito Ativo',
      color: 'text-green-500'
    }
  }
}