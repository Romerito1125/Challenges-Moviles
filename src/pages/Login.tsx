import {
  IonPage,
  IonContent,
  IonInput,
  IonItem,
  IonButton,
  IonAlert,
  IonSpinner,
} from '@ionic/react';
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
      <IonContent className="ion-padding">

        <IonItem>
          <IonInput
            placeholder="Email"
            type="email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonInput
            type="password"
            placeholder="Contraseña"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
          />
        </IonItem>

        <IonButton expand="block" onClick={handleLogin} disabled={isPending} className="mt-4">
          {isPending ? <IonSpinner name="crescent" /> : 'Iniciar sesión'}
        </IonButton>

        <IonButton expand="block" fill="clear" onClick={() => history.push('/register')}>
          ¿No tienes cuenta? Regístrate
        </IonButton>

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
