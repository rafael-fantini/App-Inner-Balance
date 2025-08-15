'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Calendar, 
  DollarSign, 
  Target, 
  Heart, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Cigarette,
  Wine,
  Pill,
  Coffee,
  Activity
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const substances = [
  { id: 'cigarette', name: 'Cigarro', icon: Cigarette, color: 'text-orange-500' },
  { id: 'alcohol', name: 'Álcool', icon: Wine, color: 'text-red-500' },
  { id: 'drugs', name: 'Drogas', icon: Pill, color: 'text-purple-500' },
  { id: 'caffeine', name: 'Cafeína', icon: Coffee, color: 'text-brown-500' },
  { id: 'other', name: 'Outro', icon: Activity, color: 'text-gray-500' }
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, setSobrietyData, setIsFirstTime, addGoal } = useAppStore()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    startDate: '',
    startTime: '00:00',
    substance: '',
    customSubstance: '',
    dailySpending: '',
    reason: '',
    goals: [] as string[]
  })

  const steps = [
    {
      title: 'Bem-vindo(a)!',
      subtitle: 'Vamos configurar sua jornada de recuperação',
      icon: Heart
    },
    {
      title: 'Quando você parou?',
      subtitle: 'Informe a data e hora exata que você decidiu parar',
      icon: Calendar
    },
    {
      title: 'O que você parou de usar?',
      subtitle: 'Selecione a substância principal',
      icon: Target
    },
    {
      title: 'Quanto você gastava?',
      subtitle: 'Estimate o valor gasto por dia (em R$)',
      icon: DollarSign
    },
    {
      title: 'Por que você decidiu parar?',
      subtitle: 'Compartilhe sua motivação (opcional)',
      icon: Heart
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinish()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = () => {
    // Validações básicas
    if (!formData.startDate) {
      toast.error('Por favor, informe a data que você parou')
      setCurrentStep(1)
      return
    }

    if (!formData.substance) {
      toast.error('Por favor, selecione a substância')
      setCurrentStep(2)
      return
    }

    // Criar data de início
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
    
    // Salvar dados de sobriedade
    const sobrietyData = {
      startDate: startDateTime,
      substance: formData.substance === 'other' ? formData.customSubstance : formData.substance,
      dailySpending: parseFloat(formData.dailySpending) || 0,
      reason: formData.reason
    }

    setSobrietyData(sobrietyData)

    // Criar metas padrão
    const defaultGoals = [
      {
        id: uuidv4(),
        title: '7 dias sem usar',
        description: 'Primeira semana de sobriedade',
        targetValue: 7,
        currentValue: 0,
        unit: 'dias',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        category: 'personal' as const,
        isCompleted: false
      },
      {
        id: uuidv4(),
        title: '30 dias de sobriedade',
        description: 'Primeiro mês limpo',
        targetValue: 30,
        currentValue: 0,
        unit: 'dias',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        category: 'personal' as const,
        isCompleted: false
      },
      {
        id: uuidv4(),
        title: '10.000 passos por dia',
        description: 'Manter-se ativo fisicamente',
        targetValue: 10000,
        currentValue: 0,
        unit: 'passos',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        category: 'health' as const,
        isCompleted: false
      }
    ]

    defaultGoals.forEach(goal => addGoal(goal))

    setIsFirstTime(false)
    toast.success('Configuração concluída! Bem-vindo à sua jornada!')
    router.push('/')
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.startDate !== ''
      case 2:
        return formData.substance !== '' && (formData.substance !== 'other' || formData.customSubstance !== '')
      default:
        return true
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-gradient-to-br from-recovery-500 to-primary-600 rounded-full mx-auto mb-6 flex items-center justify-center"
            >
              <Heart className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Olá, {user?.name}!
            </h2>
            <p className="text-gray-600 mb-8">
              Estamos aqui para apoiar sua jornada de recuperação. 
              Vamos configurar alguns dados importantes para personalizar sua experiência.
            </p>
            <div className="bg-recovery-50 rounded-lg p-4 text-sm text-recovery-700">
              💡 <strong>Dica:</strong> Todas as informações são privadas e podem ser alteradas depois.
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data que você parou
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horário aproximado
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
              📅 <strong>Importante:</strong> Esta data será usada para calcular seu tempo de sobriedade e economia financeira.
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3">
              {substances.map((substance) => {
                const Icon = substance.icon
                return (
                  <button
                    key={substance.id}
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      substance: substance.id,
                      customSubstance: '' 
                    }))}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                      formData.substance === substance.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${substance.color}`} />
                    <span className="font-medium">{substance.name}</span>
                    {formData.substance === substance.id && (
                      <CheckCircle className="w-5 h-5 text-primary-500 ml-auto" />
                    )}
                  </button>
                )
              })}
            </div>

            {formData.substance === 'other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <input
                  type="text"
                  placeholder="Especifique qual substância"
                  value={formData.customSubstance}
                  onChange={(e) => setFormData(prev => ({ ...prev, customSubstance: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </motion.div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor gasto por dia (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                <input
                  type="number"
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  value={formData.dailySpending}
                  onChange={(e) => setFormData(prev => ({ ...prev, dailySpending: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-sm text-green-700">
              💰 <strong>Dica:</strong> Este valor nos ajudará a calcular quanto você está economizando. Você pode deixar em branco se preferir.
            </div>

            {formData.dailySpending && parseFloat(formData.dailySpending) > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary-50 rounded-lg p-4"
              >
                <h4 className="font-medium text-primary-800 mb-2">Economia Projetada:</h4>
                <div className="space-y-1 text-sm text-primary-700">
                  <div>7 dias: R$ {(parseFloat(formData.dailySpending) * 7).toFixed(2)}</div>
                  <div>30 dias: R$ {(parseFloat(formData.dailySpending) * 30).toFixed(2)}</div>
                  <div>1 ano: R$ {(parseFloat(formData.dailySpending) * 365).toFixed(2)}</div>
                </div>
              </motion.div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O que te motivou a parar? (Opcional)
              </label>
              <textarea
                placeholder="Ex: Quero melhorar minha saúde, ser um exemplo para minha família..."
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <div className="bg-purple-50 rounded-lg p-4 text-sm text-purple-700">
              💜 <strong>Motivação:</strong> Lembrar do seu "por quê" pode te ajudar nos momentos difíceis. Esta mensagem aparecerá no seu dashboard.
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-recovery-50 to-primary-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Passo {currentStep + 1} de {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-recovery-500 to-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-16 h-16 bg-gradient-to-br from-recovery-500 to-primary-600 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            >
              {React.createElement(steps[currentStep].icon, { 
                className: "w-8 h-8 text-white" 
              })}
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600">
              {steps[currentStep].subtitle}
            </p>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}