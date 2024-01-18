import React from "react";
import Image from 'next/image'

import Link from "next/link";
import Header from "@/components/header";
import PostList from "@/components/postList";
import Head from "next/head";
import WpImage from "@/components/wpImage";
import Layout from "@/components/layout";

function Topic({adminBarHtml, menu, options, latestPosts, allPosts, topic, breadcrumb, pageNumber}: {adminBarHtml: any, menu: any, options: any, latestPosts: any, allPosts: any, topic: any, breadcrumb: any, pageNumber: number}) {
    return (
        <>
            <Head>
                <title>{topic[0].name} &ndash; {options.name}</title>
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
                    <PostList allPosts={allPosts} header={(
                        <div className={`relative py-6 px-8 text-md uppercase tracking-widest border-b border-b-black/10 bg-amber-50 z-10 font-sans`}>
                            <strong className={`font-bold`}>Topic:</strong>&nbsp;
                            {breadcrumb.map((item: any) => (
                                item.current ? (
                                    <span key={item.id}>
                                        {item.name}
                                    </span>
                                ) : (
                                    <React.Fragment key={item.id}>
                                        <Link href={`/topic/${item.slug}`}>
                                            {item.name}
                                        </Link>
                                        <svg viewBox="0 0 24 24" width={16} height={16} className={`relative bottom-[2px] inline-block mx-0.5 fill-current opacity-50`}>
                                            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                                        </svg>
                                    </React.Fragment>
                                )
                            ))}
                        </div>
                    )}
                    pageNumber={pageNumber}
                    options={options}
                    />
                </main>
            </Layout>
        </>
    )
}

export async function getStaticPaths() {
    const res = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/categories?per_page=9999`);
    const topics = await res.json();

    const paths = [];

    for (const topic of topics) {
        if (!topic.slug) {
            continue; // Skip if slug is undefined
        }

        // Fetch the total number of posts for the topic
        const resPosts = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=9999&filter[taxonomy]=category&filter[term]=${topic.slug}`);
        const posts = await resPosts.json();
        const totalPagesPerTopic = Math.ceil(posts.length / 8);

        for (let pageNumber = 1; pageNumber <= totalPagesPerTopic; pageNumber++) {
            paths.push({
                params: {
                    slug: topic.slug,
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

export async function getStaticProps({ context, params }: any) {
    const { slug, page } = params;
    const pageNumber = parseInt(page, 10);

    const resMenuIDs = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/`);
    const menus = await resMenuIDs.json();

    // Fetch Stuff
    const [menu, options, latestPosts, allPosts, topic] = await Promise.all([
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/${menus?.primary}`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=5`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=9999&filter[taxonomy]=category&filter[term]=${params.slug}`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/categories?per_page=9999&slug=${params.slug}`).then(res => res.json())
    ]);

    const [breadcrumb] = await Promise.all([
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/term/category/${topic[0].id}`).then(res => res.json()),
    ]);

    const resAuth = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/authenticate`, {
        headers: {
            cookie: context.req.headers.cookie || '',
        },
    });

    const auth = await resAuth.json();
    let revalidate;

    if ( auth ) {
        revalidate = 1;
    } else {
        revalidate = 300;
    }

    return {
        props: {
            menu,
            options,
            latestPosts,
            allPosts,
            topic,
            breadcrumb,
            pageNumber
        },
        revalidate: revalidate,
    };
}

export default Topic;