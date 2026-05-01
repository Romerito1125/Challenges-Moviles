import { IonPage, IonContent } from "@ionic/react";

export default function EmployeeHistory() {
  const data = [
    { date: "2026-04-20", hours: 8, status: "Dentro" },
    { date: "2026-04-21", hours: 9, status: "Fuera" },
  ];

  return (
    <IonPage>
      <IonContent>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Historial</h1>

          <div className="flex flex-col gap-4">
            {data.map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow">
                <p className="font-semibold">{item.date}</p>
                <p className="text-gray-500">{item.hours} horas</p>
                <p className={`text-sm ${item.status === "Dentro" ? "text-green-500" : "text-red-500"}`}>
                  {item.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
