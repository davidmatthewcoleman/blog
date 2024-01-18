import Image from 'next/image'

import Header from "@/components/header";
import PostList from "@/components/postList";
import {any} from "prop-types";
import Head from "next/head";
import WpImage from "@/components/wpImage";
import React from "react";
import WPAdminBar from "@/components/WPAdminBar";

function Search({ menu, options, latestPosts, allPosts, query, pageNumber }: { menu: any, options: any, latestPosts: any, allPosts: any, query: string, pageNumber: number }) {
    let transformedData: any = [];

    allPosts.map((post: any) => {
        if (post._embedded && post._embedded.self && post._embedded.self[0]) {
            transformedData.push({
                id: post._embedded.self[0].id,
                date: post._embedded.self[0].date,
                title: post._embedded.self[0].title,
                slug: post._embedded.self[0].slug,
                type: post.type,
                description: post._embedded.self[0].description,
                featured_media: post._embedded.self[0].featured_media,
            });
        } else {
            // Log the structure of the problematic post
            console.error("Invalid post structure:", post);
        }
    });

    return (
        <>
            <Head>
                <title>&#34;{query.replace('+', ' ')}&#34; search results &ndash; {options.name}</title>
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
                <PostList allPosts={transformedData} header={(
                    <div className={`relative py-6 px-8 text-md uppercase tracking-widest border-b border-b-black/10 bg-amber-50 z-10 font-sans`}>
                        Your search for <strong className={`font-bold`}>{query.replace('+', ' ')}</strong> returned <strong className={`font-bold`}>{allPosts.length} {allPosts.length === 1 ? 'result' : 'results'}</strong>
                    </div>
                )}
                options={options}
                pageNumber={pageNumber}
                />
            </main>
        </>
    );
}

export async function getServerSideProps(context: any) {
    // Extracting query parameters
    const { query, page = '1' } = context.query;
    const pageNumber = parseInt(page, 10) || 1;
    const postsPerPage = 8; // Define the number of posts per page

    // Fetching menu, options, and latest posts
    const resMenuIDs = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/`);
    const menus = await resMenuIDs.json();

    const menuPromise = fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/${menus?.primary}`).then(res => res.json());
    const optionsPromise = fetch(`${process.env.WORDPRESS_HOST}/api`).then(res => res.json());
    const latestPostsPromise = fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=5`).then(res => res.json());

    const [menu, options, latestPosts] = await Promise.all([menuPromise, optionsPromise, latestPostsPromise]);

    // Fetching posts based on search query and pagination
    const postsUrl = `${process.env.WORDPRESS_HOST}/api/wp/v2/search?per_page=9999&search=${query}&_embed`;
    const resPosts = await fetch(postsUrl);
    const allPosts = await resPosts.json();

    // console.log(pageNumber);

    return {
        props: {
            menu,
            options,
            latestPosts,
            allPosts,
            query,
            pageNumber
        },
    };
}

export default Search;
