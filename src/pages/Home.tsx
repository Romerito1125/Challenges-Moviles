import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon
} from '@ionic/react';

import { list, people, nutrition, logOut, wifi, cloudOffline } from 'ionicons/icons';

import { useContext } from 'react';
import { useHistory } from 'react-router';

import { TasksContext } from '../context/TareasContext';
import { AuthContext } from '../context/AuthContext';
import useNetwork from '../hooks/useNetwork';

import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const Home: React.FC = () => {

  const history = useHistory();

  const { tasks, loading, addTask, toggleTask, deleteTask } = useContext(TasksContext);
  const { logout } = useContext(AuthContext);
  const { isOnline, connectionType } = useNetwork();

  const handleLogout = () => {
    logout();
    history.push("/login");
  };

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>

          <IonTitle>
            <IonIcon icon={list} /> Tasks
          </IonTitle>

        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {/* 🌐 Estado de red */}
        <p style={{ textAlign: "center" }}>
          <IonIcon icon={isOnline ? wifi : cloudOffline} />{" "}
          {isOnline ? `Online (${connectionType})` : "Offline"}
        </p>

        {/* 🔘 Navegación */}
        <IonButton expand="block" onClick={() => history.push("/contacts")} disabled={!isOnline}>
          <IonIcon icon={people} slot="start" />
          Contacts
        </IonButton>

        <IonButton expand="block" onClick={() => history.push("/fruits")}>
          <IonIcon icon={nutrition} slot="start" />
          Fruits (Offline)
        </IonButton>

        <IonButton expand="block" color="danger" onClick={handleLogout}>
          <IonIcon icon={logOut} slot="start" />
          Logout
        </IonButton>

        {/* 🧠 Tasks */}
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

export default Home;
