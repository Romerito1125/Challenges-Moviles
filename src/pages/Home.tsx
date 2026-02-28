import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from "@ionic/react";

import { useState, useEffect } from "react";
import AddContact from "../components/AddContact";
import ContactList from "../components/ContactList";

export interface Contact {
  id: number;
  name: string;
  phone: string;
}

const Home: React.FC = () => {

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setContacts([
        { id: 1, name: "Juan", phone: "123456" },
        { id: 2, name: "Ana", phone: "987654" }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const addContact = (name: string, phone: string) => {
    const newContact: Contact = {
      id: Date.now(),
      name,
      phone
    };

    setContacts(prev => [...prev, newContact]);
  };

  const deleteContact = (id: number) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista de contactos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <AddContact onAdd={addContact} />

        {loading && <p>Cargando contactos...</p>}

        <ContactList
          contacts={contacts}
          onDelete={deleteContact}
        />

      </IonContent>
    </IonPage>
  );
};

export default Home;
