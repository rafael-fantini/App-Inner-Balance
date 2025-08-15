'use client'

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Camera, 
  FileText, 
  Image, 
  Plus, 
  Edit3, 
  Trash2,
  Save,
  X,
  Heart,
  Star,
  Target,
  Lightbulb,
  Coffee
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { toast } from 'react-toastify'
import { useDropzone } from 'react-dropzone'

interface CategoryItem {
  id: string
  type: 'photo' | 'text' | 'photo-text'
  title: string
  content: string
  imageUrl?: string
  createdAt: string
}

interface Category {
  id: string
  name: string
  description: string
  icon: any
  color: string
  items: CategoryItem[]
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Motivação Diária',
      description: 'Frases, imagens e pensamentos motivacionais',
      icon: Heart,
      color: 'danger',
      items: [
        {
          id: '1',
          type: 'text',
          title: 'Força Interior',
          content: 'Cada dia que passo sóbrio é uma vitória. Sou mais forte do que qualquer vício.',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          type: 'photo-text',
          title: 'Novo Amanhecer',
          content: 'Hoje é um novo dia, uma nova oportunidade de crescer.',
          imageUrl: '/api/placeholder/400/300',
          createdAt: '2024-01-14'
        }
      ]
    },
    {
      id: '2',
      name: 'Objetivos e Metas',
      description: 'Defina e acompanhe seus objetivos de recuperação',
      icon: Target,
      color: 'primary',
      items: [
        {
          id: '3',
          type: 'text',
          title: 'Meta 90 dias',
          content: 'Quero completar 90 dias sóbrio e usar esse dinheiro para uma viagem especial.',
          createdAt: '2024-01-13'
        }
      ]
    },
    {
      id: '3',
      name: 'Reflexões e Aprendizados',
      description: 'Registre suas reflexões e lições aprendidas',
      icon: Lightbulb,
      color: 'warning',
      items: [
        {
          id: '4',
          type: 'photo-text',
          title: 'Lição de Hoje',
          content: 'Aprendi que é normal ter momentos difíceis. O importante é não desistir.',
          imageUrl: '/api/placeholder/400/300',
          createdAt: '2024-01-12'
        }
      ]
    },
    {
      id: '4',
      name: 'Momentos Especiais',
      description: 'Capture e celebre seus momentos importantes',
      icon: Star,
      color: 'success',
      items: [
        {
          id: '5',
          type: 'photo',
          title: 'Primeiro mês sóbrio',
          content: '',
          imageUrl: '/api/placeholder/400/300',
          createdAt: '2024-01-11'
        }
      ]
    },
    {
      id: '5',
      name: 'Atividades Saudáveis',
      description: 'Documente suas novas atividades e hobbies',
      icon: Coffee,
      color: 'secondary',
      items: [
        {
          id: '6',
          type: 'text',
          title: 'Caminhada Matinal',
          content: 'Substituí o primeiro drink do dia por uma caminhada de 30 minutos. Me sinto muito melhor!',
          createdAt: '2024-01-10'
        }
      ]
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState<Partial<CategoryItem>>({
    type: 'text',
    title: '',
    content: '',
    imageUrl: ''
  })
  const [uploadedImage, setUploadedImage] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setUploadedImage(result)
        setNewItem(prev => ({ ...prev, imageUrl: result }))
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  })

  const addItem = () => {
    if (!selectedCategory || !newItem.title) {
      toast.error('Selecione uma categoria e adicione um título')
      return
    }

    if (newItem.type === 'text' && !newItem.content) {
      toast.error('Adicione um conteúdo de texto')
      return
    }

    if ((newItem.type === 'photo' || newItem.type === 'photo-text') && !newItem.imageUrl) {
      toast.error('Adicione uma imagem')
      return
    }

    const item: CategoryItem = {
      id: Date.now().toString(),
      type: newItem.type as 'photo' | 'text' | 'photo-text',
      title: newItem.title,
      content: newItem.content || '',
      imageUrl: newItem.imageUrl,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setCategories(prev => prev.map(cat => 
      cat.id === selectedCategory 
        ? { ...cat, items: [...cat.items, item] }
        : cat
    ))

    // Reset form
    setNewItem({
      type: 'text',
      title: '',
      content: '',
      imageUrl: ''
    })
    setUploadedImage('')
    setShowAddForm(false)
    toast.success('Item adicionado com sucesso!')
  }

  const removeItem = (categoryId: string, itemId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, items: cat.items.filter(item => item.id !== itemId) }
        : cat
    ))
    toast.success('Item removido')
  }

  const getColorClasses = (color: string) => {
    const colors = {
      danger: 'text-danger-500 bg-danger-50 border-danger-200',
      primary: 'text-primary-500 bg-primary-50 border-primary-200',
      warning: 'text-warning-500 bg-warning-50 border-warning-200',
      success: 'text-success-500 bg-success-50 border-success-200',
      secondary: 'text-recovery-500 bg-recovery-50 border-recovery-200'
    }
    return colors[color as keyof typeof colors] || colors.primary
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-recovery-50 via-white to-primary-50">
      <Navigation />
      
      <div className="lg:ml-64 pt-20 lg:pt-8 pb-20 lg:pb-8 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl lg:text-5xl font-bold gradient-text font-display mb-4 flex items-center">
              <BookOpen className="w-10 h-10 mr-4 text-primary-500" />
              Categorias Pessoais
            </h1>
            <p className="text-lg text-recovery-600 max-w-2xl">
              Organize seus pensamentos, objetivos e momentos especiais em categorias personalizadas.
            </p>
          </motion.div>

          {/* Add Item Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8"
            >
              <Card variant="gradient">
                <h2 className="text-xl font-bold text-recovery-800 mb-4">Adicionar Novo Item</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-recovery-700 mb-2">
                      Categoria
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 border border-recovery-200 rounded-lg"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-recovery-700 mb-2">
                      Tipo de Conteúdo
                    </label>
                    <select
                      value={newItem.type}
                      onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full p-3 border border-recovery-200 rounded-lg"
                    >
                      <option value="text">Apenas Texto</option>
                      <option value="photo">Apenas Foto</option>
                      <option value="photo-text">Foto + Texto</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-recovery-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Digite um título para este item"
                    className="w-full p-3 border border-recovery-200 rounded-lg"
                  />
                </div>

                {(newItem.type === 'text' || newItem.type === 'photo-text') && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-recovery-700 mb-2">
                      Conteúdo
                    </label>
                    <textarea
                      value={newItem.content}
                      onChange={(e) => setNewItem(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Escreva seu conteúdo aqui..."
                      className="w-full p-3 border border-recovery-200 rounded-lg resize-none"
                      rows={4}
                    />
                  </div>
                )}

                {(newItem.type === 'photo' || newItem.type === 'photo-text') && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-recovery-700 mb-2">
                      Imagem
                    </label>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDragActive ? 'border-primary-500 bg-primary-50' : 'border-recovery-300'
                      }`}
                    >
                      <input {...getInputProps()} />
                      {uploadedImage ? (
                        <div className="space-y-4">
                          <img 
                            src={uploadedImage} 
                            alt="Preview" 
                            className="max-w-full h-48 object-cover rounded-lg mx-auto"
                          />
                          <p className="text-success-600">Imagem carregada com sucesso!</p>
                        </div>
                      ) : (
                        <div>
                          <Camera className="w-12 h-12 text-recovery-400 mx-auto mb-4" />
                          <p className="text-recovery-600">
                            {isDragActive ? 'Solte a imagem aqui' : 'Clique ou arraste uma imagem aqui'}
                          </p>
                          <p className="text-sm text-recovery-500 mt-2">
                            JPG, PNG, GIF até 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="success" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Item
                  </Button>
                  <Button variant="ghost" onClick={() => {
                    setShowAddForm(false)
                    setNewItem({ type: 'text', title: '', content: '', imageUrl: '' })
                    setUploadedImage('')
                  }}>
                    Cancelar
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Add Button */}
          {!showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 text-center"
            >
              <Button
                variant="primary"
                size="lg"
                icon={Plus}
                onClick={() => setShowAddForm(true)}
              >
                Adicionar Novo Item
              </Button>
            </motion.div>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="default" className="h-full">
                  <div className="flex items-center mb-6">
                    <div className={`p-3 rounded-full mr-4 ${getColorClasses(category.color)}`}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-recovery-800 font-display">
                        {category.name}
                      </h2>
                      <p className="text-sm text-recovery-600">{category.description}</p>
                    </div>
                  </div>

                  {/* Category Items */}
                  <div className="space-y-4">
                    {category.items.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-recovery-300 mx-auto mb-4" />
                        <p className="text-recovery-500">Nenhum item nesta categoria</p>
                        <p className="text-sm text-recovery-400 mt-2">
                          Adicione seu primeiro item usando o botão acima
                        </p>
                      </div>
                    ) : (
                      category.items.map((item, itemIndex) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: itemIndex * 0.1 }}
                          className="p-4 bg-recovery-50 rounded-xl border border-recovery-200"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-recovery-800">{item.title}</h3>
                            <div className="flex gap-1">
                              <button
                                onClick={() => removeItem(category.id, item.id)}
                                className="p-1 text-danger-600 hover:bg-danger-100 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {item.imageUrl && (
                            <img 
                              src={item.imageUrl} 
                              alt={item.title}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                          )}

                          {item.content && (
                            <p className="text-recovery-700 mb-3">{item.content}</p>
                          )}

                          <div className="flex items-center justify-between text-xs text-recovery-500">
                            <span className="flex items-center">
                              {item.type === 'photo' && <Image className="w-3 h-3 mr-1" />}
                              {item.type === 'text' && <FileText className="w-3 h-3 mr-1" />}
                              {item.type === 'photo-text' && <Camera className="w-3 h-3 mr-1" />}
                              {item.type === 'photo' && 'Foto'}
                              {item.type === 'text' && 'Texto'}
                              {item.type === 'photo-text' && 'Foto + Texto'}
                            </span>
                            <span>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* Category Stats */}
                  <div className="mt-6 pt-4 border-t border-recovery-200">
                    <p className="text-sm text-recovery-500 text-center">
                      {category.items.length} {category.items.length === 1 ? 'item' : 'itens'} nesta categoria
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}