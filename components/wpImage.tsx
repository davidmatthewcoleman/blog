import React from "react";
import Imgix, { Picture, Source } from "react-imgix";

const WpImage = ({url, src, className, alt, focalPoint, props}: {url: string, src: any, className: string, alt: string, focalPoint: any, props: any}) => {
    url = url.replace(`${process.env.WORDPRESS_HOST}/wp-content/uploads/`, `${process.env.IMGIX_HOST}/`);
    const [focalPointX, focalPointY] = focalPoint.map((value: any) => parseFloat((value / 100).toFixed(2)));

    return (
        <Picture>
            {Object.entries(src).map(([mediaQuery, mediaArray], index) => (
                <React.Fragment key={index}>
                    {(mediaArray as any[]).map((media, subIndex) => (
                        <Source
                            key={subIndex}
                            src={url}
                            width={media.width}
                            height={media.height}
                            imgixParams={{
                                "fp-x": focalPointX,
                                "fp-y": focalPointY,
                                "fm": "avif"
                            }}
                            htmlAttributes={{ media: mediaQuery, type: 'image/avif' }}
                            disableLibraryParam={true}
                        />
                    ))}
                    {(mediaArray as any[]).map((media, subIndex) => (
                        <Source
                            key={subIndex}
                            src={url}
                            width={media.width}
                            height={media.height}
                            imgixParams={{
                                "fp-x": focalPointX,
                                "fp-y": focalPointY,
                                "fm": "webp"
                            }}
                            htmlAttributes={{ media: mediaQuery, type: 'image/webp' }}
                            disableLibraryParam={true}
                        />
                    ))}
                </React.Fragment>
            ))}
            <Imgix
                src={url}
                imgixParams={{
                    w: src[Object.keys(src)[0]][0].width,
                    h: src[Object.keys(src)[0]][0].height,
                    "fp-x": focalPointX,
                    "fp-y": focalPointY
                }}
                htmlAttributes={{
                    alt: alt,
                    width: src[Object.keys(src)[0]][0].width,
                    height: src[Object.keys(src)[0]][0].height,
                    ...props
                }}
                className={className}
                disableLibraryParam={true}
            />
        </Picture>
    )
}

export default WpImage;