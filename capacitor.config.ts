
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.0082c300ff974745a00dbfaf284f320b',
  appName: 'AyoCrypt Messenger',
  webDir: 'dist',
  server: {
    url: 'https://0082c300-ff97-4745-a00d-bfaf284f320b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1f2937',
      showSpinner: true,
      spinnerColor: '#10b981'
    }
  }
};

export default config;
