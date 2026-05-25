import { IonItem, IonLabel, IonInput, IonButton, IonSpinner } from '@ionic/react';
import { useState, useEffect } from 'react';
import { CreatePagoDto } from '../api/pagoService';

interface Props {
  /** Pre-rellena el formulario al editar */
  initial?: Omit<CreatePagoDto, 'idEmpleado'>;
  isPending?: boolean;
  error?: string | null;
  onSubmit: (data: Omit<CreatePagoDto, 'idEmpleado'>) => void;
  onCancel: () => void;
}

const emptyForm = { totalPago: 0, fechaProgramada: '' };

const itemStyle = {
  '--background': '#334155',
  '--color': '#f1f5f9',
  '--border-color': '#475569',
  '--highlight-color-focused': '#3b82f6',
  '--padding-start': '16px',
};

const labelStyle = { color: '#94a3b8', fontSize: '12px', fontWeight: '600' };

const PagoForm: React.FC<Props> = ({ initial, isPending = false, error, onSubmit, onCancel }) => {
  const [form, setForm] = useState(initial ?? emptyForm);

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

      {/* totalPago: entero positivo */}
      <IonItem lines="full" style={itemStyle}>
        <IonLabel position="stacked" style={labelStyle}>Total pago</IonLabel>
        <IonInput
          type="number"
          min={1}
          value={form.totalPago}
          onIonChange={(e) => setForm({ ...form, totalPago: Number(e.detail.value) })}
          required
        />
      </IonItem>

      {/* fechaProgramada: YYYY-MM-DD */}
      <IonItem lines="none" style={itemStyle}>
        <IonLabel position="stacked" style={labelStyle}>Fecha programada</IonLabel>
        <IonInput
          type="date"
          value={form.fechaProgramada}
          onIonChange={(e) => setForm({ ...form, fechaProgramada: e.detail.value! })}
          required
        />
      </IonItem>

      <div className="flex gap-3 px-4 py-4" style={{ background: '#334155' }}>
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

export default PagoForm;
