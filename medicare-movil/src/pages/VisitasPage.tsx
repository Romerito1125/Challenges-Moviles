import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonReorder,
  IonReorderGroup,
  IonSegment,
  IonSegmentButton,
  IonAlert
} from "@ionic/react";

import { useState } from "react";
import { useHistory } from "react-router";

interface Visita {
  id: number;
  paciente: string;
  estado: string;
}

interface Props {
  visitas: Visita[];
  setVisitas: React.Dispatch<React.SetStateAction<Visita[]>>;
}

const VisitasPage: React.FC<Props> = ({ visitas, setVisitas }) => {

  const history = useHistory();

  const [segment, setSegment] = useState("todas");

  const [alertCancelar, setAlertCancelar] = useState(false);
  const [visitaSeleccionada, setVisitaSeleccionada] = useState<number | null>(null);

  const visitasFiltradas = visitas.filter(v => {

    if (segment === "todas") return true;
    if (segment === "pendientes") return v.estado === "pendiente";
    if (segment === "curso") return v.estado === "en_camino";
    if (segment === "finalizadas") return v.estado === "finalizada";

    return true;

  });

  const marcarEnCamino = (id: number) => {

    const nuevas = visitas.map(v =>
      v.id === id ? { ...v, estado: "en_camino" } : v
    );

    setVisitas(nuevas);

  };

  const cancelarVisita = () => {

    if (visitaSeleccionada === null) return;

    const nuevas = visitas.map(v =>
      v.id === visitaSeleccionada
        ? { ...v, estado: "cancelada" }
        : v
    );

    setVisitas(nuevas);

  };

  const handleReorder = (event: CustomEvent) => {

    const pendientes = visitas.filter(v => v.estado === "pendiente");
    const otras = visitas.filter(v => v.estado !== "pendiente");

    const reordered = event.detail.complete([...pendientes]);

    setVisitas([...reordered, ...otras]);

  };

  return (
    <IonPage>

      <IonHeader>

        <IonToolbar>
          <IonTitle>Visitas</IonTitle>
        </IonToolbar>

        <IonToolbar>

          <IonSegment
            value={segment}
            onIonChange={(e) => setSegment(String(e.detail.value!))}
          >

            <IonSegmentButton value="todas">
              Todas
            </IonSegmentButton>

            <IonSegmentButton value="pendientes">
              Pendientes
            </IonSegmentButton>

            <IonSegmentButton value="curso">
              En curso
            </IonSegmentButton>

            <IonSegmentButton value="finalizadas">
              Finalizadas
            </IonSegmentButton>

          </IonSegment>

        </IonToolbar>

      </IonHeader>

      <IonContent>

        <IonReorderGroup
          disabled={false}
          onIonItemReorder={handleReorder}
        >

          <IonList>

            {visitasFiltradas.map((v) => (

              <IonItemSliding key={v.id}>

                <IonItem>

                  {v.estado === "pendiente" && (
                    <IonReorder slot="start" />
                  )}

                  <IonLabel>
                    <h2>{v.paciente}</h2>
                    <p>Estado: {v.estado}</p>
                  </IonLabel>

                </IonItem>

                <IonItemOptions side="start">

                  <IonItemOption
                    color="primary"
                    onClick={() => marcarEnCamino(v.id)}
                  >
                    En camino
                  </IonItemOption>

                  <IonItemOption
                    color="danger"
                    onClick={() => {
                      setVisitaSeleccionada(v.id);
                      setAlertCancelar(true);
                    }}
                  >
                    Cancelar
                  </IonItemOption>

                </IonItemOptions>

                <IonItemOptions side="end">

                  <IonItemOption
                    color="secondary"
                    onClick={() => history.push(`/tabs/visitas/${v.id}`)}
                  >
                    Ver detalle
                  </IonItemOption>

                </IonItemOptions>

              </IonItemSliding>

            ))}

          </IonList>

        </IonReorderGroup>

        <IonAlert
          isOpen={alertCancelar}
          header="Cancelar visita"
          buttons={[
            { text: "No" },
            {
              text: "Sí cancelar",
              handler: cancelarVisita
            }
          ]}
          onDidDismiss={() => setAlertCancelar(false)}
        />

      </IonContent>

    </IonPage>
  );

};

export default VisitasPage;
