import useCollection from "./useCollection";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export const useContacts = () => {

  const { user } = useContext(AuthContext);

  const {
    results,
    isPending,
    error,
    add,
    remove,
    getAll
  } = useCollection("contacts");

  useEffect(() => {
    if (user) {
      getAll([["userId", "==", user.uid]]);
    }
  }, [user]);

  const addContact = async (contact: { name: string; phone: string }) => {
    if (!user) return;

    await add({
      ...contact,
      userId: user.uid
    });

    await getAll([["userId", "==", user.uid]]); // Traigo el contacto para mostrarlo cuando lo cree
  };

  const deleteContact = async (id: string) => {
    await remove(id);

    if (user) {
      await getAll([["userId", "==", user.uid]]); // Refresco para que cuando lo elimine esté todo "sincronizado"
    }
  };

  return {
    contacts: results,
    loading: isPending,
    error,
    addContact,
    deleteContact
  };
};