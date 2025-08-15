'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Video, 
  Calendar,
  Clock,
  User,
  Star,
  Shield,
  Heart,
  Paperclip,
  Smile,
  MoreVertical
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { toast } from 'react-toastify'

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  type: 'text' | 'image' | 'system'
  isTherapist: boolean
}

export default function TherapistPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'therapist',
      senderName: 'Dr. Gedalias Mota',
      content: 'Olá! Seja bem-vindo(a) ao nosso espaço de conversa. Como você está se sentindo hoje?',
      timestamp: '2024-01-15T10:00:00Z',
      type: 'text',
      isTherapist: true
    },
    {
      id: '2',
      senderId: 'user',
      senderName: 'Você',
      content: 'Olá Dr. Gedalias! Estou me sentindo um pouco ansioso hoje, mas determinado a continuar minha jornada.',
      timestamp: '2024-01-15T10:05:00Z',
      type: 'text',
      isTherapist: false
    },
    {
      id: '3',
      senderId: 'therapist',
      senderName: 'Dr. Gedalias Mota',
      content: 'É completamente normal sentir ansiedade durante o processo de recuperação. O importante é que você está reconhecendo seus sentimentos e mantendo o compromisso. Isso mostra uma grande força interior. Gostaria de conversar sobre o que especificamente tem causado essa ansiedade?',
      timestamp: '2024-01-15T10:08:00Z',
      type: 'text',
      isTherapist: true
    }
  ])
  
  const [newMessage, setNewMessage] = useState('')
  const [isOnline, setIsOnline] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'Você',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      isTherapist: false
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simular resposta do terapeuta
    setIsTyping(true)
    setTimeout(() => {
      const responses = [
        'Entendo sua preocupação. Vamos trabalhar juntos para encontrar estratégias que funcionem para você.',
        'Muito bem! Esse tipo de autoconhecimento é fundamental para sua recuperação.',
        'Lembre-se: cada dia sóbrio é uma vitória. Você está no caminho certo.',
        'Gostaria de marcar uma sessão presencial para conversarmos mais profundamente sobre isso?',
        'Seus sentimentos são válidos. É importante expressá-los e trabalharmos em cima deles.',
        'Que estratégias têm funcionado melhor para você nos momentos difíceis?'
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      const therapistMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'therapist',
        senderName: 'Dr. Gedalias Mota',
        content: randomResponse,
        timestamp: new Date().toISOString(),
        type: 'text',
        isTherapist: true
      }

      setMessages(prev => [...prev, therapistMessage])
      setIsTyping(false)
    }, 2000)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const quickResponses = [
    'Estou me sentindo bem hoje',
    'Preciso de ajuda com ansiedade',
    'Tive um momento difícil',
    'Gostaria de marcar consulta',
    'Obrigado pelo apoio'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-recovery-50 via-white to-primary-50">
      <Navigation />
      
      <div className="lg:ml-64 pt-20 lg:pt-8 pb-20 lg:pb-8 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
          {/* Header do Chat */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="glass" className="mb-4 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-success-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                      GM
                    </div>
                    <div className={`absolute bottom-0 right-3 w-4 h-4 rounded-full border-2 border-white ${
                      isOnline ? 'bg-success-500' : 'bg-recovery-400'
                    }`} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-recovery-800 font-display">
                      Dr. Gedalias Mota
                    </h1>
                    <p className="text-recovery-600 flex items-center">
                      <Star className="w-4 h-4 text-warning-500 mr-1" />
                      Terapeuta especializado em dependência química
                    </p>
                    <p className="text-sm text-recovery-500 flex items-center mt-1">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        isOnline ? 'bg-success-500' : 'bg-recovery-400'
                      }`} />
                      {isOnline ? 'Online agora' : 'Última vez ativo há 5 min'}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" icon={Phone}>
                    Ligar
                  </Button>
                  <Button variant="outline" size="sm" icon={Video}>
                    Vídeo
                  </Button>
                  <Button variant="outline" size="sm" icon={Calendar}>
                    Agendar
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Área de Mensagens */}
          <Card variant="default" className="flex-1 flex flex-col p-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.isTherapist ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[80%] ${message.isTherapist ? 'order-2' : 'order-1'}`}>
                      <div className={`rounded-2xl p-4 shadow-lg ${
                        message.isTherapist 
                          ? 'bg-white border border-recovery-200' 
                          : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                      }`}>
                        <p className="text-sm font-medium mb-2 opacity-80">
                          {message.senderName}
                        </p>
                        <p className="text-base leading-relaxed">
                          {message.content}
                        </p>
                        <p className={`text-xs mt-2 ${
                          message.isTherapist ? 'text-recovery-500' : 'text-primary-100'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    {message.isTherapist && (
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-success-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 order-1 flex-shrink-0">
                        GM
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Indicador de digitação */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-success-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                    GM
                  </div>
                  <div className="bg-white border border-recovery-200 rounded-2xl p-4 shadow-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-recovery-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-recovery-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-recovery-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Respostas Rápidas */}
            <div className="border-t border-recovery-200 p-4">
              <div className="flex gap-2 flex-wrap mb-4">
                {quickResponses.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => setNewMessage(response)}
                    className="px-3 py-1 bg-recovery-100 text-recovery-700 rounded-full text-sm hover:bg-recovery-200 transition-colors"
                  >
                    {response}
                  </button>
                ))}
              </div>

              {/* Input de Mensagem */}
              <div className="flex items-center space-x-3">
                <button className="p-2 text-recovery-500 hover:text-recovery-700 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 text-recovery-500 hover:text-recovery-700 transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="w-full p-3 border border-recovery-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <Button
                  variant="primary"
                  size="sm"
                  icon={Send}
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="rounded-full px-4"
                >
                  Enviar
                </Button>
              </div>
            </div>
          </Card>

          {/* Informações do Terapeuta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4"
          >
            <Card variant="gradient" className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-600 mr-2" />
                  <div>
                    <p className="font-semibold text-recovery-800">Especialização</p>
                    <p className="text-sm text-recovery-600">Dependência Química</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <Clock className="w-5 h-5 text-success-600 mr-2" />
                  <div>
                    <p className="font-semibold text-recovery-800">Disponibilidade</p>
                    <p className="text-sm text-recovery-600">24/7 para emergências</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <Heart className="w-5 h-5 text-danger-600 mr-2" />
                  <div>
                    <p className="font-semibold text-recovery-800">Experiência</p>
                    <p className="text-sm text-recovery-600">15+ anos</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}