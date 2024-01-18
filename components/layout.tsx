import React from 'react';

const Layout = ({ children, adminBarHtml }: { children: any, adminBarHtml: any }) => {
    return (
        <>
            <div className={`wp-admin-bar-container`} dangerouslySetInnerHTML={{ __html: adminBarHtml }} />
            {children}
        </>
    );
};

export default Layout;
