import { CourseCurriculum } from "@/components/custom/course-curriculum"
import { CoursePageImage } from "@/components/custom/course-page-image"
import { NavBar } from "@/components/custom/nav-bar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Course, CourseFull } from "@/lib/models/course"
import { getCoursesByUuid, getFullCourseByUuid } from "@/lib/utils/courses"

interface PageProps {
    uuid: string
}

export default async function Page({params}: {params: Promise<PageProps>}) {
    const uuid = (await params).uuid
    const course: CourseFull = await getFullCourseByUuid(uuid)

    return(
        <>
            <NavBar />
            <CoursePageImage image={course.image} />
            <div className="flex flex-row m-4 gap-2">
                <div className="flex flex-col gap-2 w-2/3 pr-8">
                    <CourseCurriculum sections={course.sections} />
                </div>
                <div className="flex flex-col gap-2 w-1/3">
                    <div className="text-2xl">{course.title}</div>
                    <Separator />
                    {course.description}
                    <Button>Join Course</Button>
                </div>
            </div>
        </>
    )
}