import React, { useState, useEffect } from 'react';
import dynamic from "next/dynamic";

const Placeholder = ({ src, className }: { src: any; className: string }) => (
    <div className={className} style={{ width: (Object.values(src).pop() as any)[0].width, height: (Object.values(src).pop() as any)[0].height }}></div>
);

const WpImage = ({ url, src, className, alt, focalPoint, props }: { url: string, src: any, className: string, alt: string, focalPoint: any, props: any }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // Dynamically import GetImage
    const GetImage = dynamic(() => import('@/components/getImage'), {
        ssr: false,
        loading: () => <Placeholder src={src} className={className} />,
    });

    useEffect(() => {
        // Assuming GetImage loads instantly which might not be the case,
        // you may need a more reliable way to know when GetImage has finished loading
        setIsLoaded(true);
    }, []);

    return isLoaded
        ? <GetImage url={url} src={src} className={className} alt={alt} focalPoint={focalPoint} {...props} />
        : <Placeholder src={src} className={className} />;
}

export default WpImage;
