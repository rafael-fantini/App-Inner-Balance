import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
	appId: 'com.recuperacao.app',
	appName: 'O Caminho da Recuperação',
	webDir: 'out',
	server: {
		androidScheme: 'https',
		cleartext: false,
		allowNavigation: ['localhost', 'firebasestorage.googleapis.com']
	}
}

export default config