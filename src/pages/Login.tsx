import {
  IonPage,
  IonContent,
  IonInput,
  IonItem,
  IonAlert,
  IonSpinner,
  IonIcon,
} from '@ionic/react';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { useAuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
  const history = useHistory();
  const { login, isPending } = useAuthContext();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMsg(null);
    try {
      await login(email, password);
      history.push('/home');
    } catch (err) {
      setErrorMsg((err as Error).message ?? 'Credenciales incorrectas');
    }
  };

  return (
    <IonPage>
      <IonContent style={{ '--background': '#020617' }}>
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-950 to-black text-white flex flex-col px-6 py-12 gap-8">

          {/* Encabezado */}
          <div className="flex flex-col items-center gap-3 pt-10">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <IonIcon icon={lockClosedOutline} className="text-blue-400 text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-center m-0">Iniciar sesión</h1>
            <p className="text-gray-400 text-sm text-center m-0">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Formulario */}
          <div className="flex flex-col gap-4">
            {/* Email */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <IonItem lines="none" style={{ '--background': 'transparent', '--color': '#f1f5f9' }}>
                <div className="flex items-center gap-3 w-full py-1">
                  <IonIcon icon={mailOutline} className="text-gray-400 text-lg" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-xs mb-1">Correo electrónico</p>
                    <IonInput
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onIonChange={(e) => setEmail(e.detail.value!)}
                      style={{ '--color': '#f1f5f9', '--placeholder-color': '#64748b' }}
                    />
                  </div>
                </div>
              </IonItem>
            </div>

            {/* Contraseña */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <IonItem lines="none" style={{ '--background': 'transparent', '--color': '#f1f5f9' }}>
                <div className="flex items-center gap-3 w-full py-1">
                  <IonIcon icon={lockClosedOutline} className="text-gray-400 text-lg" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-xs mb-1">Contraseña</p>
                    <IonInput
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onIonChange={(e) => setPassword(e.detail.value!)}
                      style={{ '--color': '#f1f5f9', '--placeholder-color': '#64748b' }}
                    />
                  </div>
                </div>
              </IonItem>
            </div>

            {/* Botón login */}
            <button
              onClick={handleLogin}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-linear-to-r from-blue-600 to-blue-500 rounded-2xl text-white font-bold text-lg shadow-lg shadow-blue-900/40 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              {isPending ? (
                <IonSpinner name="crescent" className="text-white" />
              ) : (
                'Iniciar sesión'
              )}
            </button>

            {/* Link registro */}
            <button
              onClick={() => history.push('/register')}
              className="w-full py-3 text-gray-400 text-sm text-center bg-transparent border-none cursor-pointer"
            >
              ¿No tienes cuenta?{' '}
              <span className="text-blue-400 font-medium">Regístrate</span>
            </button>
          </div>
        </div>

        <IonAlert
          isOpen={!!errorMsg}
          header="Error"
          message={errorMsg ?? ''}
          buttons={['OK']}
          onDidDismiss={() => setErrorMsg(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
