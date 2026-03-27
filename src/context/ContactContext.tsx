import { createContext } from "react";
import { useContacts } from "../hooks/useContact";

export const ContactsContext = createContext<any>(null);

export const ContactsProvider = ({ children }: any) => {

  const contactsData = useContacts();

  return (
    <ContactsContext.Provider value={contactsData}>
      {children}
    </ContactsContext.Provider>
  );
};
