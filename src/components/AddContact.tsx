import { IonItem, IonInput, IonButton } from "@ionic/react";
import { useState } from "react";

interface Props {
  onAdd: (contact: { name: string; phone: string }) => void;
  disabled?: boolean;
}

const AddContact: React.FC<Props> = ({ onAdd, disabled }) => {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdd = () => {
    if (!name || !phone) return;

    onAdd({ name, phone });

    setName("");
    setPhone("");
  };

  return (
    <>
      <IonItem>
        <IonInput
          placeholder="Nombre"
          value={name}
          onIonChange={(e) => setName(e.detail.value!)}
        />
      </IonItem>

      <IonItem>
        <IonInput
          placeholder="Teléfono"
          value={phone}
          onIonChange={(e) => setPhone(e.detail.value!)}
        />
      </IonItem>

      <IonButton expand="block" onClick={handleAdd} disabled={disabled}>
        Agregar
      </IonButton>
    </>
  );
};

export default AddContact;
