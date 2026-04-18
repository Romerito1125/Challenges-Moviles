import { IonProgressBar } from "@ionic/react";

const ProgressBar = ({ misiones }: any) => {
  if (!misiones || misiones.length === 0) {
    return <p>Cargando misiones...</p>;
  }

  const completadas = misiones.filter((m: any) => m.completado).length;
  const total = misiones.length;

  const value = completadas / total;

  return (
    <div style={{ marginBottom: 20 }}>
      <p>{completadas} / {total} completadas</p>
      <IonProgressBar value={value}></IonProgressBar>
    </div>
  );
};

export default ProgressBar;