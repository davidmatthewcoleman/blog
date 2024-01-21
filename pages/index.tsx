import WpImage from "@/components/wpImage";
import Head from 'next/head';
import Header from "@/components/header";
import PostList from "@/components/postList";
import parse from "html-react-parser";
import React from "react";
import WPAdminBar from "@/components/WPAdminBar";

function Home({menu, options, latestPosts, allPosts, head}: {menu: any, options: any, latestPosts: any, allPosts: any, head: any}) {
  return (
      <>
          <Head>
              {parse(head.head)}
              <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
              <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
              <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
              <link rel="manifest" href="/icons/site.webmanifest" />
              <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#000000" />
              <link rel="shortcut icon" href="/icons/favicon.ico" />
              <meta name="msapplication-TileColor" content="#000000" />
              <meta name="msapplication-TileImage" content="/icons/mstile-144x144.png" />
              <meta name="msapplication-config" content="/icons/browserconfig.xml" />
              <meta name="theme-color" content="#000000" />
          </Head>
          <WpImage
              alt={options.name}
              url={options.site_background_url}
              src={{
                  '(max-width: 960px)': [
                      {
                          width: 1080,
                          height: 1920
                      }
                  ],
                  '(min-width: 961px)': [
                      {
                          width: 1920,
                          height: 1080
                      }
                  ]
              }}
              focalPoint={[50,50]}
              className={`fixed inset-0 w-screen h-screen object-cover opacity-75 -z-10`}
              props={``}
          />
          <main className={`flex flex-col xl:flex-row max-w-[1920px] font-serif`}>
              <Header menu={menu} options={options} latestPosts={latestPosts} />
              <PostList allPosts={allPosts} header={false} options={options} pageNumber={1} />
          </main>
      </>
  )
}

export async function getStaticProps() {
    const resMenuIDs = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/`);
    const menus = await resMenuIDs.json();

    // Fetch Stuff
    const [menu, options, latestPosts, allPosts] = await Promise.all([
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/${menus?.primary}`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=5`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=9999`).then(res => res.json())
    ]);

    const head = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.WORDPRESS_HOST}/`)}`).then(res => res.json());

    return {
        props: {
            menu,
            options,
            latestPosts,
            allPosts,
            head
        },
        revalidate: 300,
    };
}

export default Home;