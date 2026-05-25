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

const Registro: React.FC = () => {
  const history = useHistory();
  const { register, isPending } = useAuthContext();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async () => {
    setErrorMsg(null);
    try {
      await register(email, password);
      history.push('/home');
    } catch (err) {
      setErrorMsg((err as Error).message ?? 'No se pudo registrar');
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

        <IonButton expand="block" onClick={handleRegister} disabled={isPending} className="mt-4">
          {isPending ? <IonSpinner name="crescent" /> : 'Registrarse'}
        </IonButton>

        <IonButton expand="block" fill="clear" onClick={() => history.push('/login')}>
          ¿Ya tienes cuenta? Inicia sesión
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

export default Registro;
