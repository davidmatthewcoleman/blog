import { useState } from "react";
import DOMPurify from 'isomorphic-dompurify';
import parse from 'html-react-parser';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import React from "react";
import dynamic from 'next/dynamic';

const WpImage = dynamic(() => import('@/components/wpImage'), { ssr: true });

function Blocks({ data }: { data: any }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState('');

    const handleImageClick = (imageUrl: string) => {
        setCurrentImage(imageUrl);
        setLightboxOpen(true);
    };

    return (
        <>
            {
                data &&
                data.map((block: any, i: number) => {
                    i = i + 8;
                    if (block.blockName === 'core/image') {
                        let blockClass, blockImgClass, blockWidth;
                        switch (block.attrs.align) {
                            case 'left':
                                blockClass = 'float-left !my-2 !mr-4 w-full md:w-auto';
                                blockImgClass = 'mx-auto xl:!m-0 w-full';
                                blockWidth = block.attrs.width ? block.attrs.width : 256;
                                break;
                            case 'center':
                                blockClass = 'float-none !my-2 w-full md:w-auto';
                                blockImgClass = '!m-0 w-full';
                                blockWidth = block.attrs.width ? block.attrs.width : 1200;
                            case 'wide':
                                blockClass = 'float-none !my-2 max-w-5xl mx-auto md:w-auto';
                                blockImgClass = '!m-0 w-full';
                                blockWidth = 1200;
                                break;
                            case 'full':
                                blockClass = 'float-none !my-2 max-w-full mx-auto md:w-auto';
                                blockImgClass = '!m-0 w-full';
                                blockWidth = 1920;
                                break;
                            case 'right':
                                blockClass = 'float-right !my-2 !ml-4 lg:-mr-12 w-full md:w-auto';
                                blockImgClass = 'mx-auto xl:!m-0 w-full';
                                blockWidth = block.attrs.width ? block.attrs.width : 256;
                                break;
                            default:
                                blockClass = 'float-none !my-2 max-w-5xl mx-auto md:w-auto';
                                blockImgClass = '!m-0 w-full';
                                blockWidth = block.attrs.width ? block.attrs.width : 1200;
                        }
                        let blockCaption;
                        if (block.attrs.align === 'left') {
                            blockCaption = block.caption
                                ? parse(`<figcaption className="text-black/50 text-sm mt-2">${block.caption}</figcaption>`)
                                : '';
                        } else if (block.attrs.align === 'right') {
                            blockCaption = block.caption
                                ? parse(`<figcaption className="text-black/50 text-sm mt-2 text-right">${block.caption}</figcaption>`)
                                : '';
                        } else {
                            blockCaption = block.caption
                                ? parse(`<figcaption className="text-black/50 text-sm mt-2 text-center">${block.caption}</figcaption>`)
                                : '';
                        }
                        return (
                            <>
                                {(block.attrs.align === 'left' || block.attrs.align === 'right') ? (
                                    <div>
                                        <figure
                                            id={`block-${block.uuid}`}
                                            key={block.uuid}
                                            className={blockClass}
                                        >
                                            {block.attrs.linkDestination === 'media' ? (
                                                <a onClick={(event) => {
                                                    event.preventDefault(); // This will prevent the default navigation
                                                    handleImageClick(block.media_source.replace(`${process.env.WORDPRESS_HOST}/wp-content/uploads/`, `${process.env.IMGIX_HOST}/`));
                                                }} href={block.media_source.replace(`${process.env.WORDPRESS_HOST}/wp-content/uploads/`, `${process.env.IMGIX_HOST}/`)} target={block.attrs.linkTarget} title={block.attrs.title} rel={block.attrs.rel}>
                                                    <WpImage
                                                        url={block.media_source}
                                                        src={{
                                                            '': [
                                                                {
                                                                    width: block.attrs.width ? parseInt(block.attrs.width, 10) : 0,
                                                                    height: block.attrs.height ? parseInt(block.attrs.height, 10) : 0
                                                                }
                                                            ]
                                                        }}
                                                        className={blockImgClass}
                                                        alt={block.title}
                                                        focalPoint={[50, 50]}
                                                        props={``}
                                                    />
                                                    {blockCaption}
                                                </a>
                                            ) : (
                                                <>
                                                    <WpImage
                                                        url={block.media_source}
                                                        src={{
                                                            '': [
                                                                {
                                                                    width: block.attrs.width ? parseInt(block.attrs.width, 10) : 0,
                                                                    height: block.attrs.height ? parseInt(block.attrs.height, 10) : 0
                                                                }
                                                            ]
                                                        }}
                                                        className={blockImgClass}
                                                        alt={block.title}
                                                        focalPoint={[50, 50]}
                                                        props={``}
                                                    />
                                                    {blockCaption}
                                                </>
                                            )}
                                        </figure>
                                    </div>
                                ) : (
                                    <figure
                                        id={`block-${block.uuid}`}
                                        key={block.uuid}
                                        className={blockClass}
                                    >
                                        {block.attrs.linkDestination === 'media' ? (
                                            <a onClick={(event) => {
                                                event.preventDefault(); // This will prevent the default navigation
                                                handleImageClick(block.media_source.replace(`${process.env.WORDPRESS_HOST}/wp-content/uploads/`, `${process.env.IMGIX_HOST}/`));
                                            }} href={block.media_source.replace(`${process.env.WORDPRESS_HOST}/wp-content/uploads/`, `${process.env.IMGIX_HOST}/`)} target={block.attrs.linkTarget} title={block.attrs.title} rel={block.attrs.rel}>
                                                <WpImage url={block.media_source} src={{
                                                    '': [
                                                        {
                                                            width: parseInt(blockWidth),
                                                            height: block.attrs.height ? parseInt(block.attrs.height, 10) : 0
                                                        }
                                                    ]
                                                }} className={blockImgClass} alt={block.title} focalPoint={[50,50]} props={``} />
                                                {blockCaption}
                                            </a>
                                        ) : (
                                            <>
                                                <WpImage url={block.media_source} src={{
                                                    '': [
                                                        {
                                                            width: parseInt(blockWidth),
                                                            height: block.attrs.height ? parseInt(block.attrs.height, 10) : 0
                                                        }
                                                    ]
                                                }} className={blockImgClass} alt={block.title} focalPoint={[50,50]} props={``} />
                                                {blockCaption}
                                            </>
                                        )}
                                    </figure>
                                )}
                            </>
                        );
                    } else if (block.blockName === 'core/quote') {
                        const contentEnd = parse(DOMPurify.sanitize(block.innerContent.slice(-1).pop().replace('</blockquote>', '')));
                        return (
                            <blockquote
                                id={`block-${block.uuid}`}
                                className="quote prose-quoteless"
                                key={block.uuid}
                            >
                                {block.innerBlocks.map((innerBlock: any, index: number) => {
                                    const innerBlockKey = `block-${block.uuid}-${index}`;

                                    return (
                                        <p // Use <span> instead of <p>
                                            key={innerBlockKey}
                                            data-innerblock-id={innerBlockKey}
                                        >
                                            {parse(DOMPurify.sanitize(innerBlock.innerHTML.replace(/(<p[^>]+?>|<p>|<\/p>)/img, '')))}
                                        </p>
                                    )
                                })}
                                {contentEnd}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="absolute top-[10px] left-[-10px] lg:left-[-10px] fill-stone-950 bg-amber-50"
                                    width="1em"
                                    height="1em"
                                >
                                    <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                                </svg>
                            </blockquote>
                        );
                    } else if (block.blockName === 'core/separator') {
                        return (
                            <hr
                                id={`block-${block.uuid}`}
                                className="w-auto h-[2px] my-8 -mx-6 xl:-mx-8 border-none bg-black/10"
                                key={block.uuid}
                            />
                        );
                    } else if (block.blockName === 'acf/alert') {
                        return (
                            <div
                                id={`block-${block.uuid}`}
                                key={block.uuid}
                                className="alert pl-4 py-1 my-4 border-l-4"
                                style={{ borderLeftColor: block.attrs.data.border_color }}
                            >
                                {block.innerBlocks.map((innerBlock: any, index: number) => {
                                    const innerBlockKey = `block-${block.uuid}-${index}`;

                                    return (
                                        <span // Use <span> instead of <p>
                                            key={innerBlockKey}
                                            data-innerblock-id={innerBlockKey}
                                        >
                                      {parse(DOMPurify.sanitize(innerBlock.innerHTML.replace(/(<p[^>]+?>|<p>|<\/p>)/img, '')))}
                                    </span>
                                    )
                                })}
                            </div>
                        )
                    } else if (block.blockName === 'acf/citation') {
                        let align;
                        if ( block.attrs.align === 'left' ) {
                            align = 'xl:py-3 xl:px-5 xl:float-left mb-4 text-sm xl:w-80 xl:ml-[-22rem] w-full ml-auto xl:border-none py-4 border-dashed border-y border-neutral-400';
                        } else if ( block.attrs.align === 'right' ) {
                            align = 'xl:py-3 xl:px-5 xl:float-right mb-4 text-sm xl:w-80 xl:mr-[-22rem] w-full mr-auto xl:border-none   py-4 border-dashed border-y border-neutral-400';
                        } else if ( block.attrs.align === 'full' ) {
                            align = 'mb-4 -mx-8 float-none mb-4 py-4 text-sm border-dashed border-y border-neutral-400';
                        } else {
                            align = 'float-none mb-4 py-4 text-sm border-dashed border-y border-neutral-400';
                        }

                        return (
                            <aside
                                id={`block-${block.uuid}`}
                                key={block.uuid}
                                className={`citation ${align}`}
                            >
                                {block.innerBlocks.map((innerBlock: any, index: number) => {
                                    const innerBlockKey = `block-${block.uuid}-${index}`;

                                    if ( innerBlock.blockName === 'core/heading' ) {
                                        return (
                                            <div key={innerBlockKey} className={`font-sans`}>
                                                {parse(DOMPurify.sanitize(innerBlock.innerHTML))}
                                            </div>
                                        )
                                    }

                                    if ( innerBlock.blockName === 'core/paragraph' ) {
                                        return (
                                            <p // Use <span> instead of <p>
                                                key={innerBlockKey}
                                                data-innerblock-id={innerBlockKey}
                                            >
                                                {parse(DOMPurify.sanitize(innerBlock.innerHTML.replace(/(<p[^>]+?>|<p>|<\/p>)/img, '').replace(process.env.WORDPRESS_HOST, '')))}
                                            </p>
                                        )
                                    }

                                    if ( innerBlock.blockName === 'core/image' ) {
                                        const imageSrc = innerBlock.innerHTML.match(/\<img.+src\=(?:\"|\')(.+?)(?:\"|\')(?:.+?)\>/);
                                        return (
                                            <figure
                                                id={`block-${block.uuid}`}
                                                key={block.uuid}
                                                className="!my-4"
                                            >
                                                <WpImage url={imageSrc[1]} src={{
                                                    '': [
                                                        {
                                                            width: 1024,
                                                            height: block.attrs.height ? parseInt(block.attrs.height, 10) : 0
                                                        }
                                                    ]
                                                }} className={``} alt={block.title} focalPoint={[50,50]} props={``} />
                                            </figure>
                                        );
                                    }
                                })}
                            </aside>
                        )
                    } else if (block.blockName === 'core/paragraph') {
                        return (
                            <p
                                id={`block-${block.uuid}`}
                                key={block.uuid}
                            >
                                {parse(DOMPurify.sanitize(block.innerHTML.replace(/(<p[^>]+?>|<p>|<\/p>)/img, '').replace(process.env.WORDPRESS_HOST, '')))}
                            </p>
                        );
                    } else if (block.blockName === 'core/heading') {
                        return (
                            <div
                                id={`block-${block.uuid}`}
                                key={block.uuid}
                                className={'font-sans'}
                            >
                                {parse(DOMPurify.sanitize(block.innerHTML))}
                            </div>
                        );
                    } else if (block.blockName === 'acf/bookmark') {
                        return (
                            <>
                                {parse(DOMPurify.sanitize(block.innerHTML))}
                            </>
                        )
                    } else {
                        if (block.blockName === null || block.blockName === 'core/more') return;
                        return (
                            <div
                                id={`block-${block.uuid}`}
                                key={block.uuid}
                                className="text-left"
                            >
                                {parse(DOMPurify.sanitize(block.innerHTML))}
                            </div>
                        );
                    }
                })
            }
            {lightboxOpen && (
                <Lightbox
                    mainSrc={currentImage}
                    onCloseRequest={() => setLightboxOpen(false)}
                />
            )}
        </>
    );
}

export default Blocks;
