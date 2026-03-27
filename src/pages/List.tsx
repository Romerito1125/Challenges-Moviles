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

import useNetwork from '../hooks/useNetwork';
const { isOnline } = useNetwork();

import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const List: React.FC = () => {

  const { tasks, loading, addTask, toggleTask, deleteTask } = useContext(TasksContext);
  const { isOnline } = useNetwork();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task Manager</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {!isOnline && (
          <p style={{ color: "red", textAlign: "center" }}>
            Sin conexión - acciones deshabilitadas
          </p>
        )}

        {loading && (
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <IonSpinner name="crescent" />
            <p>Actualizando tareas...</p>
          </div>
        )}

        <TaskForm addTask={addTask} disabled={!isOnline} />

        <TaskList
          tasks={tasks}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          disabled={!isOnline}
        />

      </IonContent>
    </IonPage>
  );
};

export default List