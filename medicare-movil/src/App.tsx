import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  IonBadge
} from '@ionic/react';
import { useState } from "react";

import { IonReactRouter } from '@ionic/react-router';
import { calendar, people, person } from "ionicons/icons";

import LoginPage from "./pages/LoginPage";
import VisitasPage from "./pages/VisitasPage";
import MisPacientesPage from "./pages/MisPacientesPage";
import PerfilMedicoPage from "./pages/PerfilMedicoPage";
import DetalleVisitaPage from "./pages/DetalleVisitaPage";

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import '@ionic/react/css/padding.css';
import '@ionic/react/css/display.css';

import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const [visitas, setVisitas] = useState([
    { id: 1, paciente: "Pedro", estado: "pendiente" },
    { id: 2, paciente: "Ana", estado: "pendiente" },
    { id: 3, paciente: "Carlos", estado: "finalizada" }
  ]);

  const pendientes = visitas.filter(
    v => v.estado === "pendiente"
  ).length;
  return (
    <IonApp>

      <IonReactRouter>

        <IonRouterOutlet>


          <Route exact path="/login" component={LoginPage} />


          <Route
            path="/tabs"
            render={() => (
              <IonTabs>

                <IonRouterOutlet>

                  <Route
                    exact
                    path="/tabs/visitas"
                    render={(props) => (
                      <VisitasPage
                        {...props}
                        visitas={visitas}
                        setVisitas={setVisitas}
                      />
                    )}
                  />

                  <Route exact path="/tabs/pacientes" component={MisPacientesPage} />
                  <Route exact path="/tabs/perfil" component={PerfilMedicoPage} />
                  <Route
                    exact
                    path="/tabs/visitas/:id"
                    render={(props) => (
                      <DetalleVisitaPage
                        {...props}
                        visitas={visitas}
                      />
                    )}
                  />
                  <Redirect exact from="/tabs" to="/tabs/visitas" />

                </IonRouterOutlet>

                <IonTabBar slot="bottom">

                  <IonTabButton tab="visitas" href="/tabs/visitas">
                    <IonIcon icon={calendar} />
                    <IonLabel>Visitas</IonLabel>

                    {pendientes > 0 && (
                      <IonBadge color="danger">
                        {pendientes}
                      </IonBadge>
                    )}

                  </IonTabButton>

                  <IonTabButton tab="pacientes" href="/tabs/pacientes">
                    <IonIcon icon={people} />
                    <IonLabel>Pacientes</IonLabel>
                  </IonTabButton>

                  <IonTabButton tab="perfil" href="/tabs/perfil">
                    <IonIcon icon={person} />
                    <IonLabel>Perfil</IonLabel>
                  </IonTabButton>

                </IonTabBar>

              </IonTabs>
            )}
          />


          <Redirect exact from="/" to="/login" />

        </IonRouterOutlet>

      </IonReactRouter>

    </IonApp>
  );
};

export default App;
