import { useEffect, useState } from "react";
import ContactList from "./components/contactList";
import AddContact from "./components/addContact";

function App() {
  const [contacts, setContacts] = useState<
    { id: number; name: string; phone: string }[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContacts([
        { id: 1, name: "Juan", phone: "3101011010" },
        { id: 2, name: "Ana", phone: "31010101011" },
      ]);
      setLoading(false);
    }, 1000); // Cargar los contactos predefinidos después de 1 segundo, y quita el loading.

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (contacts.length === 0) return;

    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer); // Por si el componente se cierra antes que se acabe el tiempo para el useState, así que lo eliminamos para que no quede volando.
  }, [contacts]);

  const addContact = (contact: { name: string; phone: string }) => {
    setContacts(prev => [
      ...prev,
      {
        id: Date.now(),
        name: contact.name,
        phone: contact.phone,
      },
    ]);
  };

  const deleteContact = (id: number) => {
    setContacts(prev => prev.filter(c => c.id !== id)); // Elimina el contacto por el id, creando a través de un filter (en este caso, que agarra todos los que no sean la id que pasé) una nueva copia del array.
  };

  return (
    <div>
      <h1>Lista de contactos</h1>

      <AddContact onAdd={addContact} />

      {loading ? (
        <p>Cargando contactos...</p>
      ) : (
        <ContactList contacts={contacts} onDelete={deleteContact} />
      )}
    </div>
  );
}

export default App;
