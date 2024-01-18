import '@/styles/globals.css'
import React from "react";
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import {GetServerSideProps} from "next";

const AdminBarContext = React.createContext({ adminBarHtml: '' });

export default function App({ Component, pageProps }: AppProps) {
   const router = useRouter();

   return (
       <AdminBarContext.Provider value={{ adminBarHtml: pageProps.adminBarHtml }}>
          <Component {...pageProps} key={router.asPath} />
       </AdminBarContext.Provider>
   );
}

function trimSlashes(str: string | undefined) {
   if (!str) return '';
   return str.replace(/^\/|\/$/g, '');
}

export const getServerSideProps: GetServerSideProps = async (context) => {
   // Check if the user is logged in to WordPress
   const cookies = context.req.headers.cookie as string;
   const isLoggedIn = cookies && cookies.split(';').some(cookie => cookie.trim().startsWith('wordpress_logged_in_'));

   if (!isLoggedIn) {
       return { props: { adminBarHtml: null } };
   }

   try {
      const rawSlug = context.params?.slug as string | undefined;
      const slug = trimSlashes(rawSlug);  // Trim slashes from the slug
      const adminBarUrl = slug
          ? `${process.env.WORDPRESS_HOST}/${slug}/?adminbar=show`
          : `${process.env.WORDPRESS_HOST}/?adminbar=show`;

      const response = await fetch(adminBarUrl, {
         headers: { Cookie: cookies },
      });

      if (!response.ok) {
         throw new Error(`Failed to fetch admin bar: ${response.status}`);
      }

      const adminBarHtml = await response.text();
      return { props: { adminBarHtml } };
   } catch (error) {
      console.error('Error fetching admin bar:', error);
      return { props: { adminBarHtml: null } };
   }
};