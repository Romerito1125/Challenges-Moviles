import { IonPage, IonContent, IonText } from "@ionic/react";
import Avatar from "../components/AvatarPerfil";

const PerfilMedicoPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">

        <Avatar usuario={{ nombre: "Juan", apellido: "Zuluaga" }} />

        <IonText>
          <h2>Juan Pablo Zuluaga</h2>
          <p>Especialidad: Ingeniería ja</p>
        </IonText>

      </IonContent>
    </IonPage>
  );
};

export default PerfilMedicoPage;
