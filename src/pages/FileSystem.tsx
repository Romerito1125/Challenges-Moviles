import {
  IonContent,
  IonInput,
  IonItem,
  IonButton,
  IonLabel,
} from "@ionic/react";

import { useState } from "react";
import { useFilesystem } from "../hooks/useFileSystem";

const FileSystem: React.FC = () => {
  const { writeFile, readFile } = useFilesystem();

  const [nombre, setNombre] = useState("");
  const [info, setInfo] = useState("");
  const [data, setData] = useState<any>(null);

  return (
    <>
      <IonItem>
        <IonInput
          placeholder="Nombre"
          value={nombre}
          onIonChange={(e) => setNombre(e.detail.value!)}
        />
      </IonItem>

      <IonItem>
        <IonInput
          placeholder="Información"
          value={info}
          onIonChange={(e) => setInfo(e.detail.value!)}
        />
      </IonItem>

      <IonButton
        onClick={() =>
          writeFile({
            path: "mi-data.json",
            data: { nombre, info },
          })
        }
      >
        Guardar
      </IonButton>

      <IonButton
        onClick={async () => {
          const result = await readFile({ path: "mi-data.json" });
          setData(result);
        }}
      >
        Leer
      </IonButton>

      {data && (
        <IonItem>
          <IonLabel>
            <p><strong>Nombre:</strong> {data.nombre}</p>
            <p><strong>Info:</strong> {data.info}</p>
          </IonLabel>
        </IonItem>
      )}
    </>
  );
};

export default FileSystem;
