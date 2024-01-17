import axios from 'axios';
import https from 'https';
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

    // Create an Axios instance with SSL validation bypass
    const axiosInstance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Bypass SSL certificate validation
      }),
    });

    const response = await axiosInstance.get(adminBarUrl, {
      headers: requestHeaders, // Pass the request headers, including cookies
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Check if the #wpadminbar element exists using vanilla JavaScript
    const wpAdminBarElement = document.getElementById('wpadminbar');

    if (wpAdminBarElement) {
      res.status(200).send(html);
    } else {
      res.status(404).end('Admin bar not found for this slug');
    }
  } catch (error) {
    console.log(error);
    res.status(500).end(); // You can optionally return a 500 status code here
  }
};
