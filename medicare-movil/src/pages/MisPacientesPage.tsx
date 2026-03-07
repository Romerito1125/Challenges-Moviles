import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel
} from "@ionic/react";

const MisPacientesPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent>

        <IonList>
          <IonItem>
            <IonLabel>Pedro Martínez</IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>Ana Gómez</IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>Carlos López</IonLabel>
          </IonItem>
        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default MisPacientesPage;