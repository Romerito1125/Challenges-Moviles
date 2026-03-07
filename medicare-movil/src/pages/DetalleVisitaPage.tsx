import {
  IonPage,
  IonContent,
  IonText
} from "@ionic/react";

import { useParams } from "react-router";

interface Visita {
  id: number;
  paciente: string;
  estado: string;
}

interface Props {
  visitas: Visita[];
}

const DetalleVisitaPage: React.FC<Props> = ({ visitas }) => {

  const { id } = useParams<{ id: string }>();

  const visita = visitas.find(v => v.id === Number(id));

  if (!visita) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <IonText>Visita no encontrada</IonText>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>

      <IonContent className="ion-padding">

        <IonText>

          <h2>Detalle de Visita</h2>

          <p><b>Paciente:</b> {visita.paciente}</p>
          <p><b>ID:</b> {visita.id}</p>
          <p><b>Estado:</b> {visita.estado}</p>

        </IonText>

      </IonContent>

    </IonPage>
  );

};

export default DetalleVisitaPage;
