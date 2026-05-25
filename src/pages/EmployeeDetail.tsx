import { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonBackButton,
  IonButtons,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonSpinner,
  IonAlert,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import useJornadas from '../hooks/useJornadas';
import { Jornada } from '../api/jornadaService';
import { Employee, getEmployeeById } from '../api/employeeService';
import JornadaItem from '../components/JornadaItem';
import JornadaForm from '../components/JornadaForm';

const VALOR_HORA_EXTRA = 9948.32;

interface RouteParams {
  id: string;
}

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const { jornadas, resumen, isPending, error, fetchByEmpleado, add, update, remove } = useJornadas();

  // --- Modal jornada ---
  const [showForm, setShowForm]             = useState(false);
  const [editingJornada, setEditingJornada] = useState<Jornada | null>(null);
  const [deleteTarget, setDeleteTarget]     = useState<Jornada | null>(null);
  const [formError, setFormError]           = useState<string | null>(null);

  // --- Filtro por mes ---
  const now = new Date();
  const [mesSeleccionado, setMesSeleccionado] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  );

  // Carga inicial
  useEffect(() => {
    getEmployeeById(id).then(setEmployee);
    fetchByEmpleado(id);
  }, [id]);

  // Jornadas del mes seleccionado
  const jornadasDelMes = jornadas.filter((j) => j.fecha.startsWith(mesSeleccionado));

  // Totales del mes
  const horasExtraMes = jornadasDelMes.reduce((acc, j) => acc + (j.horas_extra ?? 0), 0);
  const valorExtraMes = parseFloat((horasExtraMes * VALOR_HORA_EXTRA).toFixed(2));
  const totalAPagar   = (employee?.salario ?? 0) + valorExtraMes;

  // --- Handlers ---
  const openCreate = () => {
    setEditingJornada(null);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (jornada: Jornada) => {
    setEditingJornada(jornada);
    setFormError(null);
    setShowForm(true);
  };

  type JornadaFormData = {
    fecha: string;
    hora_entrada: string;
    hora_salida: string;
    descanso_horas: number;
  };

  const handleSubmit = async (data: JornadaFormData) => {
    setFormError(null);
    const result = editingJornada
      ? await update(editingJornada.id!, data, id)
      : await add({ ...data, id_empleado: id });
    if (result) setShowForm(false);
    else setFormError('Ocurrió un error. Intenta de nuevo.');
  };

  const handleDelete = async () => {
    if (deleteTarget?.id !== undefined) await remove(deleteTarget.id, id);
    setDeleteTarget(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/employees" />
          </IonButtons>
          <IonTitle>
            {employee ? `${employee.nombre} ${employee.apellido}` : 'Detalle empleado'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="p-4 flex flex-col gap-6">

          {/* Info del empleado */}
          {employee && (
            <div className="rounded-xl shadow p-4" style={{ background: '#1e293b' }}>
              <p className="text-lg font-bold text-slate-100">{employee.nombre} {employee.apellido}</p>
              <p className="text-sm text-slate-400">Cédula: {employee.cedula}</p>
              <p className="text-sm text-slate-400">Salario base: ${employee.salario.toLocaleString()}</p>
            </div>
          )}

          {/* Resumen histórico de horas extra */}
          {resumen && (
            <div className="rounded-xl shadow p-4" style={{ background: '#1e293b' }}>
              <p className="font-semibold mb-3 text-slate-100">Resumen histórico de extras</p>
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Total horas extra acumuladas</span>
                  <span className="text-green-400">{resumen.total_horas_extra}h</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Valor por hora extra</span>
                  <span className="text-slate-200">${resumen.valor_hora_extra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-slate-600 pt-2 mt-1 text-slate-100">
                  <span>Total valor extras</span>
                  <span className="text-green-400">${resumen.total_valor_extras.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Selector de mes + resumen mensual */}
          <div className="rounded-xl shadow p-4" style={{ background: '#1e293b' }}>
            <p className="font-semibold mb-3 text-slate-100">Resumen mensual</p>

            <IonItem
              lines="none"
              style={{
                '--background': '#334155',
                '--color': '#f1f5f9',
                '--border-color': '#475569',
                '--highlight-color-focused': '#3b82f6',
                '--padding-start': '16px',
                borderRadius: '8px',
              }}
            >
              <IonLabel position="stacked" style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>Mes</IonLabel>
              <IonInput
                type="month"
                value={mesSeleccionado}
                onIonChange={(e) => setMesSeleccionado(e.detail.value!)}
              />
            </IonItem>

            <div className="mt-3 flex flex-col gap-1 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Jornadas registradas</span>
                <span className="text-slate-200">{jornadasDelMes.length}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Horas extra acumuladas</span>
                <span className="text-green-400">{horasExtraMes.toFixed(2)}h</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Valor horas extra</span>
                <span className="text-green-400">+${valorExtraMes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-slate-600 pt-2 mt-1 text-slate-100">
                <span>Total a pagar</span>
                <span className="text-green-400">${totalAPagar.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Lista de jornadas */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">
                Jornadas ({jornadasDelMes.length} de {jornadas.length})
              </p>
              <IonButton size="small" onClick={openCreate}>+ Nueva</IonButton>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm mb-2">{error}</div>
            )}

            {isPending ? (
              <div className="flex justify-center py-8"><IonSpinner name="crescent" /></div>
            ) : jornadasDelMes.length === 0 ? (
              <p className="text-gray-400 text-center py-6">No hay jornadas en este mes.</p>
            ) : (
              <IonList>
                {jornadasDelMes.map((j) => (
                  <JornadaItem
                    key={j.id}
                    jornada={j}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                    disabled={isPending}
                  />
                ))}
              </IonList>
            )}
          </div>

        </div>

        {/* Modal crear / editar jornada */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className="rounded-2xl w-full max-w-sm shadow-xl overflow-hidden" style={{ background: '#1e293b' }}>
              <div className="px-5 pt-5 pb-1">
                <h2 className="text-lg font-bold text-slate-100">
                  {editingJornada ? 'Editar jornada' : 'Nueva jornada'}
                </h2>
              </div>
              <JornadaForm
                initial={editingJornada
                  ? {
                      fecha: editingJornada.fecha,
                      hora_entrada: editingJornada.hora_entrada,
                      hora_salida: editingJornada.hora_salida ?? '',
                      descanso_horas: editingJornada.descanso_horas,
                    }
                  : undefined}
                isPending={isPending}
                error={formError}
                onSubmit={handleSubmit}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        <IonAlert
          isOpen={deleteTarget !== null}
          header="Eliminar jornada"
          message={`¿Seguro que deseas eliminar la jornada del ${deleteTarget?.fecha}?`}
          buttons={[
            { text: 'Cancelar', role: 'cancel', handler: () => setDeleteTarget(null) },
            { text: 'Eliminar', role: 'destructive', handler: handleDelete },
          ]}
          onDidDismiss={() => setDeleteTarget(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default EmployeeDetail;
