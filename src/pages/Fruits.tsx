import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle
} from "@ionic/react";

import AddFruits from "../components/AddFruits";
import ListFruits from "../components/ListFruits";

import useDexie from "../hooks/useDixie";

const Fruits: React.FC = () => {

  const {
    liveResults,
    add,
    deleteItem,
    isPending
  } = useDexie("frutas");

  const handleAdd = async (nombre: string) => {
    await add({ nombre });
  };

  const handleDelete = async (id: number) => {
    await deleteItem(id);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Frutas (Offline)</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <AddFruits onAdd={handleAdd} />

        {isPending && <p>Procesando...</p>}

        <ListFruits
          fruits={liveResults}
          onDelete={handleDelete}
        />

      </IonContent>
    </IonPage>
  );
};

export default Fruits;
