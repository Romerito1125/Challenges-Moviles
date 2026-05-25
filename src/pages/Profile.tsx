import { IonPage, IonContent } from "@ionic/react";

export default function EmployeeProfile() {
  return (
    <IonPage>
      <IonContent>
        <div className="p-6 flex flex-col gap-6">

          <h1 className="text-2xl font-bold">Mi Perfil</h1>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Nombre</p>
            <p className="font-semibold">Juan Pérez</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Horas trabajadas</p>
            <p className="font-semibold">160h</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Pago estimado</p>
            <p className="font-bold text-green-600">$1,200,000</p>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
}
