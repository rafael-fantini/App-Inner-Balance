'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Award, 
  Star, 
  Clock, 
  Heart,
  ThumbsUp,
  Zap,
  Crown,
  Calendar,
  Target,
  CheckCircle,
  Lock
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { differenceInDays } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const reactionEmojis = {
  heart: { emoji: '❤️', label: 'Coração' },
  thumbs_up: { emoji: '👍', label: 'Curtir' },
  clap: { emoji: '👏', label: 'Palmas' },
  fire: { emoji: '🔥', label: 'Fogo' },
  trophy: { emoji: '🏆', label: 'Troféu' }
}

export default function AchievementsPage() {
  const { 
    user, 
    sobrietyData, 
    achievements, 
    achievementNotifications,
    unlockAchievement,
    addAchievementNotification,
    addReactionToAchievement
  } = useAppStore()

  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null)

  // Verificar e desbloquear conquistas baseadas nos dias de sobriedade
  useEffect(() => {
    if (sobrietyData && user) {
      const daysSober = differenceInDays(new Date(), new Date(sobrietyData.startDate))
      
      achievements.forEach(achievement => {
        if (!achievement.isUnlocked && daysSober >= achievement.days) {
          // Desbloquear a conquista
          unlockAchievement(achievement.id)
          
          // Criar notificação para a comunidade
          const notification = {
            id: uuidv4(),
            userId: user.id,
            userName: user.name,
            achievement: { ...achievement, isUnlocked: true, unlockedAt: new Date() },
            timestamp: new Date(),
            reactions: []
          }
          
          addAchievementNotification(notification)
          
          // Mostrar toast de parabéns
          toast.success(`🎉 Parabéns! Você desbloqueou: ${achievement.name}!`, {
            autoClose: 5000
          })
        }
      })
    }
  }, [sobrietyData, achievements, user, unlockAchievement, addAchievementNotification])

  const handleReaction = (notificationId: string, reactionType: keyof typeof reactionEmojis) => {
    if (!user) return
    
    addReactionToAchievement(notificationId, {
      userId: user.id,
      type: reactionType
    })
    
    toast.success(`${reactionEmojis[reactionType].emoji} Reação adicionada!`)
  }

  const getAchievementProgress = () => {
    if (!sobrietyData) return 0
    const daysSober = differenceInDays(new Date(), new Date(sobrietyData.startDate))
    const unlockedCount = achievements.filter(a => a.isUnlocked).length
    return { daysSober, unlockedCount, totalCount: achievements.length }
  }

  const progress = getAchievementProgress()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Conquistas</h1>
          <p className="text-gray-600">
            Comemore cada marco da sua jornada de recuperação
          </p>
        </motion.div>

        {/* Progresso Geral */}
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-600">
                {typeof progress === 'object' ? progress.daysSober : 0}
              </div>
              <div className="text-sm text-gray-600">Dias Limpo</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {typeof progress === 'object' ? `${progress.unlockedCount}/${progress.totalCount}` : '0/6'}
              </div>
              <div className="text-sm text-gray-600">Conquistas Desbloqueadas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">
                {typeof progress === 'object' ? Math.round((progress.unlockedCount / progress.totalCount) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Progresso Total</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Grid de Conquistas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`p-6 cursor-pointer transition-all duration-300 ${
                achievement.isUnlocked 
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg' 
                  : 'bg-gray-50 border-gray-200'
              }`}
              onClick={() => setSelectedAchievement(selectedAchievement === achievement.id ? null : achievement.id)}
            >
              <div className="text-center">
                {/* Medalha */}
                <div className="relative mb-4">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                    achievement.isUnlocked ? 'opacity-100' : 'opacity-40'
                  }`}>
                    <img 
                      src={achievement.iconUrl} 
                      alt={achievement.name}
                      className="w-full h-full"
                    />
                  </div>
                  
                  {!achievement.isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {achievement.isUnlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2"
                    >
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Informações */}
                <h3 className={`font-bold text-lg mb-2 ${
                  achievement.isUnlocked ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {achievement.name}
                </h3>
                
                <p className={`text-sm mb-3 ${
                  achievement.isUnlocked ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>

                <div className="flex items-center justify-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span className={achievement.isUnlocked ? 'text-gray-600' : 'text-gray-400'}>
                    {achievement.days} {achievement.days === 1 ? 'dia' : 'dias'}
                  </span>
                </div>

                {achievement.isUnlocked && achievement.unlockedAt && (
                  <div className="mt-3 text-xs text-green-600">
                    ✅ Desbloqueada em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                  </div>
                )}

                {/* Detalhes expandidos */}
                <AnimatePresence>
                  {selectedAchievement === achievement.id && achievement.isUnlocked && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <div className="text-xs text-gray-500 space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Trophy className="w-3 h-3" />
                          <span>Conquista especial desbloqueada!</span>
                        </div>
                        
                        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-2">
                          <p className="text-yellow-800 font-medium">
                            🎉 Você é incrível! Continue assim!
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Feed de Notificações da Comunidade */}
      {achievementNotifications.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Conquistas da Comunidade</h2>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {achievementNotifications.slice(0, 10).map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200"
              >
                <div className="flex items-start gap-4">
                  {/* Medalha */}
                  <div className="w-12 h-12 flex-shrink-0">
                    <img 
                      src={notification.achievement.iconUrl} 
                      alt={notification.achievement.name}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1">
                    <p className="text-gray-800 mb-2">
                      <span className="font-bold text-blue-600">{notification.userName}</span>
                      {' '}acaba de conquistar a medalha{' '}
                      <span className="font-bold text-purple-600">
                        {notification.achievement.name}
                      </span>
                      ! 🎉
                    </p>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {notification.achievement.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleString('pt-BR')}
                      </span>

                      {/* Reações */}
                      <div className="flex items-center gap-2">
                        {Object.entries(reactionEmojis).map(([type, { emoji, label }]) => {
                          const reactionCount = notification.reactions.filter(r => r.type === type).length
                          const userReacted = notification.reactions.some(r => r.type === type && r.userId === user?.id)
                          
                          return (
                            <button
                              key={type}
                              onClick={() => handleReaction(notification.id, type as keyof typeof reactionEmojis)}
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
                                userReacted 
                                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={label}
                            >
                              <span>{emoji}</span>
                              {reactionCount > 0 && <span>{reactionCount}</span>}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Próximas Conquistas */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Próximas Conquistas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements
            .filter(a => !a.isUnlocked)
            .slice(0, 4)
            .map((achievement) => {
              const daysRemaining = sobrietyData 
                ? achievement.days - differenceInDays(new Date(), new Date(sobrietyData.startDate))
                : achievement.days
              
              return (
                <div key={achievement.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 opacity-40">
                      <img 
                        src={achievement.iconUrl} 
                        alt={achievement.name}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                      <p className="text-sm text-gray-600">
                        {daysRemaining > 0 
                          ? `${daysRemaining} dias restantes`
                          : 'Disponível agora!'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </Card>
    </div>
  )
}