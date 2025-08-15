'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
  Heart,
  Users,
  User,
  X,
  Save
} from 'lucide-react'
import { useAppStore, Goal } from '@/lib/store'
import { v4 as uuidv4 } from 'uuid'
import { format, differenceInDays, isPast } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'react-toastify'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const goalCategories = [
  { id: 'health', name: 'Saúde', icon: Heart, color: 'text-red-500' },
  { id: 'financial', name: 'Financeiro', icon: DollarSign, color: 'text-green-500' },
  { id: 'social', name: 'Social', icon: Users, color: 'text-blue-500' },
  { id: 'personal', name: 'Pessoal', icon: User, color: 'text-purple-500' }
]

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useAppStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetValue: '',
    unit: '',
    category: 'personal' as Goal['category'],
    deadline: ''
  })

  const resetForm = () => {
    setNewGoal({
      title: '',
      description: '',
      targetValue: '',
      unit: '',
      category: 'personal',
      deadline: ''
    })
  }

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetValue || !newGoal.deadline) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    const goal: Goal = {
      id: uuidv4(),
      title: newGoal.title,
      description: newGoal.description,
      targetValue: parseFloat(newGoal.targetValue),
      currentValue: 0,
      unit: newGoal.unit,
      category: newGoal.category,
      deadline: new Date(newGoal.deadline),
      isCompleted: false
    }

    addGoal(goal)
    resetForm()
    setShowAddForm(false)
    toast.success('Meta criada com sucesso!')
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setNewGoal({
      title: goal.title,
      description: goal.description,
      targetValue: goal.targetValue.toString(),
      unit: goal.unit,
      category: goal.category,
      deadline: format(goal.deadline, 'yyyy-MM-dd')
    })
    setShowAddForm(true)
  }

  const handleUpdateGoal = () => {
    if (!editingGoal || !newGoal.title || !newGoal.targetValue || !newGoal.deadline) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    const updates: Partial<Goal> = {
      title: newGoal.title,
      description: newGoal.description,
      targetValue: parseFloat(newGoal.targetValue),
      unit: newGoal.unit,
      category: newGoal.category,
      deadline: new Date(newGoal.deadline)
    }

    updateGoal(editingGoal.id, updates)
    resetForm()
    setEditingGoal(null)
    setShowAddForm(false)
    toast.success('Meta atualizada com sucesso!')
  }

  const handleDeleteGoal = (goalId: string) => {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      deleteGoal(goalId)
      toast.success('Meta excluída com sucesso!')
    }
  }

  const handleProgressUpdate = (goalId: string, newValue: number) => {
    const goal = goals.find(g => g.id === goalId)
    if (!goal) return

    const isCompleted = newValue >= goal.targetValue
    updateGoal(goalId, { 
      currentValue: newValue,
      isCompleted 
    })

    if (isCompleted && !goal.isCompleted) {
      toast.success('🎉 Parabéns! Meta concluída!')
    }
  }

  const filteredGoals = selectedCategory === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === selectedCategory)

  const completedGoals = goals.filter(g => g.isCompleted)
  const activeGoals = goals.filter(g => !g.isCompleted)
  const overdueGoals = activeGoals.filter(g => isPast(g.deadline))

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Minhas Metas</h1>
          <p className="text-gray-600">
            Defina e acompanhe seus objetivos de recuperação
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Meta
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{goals.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Concluídas</p>
              <p className="text-xl font-bold text-gray-900">{completedGoals.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Em Progresso</p>
              <p className="text-xl font-bold text-gray-900">{activeGoals.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Vencidas</p>
              <p className="text-xl font-bold text-gray-900">{overdueGoals.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas
        </button>
        {goalCategories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </button>
          )
        })}
      </div>

      {/* Lista de Metas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredGoals.map((goal) => {
            const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100)
            const isOverdue = isPast(goal.deadline) && !goal.isCompleted
            const daysLeft = differenceInDays(goal.deadline, new Date())
            const category = goalCategories.find(c => c.id === goal.category)
            const CategoryIcon = category?.icon || Target

            return (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className={`p-6 ${goal.isCompleted ? 'bg-green-50 border-green-200' : isOverdue ? 'bg-red-50 border-red-200' : ''}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${goal.isCompleted ? 'bg-green-100' : isOverdue ? 'bg-red-100' : 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
                        {goal.isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <CategoryIcon className={`w-5 h-5 ${category?.color || 'text-gray-600'}`} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                        <p className="text-sm text-gray-500">{category?.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Descrição */}
                  {goal.description && (
                    <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
                  )}

                  {/* Progresso */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progresso</span>
                      <span className="text-sm text-gray-500">
                        {goal.currentValue}/{goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          goal.isCompleted 
                            ? 'bg-green-500' 
                            : isOverdue 
                              ? 'bg-red-500' 
                              : 'bg-blue-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    
                    <div className="text-center">
                      <span className={`text-sm font-medium ${
                        goal.isCompleted 
                          ? 'text-green-600' 
                          : isOverdue 
                            ? 'text-red-600' 
                            : 'text-blue-600'
                      }`}>
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Atualizar Progresso */}
                  {!goal.isCompleted && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Atualizar progresso
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          max={goal.targetValue}
                          defaultValue={goal.currentValue}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0
                            handleProgressUpdate(goal.id, value)
                          }}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                        <span className="flex items-center text-sm text-gray-500">
                          {goal.unit}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Status e Prazo */}
                  <div className="flex items-center justify-between text-sm">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      goal.isCompleted
                        ? 'bg-green-100 text-green-800'
                        : isOverdue
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {goal.isCompleted 
                        ? 'Concluída' 
                        : isOverdue 
                          ? 'Vencida' 
                          : 'Em progresso'
                      }
                    </span>
                    
                    <span className="text-gray-500">
                      {goal.isCompleted 
                        ? 'Concluída!' 
                        : isOverdue 
                          ? `${Math.abs(daysLeft)} dias em atraso`
                          : daysLeft === 0 
                            ? 'Vence hoje' 
                            : `${daysLeft} dias restantes`
                      }
                    </span>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filteredGoals.length === 0 && (
          <div className="col-span-full">
            <Card className="p-12 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma meta encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedCategory === 'all' 
                  ? 'Crie sua primeira meta para começar a acompanhar seu progresso.'
                  : `Você não tem metas na categoria ${goalCategories.find(c => c.id === selectedCategory)?.name}.`
                }
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Criar Meta
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Modal de Adicionar/Editar Meta */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingGoal ? 'Editar Meta' : 'Nova Meta'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingGoal(null)
                      resetForm()
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Caminhar 10.000 passos por dia"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={newGoal.description}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva sua meta..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valor Meta *
                      </label>
                      <input
                        type="number"
                        value={newGoal.targetValue}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: e.target.value }))}
                        placeholder="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unidade
                      </label>
                      <input
                        type="text"
                        value={newGoal.unit}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                        placeholder="passos, dias, R$..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {goalCategories.map((category) => {
                        const Icon = category.icon
                        return (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => setNewGoal(prev => ({ ...prev, category: category.id as Goal['category'] }))}
                            className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                              newGoal.category === category.id
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${category.color}`} />
                            <span className="text-sm font-medium">{category.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prazo *
                    </label>
                    <input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingGoal(null)
                      resetForm()
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={editingGoal ? handleUpdateGoal : handleAddGoal}
                    className="flex-1 inline-flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingGoal ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}