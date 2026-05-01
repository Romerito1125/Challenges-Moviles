import { IonPage, IonContent } from "@ionic/react";

export default function EmployeesAdmin() {
  const employees = ["Juan", "Maria", "Carlos"];

  return (
    <IonPage>
      <IonContent>
        <div className="p-6">

          <h1 className="text-2xl font-bold mb-4">Empleados</h1>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4">
            + Agregar empleado
          </button>

          <div className="flex flex-col gap-3">
            {employees.map((emp, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow flex justify-between">
                <span>{emp}</span>
                <button className="text-blue-500">Ver</button>
              </div>
            ))}
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
}
