import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from '@/components/post';
import PostNoBanner from '@/components/postNoBanner';

const InfiniteScrollComponent = ({ visiblePosts, allPosts, scrollState, loadMorePosts }: { visiblePosts: any, allPosts: any, scrollState: any, loadMorePosts: any }) => (
    <InfiniteScroll
        dataLength={visiblePosts}
        next={loadMorePosts}
        hasMore={scrollState === 'init' || (visiblePosts < allPosts.length && scrollState !== 'finish')}
        loader={``}
        endMessage={``}
    >
        {allPosts.slice(0, visiblePosts).map((post: any) => {
            if (post.featured_media !== false) {
                return <Post key={post.id} data={post} single={false} />;
            } else {
                return <PostNoBanner key={post.id} data={post} single={false} />;
            }
        })}
    </InfiniteScroll>
);

export default React.memo(InfiniteScrollComponent);
