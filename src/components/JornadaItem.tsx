import { IonItem, IonLabel, IonButton } from '@ionic/react';
import { Jornada } from '../api/jornadaService';

interface Props {
  jornada: Jornada;
  onEdit: (jornada: Jornada) => void;
  onDelete: (jornada: Jornada) => void;
  disabled?: boolean;
}

const itemStyle = {
  '--background': '#1e293b',
  '--color': '#f1f5f9',
  '--border-color': '#334155',
};

const JornadaItem: React.FC<Props> = ({ jornada, onEdit, onDelete, disabled }) => {
  const fecha = new Date(jornada.fecha + 'T00:00:00').toLocaleDateString('es-CO', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <IonItem style={itemStyle}>
      <IonLabel>
        <h2>{fecha}</h2>
        <p style={{ color: '#94a3b8' }}>
          Entrada: {jornada.hora_entrada} — Salida: {jornada.hora_salida}
          {jornada.descanso_horas > 0 && ` — Descanso: ${jornada.descanso_horas}h`}
        </p>
        <p style={{ color: '#94a3b8' }}>
          Trabajadas: {jornada.horas_trabajadas}h
          {(jornada.horas_extra ?? 0) > 0 && (
            <span style={{ color: '#4ade80' }}> · Extras: {jornada.horas_extra}h</span>
          )}
        </p>
      </IonLabel>

      <IonButton slot="end" fill="clear" color="primary" disabled={disabled} onClick={() => onEdit(jornada)}>
        Editar
      </IonButton>
      <IonButton slot="end" fill="clear" color="danger" disabled={disabled} onClick={() => onDelete(jornada)}>
        Eliminar
      </IonButton>
    </IonItem>
  );
};

export default JornadaItem;
