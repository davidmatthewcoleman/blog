import Head from 'next/head';
import parse from "html-react-parser";
import React from "react";
import dynamic from 'next/dynamic';

const WpImage = React.lazy(() => import('@/components/WpImage'));
const Header = dynamic(() => import('@/components/header'), { ssr: true });
const PostList = dynamic(() => import('@/components/postList'), { ssr: true });

function Home({menu, options, latestPosts, allPosts, head}: {menu: any, options: any, latestPosts: any, allPosts: any, head: any}) {
  return (
      <>
          <Head>
              {parse(head.head + options.site_favicon)}
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
          <main className={`flex flex-col lg:flex-row max-w-[1920px] font-serif`}>
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