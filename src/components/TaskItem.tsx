import { IonItem, IonLabel, IonCheckbox, IonButton } from '@ionic/react';
import { Task } from '../pages/List';
interface Props {
  task: Task;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  disabled?: boolean;
}


const TaskItem: React.FC<Props> = ({ task, toggleTask, deleteTask, disabled }) => {

  return (
    <IonItem>
      <IonCheckbox
        slot="start"
        checked={task.completed}
        disabled={disabled}
        onIonChange={() => toggleTask(task.id)}
      />
      <IonLabel
        style={{
          textDecoration: task.completed ? "line-through" : "none"
        }}
      >
        {task.title}
      </IonLabel>
      <IonButton
        color="danger"
        disabled={disabled}
        onClick={() => deleteTask(task.id)}
      >
        X
      </IonButton>

    </IonItem>
  );
};

export default TaskItem;