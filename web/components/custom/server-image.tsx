'use server'

import Image from "next/image";
import { env } from "process";

export async function ServerImage({src, alt, fill = undefined, width = undefined, height = undefined}: {src: string, alt: string, fill: boolean | undefined, width: number | undefined, height: number | undefined}) {
    const image_url = `${env.API_URL}/media/image/${src}`

    return (
        <Image src={image_url} alt={alt} fill={fill} width={width} height={height} className="object-cover object-center" />
    )
}