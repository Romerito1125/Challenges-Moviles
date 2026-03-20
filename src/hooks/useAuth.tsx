import { useEffect, useState } from "react";

export function useAuth() {
    const [user, setUser] = useState(null);

    useEffect(() => {

        const storedUser = localStorage.getItem("Usuario");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData: any) => {
        setUser(userData);
        localStorage.setItem("Usuario", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("Usuario");
    };
    
    return { user, login, logout };

}