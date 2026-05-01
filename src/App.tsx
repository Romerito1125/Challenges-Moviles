import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { AuthProvider } from './context/AuthContext';
import { TasksProvider } from './context/TareasContext';
import { ContactsProvider } from './context/ContactContext';


import Login from './pages/Login';
import Registro from './pages/Registro';
import Home from './pages/Home';
import Contacts from './pages/Contacts';
import WorkLocation from './pages/WorkLocation';
import EmployeeHistory from './pages/WorkHistory';
import AdminDashboard from './pages/AdminDashboard';
import EmployeesAdmin from './pages/EmployeesManagement';
import EmployeeProfile from './pages/Profile';


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

        <AuthProvider>
          <TasksProvider>
            <ContactsProvider>

              <Route path="/login" component={Login} exact />
              <Route path="/register" component={Registro} exact />

              <Route path="/home" component={Home} exact />
              <Route path="/contacts" component={Contacts} exact />
              <Route path="/work-location" component={WorkLocation} exact />
              <Route path="/employee-history" component={EmployeeHistory} exact />
              <Route path="/admin-dashboard" component={AdminDashboard} exact />
              <Route path="/employees" component={EmployeesAdmin} exact />
              <Route path="/profile" component={EmployeeProfile} exact />
              <Redirect exact from="/" to="/login" />

            </ContactsProvider>
          </TasksProvider>
        </AuthProvider>

      </IonReactRouter>
    </IonApp>

);

export default App;
