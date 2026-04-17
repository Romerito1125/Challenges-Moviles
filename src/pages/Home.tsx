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
  send,
  map
} from 'ionicons/icons';

import { useContext } from 'react';
import { useHistory } from 'react-router';

import { TasksContext } from '../context/TareasContext';
import { AuthContext } from '../context/AuthContext';

import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import "leaflet/dist/leaflet.css";

const Home: React.FC = () => {

  const history = useHistory();


  return (
    <IonPage>

        <IonButton expand="block" onClick={() => history.push("/tracking")}>
          <IonIcon icon={map} slot="start" />
          Mapa
        </IonButton>

    </IonPage>
  );
};

export default Home;
