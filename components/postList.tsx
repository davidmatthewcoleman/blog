import React from 'react';
import Post from '@/components/post';
import PostNoBanner from '@/components/postNoBanner';
import Footer from "@/components/footer";
import { useRouter } from 'next/router'; // Import useRouter for handling URL navigation

function PostList({ allPosts, header, options, pageNumber = 1 }: { allPosts: any, header: any, options: any, pageNumber: number }) {
    const router = useRouter(); // Initialize useRouter
    const { asPath } = router;
    let nextPageUrl: any, prevPageUrl: any;

    // Function to create the correct page URL
    const createPageUrl = (base: string, pageNum: number) => {
        // For page 1, don't add the page number to the URL
        return pageNum === 1 ? base : `${base}/page/${pageNum}`;
    };

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


    const currentPage = pageNumber ? pageNumber : 1;
    const postsPerPage = 8;

    // Calculate the total number of pages
    const totalPages = Math.ceil(allPosts.length / postsPerPage);

    const nextPage = () => {
        const nextPageNumber = currentPage + 1;
        router.push(nextPageUrl);
    };

    const prevPage = () => {
        if (currentPage > 1) {
            const prevPageNumber = currentPage - 1;
            router.push(prevPageUrl);
        }
    };

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const displayedPosts = allPosts.slice(startIndex, endIndex);

    // console.log(currentPage);

    return (
        <section className={`post-list relative flex flex-col w-full bg-amber-50 bar-left/50 before:w-[48px] xl:before:w-[64px]`}>
            {header}
            {displayedPosts.map((post: any) => {
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
                        <button className={`inline-link inline-block !p-0 uppercase`} onClick={prevPage}>
                            Newer Entries
                        </button>
                    )}
                    {(currentPage > 1 && currentPage < totalPages) && (
                        <span className={`inline-link inline-block !p-0 mx-2 opacity-25`}>/</span>
                    )}
                    {/* Older Entries button */}
                    {currentPage < totalPages && (
                        <button className={`inline-link inline-block !p-0 uppercase`} onClick={nextPage}>
                            Older Entries
                        </button>
                    )}
                </>
            )} options={options} />
        </section>
    );
}

export default PostList;
