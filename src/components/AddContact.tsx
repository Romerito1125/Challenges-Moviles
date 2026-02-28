import { IonInput, IonButton } from "@ionic/react";
import { useState } from "react";

interface Props {
  onAdd: (name: string, phone: string) => void;
}

const AddContact: React.FC<Props> = ({ onAdd }) => {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdd = () => {
    if (!name || !phone) return;

    onAdd(name, phone);
    setName("");
    setPhone("");
  };

  return (
    <>
      <IonInput
        label="Nombre"
        value={name}
        onIonChange={e => setName(e.detail.value!)}
      />

      <IonInput
        label="Teléfono"
        type="tel"
        value={phone}
        onIonChange={e => setPhone(e.detail.value!)}
      />

      <IonButton expand="block" onClick={handleAdd}>
        Añadir contacto
      </IonButton>
    </>
  );
};

export default AddContact;
