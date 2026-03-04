import { CoursePageImage } from "@/components/custom/course-page-image"
import { NavBar } from "@/components/custom/nav-bar"
import { Button } from "@/components/ui/button"
import { Course } from "@/lib/models/course"
import { getCoursesByUuid } from "@/lib/utils/courses"

interface PageProps {
    uuid: string
}

export default async function Page({params}: {params: Promise<PageProps>}) {
    const uuid = (await params).uuid
    const course: Course = await getCoursesByUuid(uuid)

    return(
        <>
            <NavBar />
            <CoursePageImage image={course.image} />
            <div className="flex flex-row m-4 gap-2">
                <div className="flex flex-col gap-2 w-2/3">
                    {course.description}
                </div>
                <div className="flex flex-col gap-2 w-1/3">
                    <div className="text-2xl">{course.title}</div>
                    <Button>Join Course</Button>
                </div>
            </div>
        </>
    )
}