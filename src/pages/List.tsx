import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner
} from '@ionic/react';

import { useContext } from 'react';
import { TasksContext } from '../context/TareasContext';

import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const List: React.FC = () => {

  const { tasks, loading, addTask, toggleTask, deleteTask } = useContext(TasksContext);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task Manager</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {loading && (
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <IonSpinner name="crescent" />
            <p>Actualizando tareas...</p>
          </div>
        )}

        <TaskForm addTask={addTask} />

        <TaskList
          tasks={tasks}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
        />

      </IonContent>
    </IonPage>
  );
};

export default List;
