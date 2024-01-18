import React from 'react';
import AdminBar from "@/components/adminBar";

const Layout = ({ children }: { children: any }) => {
    return (
        <>
            <AdminBar/>
            {children}
        </>
    );
};

export default Layout;
