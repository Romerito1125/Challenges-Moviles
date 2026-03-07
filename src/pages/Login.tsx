import {
  IonPage,
  IonContent,
  IonInput,
  IonItem,
  IonButton
} from "@ionic/react";

import { useState, useEffect } from "react";
import { useHistory } from "react-router";

const Login: React.FC = () => {

  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {

    const logged = localStorage.getItem("logged");

    if (logged === "true") {
      history.push("/list");
    }

  }, []);

  const handleLogin = () => {

    if (email === "user@mail.com" && password === "123") {

      localStorage.setItem("logged", "true");

      history.push("/list");

    } else {

      alert("Credenciales incorrectas");

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

      </IonContent>

    </IonPage>
  );
};

export default Login;
