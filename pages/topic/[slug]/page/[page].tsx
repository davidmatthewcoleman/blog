import Head from "next/head";
import parse from "html-react-parser";
import React from "react";
import dynamic from 'next/dynamic';
import Link from "next/link";

const Header = dynamic(() => import('@/components/header'), { ssr: true });
const PostList = dynamic(() => import('@/components/postList'), { ssr: true });
const WpImage = dynamic(() => import('@/components/WpImage'), { ssr: true });
function Topic({menu, options, latestPosts, allPosts, breadcrumb, pageNumber, totalPages, head}: {menu: any, options: any, latestPosts: any, allPosts: any, breadcrumb: any, pageNumber: number, totalPages: number, head: any}) {
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
                totalPages={totalPages}
                options={options}
                />
            </main>
        </>
    )
}

export async function getStaticPaths() {
    const res = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/categories`);
    const topics = await res.json();

    const paths = [];

    for (const topic of topics) {
        if (!topic.slug) {
            continue; // Skip if slug is undefined
        }

        // Fetch the total number of posts for the topic
        const resPosts = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?filter[taxonomy]=category&filter[term]=${topic.slug}`);
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
        fallback: false,
    };
}

const fetchPosts = async (url: string) => {
    const response = await fetch(url) as any;
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages'), 10);
    const posts = await response.json();
    return { posts, totalPages };
}

export async function getStaticProps({ params }: any) {
    const { page } = params;
    const pageNumber = parseInt(page, 10);

    const resMenuIDs = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/`);
    const menus = await resMenuIDs.json();

    // Fetch Stuff
    const [menu, options, latestPosts, allPostsData, topic] = await Promise.all([
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/${menus?.primary}`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=5`).then(res => res.json()),
        fetchPosts(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=8&page=${pageNumber}&filter[taxonomy]=category&filter[term]=${params.slug}`),
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/categories?slug=${params.slug}&_embed`).then(res => res.json())
    ]);

    const [breadcrumb] = await Promise.all([
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/term/category/${topic[0].id}`).then(res => res.json()),
    ]);

    const allPosts = allPostsData.posts;
    const totalPages = allPostsData.totalPages;

    const head = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.WORDPRESS_HOST}/topic/${params.slug}/page/${pageNumber}/`)}`).then(res => res.json());

    return {
        props: {
            menu,
            options,
            latestPosts,
            allPosts,
            topic,
            breadcrumb,
            pageNumber,
            totalPages,
            head
        },
        revalidate: 3600,
    };
}

export default Topic;