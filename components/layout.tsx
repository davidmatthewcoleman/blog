import React from 'react';
import AdminBar from "@/components/adminBar";

const Layout = ({ children, adminBarHtml = '' }: { children: any, adminBarHtml: any }) => {
    return (
        <>
            <AdminBar/>
            {children}
        </>
    );
};

export default Layout;
