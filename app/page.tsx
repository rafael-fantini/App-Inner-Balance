'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  TrendingUp, 
  Heart, 
  Award, 
  Shield,
  MessageCircle,
  Users,
  Target,
  Star,
  Clock
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function HomePage() {
  const [sobrietyDays, setSobrietyDays] = useState(0)
  const [moneySaved, setMoneySaved] = useState(0)
  const [dailySpending, setDailySpending] = useState(50) // R$ por dia estimado
  
  useEffect(() => {
    // Simular dados do usuário (normalmente viria do backend)
    const startDate = new Date('2024-01-01')
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    setSobrietyDays(diffDays)
    setMoneySaved(diffDays * dailySpending)
  }, [dailySpending])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-recovery-50 via-white to-primary-50">
      <Navigation />
      
      {/* Content */}
      <div className="lg:ml-64 pt-20 lg:pt-8 pb-20 lg:pb-8 px-4 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold gradient-text font-display mb-4">
              Sua Jornada de Recuperação
            </h1>
            <p className="text-lg text-recovery-600 max-w-2xl">
              Cada dia é uma vitória. Continue forte na sua caminhada!
            </p>
          </motion.div>

          {/* Estatísticas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div variants={itemVariants}>
              <Card variant="gradient" className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-success-500 rounded-full">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-success-600 mb-2">
                  {sobrietyDays}
                </h3>
                <p className="text-recovery-600 font-medium">
                  Dias Sóbrio
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card variant="gradient" className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-primary-500 rounded-full">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-primary-600 mb-2">
                  R$ {moneySaved.toLocaleString('pt-BR')}
                </h3>
                <p className="text-recovery-600 font-medium">
                  Economizado
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card variant="gradient" className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-danger-500 rounded-full">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-danger-600 mb-2">
                  98%
                </h3>
                <p className="text-recovery-600 font-medium">
                  Saúde Melhorada
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card variant="gradient" className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-warning-500 rounded-full">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-warning-600 mb-2">
                  5
                </h3>
                <p className="text-recovery-600 font-medium">
                  Conquistas
                </p>
              </Card>
            </motion.div>
          </div>

          {/* Ações Rápidas */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-2xl font-bold text-recovery-800 mb-6 font-display">
              Ações Rápidas
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card variant="default" className="text-center p-4 cursor-pointer group">
                <Shield className="w-12 h-12 text-danger-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-recovery-800 mb-1">SOS</h3>
                <p className="text-sm text-recovery-600">Emergência</p>
              </Card>

              <Card variant="default" className="text-center p-4 cursor-pointer group">
                <MessageCircle className="w-12 h-12 text-primary-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-recovery-800 mb-1">Terapeuta</h3>
                <p className="text-sm text-recovery-600">Chat Direto</p>
              </Card>

              <Card variant="default" className="text-center p-4 cursor-pointer group">
                <Users className="w-12 h-12 text-success-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-recovery-800 mb-1">Comunidade</h3>
                <p className="text-sm text-recovery-600">Apoio</p>
              </Card>

              <Card variant="default" className="text-center p-4 cursor-pointer group">
                <Target className="w-12 h-12 text-warning-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-recovery-800 mb-1">Metas</h3>
                <p className="text-sm text-recovery-600">Objetivos</p>
              </Card>
            </div>
          </motion.div>

          {/* Motivação Diária */}
          <motion.div variants={itemVariants} className="mb-8">
            <Card variant="glass" className="text-center bg-gradient-to-r from-primary-500 to-success-500 text-white">
              <Star className="w-16 h-16 mx-auto mb-4 animate-pulse-soft" />
              <h2 className="text-2xl font-bold mb-4 font-display">
                Frase do Dia
              </h2>
              <p className="text-lg italic mb-4">
                "A força não vem da capacidade física. Vem de uma vontade indomável."
              </p>
              <p className="text-primary-100">
                - Mahatma Gandhi
              </p>
            </Card>
          </motion.div>

          {/* Progresso da Semana */}
          <motion.div variants={itemVariants}>
            <Card variant="default">
              <h2 className="text-2xl font-bold text-recovery-800 mb-6 font-display flex items-center">
                <Clock className="w-6 h-6 mr-2" />
                Progresso da Semana
              </h2>
              
              <div className="space-y-4">
                {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, index) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="font-medium text-recovery-700">{day}</span>
                    <div className="flex space-x-2">
                      {index < 5 && (
                        <div className="w-4 h-4 bg-success-500 rounded-full animate-pulse-soft"></div>
                      )}
                      {index >= 5 && (
                        <div className="w-4 h-4 bg-recovery-300 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-recovery-200">
                <div className="flex justify-between items-center">
                  <span className="text-recovery-700 font-medium">Progresso da Semana</span>
                  <span className="text-success-600 font-bold">71%</span>
                </div>
                <div className="mt-2 bg-recovery-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-success-500 to-primary-500 h-3 rounded-full w-[71%] animate-pulse-soft"></div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}