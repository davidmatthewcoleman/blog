import React, { useEffect, useState } from 'react';

const GetImage = ({ url, src, className, alt, focalPoint, props }: { url: string, src: any, className: string, alt: string, focalPoint: any, props: any }) => {
    const [data, setData] = useState(null) as any;

    useEffect(() => {
        const fetchData = async () => {
            const queryParams = new URLSearchParams({
                url,
                src: JSON.stringify(src),
                focalPoint: JSON.stringify(focalPoint)
            }).toString();

            const response = await fetch(`/api/getImage?${queryParams}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();
            setData(jsonData);
        };

        fetchData();
    }, [url, src, focalPoint]); // Add other dependencies if necessary

    if (!data) {
        return ''; // or any other loading indicator
    }

    return (
        <picture>
            {Object.entries(src).map(([mediaQuery, mediaArray], index) => (
                <React.Fragment key={index}>
                    {(mediaArray as any).map((media: any, subIndex: number) => (
                        <>
                            <source
                                key={`avif-${subIndex}`}
                                srcSet={data.srcAvif}
                                width={media.width}
                                height={media.height}
                                media={mediaQuery}
                                type="image/avif"
                            />
                            <source
                                key={`webp-${subIndex}`}
                                srcSet={data.srcWebP}
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
                src={data.img.src}
                srcSet={data.img.srcset}
                width={(Object.values(src).pop() as any)[0].width}
                height={(Object.values(src).pop() as any)[0].height}
                className={className}
                alt={alt}
            />
        </picture>
    );
};

export default GetImage;
