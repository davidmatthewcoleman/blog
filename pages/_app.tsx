import '@/styles/globals.css'
import React from "react";
import App from 'next/app'
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
      const adminBarHtml = await res.text(); // Assuming the response is directly the HTML

      // Call the original getInitialProps method
      const appProps = await App.getInitialProps(appContext);

      return { ...appProps, pageProps: { ...appProps.pageProps, adminBarHtml } };
   }

   render() {
      const { Component, pageProps } = this.props;
      return <Component {...pageProps} />;
   }
}

export default WebApp;
