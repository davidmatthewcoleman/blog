import React from 'react';
import WPAdminBar from "@/components/WPAdminBar";

const Layout = ({ children, adminBarHtml = '' }: { children: any, adminBarHtml: any }) => {
    return (
        <>
            <WPAdminBar/>
            {children}
        </>
    );
};

export default Layout;
