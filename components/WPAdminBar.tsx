import React from 'react';
import { useAdminBar } from '@/context/AdminBarContext';

const AdminBar = () => {
    const { adminBarHtml } = useAdminBar() as any;
    if (!adminBarHtml) return null;

    return (
        <div className={`wp-admin-bar-container`} dangerouslySetInnerHTML={{ __html: adminBarHtml }} />
    );
};

export default AdminBar;