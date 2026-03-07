import { useEffect, useState } from "react";

interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
}

interface Props {
  onGuardar: (paciente: Paciente) => void;
  onActualizar: (paciente: Paciente) => void;
  pacienteEditando: Paciente | null;
}

function FormularioPaciente({ onGuardar, onActualizar, pacienteEditando }: Props) {

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {

    if (pacienteEditando) {
      setNombre(pacienteEditando.nombre);
      setApellido(pacienteEditando.apellido);
      setDni(pacienteEditando.dni);
      setTelefono(pacienteEditando.telefono);
    }

  }, [pacienteEditando]);

  function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    if (!nombre || !apellido || !dni) {
      alert("Nombre, apellido y DNI son obligatorios");
      return;
    }

    const paciente: Paciente = {
      id: pacienteEditando ? pacienteEditando.id : Date.now(),
      nombre,
      apellido,
      dni,
      telefono
    };

    if (pacienteEditando) {
      onActualizar(paciente);
    } else {
      onGuardar(paciente);
    }

    setNombre("");
    setApellido("");
    setDni("");
    setTelefono("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-4 space-y-3"
    >

      <h3 className="font-semibold">
        {pacienteEditando ? "Editar paciente" : "Alta de paciente"}
      </h3>

      <input
        className="w-full border rounded-md p-2"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        className="w-full border rounded-md p-2"
        placeholder="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
      />

      <input
        className="w-full border rounded-md p-2"
        placeholder="DNI"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
      />

      <input
        className="w-full border rounded-md p-2"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
        Guardar
      </button>

    </form>
  );
}

export default FormularioPaciente;
