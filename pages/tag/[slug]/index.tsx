import Head from "next/head";
import parse from "html-react-parser";
import React from "react";
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('@/components/header'), { ssr: true });
const PostList = dynamic(() => import('@/components/postList'), { ssr: true });
const WpImage = dynamic(() => import('@/components/WpImage'), { ssr: true });
function Tag({menu, options, latestPosts, allPosts, totalPages, tag, head}: {menu: any, options: any, latestPosts: any, allPosts: any, totalPages: number, tag: any, head: any}) {
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
                        <strong className={`font-bold`}>Tag:</strong>&nbsp;{tag[0].name}
                    </div>
                )}
                pageNumber={1}
                totalPages={totalPages}
                options={options}
                />
            </main>
        </>
    )
}

const fetchPosts = async (url: string) => {
    const response = await fetch(url) as any;
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages'), 10);
    const posts = await response.json();
    return { posts, totalPages };
}

export async function getStaticPaths() {
    const res = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/tags`);
    const tags = await res.json();

    const paths = tags.map((tag: any) => ({
        params: { slug: tag.slug },
    }));

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }: any) {
    const resMenuIDs = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/`);
    const menus = await resMenuIDs.json();

    // Fetch Stuff
    const [menu, options, latestPosts, allPostsData, tag] = await Promise.all([
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/menu/${menus?.primary}`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api`).then(res => res.json()),
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=5`).then(res => res.json()),
        fetchPosts(`${process.env.WORDPRESS_HOST}/api/wp/v2/posts?per_page=8&page=1&filter[taxonomy]=post_tag&filter[term]=${params.slug}`),
        fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/tags?slug=${params.slug}`).then(res => res.json())
    ]);

    const allPosts = allPostsData.posts;
    const totalPages = allPostsData.totalPages;

    const head = await fetch(`${process.env.WORDPRESS_HOST}/api/wp/v2/head/${encodeURIComponent(`${process.env.WORDPRESS_HOST}/tag/${params.slug}/`)}`).then(res => res.json());

    return {
        props: {
            menu,
            options,
            latestPosts,
            allPosts,
            totalPages,
            tag,
            head
        },
        revalidate: 3600,
    };
}

export default Tag;