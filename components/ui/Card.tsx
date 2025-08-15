'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'glass' | 'gradient' | 'dark'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  className?: string
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = true,
  className = '',
  onClick,
}) => {
  const baseClasses = 'rounded-2xl shadow-xl border transition-all duration-300'
  
  const variantClasses = {
    default: 'bg-white border-gray-100',
    glass: 'glass border-white/20',
    gradient: 'bg-gradient-to-br from-primary-50 to-recovery-50 border-primary-100',
    dark: 'bg-recovery-800 border-recovery-700 text-white',
  }
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  }
  
  const hoverClasses = hover ? 'hover:shadow-2xl hover:-translate-y-1' : ''
  const clickableClasses = onClick ? 'cursor-pointer' : ''
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${clickableClasses} ${className}`

  return (
    <motion.div
      className={classes}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

export default Card