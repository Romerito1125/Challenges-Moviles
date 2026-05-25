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

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Subcomponente fila de info ───────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
  iconColor = '#60a5fa',
  iconBg = 'rgba(59,130,246,0.15)',
}: {
  icon: string;
  label: string;
  value: string;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <IonIcon icon={icon} style={{ color: iconColor, fontSize: '1.25rem' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0, fontWeight: 500 }}>
          {label}
        </p>
        <p
          style={{
            color: '#f1f5f9',
            fontSize: '0.9375rem',
            margin: '2px 0 0',
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

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

  useEffect(() => {
    cargarPerfil();
  }, []);

  const handleLogout = async () => {
    await logout();
    history.replace('/login');
  };

  const rolLabel = employee?.rol === 'admin' ? 'Administrador' : 'Empleado';
  const rolColor = employee?.rol === 'admin' ? '#f59e0b' : '#4ade80';
  const rolBg    = employee?.rol === 'admin' ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)';

  return (
    <IonPage style={{ '--background': '#020617', background: '#020617' }}>
      <IonContent fullscreen style={{ '--background': '#020617' }}>
        <div
          style={{
            minHeight: '100%',
            background: 'linear-gradient(to bottom right, #0f172a, #020617, #000)',
            color: 'white',
            paddingBottom: 40,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '48px 24px 24px',
            }}
          >
            <button
              onClick={() => history.goBack()}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <IonIcon icon={arrowBackOutline} style={{ color: 'white', fontSize: '1.25rem' }} />
            </button>

            <h1 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Mi Perfil</h1>

            <button
              onClick={cargarPerfil}
              disabled={loading}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
            >
              <IonIcon icon={refreshOutline} style={{ color: 'white', fontSize: '1.125rem' }} />
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 24px',
                gap: 16,
              }}
            >
              <IonSpinner name="crescent" style={{ color: '#3b82f6', width: 40, height: 40 }} />
              <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                Cargando perfil...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div style={{ padding: '0 24px' }}>
              <div
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 16,
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  textAlign: 'center',
                }}
              >
                <p style={{ color: '#f87171', fontSize: '0.875rem', margin: 0 }}>
                  {error}
                </p>
                <button
                  onClick={cargarPerfil}
                  style={{
                    padding: '8px 20px',
                    background: 'rgba(59,130,246,0.2)',
                    border: '1px solid rgba(59,130,246,0.4)',
                    borderRadius: 10,
                    color: '#60a5fa',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {/* Contenido */}
          {!loading && employee && (
            <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Avatar + nombre */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  paddingBottom: 8,
                }}
              >
                {/* Avatar con iniciales */}
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'white',
                    boxShadow: '0 8px 32px rgba(59,130,246,0.4)',
                  }}
                >
                  {getInitials(employee.nombre, employee.apellido)}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ fontSize: '1.375rem', fontWeight: 700, margin: 0 }}>
                    {employee.nombre} {employee.apellido}
                  </h2>
                  {/* Badge de rol */}
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: 6,
                      padding: '3px 12px',
                      borderRadius: 20,
                      background: rolBg,
                      color: rolColor,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {rolLabel}
                  </span>
                </div>
              </div>

              {/* Tarjeta de datos */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 20,
                  overflow: 'hidden',
                }}
              >
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
                <div style={{ borderBottom: 'none' }}>
                  <InfoRow
                    icon={shieldCheckmarkOutline}
                    label="Rol"
                    value={rolLabel}
                    iconColor={rolColor}
                    iconBg={rolBg}
                  />
                </div>
              </div>

              {/* Info de sesión */}
              {user && (
                <div
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 16,
                    padding: '14px 20px',
                  }}
                >
                  <p style={{ color: '#475569', fontSize: '0.75rem', margin: '0 0 4px', fontWeight: 500 }}>
                    Sesión activa
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.8125rem', margin: 0 }}>
                    {user.email}
                  </p>
                </div>
              )}

              {/* Botón cerrar sesión */}
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '16px 24px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 16,
                  color: '#f87171',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  marginTop: 4,
                }}
              >
                <IonIcon icon={logOutOutline} style={{ fontSize: '1.25rem' }} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
