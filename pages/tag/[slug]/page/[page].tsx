import Image from 'next/image'

import Header from "@/components/header";
import PostList from "@/components/postList";
import Head from "next/head";
import WpImage from "@/components/wpImage";
import React from "react";
import AdminBar from "@/components/adminBar";

function Tag({menu, options, latestPosts, allPosts, tag, pageNumber}: {menu: any, options: any, latestPosts: any, allPosts: any, tag: any, pageNumber: any}) {
    return (
        <>
            <Head>
                <title>{tag[0].name} &ndash; {options.name}</title>
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
            <AdminBar/>
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
                <PostList allPosts={allPosts} header={(
                    <div className={`relative py-6 px-8 text-md uppercase tracking-widest border-b border-b-black/10 bg-amber-50 z-10 font-sans`}>
                        <strong className={`font-bold`}>Tag:</strong>&nbsp;{tag[0].name}
                    </div>
                )}
                          pageNumber={pageNumber}
                          options={options}
                />
            </main>
        </>
    )
}

export async function getStaticPaths() {
    const res = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/tags?per_page=9999`);
    const tags = await res.json();

    const paths = [];

    for (const tag of tags) {
        if (!tag.slug) {
            continue; // Skip if slug is undefined
        }

        // Fetch the total number of posts for the topic
        const resPosts = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=9999&filter[taxonomy]=post_tag&filter[term]=${tag.slug}`);
        const posts = await resPosts.json();
        const totalPagesPerTopic = Math.ceil(posts.length / 8);

        for (let pageNumber = 1; pageNumber <= totalPagesPerTopic; pageNumber++) {
            paths.push({
                params: {
                    slug: tag.slug,
                    page: pageNumber.toString()
                }
            });
        }
    }

    return {
        paths,
        fallback: 'blocking',
    };
}

export async function getStaticProps({ params }: any) {
    const { slug, page } = params;
    const pageNumber = parseInt(page, 10);

    const resMenuIDs = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/`);
    const menus = await resMenuIDs.json();

    // Fetch Stuff
    const [menu, options, latestPosts, allPosts, tag] = await Promise.all([
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/${menus?.primary}`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=5`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?filter[taxonomy]=post_tag&filter[term]=${params.slug}`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/tags?per_page=9999&slug=${params.slug}`).then(res => res.json())
    ]);

    return {
        props: {
            menu,
            options,
            latestPosts,
            allPosts,
            tag,
            pageNumber
        },
        revalidate: 300,
    };
}

export default Tag;