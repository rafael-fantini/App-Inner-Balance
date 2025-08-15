'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Apple,
  Chrome,
  Heart
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setIsFirstTime } = useAppStore()
  
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simular autenticação (substituir por Firebase Auth)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const user = {
        id: uuidv4(),
        name: isLogin ? formData.email.split('@')[0] : formData.name,
        email: formData.email,
        isGuest: false
      }

      setUser(user)
      toast.success(`${isLogin ? 'Login' : 'Conta criada'} realizado com sucesso!`)
      router.push('/onboarding')
    } catch (error) {
      toast.error('Erro na autenticação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    try {
      // Simular Google Auth
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const user = {
        id: uuidv4(),
        name: 'Usuário Google',
        email: 'usuario@gmail.com',
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        isGuest: false
      }

      setUser(user)
      toast.success('Login com Google realizado!')
      router.push('/onboarding')
    } catch (error) {
      toast.error('Erro no login com Google')
    } finally {
      setLoading(false)
    }
  }

  const handleAppleAuth = async () => {
    setLoading(true)
    try {
      // Simular Apple Auth
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const user = {
        id: uuidv4(),
        name: 'Usuário Apple',
        email: 'usuario@icloud.com',
        isGuest: false
      }

      setUser(user)
      toast.success('Login com Apple realizado!')
      router.push('/onboarding')
    } catch (error) {
      toast.error('Erro no login com Apple')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = () => {
    const guestUser = {
      id: uuidv4(),
      name: 'Visitante',
      email: 'visitante@guest.com',
      isGuest: true
    }

    setUser(guestUser)
    toast.success('Entrando como visitante')
    router.push('/onboarding')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-recovery-50 to-primary-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-recovery-500 to-primary-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-xl">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-recovery-600 to-primary-600 bg-clip-text text-transparent">
            O Caminho da Recuperação
          </h1>
          <p className="text-gray-600 mt-2">
            Sua jornada de transformação começa aqui
          </p>
        </motion.div>

        <Card className="p-8">
          {/* Toggle Login/Register */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isLogin 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isLogin 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <Button
              onClick={handleGoogleAuth}
              variant="outline"
              className="w-full flex items-center justify-center gap-3 py-3"
              disabled={loading}
            >
              <Chrome className="w-5 h-5 text-red-500" />
              Continuar com Google
            </Button>

            <Button
              onClick={handleAppleAuth}
              variant="outline"
              className="w-full flex items-center justify-center gap-3 py-3"
              disabled={loading}
            >
              <Apple className="w-5 h-5 text-gray-800" />
              Continuar com Apple
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full py-3"
              loading={loading}
            >
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>
          </form>

          {/* Guest Login */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              onClick={handleGuestLogin}
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-800"
            >
              <User className="w-4 h-4 mr-2" />
              Entrar como Visitante
            </Button>
          </div>

          {/* Forgot Password */}
          {isLogin && (
            <div className="text-center mt-4">
              <button className="text-sm text-primary-600 hover:text-primary-700">
                Esqueceu sua senha?
              </button>
            </div>
          )}
        </Card>

        {/* Terms */}
        <motion.p 
          className="text-center text-xs text-gray-500 mt-6 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Ao continuar, você concorda com nossos{' '}
          <button className="text-primary-600 hover:underline">
            Termos de Uso
          </button>{' '}
          e{' '}
          <button className="text-primary-600 hover:underline">
            Política de Privacidade
          </button>
        </motion.p>
      </motion.div>
    </div>
  )
}