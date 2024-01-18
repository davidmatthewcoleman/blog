import Image from 'next/image'

import Header from "@/components/header";
import SinglePost from "@/components/singlePost";
import SinglePage from "@/components/singlePage";
import Head from "next/head";

import DOMPurify from 'isomorphic-dompurify';
import parse from 'html-react-parser';
import WpImage from "@/components/wpImage";
import Layout from "@/components/layout";
import React from "react";

export default function PostPage({adminBarHtml, menu, options, latestPosts, currentPost, latestPostsAside}: {adminBarHtml: any, menu: any, options: any, latestPosts: any, currentPost: any, latestPostsAside: any}) {
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
            <Layout adminBarHtml={adminBarHtml}>
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
            </Layout>
        </>
    )
}

export async function getServerSideProps({ context, params }: any) {
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

        // Authenticate the user (example)
        const resAuth = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/authenticate`, {
            headers: {
                cookie: context.req.headers.cookie || '',
            },
        });
        const auth = await resAuth.json();

        return {
            props: {
                menu,
                options,
                latestPosts,
                currentPost,
                latestPostsAside,
                isAuthenticated: auth.isAuthenticated
            }
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            props: {
                menu: null,
                options: null,
                latestPosts: null,
                allPosts: null,
            }
        };
    }
}