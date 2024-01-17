import axios from 'axios';
import https from 'https';
import cheerio from 'cheerio';

export default async (req: any, res: any) => {
  try {
    const { slug } = req.query;
    const adminBarUrl = slug
        ? `${process.env.WORDPRESS_HOST}/${slug}/?adminbar=show`
        : `${process.env.WORDPRESS_HOST}/?adminbar=show`;

    // Extract the cookies from the incoming request
    const cookies = req.headers.cookie;

    if (!cookies) {
      return res.status(401).send('Unauthorized: No cookies provided');
    }

    // Create an axios instance
    const axiosInstance = axios.create({
      httpsAgent: new https.Agent({ rejectUnauthorized: true }),
      headers: {
        Cookie: cookies, // Forward the cookies from the incoming request
      }
    });

    // Fetch the admin bar HTML
    const adminBarResponse = await axiosInstance.get(adminBarUrl);
    const html = adminBarResponse.data;

    console.log(html);

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
    // console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};
