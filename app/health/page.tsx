'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  Heart, 
  TrendingUp, 
  Target, 
  Calendar,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Clock,
  Zap,
  Shield
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { healthService, formatSteps, getStepGoalProgress, getActivityLevel } from '@/lib/health'
import { toast } from 'react-toastify'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function HealthPage() {
  const { addHealthData, updateHealthData, goals, updateGoal } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [todaySteps, setTodaySteps] = useState(0)
  const [heartRate, setHeartRate] = useState<number | null>(null)
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [isTracking, setIsTracking] = useState(false)
  const [permissions, setPermissions] = useState({
    steps: false,
    heartRate: false,
    sleep: false,
    exercise: false
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      // Check if health service is available
      if (healthService.isHealthAPIAvailable()) {
        const perms = healthService.getPermissions()
        setPermissions(perms)
        
        if (perms.steps) {
          const steps = await healthService.getTodaySteps()
          setTodaySteps(steps)
          
          // Update store with today's data
          const today = new Date().toISOString().split('T')[0]
          addHealthData({
            steps,
            date: today
          })
        }
        
        if (perms.heartRate) {
          const hr = await healthService.getHeartRate()
          setHeartRate(hr)
        }
        
        // Load weekly data
        const weekly = await healthService.getWeeklySteps()
        setWeeklyData(weekly)
      }
    } catch (error) {
      console.error('Error loading health data:', error)
      toast.error('Erro ao carregar dados de saúde')
    } finally {
      setLoading(false)
    }
  }

  const requestPermissions = async () => {
    setLoading(true)
    try {
      const granted = await healthService.requestPermissions()
      setPermissions(granted)
      
      if (granted.steps) {
        toast.success('Permissões concedidas! Carregando dados...')
        await loadInitialData()
      } else {
        toast.warning('Algumas permissões foram negadas')
      }
    } catch (error) {
      console.error('Error requesting permissions:', error)
      toast.error('Erro ao solicitar permissões de saúde')
    } finally {
      setLoading(false)
    }
  }

  const startTracking = async () => {
    try {
      await healthService.startStepTracking((steps) => {
        setTodaySteps(steps)
        
        // Update store
        const today = new Date().toISOString().split('T')[0]
        updateHealthData(today, { steps })
        
        // Check step goals
        checkStepGoals(steps)
      })
      
      setIsTracking(true)
      toast.success('Rastreamento ativo iniciado!')
    } catch (error) {
      toast.error('Erro ao iniciar rastreamento')
    }
  }

  const stopTracking = () => {
    healthService.stopStepTracking()
    setIsTracking(false)
    toast.info('Rastreamento pausado')
  }

  const checkStepGoals = (currentSteps: number) => {
    // Check if any step-related goals were achieved
    const stepGoals = goals.filter(g => 
      g.unit === 'passos' && !g.isCompleted && currentSteps >= g.targetValue
    )
    
    stepGoals.forEach(goal => {
      updateGoal(goal.id, { 
        currentValue: currentSteps,
        isCompleted: true 
      })
      toast.success(`🎉 Meta "${goal.title}" concluída!`)
    })
  }

  const refreshData = async () => {
    setLoading(true)
    try {
      if (permissions.steps) {
        const steps = await healthService.getTodaySteps()
        setTodaySteps(steps)
        
        const today = new Date().toISOString().split('T')[0]
        updateHealthData(today, { steps })
      }
      
      if (permissions.heartRate) {
        const hr = await healthService.getHeartRate()
        setHeartRate(hr)
      }
      
      toast.success('Dados atualizados!')
    } catch (error) {
      toast.error('Erro ao atualizar dados')
    } finally {
      setLoading(false)
    }
  }

  const activityLevel = getActivityLevel(todaySteps)
  const stepGoal = goals.find(g => g.unit === 'passos' && !g.isCompleted)
  const stepProgress = stepGoal ? getStepGoalProgress(todaySteps, stepGoal.targetValue) : null

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saúde & Atividade</h1>
          <p className="text-gray-600">
            Monitore sua atividade física e saúde geral
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={refreshData}
            variant="outline"
            loading={loading}
            className="inline-flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Atualizar
          </Button>
          
          {!permissions.steps ? (
            <Button
              onClick={requestPermissions}
              loading={loading}
              className="inline-flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              Conectar App Saúde
            </Button>
          ) : (
            <Button
              onClick={isTracking ? stopTracking : startTracking}
              variant={isTracking ? "outline" : "primary"}
              className="inline-flex items-center gap-2"
            >
              {isTracking ? (
                <>
                  <Clock className="w-4 h-4" />
                  Pausar
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  Iniciar
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              permissions.steps ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              {permissions.steps ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Smartphone className="w-6 h-6 text-gray-400" />
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">
                {permissions.steps ? 'Conectado ao App de Saúde' : 'App de Saúde Desconectado'}
              </h3>
              <p className="text-sm text-gray-600">
                {permissions.steps 
                  ? 'Sincronizando dados automaticamente' 
                  : 'Conecte para rastrear automaticamente'
                }
              </p>
            </div>
          </div>
          
          {permissions.steps && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {isTracking ? 'Rastreando' : 'Conectado'}
            </div>
          )}
        </div>
        
        {permissions.steps && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center ${
                permissions.steps ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Activity className={`w-4 h-4 ${permissions.steps ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <p className="text-xs text-gray-600">Passos</p>
            </div>
            
            <div className="text-center">
              <div className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center ${
                permissions.heartRate ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Heart className={`w-4 h-4 ${permissions.heartRate ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <p className="text-xs text-gray-600">Frequência</p>
            </div>
            
            <div className="text-center">
              <div className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center ${
                permissions.sleep ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Clock className={`w-4 h-4 ${permissions.sleep ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <p className="text-xs text-gray-600">Sono</p>
            </div>
            
            <div className="text-center">
              <div className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center ${
                permissions.exercise ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Zap className={`w-4 h-4 ${permissions.exercise ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <p className="text-xs text-gray-600">Exercício</p>
            </div>
          </div>
        )}
      </Card>

      {permissions.steps ? (
        <>
          {/* Today's Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${activityLevel.color} bg-opacity-10`}>
                  {activityLevel.label}
                </span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {todaySteps.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600">passos hoje</p>
                
                {stepProgress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Meta: {stepGoal?.targetValue.toLocaleString()}</span>
                      <span>{stepProgress.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${stepProgress.percentage}%` }}
                      />
                    </div>
                    {stepProgress.remaining > 0 && (
                      <p className="text-xs text-gray-500">
                        {stepProgress.remaining.toLocaleString()} passos restantes
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {heartRate && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-sm text-gray-500">BPM</span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">{heartRate}</h3>
                  <p className="text-sm text-gray-600">frequência cardíaca</p>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-gray-500">Monitorando</span>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">Hoje</span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {Math.round((todaySteps / 10000) * 100)}%
                </h3>
                <p className="text-sm text-gray-600">meta diária</p>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((todaySteps / 10000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Weekly Progress */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Progresso da Semana</h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {weeklyData.map((day, index) => {
                const isToday = index === weeklyData.length - 1
                const progress = Math.min((day.steps / 10000) * 100, 100)
                
                return (
                  <div key={day.date} className="text-center">
                    <div className="mb-2">
                      <div className="text-xs text-gray-500 mb-1">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][new Date(day.date).getDay()]}
                      </div>
                      <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center text-xs font-medium ${
                        isToday 
                          ? 'bg-primary-500 text-white' 
                          : progress >= 100 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {formatSteps(day.steps)}
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all duration-500 ${
                          isToday ? 'bg-primary-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {Math.round(weeklyData.reduce((sum, day) => sum + day.steps, 0) / weeklyData.length).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Média diária</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {Math.max(...weeklyData.map(d => d.steps)).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Melhor dia</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {weeklyData.filter(d => d.steps >= 10000).length}
                  </p>
                  <p className="text-sm text-gray-600">Metas atingidas</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Health Tips */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Dicas de Saúde</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">🚶‍♂️ Atividade Física</h3>
                <p className="text-sm text-blue-800">
                  Caminhar regularmente fortalece o sistema cardiovascular e melhora o humor, 
                  contribuindo para sua recuperação.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">💪 Força Mental</h3>
                <p className="text-sm text-green-800">
                  O exercício libera endorfinas naturais, que ajudam a combater a ansiedade 
                  e fortalecem sua determinação.
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">🎯 Metas Diárias</h3>
                <p className="text-sm text-purple-800">
                  Estabeleça pequenas metas de atividade. Cada passo é uma vitória 
                  na sua jornada de recuperação.
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">😴 Sono Reparador</h3>
                <p className="text-sm text-orange-800">
                  A atividade física melhora a qualidade do sono, essencial para 
                  a recuperação física e mental.
                </p>
              </div>
            </div>
          </Card>
        </>
      ) : (
        /* Permission Request Prompt */
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Conecte-se ao seu App de Saúde
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Para acompanhar automaticamente seus passos e atividades, 
            conecte-se ao app de saúde do seu dispositivo.
          </p>
          
          <div className="space-y-4 max-w-sm mx-auto mb-8">
            <div className="flex items-center gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Contagem automática de passos</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Monitoramento de frequência cardíaca</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Acompanhamento de metas de saúde</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Dados sincronizados com sua recuperação</span>
            </div>
          </div>
          
          <Button
            onClick={requestPermissions}
            loading={loading}
            size="lg"
            className="inline-flex items-center gap-3"
          >
            <Smartphone className="w-5 h-5" />
            Conectar App de Saúde
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            Seus dados de saúde são privados e seguros
          </p>
        </Card>
      )}
    </div>
  )
}