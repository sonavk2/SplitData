import React, { createContext, useState, useContext } from 'react';
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null); // Renamed to userId for consistency

    const login = (id) => {
        console.log('UserProvider: login called with id:', id);
        setUserId(id);
    };

    const logout = () => {
        console.log('UserProvider: logout called');
        setUserId(null);
    };

    return (
        <UserContext.Provider value={{ userId, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
