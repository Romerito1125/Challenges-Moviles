import Dexie from "dexie";
import type { EntityTable } from "dexie";

export interface FotoEntry {
  id: string;
  dataUrl: string;
  createdAt: number;
}

const db = new Dexie("MiAppDB") as Dexie & {
  fotos: EntityTable<FotoEntry, "id">;
};

db.version(2).stores({
  frutas: "++id, nombre, createdAt",
  fotos:  "id, createdAt",
});

export default db;
