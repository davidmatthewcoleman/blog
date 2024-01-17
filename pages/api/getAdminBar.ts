import axios from 'axios';
import https from 'https';
import cheerio from 'cheerio';

export default async (req: any, res: any) => {
  try {
    const { slug } = req.query;

    // Construct the admin bar URL based on whether a slug is provided
    const adminBarUrl = slug
        ? `${process.env.WORDPRESS_HOST}/${encodeURIComponent(slug)}/?adminbar=show`
        : `${process.env.WORDPRESS_HOST}/?adminbar=show`;

    // Extract JWT token from request headers or cookies
    const jwtToken = req.cookies.jwt_token || req.headers.authorization;

    // Return unauthorized status if no token is present
    if (!jwtToken) {
      return res.status(401).send('Unauthorized: No token provided');
    }

    // Create an axios instance with appropriate headers and SSL settings
    const axiosInstance = axios.create({
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Host': new URL(process.env.WORDPRESS_HOST as string).hostname
      }
    });

    // Fetch the admin bar HTML
    const adminBarResponse = await axiosInstance.get(adminBarUrl);
    const html = adminBarResponse.data;

    // Load the HTML with cheerio and extract the admin bar
    const $ = cheerio.load(html);
    const wpAdminBarElement = $('#wpadminbar');

    // Send the admin bar HTML or a not found message
    if (wpAdminBarElement.length > 0) {
      const adminBarHtml = wpAdminBarElement.html();
      res.status(200).send(adminBarHtml);
    } else {
      res.status(404).send('Admin bar not found for this slug');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
