import React, { useEffect, useState } from "react";
import { isAuthenticated } from "./util/Helpers";

export const AuthContext = React.createContext({
    authenticated: false,
    setAuthenicated: () => { }
});

export const AuthProvider = ({ children }) => {
    const [pending, setPending] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    useEffect(() => {
        setAuthenticated(isAuthenticated())

        setPending(false)
    }, []);

    if (pending) {
        return <>Loading...</>
    }

    return (
        <AuthContext.Provider value={{ authenticated, setAuthenticated: setAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
