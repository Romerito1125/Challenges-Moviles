interface Props {
  busqueda: string;
  setBusqueda: (valor: string) => void;
}

function BuscadorPaciente({ busqueda, setBusqueda }: Props) {

  return (
    <input
      className="w-full border rounded-md p-2"
      placeholder="Buscar por nombre, apellido o DNI..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
    />
  );
}

export default BuscadorPaciente;
