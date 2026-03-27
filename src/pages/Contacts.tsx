import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle
} from "@ionic/react";

import { useContext } from "react";
import { ContactsContext } from "../context/ContactContext";
import useNetwork from "../hooks/useNetwork";

import AddContact from "../components/AddContact";
import ContactList from "../components/ContactList";

const Contact: React.FC = () => {

  const { contacts, loading, addContact, deleteContact } = useContext(ContactsContext);
  const { isOnline } = useNetwork();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Contactos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {!isOnline && (
          <p style={{ color: "red" }}>
            Sin conexión - acciones deshabilitadas
          </p>
        )}

        <AddContact onAdd={addContact} disabled={!isOnline} />

        {loading ? (
          <p>Cargando contactos...</p>
        ) : (
          <ContactList
            contacts={contacts}
            onDelete={deleteContact}
            disabled={!isOnline}
          />
        )}

      </IonContent>
    </IonPage>
  );
};

export default Contact;
