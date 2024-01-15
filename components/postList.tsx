import React from 'react';
import Post from '@/components/post';
import PostNoBanner from '@/components/postNoBanner';
import Footer from "@/components/footer";
import { useRouter } from 'next/router'; // Import useRouter for handling URL navigation

function PostList({ allPosts, header, options, pageNumber = 1 }: { allPosts: any, header: any, options: any, pageNumber: number }) {
    const router = useRouter(); // Initialize useRouter
    const { asPath } = router;
    let nextPageUrl: any, prevPageUrl: any;

    // Determine the current [slug]'s route dynamically
    if (asPath === '/') {
        // Home [slug] ("/")
        nextPageUrl = `/page/${pageNumber + 1}`;
        prevPageUrl = pageNumber > 1 ? `/page/${pageNumber - 1}` : '/';
    } else if (asPath.startsWith('/writer/')) {
        // Writer [slug] ("/writer/[slug]")
        const writerSlug = asPath.split('/writer/')[1].split('/')[0];
        nextPageUrl = `/writer/${writerSlug}/page/${pageNumber + 1}`;
        prevPageUrl = pageNumber > 1 ? `/writer/${writerSlug}/page/${pageNumber - 1}` : `/writer/${writerSlug}`;
    } else if (asPath.startsWith('/tag/')) {
        // Tag [slug] ("/tag/[slug]")
        const tagSlug = asPath.split('/tag/')[1].split('/')[0];
        nextPageUrl = `/tag/${tagSlug}/page/${pageNumber + 1}`;
        prevPageUrl = pageNumber > 1 ? `/tag/${tagSlug}/page/${pageNumber - 1}` : `/tag/${tagSlug}`;
    } else if (asPath.startsWith('/topic/')) {
        // Topic [slug] ("/topic/[slug]")
        const topicSlug = asPath.split('/topic/')[1].split('/')[0];
        nextPageUrl = `/topic/${topicSlug}/page/${pageNumber + 1}`;
        prevPageUrl = pageNumber > 1 ? `/topic/${topicSlug}/page/${pageNumber - 1}` : `/topic/${topicSlug}`;
    } else if (asPath.startsWith('/search/')) {
        // Search [slug] ("/search/[query]")
        const query = asPath.split('/search/')[1].split('/')[0];
        nextPageUrl = `/search/${query}/page/${pageNumber + 1}`;
        prevPageUrl = pageNumber > 1 ? `/search/${query}/page/${pageNumber - 1}` : `/search/${query}`;
    } else {
        // Handle other routes or fallback to home [slug]
        nextPageUrl = `/page/${pageNumber + 1}`;
        prevPageUrl = pageNumber > 1 ? `/page/${pageNumber - 1}` : '/';
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
