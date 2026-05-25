import { IonItem, IonLabel, IonButton } from '@ionic/react';
import { Pago } from '../api/pagoService';

interface Props {
  pago: Pago;
  onEdit: (pago: Pago) => void;
  onDelete: (pago: Pago) => void;
  disabled?: boolean;
}

const PagoItem: React.FC<Props> = ({ pago, onEdit, onDelete, disabled }) => {
  const fecha = new Date(pago.fechaprogramada + 'T00:00:00').toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <IonItem>
      <IonLabel>
        <h2>${pago.totalpago.toLocaleString()}</h2>
        <p>{fecha}</p>
      </IonLabel>

      <IonButton slot="end" fill="clear" color="primary" disabled={disabled} onClick={() => onEdit(pago)}>
        Editar
      </IonButton>
      <IonButton slot="end" fill="clear" color="danger" disabled={disabled} onClick={() => onDelete(pago)}>
        Eliminar
      </IonButton>
    </IonItem>
  );
};

export default PagoItem;
