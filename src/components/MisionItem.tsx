import { IonItem, IonLabel, IonBadge } from "@ionic/react";

const MisionItem = ({ mision }: any) => {
  return (
    <IonItem>
      <IonLabel>
        <h2>{mision.nombre}</h2>
        <p>{mision.puntos} pts</p>
      </IonLabel>

      <IonBadge color={mision.completado ? "success" : "medium"}>
        {mision.completado ? "Completada" : "Pendiente"}
      </IonBadge>
    </IonItem>
  );
};

export default MisionItem;