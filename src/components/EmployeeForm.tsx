import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { Employee } from '../api/employeeService';

type EmployeeFormData = Omit<Employee, 'id' | 'created_at' | 'updated_at'>;

interface Props {
  initial?: EmployeeFormData;
  isPending?: boolean;
  error?: string | null;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
}

const emptyForm: EmployeeFormData = { cedula: '', nombre: '', apellido: '', salario: 0 };

const EmployeeForm: React.FC<Props> = ({
  initial,
  isPending = false,
  error,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState<EmployeeFormData>(initial ?? emptyForm);

  useEffect(() => {
    setForm(initial ?? emptyForm);
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <p className="text-red-500 text-sm px-4 pt-2">{error}</p>
      )}

      <IonItem lines="full">
        <IonLabel position="stacked">Cédula</IonLabel>
        <IonInput
          value={form.cedula}
          onIonChange={(e) => setForm({ ...form, cedula: e.detail.value! })}
          required
        />
      </IonItem>

      <IonItem lines="full">
        <IonLabel position="stacked">Nombre</IonLabel>
        <IonInput
          value={form.nombre}
          onIonChange={(e) => setForm({ ...form, nombre: e.detail.value! })}
          required
        />
      </IonItem>

      <IonItem lines="full">
        <IonLabel position="stacked">Apellido</IonLabel>
        <IonInput
          value={form.apellido}
          onIonChange={(e) => setForm({ ...form, apellido: e.detail.value! })}
          required
        />
      </IonItem>

      <IonItem lines="none">
        <IonLabel position="stacked">Salario</IonLabel>
        <IonInput
          type="number"
          min={0}
          value={form.salario}
          onIonChange={(e) => setForm({ ...form, salario: Number(e.detail.value) })}
          required
        />
      </IonItem>

      <div className="flex gap-3 px-4 py-4">
        <IonButton fill="outline" expand="block" className="flex-1" onClick={onCancel}>
          Cancelar
        </IonButton>
        <IonButton type="submit" expand="block" className="flex-1" disabled={isPending}>
          {isPending ? <IonSpinner name="crescent" /> : 'Guardar'}
        </IonButton>
      </div>
    </form>
  );
};

export default EmployeeForm;
