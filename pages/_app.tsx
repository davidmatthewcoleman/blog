import '@/styles/globals.css'
import React from "react";
import App from 'next/app'
import cheerio from 'cheerio';
import { useRouter } from 'next/router'
import {GetServerSideProps} from "next";

class WebApp extends App {
   static async getInitialProps(appContext: any) {
      const { ctx } = appContext;
      const { asPath } = ctx; // This gives you the current path

      // Extract slug from the path
      const slug = asPath.split('/').filter((part: string) => part.length > 0).join('/');


      // Construct the admin bar URL
      const adminBarUrl = slug
          ? `${process.env.WORDPRESS_HOST}/${slug}/?adminbar=show`
          : `${process.env.WORDPRESS_HOST}/?adminbar=show`;

      // Fetch the admin bar HTML
      const res = await fetch(adminBarUrl);
      const adminBarHtml = await res.text();

      // Use Cheerio to parse the HTML
      const $ = cheerio.load(adminBarHtml);
      const isAdminBarPresent = $('#wpadminbar').length > 0;

      // Call the original getInitialProps method
      const appProps = await App.getInitialProps(appContext);

      // Pass the admin bar HTML only if the admin bar is present
      return {
         ...appProps,
         pageProps: {
            ...appProps.pageProps,
            adminBarHtml: isAdminBarPresent ? adminBarHtml : null
         }
      };
   }

   render() {
      const { Component, pageProps } = this.props;
      return <Component {...pageProps} />;
   }
}

export default WebApp;
