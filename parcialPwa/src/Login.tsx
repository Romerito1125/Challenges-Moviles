import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    interface Usuario {
        email: string;
        password: string;
        name: string;
        apellidos: string;
        imagen: string | null;
        rol: string;
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const usuariosPrueba: Usuario[] = [
        {
            email: "JuanitaPerez@medicare.com",
            password: "1234",
            name: "Juanita",
            apellidos: "Perez",
            imagen: null,
            rol: "recepcionista"
        },
        {
            email: "JuanZuluaga@medicare.com",
            password: "1234",
            name: "Juan",
            apellidos: "Zuluaga",
            imagen: null,
            rol: "medico"
        }
    ];

    function onLogin(usuario: Usuario) {
        localStorage.setItem("medicare_user", JSON.stringify(usuario));
        navigate("/home");
    }

    function handleLogin() {

        const usuario = usuariosPrueba.find(
            (u) => u.email === email && u.password === password
        );

        if (usuario) {
            onLogin(usuario);
        } else {
            setError("Usuario o contraseña incorrectos");
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-900">

            <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-80 space-y-4">

                <h2 className="text-white text-xl font-semibold text-center">
                    Login MediCare+
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    className="w-full rounded-lg bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                    }}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    className="w-full rounded-lg bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                    }}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                >
                    Iniciar sesión
                </button>

                {error && (
                    <p className="text-red-400 text-sm text-center">
                        {error}
                    </p>
                )}

            </div>

        </div>
    );
}

export default Login
