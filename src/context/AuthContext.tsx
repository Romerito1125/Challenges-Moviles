import { createContext, useEffect, useState  } from "react";
import { useAuth } from "../hooks/useAuth";


export const AuthContext = createContext<any>(null);


export function AuthProvider({ children }: { children: React.ReactNode }) {


    const { user, login, logout } = useAuth();

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );


}