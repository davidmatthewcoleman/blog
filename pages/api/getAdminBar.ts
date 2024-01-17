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

    // Use Axios to fetch authentication cookies from the WordPress REST API endpoint
    const response = await axios.get(`${process.env.WORDPRESS_HOST}/api/wp/v2/get-auth-cookies`, {
      headers: requestHeaders, // Pass the request headers, including cookies
      withCredentials: true, // Include credentials (cookies) in the request
    });

    // Check if the cookies are available in the response
    const authCookies = response.data;

    console.log(authCookies);

    if (authCookies) {
      // You can use the retrieved cookies for authentication or other purposes

      // Continue with your code to fetch the admin bar content
      const axiosInstance = axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: true, // Bypass SSL certificate validation
        }),
      });

      const adminBarResponse = await axiosInstance.get(adminBarUrl, {
        headers: requestHeaders, // Pass the request headers, including cookies
      });

      // console.log('Response Status Code:', adminBarResponse.status);
      // console.log('Response Headers:', adminBarResponse.headers);
      // console.log('Response Data:', adminBarResponse.data);

      const html = adminBarResponse.data;
      const $ = cheerio.load(html);

      // Check if the #wpadminbar element exists using vanilla JavaScript
      const wpAdminBarElement = document.getElementById('wpadminbar');

      if (wpAdminBarElement) {
        res.status(200).send(html);
      } else {
        res.status(404).end('Admin bar not found for this slug');
      }
    } else {
      res.status(401).end('Authentication cookies not available'); // Handle unauthorized access
    }
  } catch (error) {
    console.log(error);
    res.status(500).end(); // You can optionally return a 500 status code here
  }
};
