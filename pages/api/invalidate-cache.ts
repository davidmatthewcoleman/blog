import { NextApiRequest, NextApiResponse } from 'next';
import cache from 'memory-cache';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Handle the incoming webhook request here
        // You can access the request body and headers to determine the event and take appropriate actions

        // Example: Check if it's a login event
        if (req.headers['X-WordPress-Event'] === 'login') {
            cache.clear();
            // Perform cache invalidation logic for login event here
            // You can use your preferred caching mechanism or logic
            // For this example, we'll just send a response indicating success
            res.status(200).json({ message: 'Cache invalidated for login event' });
        }

        // Example: Check if it's a logout event
        if (req.headers['X-WordPress-Event'] === 'logout') {
            cache.clear();
            // Perform cache invalidation logic for logout event here
            // You can use your preferred caching mechanism or logic
            // For this example, we'll just send a response indicating success
            res.status(200).json({ message: 'Cache invalidated for logout event' });
        }

        // Handle other webhook events as needed

    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
