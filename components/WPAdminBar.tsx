import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const WPAdminBar = (adminBarHtml: any) => {
    // The rest of your component remains the same

    return (
        <div className={`wp-admin-bar-container`} dangerouslySetInnerHTML={{ __html: adminBarHtml }} />
    );
};

export default WPAdminBar;

// Add this function to fetch data on the server
export async function getServerSideProps() {
    try {
        // Fetch the admin bar content on the server
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getAdminBar`);
        if (!response.ok) {
            console.error('Failed to fetch admin bar:', response.status);
            return {
                props: { adminBarHtml: '' }, // Provide an empty HTML in case of failure
            };
        }

        const adminBarData = await response.json();
        return {
            props: { adminBarHtml: adminBarData.adminBarHtml },
        };
    } catch (error) {
        console.error('Error fetching admin bar:', error);
        return {
            props: { adminBarHtml: '' }, // Provide an empty HTML in case of error
        };
    }
}
