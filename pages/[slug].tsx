import Image from 'next/image'

import Header from "@/components/header";
import SinglePost from "@/components/singlePost";
import SinglePage from "@/components/singlePage";
import Head from "next/head";

import DOMPurify from 'isomorphic-dompurify';
import parse from 'html-react-parser';
import WpImage from "@/components/wpImage";
import React from "react";
import WPAdminBar from "@/pages/components/WPAdminBar";

export default function PostPage({menu, options, latestPosts, currentPost, latestPostsAside}: {menu: any, options: any, latestPosts: any, currentPost: any, latestPostsAside: any}) {
    return (
        <>
            <Head>
                <title>{parse(DOMPurify.sanitize(currentPost[0].title.rendered))} &ndash; {options.name}</title>
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
            <WPAdminBar/>
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
                {currentPost[0].type === 'post' ? (
                    <SinglePost post={currentPost} latestPosts={latestPostsAside} options={options} />
                ) : (
                    <SinglePage post={currentPost} latestPosts={latestPostsAside} options={options} />
                )}
            </main>
        </>
    )
}

export async function getStaticPaths() {
    const [posts, pages] = await Promise.all([
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=9999`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/pages?per_page=9999`).then(res => res.json()),
    ]);

    const allPosts = [...posts, ...pages];

    const paths = allPosts.map((post: any) => ({
        params: { slug: post.slug },
    }));

    return {
        paths,
        fallback: 'blocking',
    };
}

export async function getStaticProps({ params }: any) {
    try {
        const resMenuIDs = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/`);
        const menus = await resMenuIDs.json();

        // Fetch Stuff
        const [menu, options, latestPosts, currentPosts, currentPages] = await Promise.all([
            fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/${menus?.primary}`).then(res => res.json()),
            fetch(`${process.env.WORDPRESS_HOST}/api`).then(res => res.json()),
            fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=5`).then(res => res.json()),
            fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?slug=${params.slug}&per_page=1&_embed`).then(res => res.json()),
            fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/pages?slug=${params.slug}&per_page=1&_embed`).then(res => res.json()),
        ]);

        const currentPost = [...currentPosts, ...currentPages];
        const latestPostsAside = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=3`).then(res => res.json());

        return {
            props: {
                menu,
                options,
                latestPosts,
                currentPost,
                latestPostsAside
            },
            revalidate: 300,
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            props: {
                menu: null,
                options: null,
                latestPosts: null,
                allPosts: null,
            },
            revalidate: 300,
        };
    }
}