import { IonPage, IonContent, IonIcon } from "@ionic/react";
import { arrowBackOutline, saveOutline, locationOutline } from "ionicons/icons";
import { useState } from "react";
import { useHistory } from "react-router-dom";

export default function WorkLocation() {
  const history = useHistory();
  const [radio, setRadio] = useState("");

  return (
    <IonPage style={{ '--background': '#020617', background: '#020617' }}>
      <IonContent fullscreen style={{ '--background': '#020617' }}>
        <div className="min-h-full bg-linear-to-br from-slate-900 via-slate-950 to-black text-white px-6 pt-12 pb-10 flex flex-col gap-6">

          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => history.goBack()}
              className="w-10 h-10 rounded-full bg-white/8 border border-white/10 flex items-center justify-center cursor-pointer shrink-0"
            >
              <IonIcon icon={arrowBackOutline} className="text-white text-xl" />
            </button>
            <div>
              <h1 className="text-[1.375rem] font-bold m-0">Ubicación de trabajo</h1>
              <p className="text-slate-500 text-[0.8125rem] mt-0.5 m-0">
                Configura el área de trabajo permitida
              </p>
            </div>
          </div>

          {/* Mapa placeholder */}
          <div className="h-64 bg-white/4 border border-white/8 rounded-2xl flex flex-col items-center justify-center gap-2.5">
            <IonIcon icon={locationOutline} className="text-blue-500 text-4xl" />
            <p className="text-slate-500 text-sm m-0">Mapa próximamente</p>
          </div>

          {/* Input radio */}
          <div className="bg-white/4 border border-white/8 rounded-2xl px-5 py-4">
            <label className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
              Radio permitido (metros)
            </label>
            <input
              type="number"
              placeholder="Ej: 100"
              value={radio}
              onChange={(e) => setRadio(e.target.value)}
              className="block w-full mt-2 bg-transparent border-none outline-none text-white text-lg font-medium placeholder:text-slate-600"
            />
          </div>

          {/* Botón guardar */}
          <button className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-linear-to-r from-blue-600 to-blue-500 border-none rounded-2xl text-white font-bold text-base cursor-pointer shadow-[0_8px_24px_rgba(37,99,235,0.35)]">
            <IonIcon icon={saveOutline} className="text-xl" />
            Guardar ubicación
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
}
