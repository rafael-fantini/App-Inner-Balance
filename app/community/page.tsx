'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Send, 
  Heart, 
  MessageCircle, 
  Star,
  Shield,
  Clock,
  User,
  Smile,
  Camera,
  ThumbsUp,
  Share,
  MoreVertical,
  Crown,
  Calendar,
  Award
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { toast } from 'react-toastify'

interface CommunityMessage {
  id: string
  userId: string
  userName: string
  userLevel: 'member' | 'moderator' | 'veteran'
  daysSober: number
  content: string
  timestamp: string
  type: 'text' | 'milestone' | 'support'
  likes: number
  hasLiked: boolean
}

interface OnlineUser {
  id: string
  name: string
  level: 'member' | 'moderator' | 'veteran'
  daysSober: number
  isOnline: boolean
}

export default function CommunityPage() {
  const [messages, setMessages] = useState<CommunityMessage[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'Ana Silva',
      userLevel: 'veteran',
      daysSober: 365,
      content: 'Completei 1 ano sóbria hoje! Nunca pensei que chegaria até aqui. Obrigada a todos pelo apoio! 🎉',
      timestamp: '2024-01-15T14:30:00Z',
      type: 'milestone',
      likes: 15,
      hasLiked: false
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Carlos Mendes',
      userLevel: 'moderator',
      daysSober: 180,
      content: 'Parabéns Ana! Sua jornada é inspiradora para todos nós. Continue forte! 💪',
      timestamp: '2024-01-15T14:35:00Z',
      type: 'support',
      likes: 8,
      hasLiked: true
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Maria Santos',
      userLevel: 'member',
      daysSober: 45,
      content: 'Estou passando por um momento difícil hoje. Podem me dar algumas palavras de apoio?',
      timestamp: '2024-01-15T15:00:00Z',
      type: 'support',
      likes: 3,
      hasLiked: false
    },
    {
      id: '4',
      userId: 'user4',
      userName: 'João Oliveira',
      userLevel: 'veteran',
      daysSober: 500,
      content: 'Maria, lembre-se que cada dia é uma vitória. Você já está há 45 dias, isso é incrível! Nós estamos aqui para você. 🤗',
      timestamp: '2024-01-15T15:05:00Z',
      type: 'support',
      likes: 12,
      hasLiked: false
    }
  ])

  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([
    { id: 'user1', name: 'Ana Silva', level: 'veteran', daysSober: 365, isOnline: true },
    { id: 'user2', name: 'Carlos Mendes', level: 'moderator', daysSober: 180, isOnline: true },
    { id: 'user3', name: 'Maria Santos', level: 'member', daysSober: 45, isOnline: true },
    { id: 'user4', name: 'João Oliveira', level: 'veteran', daysSober: 500, isOnline: false },
    { id: 'user5', name: 'Pedro Costa', level: 'member', daysSober: 30, isOnline: true },
    { id: 'user6', name: 'Lucia Ferreira', level: 'moderator', daysSober: 200, isOnline: false }
  ])

  const [newMessage, setNewMessage] = useState('')
  const [selectedMessageType, setSelectedMessageType] = useState<'text' | 'milestone' | 'support'>('text')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: CommunityMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'Você',
      userLevel: 'member',
      daysSober: 75,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: selectedMessageType,
      likes: 0,
      hasLiked: false
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simular reação da comunidade
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id 
          ? { ...msg, likes: Math.floor(Math.random() * 5) + 1 }
          : msg
      ))
    }, 2000)

    toast.success('Mensagem enviada para a comunidade!')
  }

  const toggleLike = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { 
            ...msg, 
            likes: msg.hasLiked ? msg.likes - 1 : msg.likes + 1,
            hasLiked: !msg.hasLiked
          }
        : msg
    ))
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getLevelInfo = (level: string) => {
    const levels = {
      member: { label: 'Membro', color: 'text-recovery-600', icon: User },
      moderator: { label: 'Moderador', color: 'text-primary-600', icon: Shield },
      veteran: { label: 'Veterano', color: 'text-warning-600', icon: Crown }
    }
    return levels[level as keyof typeof levels] || levels.member
  }

  const getMessageTypeColor = (type: string) => {
    const types = {
      text: 'border-l-recovery-400',
      milestone: 'border-l-success-500 bg-success-50',
      support: 'border-l-primary-500 bg-primary-50'
    }
    return types[type as keyof typeof types] || types.text
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-recovery-50 via-white to-primary-50">
      <Navigation />
      
      <div className="lg:ml-64 pt-20 lg:pt-8 pb-20 lg:pb-8 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl lg:text-5xl font-bold gradient-text font-display mb-4 flex items-center">
              <Users className="w-10 h-10 mr-4 text-primary-500" />
              Comunidade de Apoio
            </h1>
            <p className="text-lg text-recovery-600 max-w-2xl">
              Conecte-se com outras pessoas em jornadas similares. Compartilhe experiências, 
              celebre conquistas e ofereça apoio mútuo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Lista de Usuários Online */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card variant="default">
                <h2 className="text-xl font-bold text-recovery-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Membros Online ({onlineUsers.filter(u => u.isOnline).length})
                </h2>
                
                <div className="space-y-3">
                  {onlineUsers.map((user, index) => {
                    const levelInfo = getLevelInfo(user.level)
                    const LevelIcon = levelInfo.icon
                    
                    return (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center p-3 rounded-lg transition-colors ${
                          user.isOnline ? 'bg-success-50 border border-success-200' : 'bg-recovery-100'
                        }`}
                      >
                        <div className="relative">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 ${
                            user.level === 'veteran' ? 'bg-warning-500' : 
                            user.level === 'moderator' ? 'bg-primary-500' : 'bg-recovery-500'
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div className={`absolute bottom-0 right-2 w-3 h-3 rounded-full border-2 border-white ${
                            user.isOnline ? 'bg-success-500' : 'bg-recovery-400'
                          }`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center">
                            <p className="font-medium text-recovery-800 text-sm">{user.name}</p>
                            <LevelIcon className={`w-3 h-3 ml-1 ${levelInfo.color}`} />
                          </div>
                          <p className="text-xs text-recovery-600">{user.daysSober} dias sóbrio</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Estatísticas da Comunidade */}
                <div className="mt-6 pt-4 border-t border-recovery-200">
                  <h3 className="font-semibold text-recovery-800 mb-3">Estatísticas</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-recovery-600">Total de membros</span>
                      <span className="font-semibold text-recovery-800">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-recovery-600">Ativos hoje</span>
                      <span className="font-semibold text-success-600">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-recovery-600">Marcos celebrados</span>
                      <span className="font-semibold text-warning-600">43</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Chat da Comunidade */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3"
            >
              <Card variant="default" className="h-[600px] flex flex-col p-0">
                {/* Header do Chat */}
                <div className="p-4 border-b border-recovery-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-recovery-800">Chat da Comunidade</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedMessageType('text')}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedMessageType === 'text' 
                            ? 'bg-recovery-500 text-white' 
                            : 'bg-recovery-100 text-recovery-600'
                        }`}
                      >
                        Geral
                      </button>
                      <button
                        onClick={() => setSelectedMessageType('milestone')}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedMessageType === 'milestone' 
                            ? 'bg-success-500 text-white' 
                            : 'bg-recovery-100 text-recovery-600'
                        }`}
                      >
                        Marco
                      </button>
                      <button
                        onClick={() => setSelectedMessageType('support')}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedMessageType === 'support' 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-recovery-100 text-recovery-600'
                        }`}
                      >
                        Apoio
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((message, index) => {
                      const levelInfo = getLevelInfo(message.userLevel)
                      const LevelIcon = levelInfo.icon
                      
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`border-l-4 p-4 rounded-r-lg ${getMessageTypeColor(message.type)}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 ${
                                message.userLevel === 'veteran' ? 'bg-warning-500' : 
                                message.userLevel === 'moderator' ? 'bg-primary-500' : 'bg-recovery-500'
                              }`}>
                                {message.userName.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <span className="font-semibold text-recovery-800">{message.userName}</span>
                                  <LevelIcon className={`w-4 h-4 ml-1 ${levelInfo.color}`} />
                                  <span className="text-xs text-recovery-500 ml-2">
                                    {message.daysSober} dias sóbrio
                                  </span>
                                </div>
                                <span className="text-xs text-recovery-500">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                            </div>
                            
                            {message.type === 'milestone' && (
                              <Award className="w-5 h-5 text-warning-500" />
                            )}
                            {message.type === 'support' && (
                              <Heart className="w-5 h-5 text-primary-500" />
                            )}
                          </div>
                          
                          <p className="text-recovery-700 mb-3 leading-relaxed">
                            {message.content}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => toggleLike(message.id)}
                              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                                message.hasLiked 
                                  ? 'bg-danger-100 text-danger-600' 
                                  : 'bg-recovery-100 text-recovery-600 hover:bg-recovery-200'
                              }`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span>{message.likes}</span>
                            </button>
                            
                            <div className="flex space-x-2">
                              <button className="p-1 text-recovery-500 hover:text-recovery-700 transition-colors">
                                <MessageCircle className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-recovery-500 hover:text-recovery-700 transition-colors">
                                <Share className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input de Mensagem */}
                <div className="p-4 border-t border-recovery-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                        placeholder={`Compartilhe uma ${
                          selectedMessageType === 'milestone' ? 'conquista' :
                          selectedMessageType === 'support' ? 'necessidade de apoio' : 'mensagem'
                        }...`}
                        className="w-full p-3 border border-recovery-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <button className="p-2 text-recovery-500 hover:text-recovery-700 transition-colors">
                        <Camera className="w-5 h-5" />
                      </button>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Send}
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="rounded-full"
                      >
                        Enviar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-recovery-500 text-center">
                    Presione Enter para enviar • Shift+Enter para nova linha
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}