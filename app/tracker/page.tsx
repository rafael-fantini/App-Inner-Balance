'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calculator, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Heart, 
  Clock,
  Target,
  Award,
  Zap,
  Edit,
  Save,
  X
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { toast } from 'react-toastify'

interface SobrietyData {
  startDate: string
  dailySpending: number
  substanceType: string
  goals: {
    id: string
    description: string
    targetDays: number
    completed: boolean
  }[]
}

export default function TrackerPage() {
  const [sobrietyData, setSobrietyData] = useState<SobrietyData>({
    startDate: '2024-01-01',
    dailySpending: 50,
    substanceType: 'Álcool',
    goals: [
      { id: '1', description: '7 dias sóbrio', targetDays: 7, completed: true },
      { id: '2', description: '30 dias sóbrio', targetDays: 30, completed: true },
      { id: '3', description: '90 dias sóbrio', targetDays: 90, completed: false },
      { id: '4', description: '1 ano sóbrio', targetDays: 365, completed: false },
    ]
  })
  
  const [editMode, setEditMode] = useState(false)
  const [tempData, setTempData] = useState(sobrietyData)
  const [stats, setStats] = useState({
    totalDays: 0,
    totalHours: 0,
    totalMinutes: 0,
    moneySaved: 0,
    weeksSober: 0,
    monthsSober: 0,
    healthImprovement: 0
  })

  useEffect(() => {
    calculateStats()
  }, [sobrietyData])

  const calculateStats = () => {
    const startDate = new Date(sobrietyData.startDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - startDate.getTime())
    
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const totalHours = Math.floor(diffTime / (1000 * 60 * 60))
    const totalMinutes = Math.floor(diffTime / (1000 * 60))
    const moneySaved = totalDays * sobrietyData.dailySpending
    const weeksSober = Math.floor(totalDays / 7)
    const monthsSober = Math.floor(totalDays / 30)
    
    // Cálculo da melhoria da saúde (baseado em estudos sobre recuperação)
    let healthImprovement = 0
    if (totalDays >= 1) healthImprovement = 20
    if (totalDays >= 7) healthImprovement = 40
    if (totalDays >= 30) healthImprovement = 65
    if (totalDays >= 90) healthImprovement = 80
    if (totalDays >= 365) healthImprovement = 95

    setStats({
      totalDays,
      totalHours,
      totalMinutes,
      moneySaved,
      weeksSober,
      monthsSober,
      healthImprovement
    })
  }

  const handleSave = () => {
    setSobrietyData(tempData)
    setEditMode(false)
    toast.success('Dados atualizados com sucesso!')
  }

  const handleCancel = () => {
    setTempData(sobrietyData)
    setEditMode(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getNextMilestone = () => {
    const milestones = [7, 30, 60, 90, 180, 365, 730, 1095]
    return milestones.find(m => m > stats.totalDays) || 2000
  }

  const getMilestoneProgress = () => {
    const nextMilestone = getNextMilestone()
    return (stats.totalDays / nextMilestone) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-recovery-50 via-white to-primary-50">
      <Navigation />
      
      <div className="lg:ml-64 pt-20 lg:pt-8 pb-20 lg:pb-8 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold gradient-text font-display mb-4 flex items-center">
                  <Calculator className="w-10 h-10 mr-4 text-primary-500" />
                  Contador de Sobriedade
                </h1>
                <p className="text-lg text-recovery-600 max-w-2xl">
                  Acompanhe seu progresso, economias e conquistas na jornada da recuperação.
                </p>
              </div>
              <Button
                variant={editMode ? "success" : "outline"}
                icon={editMode ? Save : Edit}
                onClick={editMode ? handleSave : () => setEditMode(true)}
              >
                {editMode ? 'Salvar' : 'Editar'}
              </Button>
            </div>
          </motion.div>

          {/* Configurações */}
          {editMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8"
            >
              <Card variant="gradient">
                <h2 className="text-xl font-bold text-recovery-800 mb-4">Configurações</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-recovery-700 mb-2">
                      Data de Início da Sobriedade
                    </label>
                    <input
                      type="date"
                      value={tempData.startDate}
                      onChange={(e) => setTempData({...tempData, startDate: e.target.value})}
                      className="w-full p-3 border border-recovery-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-recovery-700 mb-2">
                      Gasto Diário Estimado (R$)
                    </label>
                    <input
                      type="number"
                      value={tempData.dailySpending}
                      onChange={(e) => setTempData({...tempData, dailySpending: Number(e.target.value)})}
                      className="w-full p-3 border border-recovery-200 rounded-lg"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-recovery-700 mb-2">
                      Tipo de Substância
                    </label>
                    <select
                      value={tempData.substanceType}
                      onChange={(e) => setTempData({...tempData, substanceType: e.target.value})}
                      className="w-full p-3 border border-recovery-200 rounded-lg"
                    >
                      <option value="Álcool">Álcool</option>
                      <option value="Cigarro">Cigarro</option>
                      <option value="Drogas">Drogas</option>
                      <option value="Medicamentos">Medicamentos</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="success" onClick={handleSave}>
                    Salvar Alterações
                  </Button>
                  <Button variant="ghost" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Contador Principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card variant="glass" className="text-center bg-gradient-to-r from-success-500 to-primary-500 text-white">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Award className="w-20 h-20 mx-auto mb-6" />
                <h2 className="text-6xl lg:text-8xl font-bold mb-4">
                  {stats.totalDays}
                </h2>
                <p className="text-2xl font-medium mb-4">
                  {stats.totalDays === 1 ? 'Dia Sóbrio' : 'Dias Sóbrios'}
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold">{stats.totalHours.toLocaleString()}</p>
                    <p className="text-sm opacity-90">Horas</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats.totalMinutes.toLocaleString()}</p>
                    <p className="text-sm opacity-90">Minutos</p>
                  </div>
                </div>
              </motion.div>
            </Card>
          </motion.div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="default" className="text-center">
                <DollarSign className="w-12 h-12 text-success-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-success-600 mb-2">
                  {formatCurrency(stats.moneySaved)}
                </h3>
                <p className="text-recovery-600 font-medium">Economizado</p>
                <p className="text-sm text-recovery-500 mt-2">
                  {formatCurrency(sobrietyData.dailySpending)}/dia não gasto
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="default" className="text-center">
                <Heart className="w-12 h-12 text-danger-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-danger-600 mb-2">
                  {stats.healthImprovement}%
                </h3>
                <p className="text-recovery-600 font-medium">Saúde Melhorada</p>
                <div className="mt-2 bg-recovery-200 rounded-full h-2">
                  <motion.div
                    className="bg-danger-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.healthImprovement}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="default" className="text-center">
                <Calendar className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-primary-600 mb-2">
                  {stats.weeksSober}
                </h3>
                <p className="text-recovery-600 font-medium">Semanas</p>
                <p className="text-sm text-recovery-500 mt-2">
                  {stats.monthsSober} meses
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card variant="default" className="text-center">
                <Zap className="w-12 h-12 text-warning-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-warning-600 mb-2">
                  {sobrietyData.substanceType}
                </h3>
                <p className="text-recovery-600 font-medium">Livre de</p>
                <p className="text-sm text-recovery-500 mt-2">
                  Desde {new Date(sobrietyData.startDate).toLocaleDateString('pt-BR')}
                </p>
              </Card>
            </motion.div>
          </div>

          {/* Próximo Marco */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Card variant="gradient">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-recovery-800 font-display flex items-center">
                  <Target className="w-6 h-6 mr-2" />
                  Próximo Marco
                </h2>
                <span className="text-primary-600 font-bold">
                  {getNextMilestone()} dias
                </span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-recovery-600 mb-2">
                  <span>{stats.totalDays} dias</span>
                  <span>{getNextMilestone()} dias</span>
                </div>
                <div className="bg-recovery-200 rounded-full h-4">
                  <motion.div
                    className="bg-gradient-to-r from-primary-500 to-success-500 h-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getMilestoneProgress()}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
              </div>
              
              <p className="text-recovery-600 text-center">
                Faltam {getNextMilestone() - stats.totalDays} dias para seu próximo marco!
              </p>
            </Card>
          </motion.div>

          {/* Conquistas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card variant="default">
              <h2 className="text-2xl font-bold text-recovery-800 mb-6 font-display flex items-center">
                <Award className="w-6 h-6 mr-2" />
                Conquistas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sobrietyData.goals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      stats.totalDays >= goal.targetDays
                        ? 'bg-success-50 border-success-500'
                        : 'bg-recovery-50 border-recovery-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-recovery-800">
                          {goal.description}
                        </h3>
                        <p className="text-sm text-recovery-600">
                          Meta: {goal.targetDays} dias
                        </p>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        stats.totalDays >= goal.targetDays
                          ? 'bg-success-500 text-white'
                          : 'bg-recovery-300 text-recovery-600'
                      }`}>
                        {stats.totalDays >= goal.targetDays ? '✓' : '○'}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="bg-recovery-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            stats.totalDays >= goal.targetDays
                              ? 'bg-success-500'
                              : 'bg-primary-500'
                          }`}
                          style={{
                            width: `${Math.min((stats.totalDays / goal.targetDays) * 100, 100)}%`
                          }}
                        />
                      </div>
                      <p className="text-xs text-recovery-500 mt-1 text-right">
                        {Math.min(stats.totalDays, goal.targetDays)}/{goal.targetDays} dias
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}