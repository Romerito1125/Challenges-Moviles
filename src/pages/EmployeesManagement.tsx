import { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonSpinner,
  IonAlert,
  IonList,
  IonButton,
} from '@ionic/react';
import useEmployees from '../hooks/useEmployees';
import { Employee } from '../api/employeeService';
import EmployeeItem from '../components/EmployeeItem';
import EmployeeForm from '../components/EmployeeForm';

type EmployeeFormData = Omit<Employee, 'id' | 'created_at' | 'updated_at'>;

export default function EmployeesAdmin() {
  const { employees, isPending, error, fetchAll, add, update, remove } = useEmployees();

  const [showForm, setShowForm]           = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget]   = useState<Employee | null>(null);
  const [formError, setFormError]         = useState<string | null>(null);

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
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Empleados</h1>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <IonButton expand="block" onClick={openCreate} className="mb-4">
            + Agregar empleado
          </IonButton>

          {isPending ? (
            <div className="flex justify-center mt-8">
              <IonSpinner name="crescent" />
            </div>
          ) : employees.length === 0 ? (
            <p className="text-gray-400 text-center mt-8">No hay empleados registrados.</p>
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

        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className="rounded-2xl w-full max-w-sm shadow-xl overflow-hidden" style={{ background: '#1e293b' }}>
              <div className="px-5 pt-5 pb-1">
                <h2 className="text-lg font-bold text-slate-100">
                  {editingEmployee ? 'Editar empleado' : 'Nuevo empleado'}
                </h2>
              </div>
              <EmployeeForm
                initial={editingEmployee
                  ? { cedula: editingEmployee.cedula, nombre: editingEmployee.nombre, apellido: editingEmployee.apellido, salario: editingEmployee.salario }
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
