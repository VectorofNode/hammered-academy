'use client'

import { ImageOff } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface CoursePageImageProps {
    image: string
}

export function CoursePageImage({image}: CoursePageImageProps) {
    const [imgError, setImgError] = useState(false)

    const image_url = `/api/image-proxy?file=${image}`

    return (
        <div className="m-4 rounded-2xl h-64 overflow-hidden relative flex justify-center items-center outline">
            {!imgError
                ? <Image src={image_url} alt="" fill onError={() => setImgError(true)} />
                : <ImageOff />
            }
        </div>
    )
}