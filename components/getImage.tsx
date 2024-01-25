import React, { useEffect, useState, useRef } from 'react';

const GetImage = ({ url, src, className, alt, focalPoint, props }: { url: string, src: any, className: string, alt: string, focalPoint: any, props: any }) => {
    const [data, setData] = useState(null) as any;
    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef() as any;

    // Function to fetch image data
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

    useEffect(() => {
        if (!data) {
            fetchData();
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setLoaded(true);
                    observer.unobserve(imgRef.current);
                }
            });
        });

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, [data, url, src, focalPoint]);

    if (!data) {
        return <div className={className} style={{
            width: (Object.values(src).pop() as any)[0].width,
            height: (Object.values(src).pop() as any)[0].height
        }}></div>; // or any other loading indicator
    }

    return (
        <picture ref={imgRef}>
            {Object.entries(src).map(([mediaQuery, mediaArray], index) => (
                <React.Fragment key={index}>
                    {(mediaArray as any).map((media: any, subIndex: any) => (
                        <React.Fragment key={subIndex}>
                            <source
                                srcSet={loaded ? data.srcAvif : ''}
                                width={media.width}
                                height={media.height}
                                media={mediaQuery}
                                type="image/avif"
                            />
                            <source
                                srcSet={loaded ? data.srcWebP : ''}
                                width={media.width}
                                height={media.height}
                                media={mediaQuery}
                                type="image/webp"
                            />
                        </React.Fragment>
                    ))}
                </React.Fragment>
            ))}
            <img
                src={loaded ? data.img.src : ''}
                srcSet={loaded ? data.img.srcset : ''}
                width={(Object.values(src).pop() as any)[0].width}
                height={(Object.values(src).pop() as any)[0].height}
                className={`transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                alt={alt}
                loading="eager"
                {...props}
            />
        </picture>
    );
};

export default GetImage;