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
        <p style={{ textAlign: "center" }}>
          <IonIcon icon={isOnline ? wifi : cloudOffline} />{" "}
          {isOnline ? `Online (${connectionType})` : "Offline"}
        </p>
        <IonButton expand="block" onClick={() => history.push("/contacts")} disabled={!isOnline}>
          <IonIcon icon={people} slot="start" />
          Contacts
        </IonButton>

        <IonButton expand="block" onClick={() => history.push("/fruits")}>
          <IonIcon icon={nutrition} slot="start" />
          Fruits (Offline)
        </IonButton>

        {/* <IonButton expand="block" color="danger" onClick={handleLogout}>
          <IonIcon icon={logOut} slot="start" />
          Logout
        </IonButton> */}
        <button className='bg-blue-600 w-full h-10'> 

          <IonIcon icon={logOut} slot="start" />
          Cerrar sesión

        </button>
        {/* Tasks */}
        <TaskForm addTask={addTask} disabled={!isOnline} />



        <TaskList
          tasks={tasks}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          disabled={!isOnline}
        />

        <h1 className="text-3xl font-bold text-white mb-4">Welcome to Ionic</h1>
        <p className="text-white mb-6">This is a Tailwind CSS styled Ionic app.</p>

      </IonContent>
    </IonPage>
  );
};

export default Home;
