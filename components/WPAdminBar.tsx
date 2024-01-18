import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function trimSlashes(str: any){
    str = str.startsWith('/') ? str.substr(1) : str;
    str = str.endsWith('/') ? str.substr(0, str.length - 1) : str;
    return str;
}

const WPAdminBar = () => {
    const router = useRouter();
    const [adminBarHtml, setAdminBarHtml] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!router.isReady) return;

        const fetchAdminBar = async () => {
            setIsLoading(true);
            try {
                let response;
                if (router.asPath === '/' || trimSlashes(router.asPath).indexOf('/') !== -1) {
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
            setIsLoading(false);
        };

        fetchAdminBar();
    }, [router.isReady, router.asPath]);

    if (isLoading) {
        return <div className={`wp-admin-bar-placeholder`}/>;
    }

    return (
        <div className={`wp-admin-bar-container`} dangerouslySetInnerHTML={{ __html: adminBarHtml }} />
    );
};

export default WPAdminBar;
