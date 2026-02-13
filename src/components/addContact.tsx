import { useState } from "react";

interface Props {
  onAdd: (contact: { name: string; phone: string }) => void;
}

const AddContact = ({ onAdd }: Props) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdd = () => {
    if (!name || !phone) return;

    onAdd({ name, phone });

    // limpiar inputs
    setName("");
    setPhone("");
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        style={{ marginLeft: "10px" }}
      />

      <button onClick={handleAdd} style={{ marginLeft: "10px" }}>
        Add
      </button>
    </div>
  );
};

export default AddContact;
