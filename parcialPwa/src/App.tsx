import { useEffect, useState } from "react";
import TablaPaciente from "./components/TablaPaciente";
import FormularioPaciente from "./components/FormularioPaciente";
import BuscadorPaciente from "./components/BuscadorPaciente";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";

interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
}

interface Usuario {
  email: string;
  name: string;
  apellidos: string;
  imagen: string | null;
  rol: string;
}

function App() {

  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState<Paciente[]>(() => {
    const data = localStorage.getItem("medicare_pacientes");
    return data ? JSON.parse(data) : [];
  }); // Evitar que monte el componente antes de cargar los pacientes guardados.
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pacienteEditando, setPacienteEditando] = useState<Paciente | null>(null);

  // sesión usuario
  useEffect(() => {
    const user = localStorage.getItem("medicare_user");

    if (user) {
      setUsuario(JSON.parse(user));
    } else {
      navigate("/login");
    }
  }, []);

  const mostrarFormulario = usuario?.rol === "recepcionista" || pacienteEditando;



  // guardar pacientes
  useEffect(() => {
    localStorage.setItem(
      "medicare_pacientes",
      JSON.stringify(pacientes)
    );
  }, [pacientes]);

  function agregarPaciente(paciente: Paciente) {
    setPacientes([...pacientes, paciente]);
  }

  function eliminarPaciente(id: number) {
    setPacientes(pacientes.filter(p => p.id !== id));
  }

  function actualizarPaciente(pacienteActualizado: Paciente) {
    setPacientes(
      pacientes.map(p =>
        p.id === pacienteActualizado.id ? pacienteActualizado : p
      )
    );

    setPacienteEditando(null);
  }

  const pacientesFiltrados = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.dni.includes(busqueda)
  );

  return (
    <div>

      <Header />

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        <BuscadorPaciente
          busqueda={busqueda}
          setBusqueda={setBusqueda}
        />


        {/* La busqueda debe estar en el componente padre porque es el que contiene la lista completa de los pacientes, TablaPaciente solo se encarga de renderizar los datos que recibe del padre.*/}
        {mostrarFormulario && (

          <FormularioPaciente
            onGuardar={agregarPaciente}
            onActualizar={actualizarPaciente}
            pacienteEditando={pacienteEditando}
          />

        )}


        <TablaPaciente
          pacientes={pacientesFiltrados}
          onEliminar={eliminarPaciente}
          onEditar={setPacienteEditando}
          rol={usuario?.rol}
        />

      </main>

    </div>
  );
}

export default App;
