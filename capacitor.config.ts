import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'kiplings_myanmar',
  webDir: 'out',
  plugins: {
    "CapacitorHttp": {
      "enabled": true
    }
  },
  bundledWebRuntime: false
};

export default config;
