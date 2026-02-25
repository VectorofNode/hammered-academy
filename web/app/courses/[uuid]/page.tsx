import { NavBar } from "@/components/custom/nav-bar"
import { Button } from "@/components/ui/button"
import { Course } from "@/lib/models/course"
import { ImageOff } from "lucide-react"
import Image from "next/image"

interface PageProps {
    uuid: string
}

export default async function Page({params}: {params: Promise<PageProps>}) {
    const uuid = (await params).uuid
    const course: Course = {title: "", image: "", description: "aklvndk", uuid: uuid} //TODO: Get by uuid

    return(
        <>
            <NavBar />
            <div className="m-4 bg-gray-300 rounded-2xl h-64 overflow-hidden relative flex justify-center items-center">
                {course.image != ""
                    ? <Image src={course.image} alt="" fill />
                    : <ImageOff />
                }
            </div>
            <div className="flex flex-row m-4 gap-2">
                <div className="flex flex-col gap-2 w-2/3">
                    {course.description}
                </div>
                <div className="flex flex-col gap-2 w-1/3">
                    <div className="text-2xl">{uuid}</div>
                    <Button>Join Course</Button>
                </div>
            </div>
        </>
    )
}