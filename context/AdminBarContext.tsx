import React, { createContext, useContext } from 'react';

// Create a context with an empty default value
export const AdminBarContext = createContext({ adminBarHtml: '' });

// Context provider in your _app.tsx or a layout component
export const AdminBarProvider = ({ children, adminBarHtml }: { children: any, adminBarHtml: any }) => {
    return (
        <AdminBarContext.Provider value={{ adminBarHtml }}>
            {children}
        </AdminBarContext.Provider>
    );
};

// Custom hook to use the admin bar context
export const useAdminBar = () => useContext(AdminBarContext);
