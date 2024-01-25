import React from 'react';
import dynamic from "next/dynamic";
const GetImage = dynamic(() => import('@/components/getImage'), { ssr: true });

const WpImage = ({url, src, className, alt, focalPoint, props}: {url: string, src: any, className: string, alt: string, focalPoint: any, props: any}) => {
    return <GetImage url={url} src={src} className={className} alt={alt} focalPoint={focalPoint} {...props} />;
}

export default WpImage;