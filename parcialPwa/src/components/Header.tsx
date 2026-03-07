import { useEffect, useState } from "react";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface Usuario {
  email: string;
  name: string;
  apellidos: string;
  imagen: string | null;
  rol: string;
}

function Header() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("medicare_user");
    if (user) {
      setUsuario(JSON.parse(user));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("medicare_user");
    navigate("/login");
  }

  const iniciales = usuario
    ? `${usuario.name[0]}${usuario.apellidos[0]}`.toUpperCase()
    : "";

  return (
    <header className="w-full bg-gray-800 text-white shadow">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <h1 className="text-lg font-semibold">
          MediCare
        </h1>

        <div className="flex items-center gap-3">
          
          {usuario?.imagen ? (
            <img
              src={usuario.imagen}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
              {iniciales}
            </div>
          )}

          <span className="hidden sm:block text-sm">
            {usuario?.name} {usuario?.apellidos}
          </span>

          <MdLogout
            size={22}
            className="cursor-pointer hover:text-red-400"
            onClick={handleLogout}
          />

        </div>
      </div>
    </header>
  );
}

export default Header;
