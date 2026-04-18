import MisionItem from "./MisionItem";

const MissionList = ({ misiones }: any) => {
  if (!misiones) return <p>Cargando misiones...</p>;

  return (
    <>
      {misiones.map((m: any) => (
        <MisionItem key={m.id} mision={m} />
      ))}
    </>
  );
};

export default MissionList;