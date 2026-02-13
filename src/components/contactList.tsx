interface Props {
  contacts: { id: number; name: string; phone: string }[];
  onDelete: (id: number) => void;
}

const ContactList = ({ contacts, onDelete }: Props) => {
  if (contacts.length === 0) {
    return <p>No hay contactos</p>;
  }

  return (
    <ul>
      {contacts.map(contact => (
        <li key={contact.id}>
          <strong>{contact.name}</strong> – {contact.phone}
          <button
            onClick={() => onDelete(contact.id)}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ContactList;
