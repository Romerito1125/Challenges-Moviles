import { IonItem, IonInput, IonButton } from '@ionic/react';
import { useState } from 'react';

interface Props {
  addTask: (task: { title: string; completed: boolean }) => void;
  disabled?: boolean;
}

const TaskForm: React.FC<Props> = ({ addTask, disabled }) => {

  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (title.trim() === "") return;

    addTask({
      title,
      completed: false
    });

    setTitle("");
  };

  return (
    <>
      <IonItem>
        <IonInput
          placeholder="Nueva tarea"
          value={title}
          onIonChange={e => setTitle(e.detail.value!)}
        />
      </IonItem>

      <IonButton expand="block" onClick={handleSubmit} disabled={disabled}>
        Agregar
      </IonButton>
    </>
  );
};

export default TaskForm;
