'use client'

import Image from "next/image"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Course } from "@/lib/models/course"
import { useRouter } from "next/navigation"
import { ImageOff } from "lucide-react"

export function CourseCard({image, title, description, uuid}: Course) {
    const router = useRouter()

    return (
        <>
            <Card className="w-fit hover:cursor-pointer" onClick={() => router.push(`/courses/${uuid}`)}>
                <div className="flex w-3xs h-32 overflow-hidden items-center justify-center">
                    {/* {image != ""
                        ? <Image src={image} alt="" width={256} height={128} className="object-cover object-center" />
                        : <ImageOff />} */}
                    <ImageOff />
                </div>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
            </Card>
        </>
    )
}