import '@/styles/globals.css';
import React from 'react';
import App, { AppContext } from 'next/app';
import cheerio from 'cheerio';

class WebApp extends App {
   static async getInitialProps(appContext: AppContext) {
      const { ctx } = appContext;
      let slug = '';

      // Function to extract slug based on route type
      const extractSlug = (path: string) => {
         const topicMatch = path.match(/\/topic\/([^\/?]+)/);
         if (topicMatch) return topicMatch[1];

         const tagMatch = path.match(/\/tag\/([^\/?]+)/);
         if (tagMatch) return tagMatch[1];

         const writerMatch = path.match(/\/writer\/([^\/?]+)/);
         if (writerMatch) return writerMatch[1];

         const searchMatch = path.match(/\/search\/([^\/?]+)/);
         if (searchMatch) return searchMatch[1];

         return '';
      };

      if (ctx.req) {
         // Server-side: Extract slug from the request URL
         slug = extractSlug(ctx.req.url || '');
      } else {
         // Client-side: Use window.location.pathname
         slug = extractSlug(window.location.pathname);
      }

      // Construct the admin bar URL
      const adminBarUrl = slug
          ? `${process.env.WORDPRESS_HOST}/${slug}/?adminbar=show`
          : `${process.env.WORDPRESS_HOST}/?adminbar=show`;

      let adminBarHtml: string | null = '';
      if (ctx.req) {
         // Forward cookies from the incoming request to the fetch request
         const cookies = ctx.req.headers.cookie || '';

         try {
            // Fetch the admin bar HTML, including the cookies in the request
            const res = await fetch(adminBarUrl, {
               headers: {
                  'Cookie': cookies,
               },
            });

            if (!res.ok) {
               throw new Error(`Failed to fetch admin bar: ${res.statusText}`);
            }
            adminBarHtml = await res.text();

            // Use Cheerio to parse the HTML
            const $ = cheerio.load(adminBarHtml);
            const isAdminBarPresent = $('#wpadminbar').length > 0;
            adminBarHtml = isAdminBarPresent ? adminBarHtml : null;
         } catch (error) {
            console.error('Error fetching admin bar:', error);
         }
      }

      // Call the original getInitialProps method
      const appProps = await App.getInitialProps(appContext);

      // Pass the admin bar HTML only if the admin bar is present
      return {
         ...appProps,
         pageProps: {
            ...appProps.pageProps,
            adminBarHtml: adminBarHtml,
            key: slug
         }
      };
   }

   render() {
      const { Component, pageProps } = this.props;
      return <Component {...pageProps} />;
   }
}

export default WebApp;