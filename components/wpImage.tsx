import React, { useMemo } from "react";
import ImgixClient from '@imgix/js-core';

const WpImage = ({ url, src, className, alt, focalPoint }: { url: string, src: any, className: string, alt: string, focalPoint: any }) => {
    const client = useMemo(() => new ImgixClient({
        domain: process.env.IMGIX_HOST as string,
        secureURLToken: process.env.IMGIX_TOKEN as string,
        includeLibraryParam: false
    }), []);

    const path = useMemo(() => url.replace(`${process.env.WORDPRESS_HOST}/wp-content/uploads/`, ''), [url]);

    const [focalPointX, focalPointY] = useMemo(() => focalPoint.map((value: any) => parseFloat((value / 100).toFixed(2))), [focalPoint]);
    const dpr = [1, 2, 3];
    const quality = { 1: 95, 2: 90, 3: 85 };

    const arraysOnly: any = useMemo(() => Object.values(src).filter(value => Array.isArray(value)), [src]);
    const originalSrc: any = useMemo(() => arraysOnly[arraysOnly.length - 1][0], [arraysOnly]);

    const newSrc = useMemo(() => client.buildURL(
        path,
        {
            w: originalSrc.width,
            h: originalSrc.height,
            "fp-x": focalPointX,
            "fp-y": focalPointY,
            fm: "webp",
            q: 95
        }
    ), [client, path, originalSrc, focalPointX, focalPointY]);

    const newSrcSet = useMemo(() => client.buildSrcSet(
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
        }
    ), [client, path, originalSrc, focalPointX, focalPointY, dpr, quality]);

    return (
        <picture>
            {Object.entries(src).map(([mediaQuery, mediaArray], index) => (
                <React.Fragment key={index}>
                    {(mediaArray as any).map((media: any, subIndex: any) => (
                        <>
                            <source
                                key={subIndex}
                                srcSet={client.buildSrcSet(
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
                                    }
                                )}
                                width={media.width}
                                height={media.height}
                                media={mediaQuery}
                                type="image/avif"
                            />
                            <source
                                key={subIndex}
                                srcSet={client.buildSrcSet(
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
                                    }
                                )}
                                width={media.width}
                                height={media.height}
                                media={mediaQuery}
                                type="image/webp"
                            />
                        </>
                    ))}
                </React.Fragment>
            ))}
            <img
                src={newSrc}
                srcSet={newSrcSet}
                width={originalSrc.width}
                height={originalSrc.height}
                className={className}
                alt={alt}
            />
        </picture>
    );
};

export default WpImage;
