import { IonPage, IonContent, IonIcon } from "@ionic/react";
import { useEffect, useState } from "react";
import { exitOutline, enterOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";

export default function EmployeeHome() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const history = useHistory();

  const goToLogin = () => history.push("/login");
  const goToRegister = () => history.push("/register");
  const goToHome = () => history.push("/home");
  const goToWorkLocation = () => history.push("/work-location");
  const goToEmployeeHistory = () => history.push("/employee-history");
  const goToAdminDashboard = () => history.push("/admin-dashboard");
  const goToEmployees = () => history.push("/employees");
  const goToProfile = () => history.push("/profile");
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      const timeColombia = new Intl.DateTimeFormat("es-CO", {
        timeZone: "America/Bogota",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(now);

      const dateColombia = new Intl.DateTimeFormat("es-CO", {
        timeZone: "America/Bogota",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(now);

      setTime(timeColombia);
      setDate(dateColombia);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <IonPage>
      <IonContent>
        <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#020617] to-black text-white p-6 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">Registro de Jornada</h1>
            <p className="text-gray-400 text-sm mt-1">
              Control de asistencia en tiempo real
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Estado actual</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <p className="text-green-400 font-semibold">
                    Dentro del área
                  </p>
                </div>
              </div>

              {/* Indicador visual */}
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                📍
              </div>
            </div>

            {/* Línea */}
            <div className="border-t border-white/10 my-4"></div>

            {/* HORA */}
            <div>
              <p className="text-gray-400 text-sm">Hora actual (Colombia)</p>
              <p className="text-3xl font-bold mt-1">{time}</p>
              <p className="text-gray-400 text-sm capitalize">{date}</p>
            </div>
          </div>

          {/* BOTÓN ENTRADA */}
          <div className="px-4 mt-4">
            <div className="rounded-2xl overflow-hidden">
              <button className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-900/30 active:scale-95 hover:scale-[1.02] transition-all duration-150">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl flex items-center justify-center">
                    <IonIcon
                      icon={enterOutline}
                      className="text-white text-xl"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-lg">
                      Marcar Entrada
                    </p>
                    <p className="text-blue-100 text-sm">
                      Registrar inicio de jornada
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* BOTÓN SALIDA */}
          <div className="px-4 mt-4">
            <div className="rounded-2xl overflow-hidden">
              <button className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-900/30 active:scale-95 hover:scale-[1.02] transition-all duration-150">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl flex items-center justify-center">
                    <IonIcon
                      icon={exitOutline}
                      className="text-white text-xl"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-lg">
                      Marcar Salida
                    </p>
                    <p className="text-red-100 text-sm">
                      Registrar fin de jornada
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* RESUMEN */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Jornada de hoy</p>
              <p className="text-sm">Aún no has marcado entrada</p>
            </div>

            <div className="text-right">
              <p className="text-gray-400 text-sm">Horas</p>
              <p className="text-xl font-bold">00:00</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-6">
            <button onClick={goToHome}>Home</button>
            <button onClick={goToWorkLocation}>Work Location</button>
            <button onClick={goToEmployeeHistory}>Historial</button>
            <button onClick={goToAdminDashboard}>Admin</button>
            <button onClick={goToEmployees}>Empleados</button>
            <button onClick={goToProfile}>Perfil</button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
