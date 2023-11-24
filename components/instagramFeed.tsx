import Image from "next/image";

function InstagramFeed({feed}: {feed: any}) {
    return (
        <>
            <div className={`relative flex flex-row mt-auto z-10 [&_a:nth-child(n+5)]:hidden sm:[&_a:nth-child(-n+7)]:!inline-flex md:[&_a:nth-child(-n+9)]:!inline-flex lg:[&_a:nth-child(-n+11)]:!inline-flex`}>
                {feed.map((post: any) => (
                    <a
                        key={post?.id}
                        href={post?.post_link}
                        target={`_blank`}
                        className={`contrast-150 sepia hover:contrast-100 hover:sepia-0 transition-all`}
                        dangerouslySetInnerHTML={{ __html: post?.thumbnail_html?.rendered }}
                    ></a>
                ))}
            </div>
        </>
    );
}

export default InstagramFeed;