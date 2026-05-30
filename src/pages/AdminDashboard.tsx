import { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonSpinner,
  IonAlert,
  IonList,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import useEmployees from '../hooks/useEmployees';
import { Employee } from '../api/employeeService';
import EmployeeItem from '../components/EmployeeItem';
import EmployeeForm from '../components/EmployeeForm';

type EmployeeFormData = Omit<Employee, 'id' | 'auth_user_id' | 'activo' | 'created_at' | 'updated_at'>;

export default function AdminDashboard() {
  const history = useHistory();
  const { employees, isPending, error, fetchAll, add, update, remove } = useEmployees();

  const [showForm, setShowForm]               = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget]       = useState<Employee | null>(null);
  const [formError, setFormError]             = useState<string | null>(null);

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditingEmployee(null);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (data: EmployeeFormData) => {
    setFormError(null);
    const result = editingEmployee
      ? await update(editingEmployee.id!, data)
      : await add(data);
    if (result) setShowForm(false);
    else setFormError('Ocurrió un error. Intenta de nuevo.');
  };

  const handleDelete = async () => {
    if (deleteTarget?.id !== undefined) await remove(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <IonPage>
      <IonContent>
        <div className="p-6 flex flex-col gap-6">

          {/* Header */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => history.goBack()}
              className="w-9 h-9 rounded-full bg-white/8 border border-white/12 flex items-center justify-center cursor-pointer shrink-0"
            >
              <IonIcon icon={arrowBackOutline} className="text-white text-lg" />
            </button>
            <h1 className="text-2xl font-bold m-0">Dashboard</h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-500 p-4 rounded-xl shadow">
              <p className="text-white text-sm">Empleados</p>
              <p className="text-xl font-bold">
                {isPending ? <IonSpinner name="dots" /> : employees.length}
              </p>
            </div>
            <div className="bg-gray-500 p-4 rounded-xl shadow">
              <p className="text-white text-sm">Horas totales</p>
              <p className="text-xl font-bold">980h</p>
            </div>
          </div>

          {/* Acciones */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Gestión de empleados</h2>
            <IonButton expand="block" onClick={openCreate}>
              + Nuevo empleado
            </IonButton>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>
          )}

          {/* Lista */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Empleados</h2>
            {isPending ? (
              <div className="flex justify-center py-8"><IonSpinner name="crescent" /></div>
            ) : employees.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No hay empleados registrados.</p>
            ) : (
              <IonList>
                {employees.map((emp) => (
                  <EmployeeItem
                    key={emp.id}
                    employee={emp}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                    disabled={isPending}
                  />
                ))}
              </IonList>
            )}
          </div>
        </div>

        {/* Modal formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
              <div className="px-5 pt-5 pb-1">
                <h2 className="text-lg font-bold text-slate-100">
                  {editingEmployee ? 'Editar empleado' : 'Nuevo empleado'}
                </h2>
              </div>
              <EmployeeForm
                initial={editingEmployee
                  ? {
                      cedula: editingEmployee.cedula,
                      nombre: editingEmployee.nombre,
                      apellido: editingEmployee.apellido,
                      email: editingEmployee.email,
                      salario: editingEmployee.salario,
                      rol: editingEmployee.rol,
                    }
                  : undefined}
                isEditing={!!editingEmployee}
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
          header="Eliminar empleado"
          message={`¿Seguro que deseas eliminar a ${deleteTarget?.nombre} ${deleteTarget?.apellido}?`}
          buttons={[
            { text: 'Cancelar', role: 'cancel', handler: () => setDeleteTarget(null) },
            { text: 'Eliminar', role: 'destructive', handler: handleDelete },
          ]}
          onDidDismiss={() => setDeleteTarget(null)}
        />
      </IonContent>
    </IonPage>
  );
}
