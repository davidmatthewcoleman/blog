import React, { Suspense } from 'react';
const GetImage = React.lazy(() => import('@/components/getImage'));

const WpImage = ({url, src, className, alt, focalPoint, props}: {url: string, src: any, className: string, alt: string, focalPoint: any, props: any}) => {
    return (
        <Suspense fallback={<div style={{ width: (Object.values(src).pop() as any)[0].width, height: (Object.values(src).pop() as any)[0].height }} className={className}></div>}>
            <GetImage url={url} src={src} className={className} alt={alt} focalPoint={focalPoint} props={...props} />
        </Suspense>
    )
}

export default WpImage;