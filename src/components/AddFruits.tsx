import { IonItem, IonInput, IonButton } from "@ionic/react";
import { useState } from "react";

interface Props {
  onAdd: (nombre: string) => void;
}

const AddFruits: React.FC<Props> = ({ onAdd }) => {

  const [nombre, setNombre] = useState("");

  const handleAdd = () => {
    if (!nombre.trim()) return;

    onAdd(nombre);
    setNombre("");
  };

  return (
    <>
      <IonItem>
        <IonInput
          placeholder="Nombre de la fruta"
          value={nombre}
          onIonChange={(e) => setNombre(e.detail.value!)}
        />
      </IonItem>

      <IonButton expand="block" onClick={handleAdd}>
        Agregar fruta
      </IonButton>
    </>
  );
};

export default AddFruits;
