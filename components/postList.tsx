import React, { useState, useEffect } from 'react';
import Post from '@/components/post';
import PostNoBanner from '@/components/postNoBanner';
import Footer from "@/components/footer";

function PostList({ allPosts, header, options }: { allPosts: any, header: any, options: any }) {
    const [visiblePosts, setVisiblePosts] = useState(8);
    const [loadingMore, setLoadingMore] = useState(false);
    const [manualLoad, setManualLoad] = useState(false);

    const loadMorePosts = () => {
        setLoadingMore(true);
        // Simulate an asynchronous data fetch, replace this with your actual data fetching logic
        setTimeout(() => {
            setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 8);
            setLoadingMore(false);
            setManualLoad(true);
        }, 1000);
    };

    useEffect(() => {
        // Attach the scroll event listener when the component mounts
        const handleScroll = () => {
            if (!manualLoad) {
                const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
                const body = document.body;
                const html = document.documentElement;
                const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

                const windowBottom = windowHeight + window.pageYOffset;

                if (windowBottom >= docHeight && !loadingMore) {
                    // User has scrolled to the bottom, load more posts only if manualLoad is true
                    if (manualLoad) {
                        loadMorePosts();
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            // Remove the scroll event listener when the component unmounts
            window.removeEventListener('scroll', handleScroll);
        };
    }, [manualLoad, loadingMore]); // Include manualLoad and loadingMore in the dependency array

    return (
        <section className={`post-list relative flex flex-col w-full bg-amber-50 bar-left/50 before:w-[48px] xl:before:w-[64px]`}>
            {header}
            {allPosts.slice(0, visiblePosts).map((post: any) => {
                if (post.featured_media !== false) {
                    return <Post key={post.id} data={post} single={false} />;
                } else {
                    return <PostNoBanner key={post.id} data={post} single={false} />;
                }
            })}
            <Footer loadMore={visiblePosts < allPosts.length && (
                    <button className={`inline-link inline-block !p-0 uppercase`} onClick={loadMorePosts} disabled={loadingMore}>
                        {loadingMore ? (
                            <>
                                <span className={`relative`}>Loading&hellip;</span>
                                <svg className={`relative bottom-px inline stroke-black ml-0.5`} width={16} height={16} viewBox="0 0 24 24"><g className="spinner_V8m1"><circle cx="12" cy="12" r="9.5" fill="none" stroke-width="3"></circle></g></svg>
                            </>
                        ) : (
                            <>
                                <span className={`relative`}>Load More</span>
                                <svg className={`relative bottom-px inline fill-black ml-0.5`} width={16} height={16} viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
                            </>
                        )}
                    </button>
                )} options={options}/>
        </section>
    );
}

export default PostList;
