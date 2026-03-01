import {
  IonApp,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner
} from '@ionic/react';
import { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const App: React.FC = () => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {

    if (tasks.length === 0) return;

    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);

  }, [tasks]);

  const addTask = (title: string) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false
    };

    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Task Manager</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">

          {/* Mensaje de actualización */}
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
    </IonApp>
  );
};

export default App;
