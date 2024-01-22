import WpImage from "@/components/wpImage";
import Head from 'next/head';
import Header from "@/components/header";
import PostList from "@/components/postList";
import parse from "html-react-parser";
import React from "react";
import { useRouter } from 'next/router';
import WPAdminBar from "@/components/WPAdminBar";


function Home({menu, options, latestPosts, allPosts, head}: {menu: any, options: any, latestPosts: any, allPosts: any, head: any}) {
    const router = useRouter();
    const { page } = router.query;
    const pageNumber = parseInt(page as string, 10) || 1;

    return (
        <>
            <Head>
                {parse(head.head)}
                {parse(options.site_favicon)}
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
                <PostList allPosts={allPosts} header={false} options={options} pageNumber={pageNumber} />
            </main>
        </>
    )
}

export async function getStaticPaths() {
    const totalNumberOfPages = 10; // Replace with your actual total number of pages
    const paths = Array.from({ length: totalNumberOfPages }, (_, i) => ({
        params: { page: (i + 1).toString() },
    }));

    return {
        paths,
        fallback: true,
    };
}


export async function getStaticProps({ params }: any) {
    const pageNumber = params.page ? parseInt(params.page, 10) : 1;

    const resMenuIDs = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/`);
    const menus = await resMenuIDs.json();

    // Fetch Stuff
    const [menu, options, latestPosts, allPosts] = await Promise.all([
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/${menus?.primary}`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=5`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=9999`).then(res => res.json())
    ]);

    const head = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.WORDPRESS_HOST}/page/${pageNumber}/`)}`).then(res => res.json());

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