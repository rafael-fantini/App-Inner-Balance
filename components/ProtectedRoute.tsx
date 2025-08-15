'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'

// Rotas que não precisam de autenticação
const publicRoutes = ['/auth/login']

// Rotas que precisam de autenticação mas não mostram navegação
const authOnlyRoutes = ['/onboarding']

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isFirstTime, user } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = publicRoutes.includes(pathname)
      const isAuthOnlyRoute = authOnlyRoutes.includes(pathname)

      // Se não está autenticado e não é rota pública, redirecionar para login
      if (!isAuthenticated && !isPublicRoute) {
        router.push('/auth/login')
        return
      }

      // Se está autenticado, é primeira vez e não está no onboarding, redirecionar
      if (isAuthenticated && isFirstTime && pathname !== '/onboarding') {
        router.push('/onboarding')
        return
      }

      // Se está autenticado, não é primeira vez e está numa rota de auth, redirecionar para home
      if (isAuthenticated && !isFirstTime && (isPublicRoute || isAuthOnlyRoute)) {
        router.push('/')
        return
      }
    }
  }, [isAuthenticated, isFirstTime, pathname, router, isLoading])

  // Tela de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-recovery-50 to-primary-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-recovery-500 to-primary-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-xl"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Heart className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1 
            className="text-2xl font-bold bg-gradient-to-r from-recovery-600 to-primary-600 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            O Caminho da Recuperação
          </motion.h1>
          <motion.div
            className="flex items-center justify-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="w-2 h-2 bg-recovery-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-recovery-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-recovery-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </motion.div>
        </motion.div>
      </div>
    )
  }

  const isPublicRoute = publicRoutes.includes(pathname)
  const isAuthOnlyRoute = authOnlyRoutes.includes(pathname)
  const showNavigation = isAuthenticated && !isFirstTime && !isPublicRoute && !isAuthOnlyRoute

  // Se deve mostrar navegação, envolve com o layout
  if (showNavigation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-6 pb-20 lg:pb-6">
            {children}
          </div>
        </main>
      </div>
    )
  }

  // Caso contrário, renderiza apenas o children
  return <>{children}</>
}