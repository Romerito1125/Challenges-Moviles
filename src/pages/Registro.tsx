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

const Registro: React.FC = () => {

  const history = useHistory();

  const { login } = useContext(AuthContext);
  const { registerUser } = useFirebaseAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleRegister = async () => {

    try {

      const user = await registerUser(email, password);

      /* Inicia sesión de una vez y va al List */
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

        <IonButton expand="block" onClick={handleRegister}>
          Registrar
        </IonButton>
        
        <IonButton expand="block" fill="clear" onClick={() => history.push("/login")}>
          ¿Ya tienes cuenta? Inicia sesión
        </IonButton>

        <IonAlert
          isOpen={isOpen}
          header="Error"
          message="No se pudo registrar"
          buttons={['OK']}
          onDidDismiss={() => setIsOpen(false)}
        />

      </IonContent>

    </IonPage>
  );
};

export default Registro;
