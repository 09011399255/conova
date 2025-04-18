import React, { createContext, useContext } from 'react';

// Define the shape of your context
interface AdminContextType {
    isAdmin: boolean;
}

// Create the context with a default value
const AdminContext = createContext<AdminContextType>({ isAdmin: false });

// Create a provider component
export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAdmin = false;

    return (
        <AdminContext.Provider value={{ isAdmin }}>
            {children}
        </AdminContext.Provider>
    );
};

// Custom hook to use the admin context
export const useAdmin = () => useContext(AdminContext);
