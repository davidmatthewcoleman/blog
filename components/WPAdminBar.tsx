import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const WPAdminBar = () => {
    const router = useRouter();
    const [adminBarSlug, setAdminBarSlug] = useState('');

    useEffect(() => {
        // Check if the router is ready
        if (router.isReady) {
            console.log("Pathname:", router.pathname); // Log the pathname
            console.log("AsPath:", router.asPath); // Log the asPath

            setAdminBarSlug(router.asPath);
        }
    }, [router.isReady, router.pathname, router.asPath]);

    const [adminBarHtml, setAdminBarHtml] = useState('');

    useEffect(() => {
        const fetchAdminBar = async () => {
            try {
                // Get the authentication cookies from the browser's cookies
                const authCookies = document.cookie; // This will contain all cookies for the domain

                // Fetch the admin bar HTML for the specific slug and include the authentication cookies
                const response = await fetch(`/api/getAdminBar?slug=${adminBarSlug}`, {
                    method: 'GET',
                    headers: {
                        'Cookie': authCookies, // Include all cookies in the request headers
                    },
                });

                if (response.ok) {
                    const html = await response.text();

                    // Now, fetch the CSS and JS for the #wpadminbar
                    const adminBar = document.createElement('div');
                    adminBar.innerHTML = html;

                    const cssLink = adminBar.querySelector('link#admin-bar-css');
                    const jsScript = adminBar.querySelector('script#admin-bar-js');

                    if (cssLink && jsScript) {
                        const cssUrl = cssLink.getAttribute('href') as string;
                        const jsUrl = jsScript.getAttribute('src') as string;

                        // Fetch the CSS and JS files
                        const [cssResponse, jsResponse] = await Promise.all([
                            fetch(cssUrl),
                            fetch(jsUrl),
                        ]);

                        if (cssResponse.ok) {
                            const cssText = await cssResponse.text();
                            // Create a style element and set its content to the CSS text
                            const styleElement = document.createElement('style');
                            styleElement.textContent = cssText;

                            // Append the style element to the adminBar
                            adminBar.appendChild(styleElement);
                        }

                        if (jsResponse.ok) {
                            const jsText = await jsResponse.text();
                            // Create a script element and set its content to the JS text
                            const scriptElement = document.createElement('script');
                            scriptElement.textContent = jsText;

                            // Append the script element to the adminBar
                            adminBar.appendChild(scriptElement);
                        }

                        // Now, adminBar contains the HTML, CSS, and JS
                        setAdminBarHtml(adminBar.innerHTML);
                    }
                } else {
                    console.error('Failed to fetch admin bar:', response.status);
                    // Handle error appropriately
                }
            } catch (error) {
                console.error('Error:', error);
                // Handle error appropriately
            }
        };

        fetchAdminBar();
    }, [adminBarSlug]);

    return (
        <div id={`wpadminbar_wrapper`} className={`fixed inset-0 w-screen h-screen z-50`} dangerouslySetInnerHTML={{ __html: adminBarHtml }}></div>
    );
};

export default WPAdminBar;
