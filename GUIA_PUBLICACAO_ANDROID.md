# 🚀 Guia Completo para Publicar o App na Google Play Store

## ✅ Status Atual do Projeto

O projeto já está configurado com:
- ✅ Capacitor instalado e configurado
- ✅ Projeto Android gerado (`android/` folder)
- ✅ Build estático do Next.js funcionando
- ✅ Páginas dinâmicas corrigidas para export estático
- ✅ Configurações de permissões no AndroidManifest.xml

## 📋 Pré-requisitos

### 1. Conta Google Play Console
- Acesse [Google Play Console](https://play.google.com/console)
- Pague a taxa única de $25 USD
- Complete o cadastro da conta de desenvolvedor

### 2. Android Studio e SDK
- Baixe e instale [Android Studio](https://developer.android.com/studio)
- Durante a instalação, certifique-se de instalar:
  - Android SDK Platform 35 (API Level 35)
  - Android SDK Build-Tools
  - Android SDK Command-line Tools

### 3. Java Development Kit (JDK)
- Instale JDK 17 ou superior
- Configure a variável de ambiente `JAVA_HOME`

## 🔧 Configuração do Ambiente

### 1. Configurar Android SDK

Após instalar o Android Studio, localize o caminho do SDK:
- Windows: `C:\Users\[SEU_USUARIO]\AppData\Local\Android\Sdk`
- macOS: `~/Library/Android/sdk`
- Linux: `~/Android/Sdk`

### 2. Criar arquivo local.properties

Crie o arquivo `android/local.properties` com o caminho do SDK:

```properties
sdk.dir=C:\\Users\\[SEU_USUARIO]\\AppData\\Local\\Android\\Sdk
```

**Substitua `[SEU_USUARIO]` pelo seu nome de usuário do Windows.**

### 3. Configurar variáveis de ambiente (opcional)

Adicione ao PATH do sistema:
```
C:\Users\[SEU_USUARIO]\AppData\Local\Android\Sdk\platform-tools
C:\Users\[SEU_USUARIO]\AppData\Local\Android\Sdk\tools
```

## 🏗️ Gerando o AAB (Android App Bundle)

### 1. Build e Sincronização
```bash
# Build do Next.js
npm run build

# Sincronizar com Android
npm run android:sync
```

### 2. Gerar AAB
```bash
# Navegar para pasta android
cd android

# Gerar AAB de release
.\gradlew.bat bundleRelease
```

### 3. Localizar o AAB
O arquivo será gerado em:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## 🔐 Configuração de Assinatura (Keystore)

### 1. Gerar Keystore
```bash
keytool -genkey -v -keystore recuperacao-app.keystore -alias recuperacao-app -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configurar assinatura no build.gradle

Edite `android/app/build.gradle` e adicione:

```gradle
android {
    // ... outras configurações ...
    
    signingConfigs {
        release {
            storeFile file("recuperacao-app.keystore")
            storePassword "SUA_SENHA_AQUI"
            keyAlias "recuperacao-app"
            keyPassword "SUA_SENHA_AQUI"
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

## 📱 Preparação para Google Play Store

### 1. Informações do App
- **Nome**: "O Caminho da Recuperação"
- **ID do Pacote**: `com.recuperacao.app`
- **Versão**: 1.0.0
- **Categoria**: Saúde e Fitness

### 2. Assets Necessários
- **Ícone do App**: 512x512px PNG
- **Screenshots**: 3-8 imagens (1080x1920px)
- **Descrição**: Texto promocional
- **Palavras-chave**: Recuperação, saúde mental, bem-estar

### 3. Política de Privacidade
Crie uma política de privacidade que cubra:
- Coleta de dados
- Uso de localização
- Armazenamento de informações
- Compartilhamento de dados

## 🚀 Publicação na Google Play Store

### 1. Criar Novo App
1. Acesse Google Play Console
2. Clique em "Criar app"
3. Preencha informações básicas

### 2. Upload do AAB
1. Vá para "Produção" > "Criar nova versão"
2. Faça upload do arquivo `.aab`
3. Adicione notas da versão

### 3. Configuração da Loja
1. **Informações do app**:
   - Nome: "O Caminho da Recuperação"
   - Descrição curta: "App de apoio para recuperação e bem-estar mental"
   - Descrição completa: [Escreva uma descrição detalhada]

2. **Classificação de conteúdo**:
   - Responda o questionário de classificação

3. **Preços e distribuição**:
   - Escolha países de distribuição
   - Defina se será gratuito ou pago

### 4. Revisão e Publicação
1. Revise todas as informações
2. Clique em "Revisar versão"
3. Aguarde a aprovação (pode levar algumas horas a dias)

## 🔧 Scripts Automatizados

Adicione estes scripts ao `package.json`:

```json
{
  "scripts": {
    "android:build": "npm run build && npm run android:sync && cd android && .\\gradlew.bat bundleRelease",
    "android:debug": "cd android && .\\gradlew.bat assembleDebug",
    "android:clean": "cd android && .\\gradlew.bat clean"
  }
}
```

## 🐛 Solução de Problemas

### Erro: SDK não encontrado
- Verifique o caminho no `local.properties`
- Certifique-se de que o Android Studio está instalado

### Erro: Gradle build failed
- Execute `npm run android:clean`
- Verifique se o JDK está instalado
- Confirme as versões do SDK

### Erro: Keystore não encontrado
- Verifique o caminho do keystore no `build.gradle`
- Confirme se as senhas estão corretas

## 📞 Suporte

Para dúvidas sobre:
- **Google Play Console**: [Documentação oficial](https://support.google.com/googleplay/android-developer)
- **Capacitor**: [Documentação oficial](https://capacitorjs.com/docs)
- **Next.js**: [Documentação oficial](https://nextjs.org/docs)

## 🎯 Próximos Passos

1. ✅ Configurar Android Studio e SDK
2. ✅ Gerar keystore e configurar assinatura
3. ✅ Testar o AAB localmente
4. ✅ Criar conta Google Play Console
5. ✅ Preparar assets e descrições
6. ✅ Fazer upload e aguardar aprovação

---

**Boa sorte com a publicação! 🚀**
