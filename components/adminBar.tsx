import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const AdminBar = () => {
    const [adminBarHtml, setAdminBarHtml] = useState('');
    const router = useRouter();
    const { slug } = router.query; // Assuming 'slug' is the dynamic part of your route

    useEffect(() => {
        const fetchAdminBar = async () => {
            const adminBarUrl = slug
                ? `${process.env.WORDPRESS_HOST}/${slug}/?adminbar=show`
                : `${process.env.WORDPRESS_HOST}/?adminbar=show`;

            try {
                const res = await fetch(adminBarUrl, {
                    credentials: 'include',
                });

                if (res.ok) {
                    const html = await res.text();
                    setAdminBarHtml(html);
                } else {
                    console.error('Failed to fetch admin bar:', res.statusText);
                }
            } catch (error) {
                console.error('Error fetching admin bar:', error);
            }
        };

        if (slug || slug === '') { // Fetch admin bar if slug is present or it's the home page
            fetchAdminBar();
        }
    }, [slug]); // Re-run the effect when the slug changes

    return (
        <div className={`wp-admin-bar-container`} dangerouslySetInnerHTML={{ __html: adminBarHtml }} />
    );
};

export default AdminBar;
