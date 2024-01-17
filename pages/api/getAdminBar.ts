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
      var adminBarUrl = `${process.env.WORDPRESS_HOST}/${sanitizedSlug}/?adminbar=show`;
    } else {
      // If no `slug` is provided, construct the admin bar URL without the slug attribute
      var adminBarUrl = `${process.env.WORDPRESS_HOST}/?adminbar=show`;
    }

    // Get the incoming request headers
    const requestHeaders = req.headers;

    // Continue with your code to fetch the admin bar content
    const axiosInstance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: true, // Bypass SSL certificate validation
      }),
      headers: requestHeaders, // Pass the request headers, including cookies
      withCredentials: true, // Include credentials (cookies) in the request
    });

    const adminBarResponse = await axiosInstance.get(adminBarUrl);

    // console.log('Response Status Code:', adminBarResponse.status);
    // console.log('Response Headers:', adminBarResponse.headers);
    // console.log('Response Data:', adminBarResponse.data);

    const html = adminBarResponse.data;
    const $ = cheerio.load(html);

    // Check if the #wpadminbar element exists using vanilla JavaScript
    // Note: This check is based on server-side rendering, so document.getElementById won't work
    // You might need to use a different approach if you want to check this on the client side
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
