// pages/components/WPAdminBar.tsx
import React from 'react';
import { GetServerSideProps } from 'next';

interface WPAdminBarProps {
    adminBarHtml: string;
}

const WPAdminBar: React.FC<WPAdminBarProps> = ({ adminBarHtml= '' }) => {
    // Render only if adminBarHtml is provided
    if (!adminBarHtml) return null;

    return (
        <div className={`wp-admin-bar-container`} dangerouslySetInnerHTML={{ __html: adminBarHtml }} />
    );
};

function trimSlashes(str: string | undefined) {
    if (!str) return '';
    return str.replace(/^\/|\/$/g, '');
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // Redirect if this page is accessed directly
    if (context.resolvedUrl.startsWith('/components/WPAdminBar')) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    // Check if the user is logged in to WordPress
    const cookies = context.req.headers.cookie as string;
    // const isLoggedIn = cookies && cookies.split(';').some(cookie => cookie.trim().startsWith('wordpress_logged_in_'));
    //
    // if (!isLoggedIn) {
    //     return { props: { adminBarHtml: null } };
    // }

    try {
        const rawSlug = context.params?.slug as string | undefined;
        const slug = trimSlashes(rawSlug);  // Trim slashes from the slug
        const adminBarUrl = slug
            ? `${process.env.WORDPRESS_HOST}/${slug}/?adminbar=show`
            : `${process.env.WORDPRESS_HOST}/?adminbar=show`;

        const response = await fetch(adminBarUrl, {
            headers: { Cookie: cookies },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch admin bar: ${response.status}`);
        }

        const adminBarHtml = await response.text();
        return { props: { adminBarHtml } };
    } catch (error) {
        console.error('Error fetching admin bar:', error);
        return { props: { adminBarHtml: null } };
    }
};

export default WPAdminBar;
