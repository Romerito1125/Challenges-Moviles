import useCollection from "./useCollection";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useContacts = () => {

  const { user } = useContext(AuthContext);

  const {
    results,
    isPending,
    error,
    add,
    remove
  } = useCollection("contacts");

  const getContacts = async () => {
    if (!user) return;

    return await results;
  };

  const addContact = async (contact: { name: string; phone: string }) => {
    if (!user) return;

    await add({
      ...contact,
      userId: user.uid
    });
  };

  const deleteContact = async (id: string) => {
    await remove(id);
  };

  return {
    contacts: results,
    loading: isPending,
    error,
    getContacts,
    addContact,
    deleteContact
  };
};
