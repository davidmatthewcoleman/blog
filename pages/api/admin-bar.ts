// pages/api/admin-bar.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = req.headers.cookie;
    const isLoggedIn = cookies && cookies.split(';').some(cookie => cookie.trim().startsWith('wordpress_logged_in_'));

    if (isLoggedIn) {
        try {
            const slug = req.query.slug as string | undefined;
            const adminBarUrl = slug
                ? `${process.env.WORDPRESS_HOST}/${slug}?adminbar=show`
                : `${process.env.WORDPRESS_HOST}/?adminbar=show`;

            const wpResponse = await fetch(adminBarUrl, {
                headers: { Cookie: cookies },
            });
            const adminBarHtml = await wpResponse.text();
            res.status(200).json({ adminBarHtml });
        } catch (error) {
            console.error('Error fetching admin bar:', error);
            res.status(500).json({ adminBarHtml: null });
        }
    } else {
        res.status(200).json({ adminBarHtml: null });
    }
}
