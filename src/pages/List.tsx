import {
  IonPage,
  IonContent,
  IonButton
} from "@ionic/react";

import { useEffect } from "react";
import { useHistory } from "react-router";

const List: React.FC = () => {

  const history = useHistory();

  useEffect(() => {

    const logged = localStorage.getItem("logged");

    if (logged !== "true") {
      history.push("/login");
    }

  }, []);

  const logout = () => {

    localStorage.removeItem("logged");

    history.push("/login");

  };

  return (
    <IonPage>

      <IonContent className="ion-padding">

        <h2>Estás logueado</h2>

        <IonButton color="danger" onClick={logout}>
          Logout
        </IonButton>

      </IonContent>

    </IonPage>
  );
};

export default List;
