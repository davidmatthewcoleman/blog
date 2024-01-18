import { NextApiRequest, NextApiResponse } from 'next';
import cache from 'memory-cache';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        console.log('Webhook received:', req.headers['X-WordPress-Event']);

        // Example: Check if it's a login event
        if (req.headers['X-WordPress-Event'] === 'login') {
            console.log('Invalidating cache for login event');
            cache.clear();
            res.status(200).json({ message: 'Cache invalidated for login event' });
        }

        // Example: Check if it's a logout event
        if (req.headers['X-WordPress-Event'] === 'logout') {
            console.log('Invalidating cache for logout event');
            cache.clear();
            res.status(200).json({ message: 'Cache invalidated for logout event' });
        }

        // Log if no relevant header is found
        if (!req.headers['X-WordPress-Event']) {
            console.log('No relevant header found');
            res.status(200).json({ message: 'No action taken' });
        }

    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
