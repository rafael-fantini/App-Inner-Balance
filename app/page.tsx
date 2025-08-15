'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  DollarSign, 
  Heart, 
  Target, 
  TrendingUp,
  Award,
  Activity,
  Zap,
  MapPin,
  MessageCircle,
  Users,
  AlertTriangle,
  Plus
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { formatDistanceToNow, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Link from 'next/link'

export default function HomePage() {
  const { user, sobrietyData, goals, healthData } = useAppStore()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Atualizar tempo a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Calcular estatísticas de sobriedade
  const calculateSobrietyStats = () => {
    if (!sobrietyData?.startDate) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        moneySaved: 0,
        healthImprovement: 0
      }
    }

    const startDate = new Date(sobrietyData.startDate)
    const now = currentTime
    
    const days = differenceInDays(now, startDate)
    const hours = differenceInHours(now, startDate) % 24
    const minutes = differenceInMinutes(now, startDate) % 60
    
    const totalHours = differenceInHours(now, startDate)
    const moneySaved = (totalHours / 24) * sobrietyData.dailySpending
    
    // Cálculo simples de melhoria da saúde (baseado em dias)
    const healthImprovement = Math.min(days * 2, 100)

    return {
      days,
      hours,
      minutes,
      moneySaved,
      healthImprovement
    }
  }

  const stats = calculateSobrietyStats()
  const todaySteps = healthData.find(d => d.date === new Date().toISOString().split('T')[0])?.steps || 0
  const completedGoals = goals.filter(g => g.isCompleted).length
  const activeGoals = goals.filter(g => !g.isCompleted)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Olá, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">
          {sobrietyData 
            ? `Você está no seu ${stats.days}º dia de sobriedade. Continue assim!`
            : 'Configure seus dados para começar a acompanhar seu progresso.'
          }
        </p>
      </motion.div>

      {!sobrietyData ? (
        // Onboarding prompt
        <motion.div variants={itemVariants}>
          <Card className="p-8 text-center bg-gradient-to-br from-recovery-50 to-primary-50 border-recovery-200">
            <div className="w-16 h-16 bg-gradient-to-br from-recovery-500 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Configure sua jornada
            </h2>
            <p className="text-gray-600 mb-6">
              Para começar a acompanhar seu progresso, configure seus dados de sobriedade.
            </p>
            <Link href="/onboarding">
              <Button className="inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Configurar agora
              </Button>
            </Link>
          </Card>
        </motion.div>
      ) : (
        <>
          {/* Estatísticas principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-gradient-to-br from-recovery-500 to-recovery-600 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8 text-recovery-100" />
                  <span className="text-recovery-100 text-sm font-medium">Tempo Limpo</span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold">{stats.days}</p>
                  <p className="text-recovery-100 text-sm">
                    dias, {stats.hours}h {stats.minutes}min
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-gradient-to-br from-success-500 to-success-600 text-white">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-success-100" />
                  <span className="text-success-100 text-sm font-medium">Economia</span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold">R$ {stats.moneySaved.toFixed(0)}</p>
                  <p className="text-success-100 text-sm">economizados</p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Heart className="w-8 h-8 text-primary-100" />
                  <span className="text-primary-100 text-sm font-medium">Saúde</span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold">{stats.healthImprovement}%</p>
                  <p className="text-primary-100 text-sm">melhoria</p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-gradient-to-br from-warning-500 to-warning-600 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="w-8 h-8 text-warning-100" />
                  <span className="text-warning-100 text-sm font-medium">Passos Hoje</span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold">{todaySteps.toLocaleString()}</p>
                  <p className="text-warning-100 text-sm">passos</p>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Motivação */}
          {sobrietyData.reason && (
            <motion.div variants={itemVariants}>
              <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Sua Motivação</h3>
                    <p className="text-gray-600 italic">"{sobrietyData.reason}"</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Metas em Progresso */}
          {activeGoals.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Metas em Progresso</h2>
                  <Link href="/goals">
                    <Button variant="outline" size="sm">Ver todas</Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {activeGoals.slice(0, 3).map((goal) => {
                    const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100)
                    return (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">{goal.title}</span>
                          <span className="text-sm text-gray-500">
                            {goal.currentValue}/{goal.targetValue} {goal.unit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-recovery-500 to-primary-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </motion.div>
          )}
        </>
      )}

      {/* Ações Rápidas */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/sos" className="group">
              <div className="text-center p-4 rounded-lg border-2 border-red-200 hover:border-red-300 hover:bg-red-50 transition-all">
                <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">SOS</span>
              </div>
            </Link>

            <Link href="/goals" className="group">
              <div className="text-center p-4 rounded-lg border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-all">
                <div className="w-12 h-12 bg-primary-500 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Metas</span>
              </div>
            </Link>

            <Link href="/community" className="group">
              <div className="text-center p-4 rounded-lg border-2 border-recovery-200 hover:border-recovery-300 hover:bg-recovery-50 transition-all">
                <div className="w-12 h-12 bg-recovery-500 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Comunidade</span>
              </div>
            </Link>

            <Link href="/therapist" className="group">
              <div className="text-center p-4 rounded-lg border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all">
                <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Terapeuta</span>
              </div>
            </Link>
          </div>
        </Card>
      </motion.div>

      {/* Frase motivacional do dia */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="text-center">
            <Zap className="w-8 h-8 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Pensamento do Dia</h3>
            <p className="text-gray-600 italic">
              "Cada dia que você escolhe a sobriedade é um dia que você escolhe a vida. 
              Você é mais forte do que imagina."
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Progresso Semanal */}
      {sobrietyData && (
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Progresso da Semana</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Dias consecutivos limpo</span>
              <span className="font-bold text-2xl text-recovery-600">{stats.days}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-recovery-500 to-primary-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((stats.days % 7) / 7 * 100, 100)}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Início da semana</span>
              <span>{7 - (stats.days % 7)} dias para próxima semana</span>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}