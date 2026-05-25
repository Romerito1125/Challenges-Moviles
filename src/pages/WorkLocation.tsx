import { IonPage, IonContent } from "@ionic/react";

export default function WorkLocation() {
  return (
    <IonPage>
      <IonContent>
        <div className="p-6 flex flex-col gap-4">

          <h1 className="text-2xl font-bold">Ubicación de trabajo</h1>

          <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center">
            <p className="text-gray-500">Mapa aquí</p>
          </div>

          <input
            type="number"
            placeholder="Radio en metros"
            className="border p-3 rounded-lg"
          />

          <button className="bg-blue-600 text-white py-3 rounded-xl">
            Guardar ubicación
          </button>

        </div>
      </IonContent>
    </IonPage>
  );
}
