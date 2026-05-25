import { IonItem, IonLabel, IonInput, IonButton, IonSpinner } from '@ionic/react';
import { useState, useEffect } from 'react';
import { CreateJornadaDto } from '../api/jornadaService';

type FormData = Omit<CreateJornadaDto, 'id_empleado'>;

interface Props {
  /** Pre-rellena el formulario al editar */
  initial?: FormData;
  isPending?: boolean;
  error?: string | null;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const emptyForm: FormData = {
  fecha: '',
  hora_entrada: '',
  hora_salida: '',
  descanso_horas: 0,
};

const itemStyle = {
  '--background': '#334155',
  '--color': '#f1f5f9',
  '--border-color': '#475569',
  '--highlight-color-focused': '#3b82f6',
  '--padding-start': '16px',
};

const labelStyle = { color: '#94a3b8', fontSize: '12px', fontWeight: '600' };

const JornadaForm: React.FC<Props> = ({ initial, isPending = false, error, onSubmit, onCancel }) => {
  const [form, setForm] = useState<FormData>(initial ?? emptyForm);

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

      {/* fecha: YYYY-MM-DD */}
      <IonItem lines="full" style={itemStyle}>
        <IonLabel position="stacked" style={labelStyle}>Fecha</IonLabel>
        <IonInput
          type="date"
          value={form.fecha}
          onIonChange={(e) => setForm({ ...form, fecha: e.detail.value! })}
          required
        />
      </IonItem>

      {/* hora_entrada: HH:MM */}
      <IonItem lines="full" style={itemStyle}>
        <IonLabel position="stacked" style={labelStyle}>Hora de entrada</IonLabel>
        <IonInput
          type="time"
          value={form.hora_entrada}
          onIonChange={(e) => setForm({ ...form, hora_entrada: e.detail.value! })}
          required
        />
      </IonItem>

      {/* hora_salida: HH:MM */}
      <IonItem lines="full" style={itemStyle}>
        <IonLabel position="stacked" style={labelStyle}>Hora de salida</IonLabel>
        <IonInput
          type="time"
          value={form.hora_salida}
          onIonChange={(e) => setForm({ ...form, hora_salida: e.detail.value! })}
          required
        />
      </IonItem>

      {/* descanso_horas: número decimal >= 0 (ej: 0.5 = 30 min) */}
      <IonItem lines="none" style={itemStyle}>
        <IonLabel position="stacked" style={labelStyle}>Descanso (horas)</IonLabel>
        <IonInput
          type="number"
          min="0"
          step="0.25"
          placeholder="0"
          value={String(form.descanso_horas)}
          onIonChange={(e) =>
            setForm({
              ...form,
              descanso_horas: Number(e.detail.value || 0),
            })
          }
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

export default JornadaForm;
