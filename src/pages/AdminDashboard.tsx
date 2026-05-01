import { IonPage, IonContent } from "@ionic/react";

export default function AdminDashboard() {
  return (
    <IonPage>
      <IonContent>
        <div className="p-6 flex flex-col gap-6">

          <h1 className="text-2xl font-bold">Dashboard</h1>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-gray-500">Empleados</p>
              <p className="text-xl font-bold">12</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-gray-500">Horas totales</p>
              <p className="text-xl font-bold">980h</p>
            </div>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
}
