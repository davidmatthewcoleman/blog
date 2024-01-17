import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const WPAdminBar = () => {
    const router = useRouter();
    const [adminBarHtml, setAdminBarHtml] = useState('');

    useEffect(() => {
        if (!router.isReady) return;

        const fetchAdminBar = async () => {
            try {
                let response;
                if ( router.asPath === '/' ) {
                    response = await fetch(`/api/getAdminBar`);
                } else {
                    response = await fetch(`/api/getAdminBar?slug=${router.asPath}`);
                }
                if (!response.ok) {
                    console.error('Failed to fetch admin bar:', response.status);
                    return;
                }

                const html = await response.text();
                setAdminBarHtml(html);
            } catch (error) {
                console.error('Error fetching admin bar:', error);
            }
        };

        fetchAdminBar();
    }, [router.isReady, router.asPath]);

    return (
        <div className={`wp-admin-bar-container`} dangerouslySetInnerHTML={{ __html: adminBarHtml }} />
    );
};

export default WPAdminBar;
