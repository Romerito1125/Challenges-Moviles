import { IonList, IonItem, IonLabel } from "@ionic/react";
import useRanking from "../hooks/useRanking";

const Ranking = () => {
  const { ranking } = useRanking();

  return (
    <IonList>
      {ranking.map((user, index) => (
        <IonItem key={user.id}>
          <IonLabel>
            <h2>#{index + 1} - {user.uid}</h2>
            <p>{user.puntos} puntos</p>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};

export default Ranking;