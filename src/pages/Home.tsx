import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon
} from '@ionic/react';

import {
  list,
  people,
  nutrition,
  logOut,
  wifi,
  cloudOffline,
  phonePortrait,
  camera,
  phoneLandscape,
  folder,
  pulse,
  notifications,
  send
} from 'ionicons/icons';

import { useContext } from 'react';
import { useHistory } from 'react-router';

import { TasksContext } from '../context/TareasContext';
import { AuthContext } from '../context/AuthContext';

import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const Home: React.FC = () => {

  const history = useHistory();


  return (
    <IonPage>

        <IonButton expand="block" onClick={() => history.push("/accelerometer")}>
          <IonIcon icon={phonePortrait} slot="start" />
          Accelerometer
        </IonButton>

        <IonButton expand="block" onClick={() => history.push("/camera")}>
          <IonIcon icon={camera} slot="start" />
          Cámara
        </IonButton>

        <IonButton expand="block" onClick={() => history.push("/device")}>
          <IonIcon icon={phoneLandscape} slot="start" />
          Device
        </IonButton>

        <IonButton expand="block" onClick={() => history.push("/filesystem")}>
          <IonIcon icon={folder} slot="start" />
          FileSystem
        </IonButton>

        <IonButton expand="block" onClick={() => history.push("/haptic")}>
          <IonIcon icon={pulse} slot="start" />
          Haptics
        </IonButton>

        <IonButton expand="block" onClick={() => history.push("/local-notification")}>
          <IonIcon icon={notifications} slot="start" />
          Local Notifications
        </IonButton>

        <IonButton expand="block" onClick={() => history.push("/push-notification")}>
          <IonIcon icon={send} slot="start" />
          Push Notifications
        </IonButton>


    </IonPage>
  );
};

export default Home;
