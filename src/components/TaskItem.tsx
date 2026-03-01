import { IonItem, IonLabel, IonCheckbox, IonButton } from '@ionic/react';
import { Task } from '../pages/Home';

interface Props {
  task: Task;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

const TaskItem: React.FC<Props> = ({ task, toggleTask, deleteTask }) => {

  return (
    <IonItem>
      <IonCheckbox
        slot="start"
        checked={task.completed}
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
        onClick={() => deleteTask(task.id)}
      >
        X
      </IonButton>
    </IonItem>
  );
};

export default TaskItem;
