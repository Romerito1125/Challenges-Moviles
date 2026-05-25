import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'contactos',
  webDir: 'dist',
  server: {
    // En desarrollo con "ionic capacitor run android -l --external"
    // apunta al servidor de Vite en tu IP local.
    // Comenta estas dos líneas para el build de producción.
    // url: 'http://192.168.X.X:8100',
    // cleartext: true,
  },
  plugins: {
    // Deep link: el email de invitación abrirá la app con este scheme.
    // El link en el backend debe ser: io.ionic.starter://set-password
    // Supabase también acepta URLs HTTPS si configuras un dominio propio.
  },
};

export default config;
