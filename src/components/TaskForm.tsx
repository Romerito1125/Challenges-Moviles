import { IonItem, IonInput, IonButton } from '@ionic/react';
import { useState } from 'react';

interface Props {
  addTask: (title: string) => void;
}

const TaskForm: React.FC<Props> = ({ addTask }) => {

  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (title.trim() === "") return;

    addTask(title);
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

      <IonButton expand="block" onClick={handleSubmit}>
        Agregar
      </IonButton>
    </>
  );
};

export default TaskForm;
