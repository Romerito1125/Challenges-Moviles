import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import { AuthProvider } from "./context/AuthContext";
import { JornadaProvider } from "./context/JornadaContext";
import { useEffect } from "react";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Home from "./pages/Home";
import WorkLocation from "./pages/WorkLocation";
import EmployeeHistory from "./pages/WorkHistory";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeesAdmin from "./pages/EmployeesManagement";
import EmployeeDetail from "./pages/EmployeeDetail";
import EmployeeProfile from "./pages/Profile";
import CameraCapture from "./pages/CameraCapture";
import JornadaResumen from "./pages/JornadaResumen";
import SetPassword from "./pages/SetPassword";

import { App as CapacitorApp } from "@capacitor/app";
import { supabase } from "./supabase/client";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    let listener: any;

    const setupDeepLinks = async () => {
      listener = await CapacitorApp.addListener(
        "appUrlOpen",
        async (event) => {
          console.log("Deep link recibido:", event.url);

          const url = event.url;

          if (url.includes("#access_token=")) {
            const hash = url.split("#")[1];

            const params = new URLSearchParams(hash);

            const accessToken = params.get("access_token");
            const refreshToken = params.get("refresh_token");

            console.log("Access token:", !!accessToken);
            console.log("Refresh token:", !!refreshToken);

            if (accessToken && refreshToken) {
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

              console.log("ERROR SETSESSION:", error);

              const { data } = await supabase.auth.getSession();

              console.log("SESSION DESPUÉS:", data.session);

              if (error) {
                alert(`Error sesión: ${error.message}`);
                console.error(error);
              } else {

                setTimeout(() => {
                  console.log("Navegando a /set-password");
                  window.location.replace("/set-password");
                }, 500);
              }
            }
          }
        }
      );
    };

    setupDeepLinks();

    return () => {
      listener?.remove();
    };
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <AuthProvider>
          <JornadaProvider>
            <IonRouterOutlet>
              <Route path="/login" component={Login} exact />
              <Route path="/register" component={Registro} exact />

              <Route path="/home" component={Home} exact />
              <Route path="/work-location" component={WorkLocation} exact />
              <Route
                path="/employee-history"
                component={EmployeeHistory}
                exact
              />
              <Route
                path="/admin-dashboard"
                component={AdminDashboard}
                exact
              />
              <Route path="/employees" component={EmployeesAdmin} exact />
              <Route
                path="/employees/:id"
                component={EmployeeDetail}
                exact
              />
              <Route path="/profile" component={EmployeeProfile} exact />
              <Route
                path="/camera-capture"
                component={CameraCapture}
                exact
              />
              <Route
                path="/jornada-resumen"
                component={JornadaResumen}
                exact
              />
              <Route
                path="/set-password"
                component={SetPassword}
                exact
              />

              <Redirect exact from="/" to="/login" />
            </IonRouterOutlet>
          </JornadaProvider>
        </AuthProvider>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;