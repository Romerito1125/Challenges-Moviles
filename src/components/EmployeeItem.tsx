import { IonItem, IonLabel, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Employee } from '../api/employeeService';

interface Props {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  disabled?: boolean;
}

const EmployeeItem: React.FC<Props> = ({ employee, onEdit, onDelete, disabled }) => {
  const history = useHistory();

  const verDetalle = () => {
    history.push(`/employees/${employee.id}`, { employee });
  };

  return (
    <IonItem>
      <IonLabel>
        <h2>{employee.nombre} {employee.apellido}</h2>
        <p>Cédula: {employee.cedula}</p>
        <p>Salario: ${employee.salario.toLocaleString()}</p>
      </IonLabel>

      <IonButton
        slot="end"
        fill="clear"
        color="medium"
        disabled={disabled}
        onClick={verDetalle}
      >
        Ver
      </IonButton>

      <IonButton
        slot="end"
        fill="clear"
        color="primary"
        disabled={disabled}
        onClick={() => onEdit(employee)}
      >
        Editar
      </IonButton>

      <IonButton
        slot="end"
        fill="clear"
        color="danger"
        disabled={disabled}
        onClick={() => onDelete(employee)}
      >
        Eliminar
      </IonButton>
    </IonItem>
  );
};

export default EmployeeItem;
