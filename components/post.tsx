import React, { useEffect } from 'react';
import { format } from 'date-fns-tz';
import { Lato, Poly } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import WpImage from "@/components/wpImage";

const lato = Lato({
    subsets: ['latin'],
    fallback: ['sans-serif'],
    weight: ['100', '300', '400', '700', '900'],
});

const poly = Poly({
    subsets: ['latin'],
    style: ['normal', 'italic'],
    fallback: ['Georgia', 'serif'],
    weight: ['400'],
});

interface PostProps {
    data: any;
    single: boolean;
}

const Post: React.FC<PostProps> = ({ data, single }) => {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            if (url === window.location.pathname) {
                sessionStorage.setItem('scrollPosition', window.pageYOffset.toString());
            }
        };

        router.events.on('beforeHistoryChange', handleRouteChange);

        return () => {
            router.events.off('beforeHistoryChange', handleRouteChange);
        };
    }, []);

    const hasFeaturedMedia =
        data.featured_media && data.featured_media.src && data.featured_media.fp;

    const backgroundColor = hasFeaturedMedia
        ? data.featured_media.color
        : 'transparent';

    return (
        <section
            className={`relative post flex flex-col bg-amber-50 z-10`}
        >
            <header
                className={`relative text-white bar-left before:w-[48px] xl:before:w-[64px] cover-gradient`}
                style={{ backgroundColor }}
            >
                {hasFeaturedMedia && single && (
                    <>
                        <WpImage
                            alt={``}
                            url={data.featured_media.src}
                            className={`absolute inset-0 w-full h-full object-cover`}
                            focalPoint={[data.featured_media.fp.x,data.featured_media.fp.y]}
                            src={{
                                '(max-width: 500px)': [
                                    {
                                        width: 512,
                                        height: 512
                                    },
                                ],
                                '(min-width: 501px)': [
                                    {
                                        width: 1590,
                                        height: 512
                                    },
                                ],
                            }}
                            props={``}
                        />

                        {data.featured_media.credit && (
                            <span className={`absolute right-2 bottom-1.5 hidden xl:block text-white/50 hover:text-white text-sm transition-colors [&_a]:text-white/75 [&_a]:hover:text-white hover:[&_a]:!text-bright-sun-400 [&_a]:transition-colors z-20`} dangerouslySetInnerHTML={{ __html: data.featured_media.credit }}></span>
                        )}
                    </>
                )}
                {hasFeaturedMedia && !single && (
                    <>
                        <WpImage
                            alt={``}
                            url={data.featured_media.src}
                            className={`absolute inset-0 w-full h-full object-cover`}
                            focalPoint={[data.featured_media.fp.x,data.featured_media.fp.y]}
                            src={{
                                '(max-width: 500px)': [
                                    {
                                        width: 512,
                                        height: 512
                                    },
                                ],
                                '(min-width: 501px)': [
                                    {
                                        width: 1590,
                                        height: 300
                                    },
                                ],
                            }}
                            props={``}
                        />
                    </>
                )}
                <svg viewBox="0 0 20 20" width={20} height={20} className={`absolute inset-0 top-auto ${data.subtitle ? 'mb-[2.25em]' : 'mb-11'} ${single ? '' : 'bottom-0.5'} mx-[14px] xl:mx-[22px] fill-current z-30`}>
                    <path d={data.type === 'post' ? 'M18 3v2H2V3h16zm-6 4v2H2V7h10zm6 0v2h-4V7h4zM8 11v2H2v-2h6zm10 0v2h-8v-2h8zm-4 4v2H2v-2h12z' : 'M3 1v18h14V1H3zm9 13H6v-1h6v1zm2-3H6v-1h8v1zm0-3H6V7h8v1zm0-3H6V4h8v1z'} />
                </svg>
                <div
                    className={`relative ${single ? 'mt-64 xl:mt-96' : 'mt-32 xl:mt-48'} ml-[72px] xl:ml-[96px] my-8 mr-6 ${single ? 'xl:w-2/3' : 'xl:w-1/2'} z-20`}
                >
                    <p
                        className={`italic opacity-60`}
                    >
                        {format(new Date(data.date), 'EEEE, MMMM do, yyyy ~ h:mm a z')}
                    </p>
                    {single ? (
                        <span
                            className={`text-3xl xl:text-5xl font-sans leading-tight`}
                        >
                            <span dangerouslySetInnerHTML={{ __html: data.title.rendered }}></span>
                            {data.subtitle && (
                                <span className={`block text-lg xl:text-2xl !italic font-serif`} dangerouslySetInnerHTML={{ __html: data.subtitle.rendered }} />
                            )}
                        </span>
                    ) : (
                        <Link
                            className={`post-link relative block text-4xl [&>span:first-of-type]:opacity-100 [&>span:first-of-type]:hover:opacity-0 [&>span:last-of-type]:opacity-0 [&>span:last-of-type]:hover:opacity-100 [&>span]:transition-all font-sans leading-tight transition-all drop-shadow pointer-events-none`}
                            href={`/${data.slug}`}
                        >
                            <span className={`inline-block`}>
                                <span className={`pointer-events-auto max-w-max`} dangerouslySetInnerHTML={{ __html: data.title.rendered }} />
                                {data.subtitle && (
                                    <span className={`block text-lg xl:text-2xl max-w-max !italic font-serif pointer-events-auto`} dangerouslySetInnerHTML={{ __html: data.subtitle.rendered }} />
                                )}
                            </span>
                            <span className={`absolute inset-0 inline-block w-full h-full bg-gradient-to-b from-bright-sun-400 to-bright-sun-600 bg-clip-text text-transparent`}>
                                <span className={`pointer-events-auto max-w-max`} dangerouslySetInnerHTML={{ __html: data.title.rendered }} />
                                {data.subtitle && (
                                    <span className={`block text-lg xl:text-2xl max-w-max !italic font-serif`} dangerouslySetInnerHTML={{ __html: data.subtitle.rendered }} />
                                )}
                            </span>
                        </Link>
                    )}
                </div>
            </header>
            {!single && (
                <div
                    className={`relative bar-left/50 before:w-[48px] xl:before:w-[64px]`}
                >
                    <div
                        className={`mt-8 ml-[72px] xl:ml-[96px] mb-2 mr-6 xl:w-1/2 text-lg`}
                        dangerouslySetInnerHTML={{ __html: data.description.rendered }}
                    />
                    <Link
                        className={`inline-link inline-block ml-[72px] xl:ml-[96px] mb-8 uppercase font-sans`}
                        href={`/${data.slug}`}
                    >
                        Read full entry
                    </Link>
                </div>
            )}
        </section>
    );
};

const MemoizedPost = React.memo(Post);
export default MemoizedPost;
