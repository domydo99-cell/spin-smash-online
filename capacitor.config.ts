import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.domydo99cell.spinsmash',
  appName: 'Spin Smash',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://spin-smash-online.onrender.com',
    cleartext: false,
    allowNavigation: ['spin-smash-online.onrender.com'],
  },
  ios: {
    contentInset: 'always',
  },
};

export default config;
