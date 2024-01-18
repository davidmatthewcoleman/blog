import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import cheerio from 'cheerio';

const AdminBar = () => {
    const [adminBarHtml, setAdminBarHtml] = useState('');
    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        const fetchAdminBar = async () => {
            const adminBarUrl = slug
                ? `${process.env.WORDPRESS_HOST}/${slug}/?adminbar=show`
                : `${process.env.WORDPRESS_HOST}/?adminbar=show`;

            try {
                // Fetching cookies from the browser (if accessible)
                const cookies = document.cookie;

                const res = await fetch(adminBarUrl, {
                    headers: {
                        'Cookie': cookies,
                    },
                    credentials: 'include',
                });

                if (res.ok) {
                    const html = await res.text();

                    // Use Cheerio to parse the HTML and check for #wpadminbar
                    const $ = cheerio.load(html);
                    const isAdminBarPresent = $('#wpadminbar').length > 0;

                    if (isAdminBarPresent) {
                        setAdminBarHtml(html);
                    }
                } else {
                    console.error('Failed to fetch admin bar:', res.statusText);
                }
            } catch (error) {
                console.error('Error fetching admin bar:', error);
            }
        };

        if (typeof slug !== 'undefined') {
            fetchAdminBar();
        }
    }, [slug]);

    return (
        <div className={`wp-admin-bar-container`} dangerouslySetInnerHTML={{ __html: adminBarHtml }} />
    );
};

export default AdminBar;
