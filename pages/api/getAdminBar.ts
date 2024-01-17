import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async (req: any, res: any) => {
  try {
    const { slug } = req.query;

    // Check if the `slug` parameter is provided
    if (slug) {
      // Decode the slug to remove forward slashes
      const sanitizedSlug = decodeURIComponent(slug).replace(/\//g, '').replace('%2F', '').replace('%2f', '');
      // Construct the admin bar URL with the sanitized slug
      var adminBarUrl = `https://secure.davidmc.io/${sanitizedSlug}/?adminbar=show`;
    } else {
      // If no `slug` is provided, construct the admin bar URL without the slug attribute
      var adminBarUrl = `https://secure.davidmc.io/?adminbar=show`;
    }

    // Get the incoming request headers
    const requestHeaders = req.headers;

    const response = await fetch(adminBarUrl, {
      headers: requestHeaders, // Pass the request headers, including cookies
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Check if the #wpadminbar element exists
    if (document.getElementById('wpadminbar')) {
      res.status(200).send(html);
    } else {
      res.status(404).end('Admin bar not found for this slug');
    }
  } catch (error) {
    console.log(error);
    res.status(500).end(); // You can optionally return a 500 status code here
  }
};
