import {
  IonPage,
  IonContent,
  IonInput,
  IonItem,
  IonButton,
  IonAlert
} from "@ionic/react";

import { useState, useContext } from "react";
import { useHistory } from "react-router";

import { AuthContext } from "../context/AuthContext";
import { useFirebaseAuth } from "../hooks/useFireBase";

const Login: React.FC = () => {

  const history = useHistory();

  const { login } = useContext(AuthContext);
  const { loginUser } = useFirebaseAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleLogin = async () => {

    try {

      const user = await loginUser(email, password);

      /* Inicia sesión y va al List, con el customhook */
      login(user);

      history.push("/home");

    } catch (error) {

      setIsOpen(true);
      console.log((error as Error).message);

    }

  };

  return (
    <IonPage>

      <IonContent className="ion-padding">

        <IonItem>
          <IonInput
            placeholder="Email"
            onIonChange={(e) => setEmail(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonInput
            type="password"
            placeholder="Password"
            onIonChange={(e) => setPassword(e.detail.value!)}
          />
        </IonItem>

        <IonButton expand="block" onClick={handleLogin}>
          Login
        </IonButton>
        
        <IonButton expand="block" fill="clear" onClick={() => history.push("/register")}>
          ¿No tienes cuenta? Regístrate
        </IonButton>

        <IonAlert
          isOpen={isOpen}
          header="Error"
          message="Credenciales incorrectas"
          buttons={['OK']}
          onDidDismiss={() => setIsOpen(false)}
        />

      </IonContent>

    </IonPage>
  );
};

export default Login;
