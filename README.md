# O Caminho da Recuperação

Um aplicativo moderno e inovador para auxiliar dependentes químicos em sua jornada de recuperação, desenvolvido com as mais avançadas tecnologias web e mobile.

## 🌟 Funcionalidades Principais

### 🆘 Sistema SOS
- **Botão de Emergência**: Envio instantâneo de alertas via WhatsApp
- **5 Contatos de Emergência**: Cadastro e gerenciamento de contatos de apoio
- **Localização em Tempo Real**: Compartilhamento automático da localização GPS
- **Mensagens Personalizadas**: Opção de adicionar contexto à emergência

### 📊 Contador de Sobriedade
- **Contador em Tempo Real**: Dias, horas e minutos sóbrios
- **Cálculo de Economia**: Quanto dinheiro foi economizado
- **Metas e Marcos**: Sistema de conquistas e objetivos
- **Melhoria da Saúde**: Indicador de progresso na saúde física e mental

### 📚 Categorias Pessoais
- **5 Categorias Temáticas**: Motivação, Objetivos, Reflexões, Momentos Especiais, Atividades
- **Múltiplos Formatos**: Apenas texto, apenas foto, ou foto + texto
- **Upload de Imagens**: Suporte completo para adicionar fotos
- **Sistema de Tags**: Organização e busca de conteúdo

### 💬 Chat com Terapeuta
- **Dr. Gedalias Mota**: Acesso direto ao terapeuta especializado
- **Chat em Tempo Real**: Mensagens instantâneas
- **Respostas Rápidas**: Botões para situações comuns
- **Histórico Completo**: Todas as conversas são salvas
- **Agendamento**: Opções para agendar consultas

### 👥 Comunidade de Apoio
- **Chat em Grupo**: Conversas com outros membros
- **Níveis de Usuário**: Membro, Moderador, Veterano
- **Tipos de Mensagem**: Geral, Marcos, Pedidos de Apoio
- **Sistema de Likes**: Apoio e engajamento
- **Status Online**: Veja quem está conectado

### 🗣️ Fórum da Comunidade
- **Categorias Temáticas**: Recuperação, Apoio, Dicas, Marcos, Perguntas
- **Sistema de Tópicos**: Criação e participação em discussões
- **Tags e Busca**: Organização e descoberta de conteúdo
- **Níveis de Usuário**: Diferentes permissões e reconhecimento
- **Estatísticas**: Visualizações, respostas, curtidas

## 🎨 Design e UX

### Tema Visual Moderno
- **Gradientes Suaves**: Cores que transmitem tranquilidade e esperança
- **Tipografia Elegante**: Inter e Poppins para máxima legibilidade
- **Animações Fluídas**: Framer Motion para transições suaves
- **Glassmorphism**: Efeitos de vidro moderno

### Responsividade Completa
- **Mobile First**: Otimizado para dispositivos móveis
- **Desktop Adaptativo**: Layout sidebar para telas grandes
- **Navegação Intuitiva**: Menu bottom no mobile, sidebar no desktop

### Acessibilidade
- **Alto Contraste**: Cores que atendem padrões de acessibilidade
- **Feedback Visual**: Estados claros para todas as interações
- **Indicadores de Status**: Informações visuais sobre conectividade e ações

## 🛠️ Tecnologias Utilizadas

### Frontend Web
- **Next.js 14**: Framework React com App Router
- **TypeScript**: Tipagem estática para maior confiabilidade
- **Tailwind CSS**: Framework de CSS utilitário
- **Framer Motion**: Animações e transições fluídas
- **Lucide React**: Ícones modernos e consistentes

### Funcionalidades Avançadas
- **React Hook Form**: Gerenciamento de formulários
- **React Dropzone**: Upload de arquivos drag-and-drop
- **React Toastify**: Notificações elegantes
- **Geolocation API**: Localização em tempo real
- **Date-fns**: Manipulação de datas

### Recursos para Mobile (Futuro)
- **React Native/Expo**: Desenvolvimento multiplataforma
- **Push Notifications**: Alertas em tempo real
- **Offline Storage**: Funcionamento sem internet
- **Biometria**: Autenticação segura

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação e Execução
```bash
# Clone o repositório
git clone https://github.com/rafael-fantini/App-Inner-Balance.git
cd o-caminho-da-recuperacao

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Ou para produção
npm run build
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 📱 Estrutura do Projeto

```
/workspace
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial
│   ├── sos/               # Sistema SOS
│   ├── tracker/           # Contador de sobriedade
│   ├── categories/        # Categorias pessoais
│   ├── therapist/         # Chat com terapeuta
│   ├── community/         # Comunidade de apoio
│   └── forum/             # Fórum da comunidade
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (Button, Card)
│   └── layout/           # Componentes de layout (Navigation)
├── public/               # Arquivos estáticos
└── package.json          # Dependências e scripts
```

## 🎯 Funcionalidades Implementadas

### ✅ Concluídas
- [x] Sistema de design moderno com Tailwind CSS
- [x] Navegação responsiva com sidebar/bottom menu
- [x] Dashboard principal com estatísticas
- [x] Sistema SOS completo com WhatsApp e geolocalização
- [x] Contador de sobriedade com economia e marcos
- [x] Categorias pessoais com upload de imagens
- [x] Chat direto com Dr. Gedalias Mota
- [x] Comunidade com chat em grupo
- [x] Fórum com tópicos e categorias
- [x] Animações e transições fluídas

### 🔄 Em Desenvolvimento
- [ ] Sistema de autenticação completo
- [ ] Integração com backend/Firebase
- [ ] Notificações push
- [ ] Modo offline
- [ ] Aplicativo mobile React Native

## 🎨 Paleta de Cores

### Cores Principais
- **Primary**: Azul (`#0ea5e9`) - Confiança e estabilidade
- **Success**: Verde (`#22c55e`) - Crescimento e conquistas  
- **Warning**: Amarelo (`#f59e0b`) - Atenção e marcos
- **Danger**: Vermelho (`#ef4444`) - Urgência e SOS
- **Recovery**: Cinza (`#64748b`) - Neutralidade e calma

### Gradientes
- **Recovery Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Success Gradient**: `linear-gradient(135deg, #4ade80 0%, #22c55e 100%)`

## 📋 Roadmap Futuro

### Versão 2.0
- [ ] Aplicativo mobile nativo (React Native)
- [ ] Integração com wearables
- [ ] IA para suporte personalizado
- [ ] Gamificação avançada
- [ ] Relatórios detalhados

### Versão 3.0
- [ ] Telemedicina integrada
- [ ] Grupos de apoio por localização
- [ ] Mentoria peer-to-peer
- [ ] Integração com profissionais de saúde
- [ ] API pública para desenvolvedores

## 🤝 Contribuição

Este projeto foi desenvolvido com foco na recuperação e bem-estar de pessoas em jornadas de sobriedade. Contribuições são bem-vindas!

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte e dúvidas sobre o aplicativo:
- **Email**: suporte@caminhoderecuperacao.com
- **WhatsApp**: +55 (11) 99999-9999
- **Emergência 24h**: Função SOS integrada no app

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- **Dr. Gedalias Mota**: Por sua expertise e dedicação ao tratamento
- **Comunidade de Recuperação**: Pelos insights e feedback valiosos
- **Desenvolvedores Open Source**: Pelas ferramentas incríveis utilizadas

---

**"O caminho da recuperação é uma jornada de mil milhas que começa com um único passo. Este aplicativo está aqui para acompanhar cada passo dessa jornada."**
