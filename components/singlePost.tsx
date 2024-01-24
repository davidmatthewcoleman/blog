import React, { useState, useEffect, useRef } from 'react';
import Post from '@/components/post';
import PostNoBanner from '@/components/postNoBanner';
import Blocks from "@/components/blocks";
import Footer from "@/components/footer";
import Link from "next/link";
import Tippy from '@tippyjs/react';
import { sticky } from 'tippy.js';
import parse, { domToReact } from "html-react-parser";
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/backdrop.css';
import 'tippy.js/animations/shift-away.css';
import WpImage from "@/components/wpImage";

function SinglePost({ post, latestPosts, options }: { post: any, latestPosts: any, options: any }) {
    const [isVisible, setIsVisible] = useState(false);
    let [tooltipVisible, setTooltipVisible] = useState(true);
    const [tooltipData, setTooltipData] = useState<string | null>(null);

    useEffect(() => {
        const storedTooltipData = localStorage.getItem(`authorTooltip${post[0]._embedded.author[0].id}`);
        setTooltipData(storedTooltipData);

        setTimeout(() => {
            setTooltipVisible(false);
        }, post[0]._embedded.author[0].acf.tooltip_timeout * 1000);
    }, [post]);

    useEffect(() => {
        const handleResize = () => {
            const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
            const docHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );

            setIsVisible(docHeight > windowHeight);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleLinkClick = (authorId: number, tooltipContent: any) => {
        localStorage.setItem(`authorTooltip${authorId}`, JSON.stringify(tooltipContent));
        setTooltipVisible(false);
    };

    if ( JSON.stringify([`${post[0]._embedded.author[0].acf.tooltip_text}`,`${post[0]._embedded.author[0].acf.page_link.url}`]) === tooltipData ) {
        tooltipVisible = false;
    }

    useEffect(() => {
        const SmoothScroll = require('smooth-scroll');
        new SmoothScroll('a[href*="#"], #totop', {
            speed: 500,
            speedAsDuration: true,
            offset: (anchor: any, toggle: any) => {
                // Apply offset only for anchor tags that are not #totop
                return toggle.getAttribute('href') !== '#' ? 16 : 0;
            }
        });
    }, []);

    let toc: any;

    if ( post[0].toc_content.length > 0 ) {
        const options: any = {
            replace: ({ name, attribs, children }: { name: any, attribs: any, children: any }) => {
                if (name) {
                    if (name === 'a') {
                        return <a {...attribs} className={`inline-block text-sm border-b border-b-transparent hover:border-b-bright-sun-500 transition-colors font-sans`}>{domToReact(children)}</a>;
                    }
                }
            },
        };

        toc = parse(post[0].toc_content, options);
    }

    return (
        <section id={`content`} className={`single-post flex flex-col w-full bg-amber-50`}>
            {post.map((post: any) => {
                if (post.featured_media !== false) {
                    return (
                        <React.Fragment key={post.id}>
                            <Post key={post.id} data={post} single={true} />
                            <div
                                className={`post-content relative w-full flex flex-col 1.5xl:flex-row flex-grow bar-left/50 before:w-[48px] xl:before:w-[64px]`}
                            >
                                <div
                                    className={`prose prose-lg prose-dropcap prose-strong:font-sans xl:w-2/3 max-w-full py-8 ml-[72px] xl:ml-[96px] mr-6 xl:mr-0`}
                                >
                                    <Blocks data={post.blocks}/>
                                </div>
                                <aside className={`sidebar flex flex-col gap-12 xl:w-1/3 py-8 px-6 xl:px-10 ml-[48px] xl:ml-0`}>
                                    <div className={`author-card inline-block xl:w-4/5 xl:ml-auto mb-8 2xl:-mb-8 ${!toc && 'xl:sticky 2xl:before:block'} before:hidden`}>
                                        <div>
                                            <WpImage url={post._embedded.author[0].avatar_urls[96].replace('-96x96', '')} src={{
                                                '': [
                                                    {
                                                        width: 74,
                                                        height: 74
                                                    }
                                                ]
                                            }} className={`relative rounded-md ml-4 mb-1.5 float-right z-10`} alt={post._embedded.author[0].name} focalPoint={[50,50]} props={``} />
                                        </div>
                                        <div>
                                            <h2
                                                className={`flex flex-col text-sm mb-2 uppercase font-semibold font-sans`}
                                            >
                                                <span
                                                    className={`opacity-50`}
                                                >
                                                    About
                                                </span>
                                                {post._embedded.author[0].name}
                                            </h2>
                                            <p
                                                className={`text-[0.85rem] italic`}
                                                dangerouslySetInnerHTML={{ __html: post._embedded.author[0].description }}
                                            >
                                            </p>
                                            <ul className={`mt-2 mb-6 xl:mb-0 list-none`}>
                                                <li className={`inline-block mr-2.5`}>
                                                    <Link
                                                        href={`/writer/${post._embedded.author[0].slug}`}
                                                        className={`inline-link text-sm font-sans`}
                                                    >
                                                        View all entries
                                                    </Link>
                                                </li>
                                                {post._embedded.author[0].acf.page_link && post._embedded.author[0].acf.enable_tooltip === true && (
                                                    <li className={`inline-block`}>
                                                        <Tippy
                                                            content={post._embedded.author[0].acf.tooltip_text}
                                                            className={`tooltip-br`}
                                                            allowHTML={true}
                                                            placement={"bottom-end"}
                                                            offset={[0,0]}
                                                            sticky={true}
                                                            hideOnClick={`toggle`}
                                                            trigger={`manual`}
                                                            arrow={true}
                                                            inertia={true}
                                                            showOnCreate={true}
                                                            plugins={[sticky]}
                                                            visible={tooltipVisible}
                                                            popperOptions={{
                                                                 strategy: 'fixed'
                                                            }}
                                                        >
                                                            <a
                                                                onClick={() => handleLinkClick(post._embedded.author[0].id, [`${post._embedded.author[0].acf.tooltip_text}`,`${post._embedded.author[0].acf.page_link.url}`])}
                                                                href={post._embedded.author[0].acf.page_link.url}
                                                                target={post._embedded.author[0].acf.page_link.url ? '_blank' : '_self'}
                                                                className={`inline-link text-sm font-sans`}
                                                            >
                                                                {post._embedded.author[0].acf.page_link.title}
                                                            </a>
                                                        </Tippy>
                                                    </li>
                                                )}
                                                {post._embedded.author[0].acf.page_link && post._embedded.author[0].acf.enable_tooltip !== true && (
                                                    <li className={`inline-block`}>
                                                        <a
                                                            href={post._embedded.author[0].acf.page_link.url}
                                                            target={post._embedded.author[0].acf.page_link.url ? '_blank' : '_self'}
                                                            className={`inline-link text-sm font-sans`}
                                                        >
                                                            {post._embedded.author[0].acf.page_link.title}
                                                        </a>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    {toc && (
                                        <div className={`toc-card hidden 2xl:inline-block mt-8 xl:w-4/5 xl:ml-auto xl:sticky bg-amber-50 before:hidden 2xl:before:block`}>
                                            <h2
                                                className={`flex flex-col text-sm mb-2 uppercase font-semibold font-sans`}
                                            >
                                                Contents
                                            </h2>
                                            {toc}
                                        </div>
                                    )}
                                    <div className={`inline-block xl:w-4/5 xl:ml-auto`}>
                                        <h2
                                            className={`flex flex-col text-sm mb-2 uppercase font-semibold font-sans`}
                                        >
                                            Topics
                                        </h2>
                                        <div>
                                            {post.terms.topics.map((topic: any) => {
                                                return (
                                                    <Link
                                                        key={topic.id}
                                                        href={`/topic/${topic.slug}`}
                                                        className={`inline-btn uppercase font-semibold font-sans`}
                                                    >
                                                        {topic.name}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    {post.terms.tags.length > 0 && (
                                        <div className={`inline-block xl:w-4/5 xl:ml-auto`}>
                                            <h2
                                                className={`flex flex-col text-sm mb-2 uppercase font-semibold font-sans`}
                                            >
                                                Tags
                                            </h2>
                                            <div>
                                                {post.terms.tags.map((tag: any) => {
                                                    return (
                                                        <Link
                                                            key={tag.id}
                                                            href={`/tag/${tag.slug}`}
                                                            className={`inline-btn uppercase font-semibold font-sans`}
                                                        >
                                                            {tag.name}
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    <div className={`inline-block xl:w-4/5 xl:ml-auto`}>
                                        <h2
                                            className={`flex flex-col text-sm mb-2 uppercase font-semibold font-sans`}
                                        >
                                            Latest
                                        </h2>
                                        <ul
                                            className={`flex flex-col gap-1.5`}
                                        >
                                            {latestPosts.map((post: any) => {
                                                return (
                                                    <li
                                                        key={post.id}
                                                    >
                                                        <Link
                                                            href={`/${post.slug}`}
                                                            className={`inline-block text-sm border-b border-b-transparent hover:border-b-bright-sun-500 transition-colors font-sans`}
                                                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                                                        >
                                                        </Link>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </aside>
                            </div>
                        </React.Fragment>
                    );
                } else {
                    return (
                        <React.Fragment key={post.id}>
                            <PostNoBanner key={post.id} data={post} single={true} />
                            <div
                                className={`post-content relative w-full flex flex-col 1.5xl:flex-row flex-grow bar-left/50 before:w-[48px] xl:before:w-[64px]`}
                            >
                                <div
                                    className={`prose prose-lg prose-dropcap prose-strong:font-sans xl:w-2/3 max-w-full py-8 ml-[72px] xl:ml-[96px] mr-6 xl:mr-0`}
                                >
                                    <Blocks data={post.blocks}/>
                                </div>
                                <aside className={`sidebar flex flex-col gap-12 xl:w-1/3 py-8 px-6 xl:px-10 ml-[48px] xl:ml-0`}>
                                    <div className={`author-card inline-block xl:w-4/5 xl:ml-auto mb-8 2xl:-mb-8 ${!toc && 'xl:sticky 2xl:before:block'} before:hidden`}>
                                        <div>
                                            <WpImage url={post._embedded.author[0].avatar_urls[96].replace('-96x96', '')} src={{
                                                '': [
                                                    {
                                                        width: 74,
                                                        height: 74
                                                    }
                                                ]
                                            }} className={`relative rounded-md ml-4 mb-1.5 float-right z-10`} alt={post._embedded.author[0].name} focalPoint={[50,50]} props={``} />
                                        </div>
                                        <div>
                                            <h2
                                                className={`flex flex-col text-sm mb-2 uppercase font-semibold font-sans`}
                                            >
                                                <span
                                                    className={`opacity-50`}
                                                >
                                                    About
                                                </span>
                                                {post._embedded.author[0].name}
                                            </h2>
                                            <p
                                                className={`text-[0.85rem] italic`}
                                                dangerouslySetInnerHTML={{ __html: post._embedded.author[0].description }}
                                            >
                                            </p>
                                            <ul className={`mt-2 gap-2.5 mb-6 xl:mb-0 list-none`}>
                                                <li className={`inline-block mr-2.5`}>
                                                    <Link
                                                        href={`/writer/${post._embedded.author[0].slug}`}
                                                        className={`inline-link text-sm font-sans`}
                                                    >
                                                        View all entries
                                                    </Link>
                                                </li>
                                                {post._embedded.author[0].acf.page_link && post._embedded.author[0].acf.enable_tooltip === true && (
                                                    <li className={`inline-block`}>
                                                        <Tippy
                                                            content={post._embedded.author[0].acf.tooltip_text}
                                                            className={`tooltip-br`}
                                                            allowHTML={true}
                                                            placement={"bottom-end"}
                                                            offset={[0,0]}
                                                            sticky={true}
                                                            hideOnClick={`toggle`}
                                                            trigger={`manual`}
                                                            arrow={true}
                                                            inertia={true}
                                                            showOnCreate={true}
                                                            plugins={[sticky]}
                                                            visible={tooltipVisible}
                                                        >
                                                            <a
                                                                onClick={() => handleLinkClick(post._embedded.author[0].id, [`${post._embedded.author[0].acf.tooltip_text}`,`${post._embedded.author[0].acf.page_link.url}`])}
                                                                href={post._embedded.author[0].acf.page_link.url}
                                                                target={post._embedded.author[0].acf.page_link.url ? '_blank' : '_self'}
                                                                className={`inline-link text-sm font-sans`}
                                                            >
                                                                {post._embedded.author[0].acf.page_link.title}
                                                            </a>
                                                        </Tippy>
                                                    </li>
                                                )}
                                                {post._embedded.author[0].acf.page_link && post._embedded.author[0].acf.enable_tooltip !== true && (
                                                    <li className={`inline-block`}>
                                                        <a
                                                            href={post._embedded.author[0].acf.page_link.url}
                                                            target={post._embedded.author[0].acf.page_link.url ? '_blank' : '_self'}
                                                            className={`inline-link text-sm font-sans`}
                                                        >
                                                            {post._embedded.author[0].acf.page_link.title}
                                                        </a>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    {toc && (
                                        <div className={`toc-card hidden 2xl:inline-block mt-8 xl:w-4/5 xl:ml-auto xl:sticky bg-amber-50 before:hidden 2xl:before:block`}>
                                            <h2
                                                className={`flex flex-col text-sm mb-2 uppercase font-semibold font-sans`}
                                            >
                                                Contents
                                            </h2>
                                            {toc}
                                        </div>
                                    )}
                                    <div className={`inline-block xl:w-4/5 xl:ml-auto`}>
                                        <h2
                                            className={`flex flex-col text-sm mb-2 uppercase font-semibold font-sans`}
                                        >
                                            Topics
                                        </h2>
                                        <div>
                                            {post.terms.topics.map((topic: any) => {
                                                return (
                                                    <Link
                                                        key={topic.id}
                                                        href={`/topic/${topic.slug}`}
                                                        className={`inline-btn uppercase font-semibold font-sans`}
                                                    >
                                                        {topic.name}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    {post.terms.tags.length > 0 && (
                                        <div className={`inline-block xl:w-4/5 xl:ml-auto`}>
                                            <h2
                                                className={`flex flex-col text-sm mb-2 uppercase font-semibold font-sans`}
                                            >
                                                Tags
                                            </h2>
                                            <div>
                                                {post.terms.tags.map((tag: any) => {
                                                    return (
                                                        <Link
                                                            key={tag.id}
                                                            href={`/tag/${tag.slug}`}
                                                            className={`inline-btn uppercase font-semibold font-sans`}
                                                        >
                                                            {tag.name}
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    <div className={`inline-block xl:w-4/5 xl:ml-auto`}>
                                        <h2
                                            className={`flex flex-col text-sm mb-2 uppercase font-semibold font-sans`}
                                        >
                                            Latest
                                        </h2>
                                        <ul
                                            className={`flex flex-col gap-1.5`}
                                        >
                                            {latestPosts.map((post: any) => {
                                                return (
                                                    <li
                                                        key={post.id}
                                                    >
                                                        <Link
                                                            href={`/${post.slug}`}
                                                            className={`inline-block text-sm border-b border-b-transparent hover:border-b-bright-sun-500 transition-colors font-sans`}
                                                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                                                        >
                                                        </Link>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </aside>
                            </div>
                        </React.Fragment>
                    );
                }
            })}

            <Footer loadMore={(
                isVisible && (
                    <a id={`totop`} href={`#`} className={`inline-link !hidden lg:!inline-block !p-0 uppercase`}>
                        <span className={`relative`}>Back to top</span>
                        <svg className={`relative bottom-px inline fill-black ml-0.5`} width={16} height={16} viewBox="0 0 24 24"><path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" /></svg>
                    </a>
                )
            )} options={options}/>
        </section>
    );
}

export default SinglePost;
