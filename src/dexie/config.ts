import Dexie from "dexie";

const db = new Dexie("MiAppDB");

db.version(1).stores({
    frutas: "++id, nombre, createdAt",
});

export default db;