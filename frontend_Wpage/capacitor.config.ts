
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5b5f9d7821c6461194e5e1a55e2e2d84',
  appName: 'measure-like-this',
  webDir: 'dist',
  server: {
    url: 'https://5b5f9d78-21c6-4611-94e5-e1a55e2e2d84.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;
