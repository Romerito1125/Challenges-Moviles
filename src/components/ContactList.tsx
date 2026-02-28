import {
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon
} from "@ionic/react";

import { trash } from "ionicons/icons";
import { Contact } from "../pages/Home";

interface Props {
  contacts: Contact[];
  onDelete: (id: number) => void;
}

const ContactList: React.FC<Props> = ({ contacts, onDelete }) => {

  return (
    <IonList>
      {contacts.map(contact => (
        <IonItem key={contact.id}>
          <IonLabel>
            <h2>{contact.name}</h2>
            <p>{contact.phone}</p>
          </IonLabel>

          <IonButton
            fill="clear"
            color="danger"
            onClick={() => onDelete(contact.id)}
          >
            <IonIcon icon={trash} />
          </IonButton>

        </IonItem>
      ))}
    </IonList>
  );
};

export default ContactList;
