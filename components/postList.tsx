import React from 'react';
import Post from '@/components/post';
import PostNoBanner from '@/components/postNoBanner';
import Footer from "@/components/footer";
import { useRouter } from 'next/router'; // Import useRouter for handling URL navigation

function PostList({ allPosts, header, options }: { allPosts: any, header: any, options: any }) {
    const router = useRouter(); // Initialize useRouter
    const currentPage = router.query.page ? parseInt(router.query.page as string) : 1;
    const postsPerPage = 8;

    // Calculate the total number of pages
    const totalPages = Math.ceil(allPosts.length / postsPerPage);

    const nextPage = () => {
        const nextPageNumber = currentPage + 1;
        if (nextPageNumber <= totalPages) {
            router.push({ pathname: '/', query: { page: nextPageNumber } });
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            const prevPageNumber = currentPage - 1;
            // @ts-ignore
            router.push(prevPageNumber === 1 ? '/' : '/', undefined, { query: { page: prevPageNumber } });
        }
    };

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const displayedPosts = allPosts.slice(startIndex, endIndex);

    console.log(currentPage);

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
