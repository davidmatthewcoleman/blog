import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async (req: any, res: any) => {
  try {
    const { slug } = req.query;

    // Check if the `slug` parameter is provided
    if (slug) {
      // Decode the slug to remove forward slashes
      const sanitizedSlug = slug.replace(/\//g, '');
      // Construct the admin bar URL with the sanitized slug
      var adminBarUrl = `https://secure.davidmc.io/${sanitizedSlug}/?adminbar=show`;
    } else {
      // If no `slug` is provided, construct the admin bar URL without the slug attribute
      var adminBarUrl = `https://secure.davidmc.io/?adminbar=show`;
    }

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