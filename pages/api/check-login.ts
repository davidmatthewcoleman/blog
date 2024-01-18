import type { NextApiRequest, NextApiResponse } from 'next';

type CheckLoginResponse = {
    isLoggedIn: boolean;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<CheckLoginResponse>) {
    const cookies = req.headers.cookie;
    const isLoggedIn = cookies && cookies.split(';').some(cookie => cookie.trim().startsWith('wordpress_logged_in_')) as any;

    res.status(200).json({ isLoggedIn });
}
