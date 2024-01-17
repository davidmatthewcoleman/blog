import fetch from 'node-fetch';
import https from 'https';
import cheerio from 'cheerio';

export default async (req: any, res: any) => {
  try {
    const { slug } = req.query;
    const adminBarUrl = slug
        ? `${process.env.WORDPRESS_HOST}/${slug}?adminbar=show`
        : `${process.env.WORDPRESS_HOST}/?adminbar=show`;

    // Extract the cookies from the incoming request
    const cookies = req.headers.cookie;

    if (!cookies) {
      return res.status(401).send('Unauthorized: No cookies provided');
    }

    // Create an HTTPS agent
    const httpsAgent = new https.Agent({ rejectUnauthorized: true });

    // Fetch the admin bar HTML using node-fetch with the HTTPS agent
    const response = await fetch(adminBarUrl, {
      method: 'GET',
      headers: {
        'Cookie': cookies
      },
      agent: httpsAgent
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Load the HTML with cheerio and extract the admin bar
    const $ = cheerio.load(html);
    const wpAdminBarElement = $('#wpadminbar');

    // Send the admin bar HTML or a not found message
    if (wpAdminBarElement.length > 0) {
      const adminBarHtml = wpAdminBarElement.html();
      res.status(200).send(html);
    } else {
      res.status(404).send('Admin bar not found for this slug');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};
