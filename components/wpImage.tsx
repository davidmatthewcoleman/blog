import React from "react";
import ImgixClient from '@imgix/js-core';

const WpImage = ({url, src, className, alt, focalPoint, props}: {url: string, src: any, className: string, alt: string, focalPoint: any, props: any}) => {
    const client = new ImgixClient({
        domain: process.env.IMGIX_HOST as string,
        secureURLToken: process.env.IMGIX_TOKEN as string,
        includeLibraryParam: false
    });

    const path = url.replace(`${process.env.WORDPRESS_HOST}/wp-content/uploads/`, '');

    const [focalPointX, focalPointY] = focalPoint.map((value: any) => parseFloat((value / 100).toFixed(2)));
    const dpr: any = [1,2,3];
    const quality: any = {
        1: 95,
        2: 90,
        3: 85
    }

    let arraysOnly: any = Object.values(src).filter(value => Array.isArray(value));
    let originalSrc: any = arraysOnly[arraysOnly.length - 1][0];

    const newSrc = client.buildURL(
        path,
        {
            w: originalSrc.width,
            h: originalSrc.height,
            "fp-x": focalPointX,
            "fp-y": focalPointY,
            fm: "webp",
            q: 95
        }
    );

    const newSrcSet = client.buildSrcSet(
        path,
        {
            w: originalSrc.width,
            h: originalSrc.height,
            "fp-x": focalPointX,
            "fp-y": focalPointY,
            fm: "webp"
        },
        {
            devicePixelRatios: dpr,
            variableQualities: quality
        },
    );

    return (
        <picture>
            {Object.entries(src).map(([mediaQuery, mediaArray], index) => (
                <React.Fragment key={index}>
                    {(mediaArray as any[]).map((media, subIndex) => {
                        const srcset = client.buildSrcSet(
                            path,
                            {
                                w: media.width,
                                h: media.height,
                                "fp-x": focalPointX,
                                "fp-y": focalPointY,
                                fm: "avif"
                            },
                            {
                                devicePixelRatios: dpr,
                                variableQualities: quality
                            },
                        );
                        return (
                        <source
                            key={subIndex}
                            srcSet={srcset}
                            width={media.width}
                            height={media.height}
                            media={mediaQuery}
                            type={`image/avif`}
                        />
                    )})}
                    {(mediaArray as any[]).map((media, subIndex) => {
                        const srcset = client.buildSrcSet(
                            path,
                            {
                                w: media.width,
                                h: media.height,
                                "fp-x": focalPointX,
                                "fp-y": focalPointY,
                                fm: "webp"
                            },
                            {
                                devicePixelRatios: dpr,
                                variableQualities: quality
                            },
                        );
                        return (
                            <source
                                key={subIndex}
                                srcSet={srcset}
                                width={media.width}
                                height={media.height}
                                media={mediaQuery}
                                type={`image/webp`}
                            />
                        )})}
                </React.Fragment>
            ))}
            <img
                src={newSrc}
                srcSet={newSrcSet}
                width={src.width}
                height={src.height}
                className={className}
                alt={alt}
            />
        </picture>
    )
}

export default WpImage;