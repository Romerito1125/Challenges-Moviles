import { IonList, IonItem, IonLabel, IonButton } from "@ionic/react";

interface Props {
  fruits: any[];
  onDelete: (id: number) => void;
}

const ListFruits: React.FC<Props> = ({ fruits, onDelete }) => {

  if (fruits.length === 0) {
    return <p>No hay frutas</p>;
  }

  return (
    <IonList>
      {fruits.map((fruit) => (
        <IonItem key={fruit.id}>

          <IonLabel>
            <h2>{fruit.nombre}</h2>
            <p>{fruit.createdAt}</p>
          </IonLabel>

          <IonButton
            color="danger"
            onClick={() => onDelete(fruit.id)}
          >
            Eliminar
          </IonButton>

        </IonItem>
      ))}
    </IonList>
  );
};

export default ListFruits;
