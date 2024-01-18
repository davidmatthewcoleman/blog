import { NextApiRequest, NextApiResponse } from 'next';
import cache from 'memory-cache';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        console.log('Received headers:', req.headers);

        const eventType = req.headers['x-wordpress-event'];
        console.log('Webhook received:', eventType);

        if (eventType === 'login' || eventType === 'logout') {
            cache.clear();
            res.status(200).json({ message: `Cache invalidated for ${eventType} event` });
        } else {
            res.status(200).json({ message: 'No relevant event type found' });
        }

    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
