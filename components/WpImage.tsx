import React from 'react';
import dynamic from "next/dynamic";

// Function to create a placeholder with a dynamic className
const createPlaceholder = (src: any, className: any) => {
    const Placeholder = () => (
        <div className={className} style={{ width: (Object.values(src).pop() as any)[0].width, height: (Object.values(src).pop() as any)[0].height }}></div>
    );
    Placeholder.displayName = 'Placeholder'; // Set displayName for the Placeholder component
    return Placeholder;
};

const WpImage = ({ url, src, className, alt, focalPoint, props }: { url: string, src: any, className: string, alt: string, focalPoint: any, props: any }) => {
    // Dynamically import GetImage with a className-aware placeholder
    const GetImage = dynamic(() => import('@/components/getImage'), {
        ssr: true,
        loading: createPlaceholder(src, className),
    });

    GetImage.displayName = 'GetImage';

    return <GetImage url={url} src={src} className={className} alt={alt} focalPoint={focalPoint} {...props} />;
}

export default WpImage;
