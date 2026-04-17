import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { AuthProvider } from './context/AuthContext';
import { TasksProvider } from './context/TareasContext';
import { ContactsProvider } from './context/ContactContext';


import Home from './pages/Home';


import Accelerometer from './pages/Device';
import Camara from './pages/Camara';
import Device from './pages/Accelerometer';
import FileSystem from './pages/FileSystem';
import Haptic from './pages/Haptic';
import LocalNotification from './pages/LocalNotification';
import PushNotification from './pages/PushNotification';
import TrackingPage from './pages/Tracking';



/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <Route path="/home" component={Home} exact />
      <Route path="/accelerometer" component={Accelerometer} exact />
      <Route path="/camera" component={Camara} exact />
      <Route path="/device" component={Device} exact />
      <Route path="/filesystem" component={FileSystem} exact />
      <Route path="/haptic" component={Haptic} exact />
      <Route path="/local-notification" component={LocalNotification} exact />
      <Route path="/push-notification" component={PushNotification} exact />
      <Route path="/tracking" component={TrackingPage} exact />

      <Redirect exact from="/" to="/home" />

    </IonReactRouter>
  </IonApp>

);

export default App;
