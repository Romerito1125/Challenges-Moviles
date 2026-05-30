import { IonPage, IonContent, IonIcon, IonSpinner } from '@ionic/react';
import {
  personOutline,
  cardOutline,
  mailOutline,
  cashOutline,
  shieldCheckmarkOutline,
  logOutOutline,
  arrowBackOutline,
  refreshOutline,
} from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { getMyProfile } from '../api/employeeService';
import { Employee } from '../api/employeeService';

function getInitials(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

function formatSalario(salario: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(salario);
}

function InfoRow({
  icon,
  label,
  value,
  iconColor = '#60a5fa',
  iconBg = 'rgba(59,130,246,0.15)',
  last = false,
}: {
  icon: string;
  label: string;
  value: string;
  iconColor?: string;
  iconBg?: string;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 px-5 py-4 ${last ? '' : 'border-b border-white/7'}`}>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        <IonIcon icon={icon} style={{ color: iconColor, fontSize: '1.25rem' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-500 text-xs font-medium m-0">{label}</p>
        <p className="text-slate-100 text-[0.9375rem] font-medium mt-0.5 m-0 truncate">{value}</p>
      </div>
    </div>
  );
}

export default function EmployeeProfile() {
  const history = useHistory();
  const { user, logout } = useAuthContext();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const cargarPerfil = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyProfile();
      setEmployee(data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message ?? 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarPerfil(); }, []);

  const handleLogout = async () => {
    await logout();
    history.replace('/login');
  };

  const isAdmin   = employee?.rol === 'admin';
  const rolLabel  = isAdmin ? 'Administrador' : 'Empleado';
  const rolColor  = isAdmin ? '#f59e0b' : '#4ade80';
  const rolBg     = isAdmin ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)';

  return (
    <IonPage style={{ '--background': '#020617', background: '#020617' }}>
      <IonContent fullscreen style={{ '--background': '#020617' }}>
        <div className="min-h-full bg-linear-to-br from-slate-900 via-slate-950 to-black text-white pb-10">

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-12 pb-6">
            <button
              onClick={() => history.goBack()}
              className="w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center cursor-pointer"
            >
              <IonIcon icon={arrowBackOutline} className="text-white text-xl" />
            </button>

            <h1 className="text-lg font-bold m-0">Mi Perfil</h1>

            <button
              onClick={cargarPerfil}
              disabled={loading}
              className="w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IonIcon icon={refreshOutline} className="text-white text-lg" />
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <IonSpinner name="crescent" style={{ color: '#3b82f6', width: 40, height: 40 }} />
              <p className="text-slate-500 text-sm m-0">Cargando perfil...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="px-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-6 py-5 flex flex-col items-center gap-3 text-center">
                <p className="text-red-400 text-sm m-0">{error}</p>
                <button
                  onClick={cargarPerfil}
                  className="px-5 py-2 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-400 text-sm cursor-pointer"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {/* Contenido */}
          {!loading && employee && (
            <div className="px-6 flex flex-col gap-5">

              {/* Avatar + nombre */}
              <div className="flex flex-col items-center gap-3 pb-2">
                <div
                  className="w-22 h-22 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-[0_8px_32px_rgba(59,130,246,0.4)]"
                  style={{
                    width: 88,
                    height: 88,
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  }}
                >
                  {getInitials(employee.nombre, employee.apellido)}
                </div>
                <div className="text-center">
                  <h2 className="text-[1.375rem] font-bold m-0">
                    {employee.nombre} {employee.apellido}
                  </h2>
                  <span
                    className="inline-block mt-1.5 px-3 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: rolBg, color: rolColor }}
                  >
                    {rolLabel}
                  </span>
                </div>
              </div>

              {/* Tarjeta de datos */}
              <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
                <InfoRow
                  icon={personOutline}
                  label="Nombre completo"
                  value={`${employee.nombre} ${employee.apellido}`}
                  iconColor="#60a5fa"
                  iconBg="rgba(59,130,246,0.15)"
                />
                <InfoRow
                  icon={mailOutline}
                  label="Correo electrónico"
                  value={employee.email}
                  iconColor="#a78bfa"
                  iconBg="rgba(139,92,246,0.15)"
                />
                <InfoRow
                  icon={cardOutline}
                  label="Cédula"
                  value={employee.cedula}
                  iconColor="#34d399"
                  iconBg="rgba(16,185,129,0.15)"
                />
                <InfoRow
                  icon={cashOutline}
                  label="Salario base"
                  value={formatSalario(employee.salario)}
                  iconColor="#4ade80"
                  iconBg="rgba(34,197,94,0.15)"
                />
                <InfoRow
                  icon={shieldCheckmarkOutline}
                  label="Rol"
                  value={rolLabel}
                  iconColor={rolColor}
                  iconBg={rolBg}
                  last
                />
              </div>

              {/* Info de sesión */}
              {user && (
                <div className="bg-white/3 border border-white/6 rounded-2xl px-5 py-3.5">
                  <p className="text-slate-500 text-xs font-medium m-0 mb-1">Sesión activa</p>
                  <p className="text-slate-500 text-[0.8125rem] m-0">{user.email}</p>
                </div>
              )}

              {/* Botón cerrar sesión */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400 font-semibold text-[0.9375rem] cursor-pointer mt-1"
              >
                <IonIcon icon={logOutOutline} className="text-xl" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
