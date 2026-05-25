import {
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonSpinner,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { Employee } from '../api/employeeService';

type EmployeeFormData = Omit<
  Employee,
  'id' | 'auth_user_id' | 'activo' | 'created_at' | 'updated_at'
>;

interface Props {
  /** Pre-rellena el formulario al editar. En edición el email no se puede cambiar. */
  initial?: EmployeeFormData;
  /** Si true, el campo email se deshabilita (modo edición) */
  isEditing?: boolean;
  isPending?: boolean;
  error?: string | null;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
}

const emptyForm: EmployeeFormData = {
  cedula: '',
  nombre: '',
  apellido: '',
  email: '',
  salario: 0,
  rol: 'empleado',
};

const itemStyle = {
  '--background': '#334155',
  '--color': '#f1f5f9',
  '--border-color': '#475569',
  '--highlight-color-focused': '#3b82f6',
  '--padding-start': '16px',
};

const labelStyle = { color: '#94a3b8', fontSize: '12px', fontWeight: '600' };

const EmployeeForm: React.FC<Props> = ({
  initial,
  isEditing = false,
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
      {error && <p className="text-red-400 text-sm px-4 pt-3">{error}</p>}

      {/* Email — solo editable al crear; al editar se muestra deshabilitado */}
      <IonItem lines="full" style={itemStyle}>
        <IonLabel position="stacked" style={labelStyle}>
          Email {!isEditing && <span className="text-blue-400">(se enviará invitación)</span>}
        </IonLabel>
        <IonInput
          type="email"
          value={form.email}
          onIonChange={(e) => setForm({ ...form, email: e.detail.value! })}
          required
          disabled={isEditing}
          placeholder="correo@empresa.com"
        />
      </IonItem>

      {/* Cédula */}
      <IonItem lines="full" style={itemStyle}>
        <IonLabel position="stacked" style={labelStyle}>Cédula</IonLabel>
        <IonInput
          value={form.cedula}
          onIonChange={(e) => setForm({ ...form, cedula: e.detail.value! })}
          required
        />
      </IonItem>

      {/* Nombre */}
      <IonItem lines="full" style={itemStyle}>
        <IonLabel position="stacked" style={labelStyle}>Nombre</IonLabel>
        <IonInput
          value={form.nombre}
          onIonChange={(e) => setForm({ ...form, nombre: e.detail.value! })}
          required
        />
      </IonItem>

      {/* Apellido */}
      <IonItem lines="full" style={itemStyle}>
        <IonLabel position="stacked" style={labelStyle}>Apellido</IonLabel>
        <IonInput
          value={form.apellido}
          onIonChange={(e) => setForm({ ...form, apellido: e.detail.value! })}
          required
        />
      </IonItem>

      {/* Salario */}
      <IonItem lines="full" style={itemStyle}>
        <IonLabel position="stacked" style={labelStyle}>Salario</IonLabel>
        <IonInput
          type="number"
          min={0}
          value={form.salario}
          onIonChange={(e) =>
            setForm({ ...form, salario: Number(e.detail.value) })
          }
          required
        />
      </IonItem>

      {/* Rol */}
      <IonItem lines="none" style={itemStyle}>
        <IonLabel position="stacked" style={labelStyle}>Rol</IonLabel>
        <IonSelect
          value={form.rol}
          onIonChange={(e) =>
            setForm({ ...form, rol: e.detail.value as 'empleado' | 'admin' })
          }
          interface="popover"
          style={{ '--color': '#f1f5f9' }}
        >
          <IonSelectOption value="empleado">Empleado</IonSelectOption>
          <IonSelectOption value="admin">Administrador</IonSelectOption>
        </IonSelect>
      </IonItem>

      <div className="flex gap-3 px-4 py-4" style={{ background: '#334155' }}>
        <IonButton fill="outline" expand="block" className="flex-1" onClick={onCancel}>
          Cancelar
        </IonButton>
        <IonButton type="submit" expand="block" className="flex-1" disabled={isPending}>
          {isPending ? <IonSpinner name="crescent" /> : isEditing ? 'Guardar' : 'Crear e invitar'}
        </IonButton>
      </div>
    </form>
  );
};

export default EmployeeForm;
