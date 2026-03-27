import { IonList, IonItem, IonLabel, IonButton } from "@ionic/react";

interface Props {
  contacts: any[];
  onDelete: (id: string) => void;
  disabled?: boolean;
}

const ContactList: React.FC<Props> = ({ contacts, onDelete, disabled }) => {

  if (contacts.length === 0) {
    return <p>No hay contactos</p>;
  }

  return (
    <IonList>
      {contacts.map(contact => (
        <IonItem key={contact.id}>

          <IonLabel>
            <h2>{contact.name}</h2>
            <p>{contact.phone}</p>
          </IonLabel>

          <IonButton
            color="danger"
            onClick={() => onDelete(contact.id)}
            disabled={disabled}
          >
            Delete
          </IonButton>

        </IonItem>
      ))}
    </IonList>
  );
};

export default ContactList;
