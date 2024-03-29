import React from 'react';
import { useRouter } from 'next/router';
import dynamic from "next/dynamic";
import {NEXT_URL} from "next/dist/client/components/app-router-headers"; // Import useRouter for handling URL navigation

const Post = dynamic(() => import('@/components/post'), { ssr: true });
const PostNoBanner = dynamic(() => import('@/components/postNoBanner'), { ssr: true });
const Footer = dynamic(() => import('@/components/footer'), { ssr: true });

function PostList({ allPosts, header, options, pageNumber = 1, totalPages }: { allPosts: any, header: any, options: any, pageNumber: number, totalPages: number }) {
    const router = useRouter(); // Initialize useRouter
    const { asPath } = router;
    let nextPageUrl: any, prevPageUrl: any;

    // Function to create the correct page URL
    const createPageUrl = (base: string, pageNum: number) => {
        // For page 1, don't add the page number to the URL
        return pageNum === 1 ? base : `${base}/page/${pageNum}`;
    };

    // Sort posts so that sticky posts come first
    const sortedPosts = allPosts.sort((a: any, b: any) => {
        if (a.sticky && !b.sticky) return -1;
        if (!a.sticky && b.sticky) return 1;
        return 0;
    });

    // Determine the current [slug]'s route dynamically
    if (asPath === '/') {
        nextPageUrl = createPageUrl('/', pageNumber + 1);
        prevPageUrl = createPageUrl('/', pageNumber - 1);
    } else if (asPath.startsWith('/page/2/')) {
        nextPageUrl = createPageUrl('/', pageNumber + 1);
        prevPageUrl = '/';
    } else if (asPath.startsWith('/writer/')) {
        const writerSlug = asPath.split('/writer/')[1].split('/')[0];
        nextPageUrl = createPageUrl(`/writer/${writerSlug}`, pageNumber + 1);
        prevPageUrl = createPageUrl(`/writer/${writerSlug}`, pageNumber - 1);
    } else if (asPath.startsWith('/tag/')) {
        const tagSlug = asPath.split('/tag/')[1].split('/')[0];
        nextPageUrl = createPageUrl(`/tag/${tagSlug}`, pageNumber + 1);
        prevPageUrl = createPageUrl(`/tag/${tagSlug}`, pageNumber - 1);
    } else if (asPath.startsWith('/topic/')) {
        const topicSlug = asPath.split('/topic/')[1].split('/')[0];
        nextPageUrl = createPageUrl(`/topic/${topicSlug}`, pageNumber + 1);
        prevPageUrl = createPageUrl(`/topic/${topicSlug}`, pageNumber - 1);
    } else if (asPath.startsWith('/search/')) {
        const query = asPath.split('/search/')[1].split('/')[0];
        nextPageUrl = createPageUrl(`/search/${query}`, pageNumber + 1);
        prevPageUrl = createPageUrl(`/search/${query}`, pageNumber - 1);
    } else {
        nextPageUrl = createPageUrl('', pageNumber + 1);
        prevPageUrl = createPageUrl('', pageNumber - 1);
    }

    nextPageUrl = nextPageUrl.replace('//', '/');
    prevPageUrl = prevPageUrl.replace('//', '/');


    const currentPage = pageNumber ? pageNumber : 1;

    return (
        <section id={`content`} className={`post-list relative flex flex-col w-full bg-amber-50 bar-left/50 before:w-[48px] xl:before:w-[64px]`}>
            {header}
            {allPosts.map((post: any) => {
                if (post.featured_media !== false) {
                    return <Post key={post.id} data={post} single={false} />;
                } else {
                    return <PostNoBanner key={post.id} data={post} single={false} />;
                }
            })}
            <Footer loadMore={totalPages > 1 && (
                <>
                    {/* Newer Entries button */}
                    {currentPage > 1 && (
                        <a href={prevPageUrl} className={`inline-link inline-block !p-0 uppercase`}>
                            Newer Entries
                        </a>
                    )}
                    {(currentPage > 1 && currentPage < totalPages) && (
                        <span className={`inline-link inline-block !p-0 mx-2 opacity-25`}>/</span>
                    )}
                    {/* Older Entries button */}
                    {currentPage < totalPages && (
                        <a href={nextPageUrl} className={`inline-link inline-block !p-0 uppercase`}>
                            Older Entries
                        </a>
                    )}
                </>
            )} options={options} />
        </section>
    );
}

export default PostList;
