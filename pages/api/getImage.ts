import type { NextApiRequest, NextApiResponse } from 'next';
import ImgixClient from "@imgix/js-core";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Extract parameters from req.query
    const url = req.query.url as string;
    const src = req.query.src ? JSON.parse(req.query.src as string) : null;
    const focalPoint = req.query.focalPoint ? JSON.parse(req.query.focalPoint as string) : [50, 50];

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

    let avifSrcSet: any = Object.entries(src).map(([mediaQuery, mediaArray]) => {
        return client.buildSrcSet(
            path,
            {
                w: originalSrc.width,
                h: originalSrc.height,
                "fp-x": focalPointX,
                "fp-y": focalPointY,
                fm: "avif"
            },
            {
                devicePixelRatios: dpr,
                variableQualities: quality
            }
        );
    });

    let webpSrcSet: any = Object.entries(src).map(([mediaQuery, mediaArray]) => {
        return client.buildSrcSet(
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
        );
    });

    const data = {
        img: {
            src: newSrc as string,
            srcset: newSrcSet as string
        },
        srcAvif: avifSrcSet as string,
        srcWebP: webpSrcSet as string
    }

    res.status(200).json(data);
}