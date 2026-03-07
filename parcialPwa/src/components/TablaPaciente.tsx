interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
}

interface Props {
  pacientes: Paciente[];
  onEliminar: (id: number) => void;
  onEditar: (paciente: Paciente) => void;
  rol?: string;
}

function TablaPaciente({ pacientes, onEliminar, onEditar, rol }: Props) {

  return (
    <div className="border rounded-lg overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">Nombre</th>
            <th className="text-left p-3">DNI</th>
            <th className="text-left p-3">Teléfono</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>

          {pacientes.map((p) => (

            <tr
              key={p.id}
              className="border-t hover:bg-gray-50"
            >
              <td className="p-3">
                {p.nombre} {p.apellido}
              </td>

              <td className="p-3">{p.dni}</td>

              <td className="p-3">{p.telefono}</td>

              <td className="p-3 text-center space-x-3">

                {rol === "medico" && (
                  <button
                    onClick={() => onEditar(p)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                )}

                <button
                  onClick={() => onEliminar(p.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default TablaPaciente;
