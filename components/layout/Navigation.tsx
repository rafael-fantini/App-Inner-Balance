'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Home, 
  Shield, 
  Calculator, 
  BookOpen, 
  MessageCircle, 
  Users, 
  MessageSquare,
  User,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/sos', label: 'SOS', icon: Shield },
    { href: '/tracker', label: 'Contador', icon: Calculator },
    { href: '/categories', label: 'Categorias', icon: BookOpen },
    { href: '/therapist', label: 'Terapeuta', icon: MessageCircle },
    { href: '/community', label: 'Comunidade', icon: Users },
    { href: '/forum', label: 'Fórum', icon: MessageSquare },
    { href: '/profile', label: 'Perfil', icon: User },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold gradient-text font-display">
            O Caminho da Recuperação
          </h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200"
        >
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'hover:bg-primary-50 text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white/90 backdrop-blur-md border-r border-gray-200 z-40">
        <div className="p-6">
          <h1 className="text-2xl font-bold gradient-text font-display mb-8">
            O Caminho da Recuperação
          </h1>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.href)
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'hover:bg-primary-50 text-gray-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${
                    isActive(item.href) ? '' : 'group-hover:scale-110'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200">
        <div className="flex justify-around items-center py-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-500'
                    : 'text-gray-500 hover:text-primary-500'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Navigation