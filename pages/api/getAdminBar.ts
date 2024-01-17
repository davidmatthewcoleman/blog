import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async (req: any, res: any) => {
  try {
    const { slug } = req.query;

    // Handle null slug gracefully (optional)
    if (slug === null || slug === undefined) {
      // Handle the case where no slug is provided
      // You can choose to respond differently based on your use case
      // For example, you can return a message indicating that no slug is provided
      return res.status(200).send('No slug provided');
    }

    // Decode the slug to remove %2F (forward slashes)
    const decodedSlug = decodeURIComponent(slug);

    // Construct the admin bar URL for the specific slug
    const adminBarUrl = `https://secure.davidmc.io/${decodedSlug}/?adminbar=show`;

    const response = await fetch(adminBarUrl);

    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);

      // Check if the #wpadminbar element exists
      if ($('#wpadminbar').length > 0) {
        res.status(200).send(html);
      } else {
        res.status(404).end('Admin bar not found for this slug');
      }
    } else {
      res.status(response.status).end();
    }
  } catch (error) {
    res.status(500).end();
  }
};
