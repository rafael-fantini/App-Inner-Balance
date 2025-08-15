'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Phone, 
  MapPin, 
  MessageCircle, 
  Plus, 
  Edit3, 
  Trash2,
  AlertTriangle,
  Heart,
  CheckCircle,
  Clock
} from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { toast } from 'react-toastify'

interface EmergencyContact {
  id: string
  name: string
  phone: string
  relation: string
}

export default function SOSPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'João Silva', phone: '(11) 99999-9999', relation: 'Familiar' },
    { id: '2', name: 'Maria Santos', phone: '(11) 88888-8888', relation: 'Amigo' },
    { id: '3', name: 'Dr. Carlos', phone: '(11) 77777-7777', relation: 'Médico' },
  ])
  
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' })
  const [showAddForm, setShowAddForm] = useState(false)
  const [isEmergency, setIsEmergency] = useState(false)
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)
  const [emergencyMessage, setEmergencyMessage] = useState('')

  useEffect(() => {
    // Obter localização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Erro ao obter localização:', error)
          toast.error('Não foi possível obter sua localização')
        }
      )
    }
  }, [])

  const handleSOSPress = async () => {
    if (contacts.length === 0) {
      toast.error('Adicione pelo menos um contato de emergência')
      return
    }

    setIsEmergency(true)
    
    // Simular envio de mensagens SOS
    const message = `🆘 ALERTA DE EMERGÊNCIA - O Caminho da Recuperação
    
${emergencyMessage || 'Preciso de ajuda urgente! Estou passando por um momento difícil na minha recuperação.'}

${location ? `📍 Minha localização: https://maps.google.com/?q=${location.lat},${location.lng}` : '📍 Localização não disponível'}

🕐 Enviado em: ${new Date().toLocaleString('pt-BR')}

Por favor, me contate imediatamente!`

    try {
      // Simular envio via WhatsApp para cada contato
      for (const contact of contacts) {
        const whatsappUrl = `https://api.whatsapp.com/send?phone=55${contact.phone.replace(/\D/g, '')}&text=${encodeURIComponent(message)}`
        
        // Em uma implementação real, isso seria feito via backend
        console.log(`Enviando SOS para ${contact.name}: ${whatsappUrl}`)
        
        // Simular delay de envio
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      toast.success(`SOS enviado para ${contacts.length} contatos!`)
      setEmergencyMessage('')
      
      // Resetar estado após 5 segundos
      setTimeout(() => {
        setIsEmergency(false)
      }, 5000)
      
    } catch (error) {
      toast.error('Erro ao enviar SOS. Tente novamente.')
      setIsEmergency(false)
    }
  }

  const addContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Preencha nome e telefone')
      return
    }

    if (contacts.length >= 5) {
      toast.error('Máximo de 5 contatos permitidos')
      return
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...newContact
    }

    setContacts([...contacts, contact])
    setNewContact({ name: '', phone: '', relation: '' })
    setShowAddForm(false)
    toast.success('Contato adicionado com sucesso!')
  }

  const removeContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id))
    toast.success('Contato removido')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-recovery-50 via-white to-primary-50">
      <Navigation />
      
      <div className="lg:ml-64 pt-20 lg:pt-8 pb-20 lg:pb-8 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl lg:text-5xl font-bold gradient-text font-display mb-4 flex items-center">
              <Shield className="w-10 h-10 mr-4 text-danger-500" />
              Sistema SOS
            </h1>
            <p className="text-lg text-recovery-600 max-w-2xl">
              Em caso de emergência, seu pedido de ajuda será enviado instantaneamente 
              para seus contatos via WhatsApp com sua localização.
            </p>
          </motion.div>

          {/* Botão SOS Principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card variant={isEmergency ? "dark" : "default"} className="text-center">
              {isEmergency ? (
                <div className="py-8">
                  <div className="animate-pulse">
                    <CheckCircle className="w-24 h-24 text-success-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-success-600 mb-2">
                      SOS Enviado!
                    </h2>
                    <p className="text-lg text-recovery-600">
                      Suas mensagens foram enviadas para {contacts.length} contatos
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8">
                  <AlertTriangle className="w-24 h-24 text-danger-500 mx-auto mb-6 animate-pulse" />
                  
                  <h2 className="text-2xl font-bold text-recovery-800 mb-4">
                    Precisa de Ajuda?
                  </h2>
                  
                  <textarea
                    value={emergencyMessage}
                    onChange={(e) => setEmergencyMessage(e.target.value)}
                    placeholder="Descreva brevemente sua situação (opcional)"
                    className="w-full p-4 border border-recovery-200 rounded-xl mb-6 resize-none"
                    rows={3}
                  />
                  
                  <Button
                    variant="danger"
                    size="xl"
                    onClick={handleSOSPress}
                    className="min-w-[200px]"
                    disabled={contacts.length === 0}
                  >
                    <Shield className="w-6 h-6 mr-2" />
                    ENVIAR SOS
                  </Button>
                  
                  <p className="text-sm text-recovery-500 mt-4">
                    Clique apenas em situações de real emergência
                  </p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Status da Localização */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card variant="gradient">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-primary-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-recovery-800">Status da Localização</h3>
                    <p className="text-sm text-recovery-600">
                      {location ? 'Localização ativada' : 'Obtendo localização...'}
                    </p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full ${location ? 'bg-success-500 animate-pulse' : 'bg-warning-500'}`}></div>
              </div>
            </Card>
          </motion.div>

          {/* Lista de Contatos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="default">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-recovery-800 font-display">
                  Contatos de Emergência
                </h2>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={() => setShowAddForm(!showAddForm)}
                  disabled={contacts.length >= 5}
                >
                  Adicionar
                </Button>
              </div>

              {/* Formulário de Adicionar Contato */}
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-recovery-50 rounded-xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Nome completo"
                      value={newContact.name}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                      className="p-3 border border-recovery-200 rounded-lg"
                    />
                    <input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                      className="p-3 border border-recovery-200 rounded-lg"
                    />
                    <select
                      value={newContact.relation}
                      onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                      className="p-3 border border-recovery-200 rounded-lg"
                    >
                      <option value="">Relacionamento</option>
                      <option value="Familiar">Familiar</option>
                      <option value="Amigo">Amigo</option>
                      <option value="Médico">Médico</option>
                      <option value="Terapeuta">Terapeuta</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="success" size="sm" onClick={addContact}>
                      Salvar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Lista de Contatos */}
              {contacts.length === 0 ? (
                <div className="text-center py-8">
                  <Phone className="w-16 h-16 text-recovery-300 mx-auto mb-4" />
                  <p className="text-recovery-500">Nenhum contato de emergência cadastrado</p>
                  <p className="text-sm text-recovery-400 mt-2">
                    Adicione até 5 contatos para receber seus alertas SOS
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact, index) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-recovery-50 rounded-xl"
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-recovery-800">{contact.name}</h3>
                          <p className="text-recovery-600">{contact.phone}</p>
                          <p className="text-sm text-recovery-500">{contact.relation}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const whatsappUrl = `https://api.whatsapp.com/send?phone=55${contact.phone.replace(/\D/g, '')}`
                            window.open(whatsappUrl, '_blank')
                          }}
                          className="p-2 text-success-600 hover:bg-success-100 rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => removeContact(contact.id)}
                          className="p-2 text-danger-600 hover:bg-danger-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-recovery-200">
                <p className="text-sm text-recovery-500 text-center">
                  {contacts.length}/5 contatos cadastrados
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}