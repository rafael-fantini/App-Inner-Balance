'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Heart, 
  MessageCircle, 
  Pin,
  Star,
  Award,
  TrendingUp,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Shield,
  Crown,
  Eye,
  ThumbsUp,
  Reply
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { toast } from 'react-toastify'

interface ForumTopic {
  id: string
  title: string
  content: string
  author: string
  authorLevel: 'member' | 'moderator' | 'veteran'
  category: string
  isPinned: boolean
  isLocked: boolean
  createdAt: string
  lastActivity: string
  views: number
  replies: number
  likes: number
  hasLiked: boolean
  tags: string[]
}

interface ForumCategory {
  id: string
  name: string
  description: string
  icon: any
  color: string
  topicCount: number
}

export default function ForumPage() {
  const [categories] = useState<ForumCategory[]>([
    {
      id: 'recovery',
      name: 'Recuperação',
      description: 'Discussões sobre o processo de recuperação',
      icon: Heart,
      color: 'danger',
      topicCount: 247
    },
    {
      id: 'support',
      name: 'Apoio e Motivação',
      description: 'Compartilhe e receba apoio da comunidade',
      icon: Star,
      color: 'warning',
      topicCount: 189
    },
    {
      id: 'tips',
      name: 'Dicas e Estratégias',
      description: 'Compartilhe técnicas e estratégias que funcionam',
      icon: Lightbulb,
      color: 'primary',
      topicCount: 156
    },
    {
      id: 'milestones',
      name: 'Marcos e Conquistas',
      description: 'Celebre suas conquistas e marcos importantes',
      icon: Award,
      color: 'success',
      topicCount: 98
    },
    {
      id: 'questions',
      name: 'Perguntas e Respostas',
      description: 'Tire dúvidas e ajude outros membros',
      icon: HelpCircle,
      color: 'secondary',
      topicCount: 134
    }
  ])

  const [topics, setTopics] = useState<ForumTopic[]>([
    {
      id: '1',
      title: 'Como lidar com gatilhos emocionais durante a recuperação?',
      content: 'Gostaria de discutir estratégias para lidar com momentos difíceis...',
      author: 'Ana Silva',
      authorLevel: 'veteran',
      category: 'recovery',
      isPinned: true,
      isLocked: false,
      createdAt: '2024-01-10T09:00:00Z',
      lastActivity: '2024-01-15T14:30:00Z',
      views: 342,
      replies: 23,
      likes: 45,
      hasLiked: false,
      tags: ['gatilhos', 'estratégias', 'emocional']
    },
    {
      id: '2',
      title: '90 dias sóbrio! Compartilhando minha experiência',
      content: 'Quero compartilhar como consegui chegar até aqui e as lições aprendidas...',
      author: 'Carlos Mendes',
      authorLevel: 'moderator',
      category: 'milestones',
      isPinned: false,
      isLocked: false,
      createdAt: '2024-01-12T10:30:00Z',
      lastActivity: '2024-01-15T16:20:00Z',
      views: 198,
      replies: 17,
      likes: 67,
      hasLiked: true,
      tags: ['90dias', 'marco', 'experiência']
    },
    {
      id: '3',
      title: 'Técnicas de respiração que me ajudaram',
      content: 'Descobri algumas técnicas de respiração que têm me ajudado muito...',
      author: 'Maria Santos',
      authorLevel: 'member',
      category: 'tips',
      isPinned: false,
      isLocked: false,
      createdAt: '2024-01-13T14:15:00Z',
      lastActivity: '2024-01-15T12:45:00Z',
      views: 156,
      replies: 12,
      likes: 34,
      hasLiked: false,
      tags: ['respiração', 'técnicas', 'ansiedade']
    },
    {
      id: '4',
      title: 'Dúvida sobre recaídas - é normal?',
      content: 'Estou com medo de ter uma recaída. É normal esse pensamento?',
      author: 'João Oliveira',
      authorLevel: 'member',
      category: 'questions',
      isPinned: false,
      isLocked: false,
      createdAt: '2024-01-14T11:20:00Z',
      lastActivity: '2024-01-15T17:10:00Z',
      views: 89,
      replies: 8,
      likes: 12,
      hasLiked: false,
      tags: ['recaída', 'medo', 'normal']
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewTopicForm, setShowNewTopicForm] = useState(false)
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
    category: 'recovery',
    tags: ''
  })

  const filteredTopics = topics.filter(topic => {
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const toggleLike = (topicId: string) => {
    setTopics(prev => prev.map(topic => 
      topic.id === topicId 
        ? { 
            ...topic, 
            likes: topic.hasLiked ? topic.likes - 1 : topic.likes + 1,
            hasLiked: !topic.hasLiked
          }
        : topic
    ))
  }

  const createTopic = () => {
    if (!newTopic.title.trim() || !newTopic.content.trim()) {
      toast.error('Preencha título e conteúdo')
      return
    }

    const topic: ForumTopic = {
      id: Date.now().toString(),
      title: newTopic.title,
      content: newTopic.content,
      author: 'Você',
      authorLevel: 'member',
      category: newTopic.category,
      isPinned: false,
      isLocked: false,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      views: 0,
      replies: 0,
      likes: 0,
      hasLiked: false,
      tags: newTopic.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    setTopics(prev => [topic, ...prev])
    setNewTopic({ title: '', content: '', category: 'recovery', tags: '' })
    setShowNewTopicForm(false)
    toast.success('Tópico criado com sucesso!')
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Agora mesmo'
    if (diffInHours < 24) return `${diffInHours}h atrás`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d atrás`
    return time.toLocaleDateString('pt-BR')
  }

  const getLevelInfo = (level: string) => {
    const levels = {
      member: { label: 'Membro', color: 'text-recovery-600', icon: User },
      moderator: { label: 'Moderador', color: 'text-primary-600', icon: Shield },
      veteran: { label: 'Veterano', color: 'text-warning-600', icon: Crown }
    }
    return levels[level as keyof typeof levels] || levels.member
  }

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0]
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
              <MessageSquare className="w-10 h-10 mr-4 text-primary-500" />
              Fórum da Comunidade
            </h1>
            <p className="text-lg text-recovery-600 max-w-2xl">
              Participe de discussões, compartilhe experiências e tire dúvidas 
              com outros membros da comunidade de recuperação.
            </p>
          </motion.div>

          {/* Estatísticas do Fórum */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card variant="gradient">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <h3 className="text-2xl font-bold text-primary-600">824</h3>
                  <p className="text-recovery-600">Tópicos</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-success-600">3,247</h3>
                  <p className="text-recovery-600">Respostas</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-warning-600">1,156</h3>
                  <p className="text-recovery-600">Membros Ativos</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-danger-600">156</h3>
                  <p className="text-recovery-600">Hoje</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar com Categorias */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Novo Tópico */}
              <Card variant="default">
                <Button
                  variant="primary"
                  size="lg"
                  icon={Plus}
                  onClick={() => setShowNewTopicForm(true)}
                  fullWidth
                >
                  Novo Tópico
                </Button>
              </Card>

              {/* Categorias */}
              <Card variant="default">
                <h2 className="text-xl font-bold text-recovery-800 mb-4">Categorias</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === 'all' 
                        ? 'bg-primary-500 text-white' 
                        : 'hover:bg-recovery-50 text-recovery-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Todas
                      </span>
                      <span className="text-xs">
                        {topics.length}
                      </span>
                    </div>
                  </button>
                  
                  {categories.map((category) => {
                    const Icon = category.icon
                    const isSelected = selectedCategory === category.id
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          isSelected 
                            ? 'bg-primary-500 text-white' 
                            : 'hover:bg-recovery-50 text-recovery-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center">
                            <Icon className="w-4 h-4 mr-2" />
                            {category.name}
                          </span>
                          <span className="text-xs">
                            {category.topicCount}
                          </span>
                        </div>
                        <p className="text-xs mt-1 opacity-80">
                          {category.description}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </Card>

              {/* Tópicos em Alta */}
              <Card variant="default">
                <h2 className="text-xl font-bold text-recovery-800 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Em Alta
                </h2>
                <div className="space-y-3">
                  {topics.slice(0, 3).map((topic, index) => (
                    <div key={topic.id} className="p-3 bg-recovery-50 rounded-lg">
                      <h3 className="font-medium text-recovery-800 text-sm line-clamp-2">
                        {topic.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2 text-xs text-recovery-500">
                        <span>{topic.views} visualizações</span>
                        <span>{topic.replies} respostas</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Lista de Tópicos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3 space-y-6"
            >
              {/* Busca e Filtros */}
              <Card variant="default">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-recovery-400" />
                    <input
                      type="text"
                      placeholder="Buscar tópicos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-recovery-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <Button variant="outline" icon={Filter}>
                    Filtros
                  </Button>
                </div>
              </Card>

              {/* Lista de Tópicos */}
              <div className="space-y-4">
                {filteredTopics.map((topic, index) => {
                  const categoryInfo = getCategoryInfo(topic.category)
                  const levelInfo = getLevelInfo(topic.authorLevel)
                  const LevelIcon = levelInfo.icon
                  const CategoryIcon = categoryInfo.icon
                  
                  return (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card variant="default" className="hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex items-start space-x-4">
                          {/* Avatar e Status */}
                          <div className="flex-shrink-0">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                              topic.authorLevel === 'veteran' ? 'bg-warning-500' : 
                              topic.authorLevel === 'moderator' ? 'bg-primary-500' : 'bg-recovery-500'
                            }`}>
                              {topic.author.charAt(0)}
                            </div>
                          </div>

                          {/* Conteúdo do Tópico */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  {topic.isPinned && (
                                    <Pin className="w-4 h-4 text-warning-500 mr-2" />
                                  )}
                                  <CategoryIcon className={`w-4 h-4 mr-2 text-${categoryInfo.color}-500`} />
                                  <span className={`text-xs px-2 py-1 rounded-full bg-${categoryInfo.color}-50 text-${categoryInfo.color}-600`}>
                                    {categoryInfo.name}
                                  </span>
                                </div>
                                
                                <h3 className="text-lg font-semibold text-recovery-800 mb-2 hover:text-primary-600 transition-colors">
                                  {topic.title}
                                </h3>
                                
                                <p className="text-recovery-600 text-sm mb-3 line-clamp-2">
                                  {topic.content}
                                </p>
                                
                                {/* Tags */}
                                {topic.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {topic.tags.map((tag, tagIndex) => (
                                      <span
                                        key={tagIndex}
                                        className="text-xs px-2 py-1 bg-recovery-100 text-recovery-600 rounded-full"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Informações do Autor */}
                                <div className="flex items-center text-xs text-recovery-500">
                                  <span className="flex items-center mr-4">
                                    por <span className="font-medium mx-1">{topic.author}</span>
                                    <LevelIcon className={`w-3 h-3 ml-1 ${levelInfo.color}`} />
                                  </span>
                                  <span className="flex items-center mr-4">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {formatTimeAgo(topic.createdAt)}
                                  </span>
                                  <span>
                                    Última atividade: {formatTimeAgo(topic.lastActivity)}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Estatísticas */}
                              <div className="text-center space-y-2 ml-4">
                                <div className="flex items-center space-x-4 text-xs text-recovery-500">
                                  <span className="flex items-center">
                                    <Eye className="w-3 h-3 mr-1" />
                                    {topic.views}
                                  </span>
                                  <span className="flex items-center">
                                    <Reply className="w-3 h-3 mr-1" />
                                    {topic.replies}
                                  </span>
                                </div>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleLike(topic.id)
                                  }}
                                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition-colors ${
                                    topic.hasLiked 
                                      ? 'bg-danger-100 text-danger-600' 
                                      : 'bg-recovery-100 text-recovery-600 hover:bg-recovery-200'
                                  }`}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>{topic.likes}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              {filteredTopics.length === 0 && (
                <Card variant="default" className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-recovery-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-recovery-600 mb-2">
                    Nenhum tópico encontrado
                  </h3>
                  <p className="text-recovery-500">
                    Tente ajustar os filtros ou seja o primeiro a criar um tópico!
                  </p>
                </Card>
              )}
            </motion.div>
          </div>

          {/* Modal Novo Tópico */}
          {showNewTopicForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowNewTopicForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-recovery-800 mb-6">Criar Novo Tópico</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-recovery-700 mb-2">
                        Categoria
                      </label>
                      <select
                        value={newTopic.category}
                        onChange={(e) => setNewTopic(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-3 border border-recovery-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-recovery-700 mb-2">
                        Título
                      </label>
                      <input
                        type="text"
                        value={newTopic.title}
                        onChange={(e) => setNewTopic(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Digite o título do seu tópico"
                        className="w-full p-3 border border-recovery-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-recovery-700 mb-2">
                        Conteúdo
                      </label>
                      <textarea
                        value={newTopic.content}
                        onChange={(e) => setNewTopic(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Descreva seu tópico em detalhes..."
                        className="w-full p-3 border border-recovery-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={6}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-recovery-700 mb-2">
                        Tags (separadas por vírgula)
                      </label>
                      <input
                        type="text"
                        value={newTopic.tags}
                        onChange={(e) => setNewTopic(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="exemplo: recuperação, apoio, dicas"
                        className="w-full p-3 border border-recovery-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      variant="ghost"
                      onClick={() => setShowNewTopicForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      onClick={createTopic}
                    >
                      Criar Tópico
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}