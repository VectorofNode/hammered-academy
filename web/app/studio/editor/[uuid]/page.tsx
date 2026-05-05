"use client"

import { NavBar } from "@/components/custom/nav-bar";
import { NewCourseForm } from "@/components/custom/new-course-form";
import { NewCourseSectionsList } from "@/components/custom/new-course-sections-table";
import { UploadImageField } from "@/components/custom/upload-image-field";
import { Course } from "@/lib/models/course";
import { Section, SectionCreate, SectionWithLessons } from "@/lib/models/section";
import { getCoursesByUuid, getFullCourseByUuid } from "@/lib/utils/courses";
import { uploadFile } from "@/lib/utils/medias";
import { createSection, deleteSection } from "@/lib/utils/sections";
import { courseSchema } from "@/lib/validations/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { unauthorized, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Page() {
    const params = useParams<{uuid: string}>()
    const {data: session} = useSession()

    const [reload, setReload] = useState(0)
    const [imageUrl, setImageUrl] = useState("")
    const [imageUuid, setImageUuid] = useState("")
    const [sections, setSections] = useState<SectionCreate[]>([])

    const imageUpdate = (file: File) => {
        uploadFile(file, session?.accessToken ?? unauthorized())
            .then(val => {
                setImageUrl(URL.createObjectURL(file))
                setImageUuid(val.uuid)
            })
            .catch(err => {
                toast.error(`${err}`)
            })
    }

    const form = useForm({
        resolver: zodResolver(courseSchema as any),
        defaultValues: {
            title: "",
            description: ""
        }
    })

    useEffect(() => {
        getFullCourseByUuid(params.uuid)
            .then(val => {
                form.setValue("title", val.title)
                form.setValue("description", val.description)
                setImageUuid(val.image)
                setSections(val.sections.map((section) => {
                    const sec: SectionCreate = {course_uuid: val.uuid, title: section.title, order: section.order}
                    return sec
                }))
            })
    }, [reload])

    return (
        <>
            <NavBar />
            <div className="flex flex-row m-4">
                <div className="flex flex-col flex-1/2">
                    <UploadImageField imageObjectUrl={imageUrl} onChange={(file) => imageUpdate(file)} />
                    <NewCourseForm form={form} />
                </div>
                <div className="flex flex-col flex-1/2">
                    <NewCourseSectionsList 
                        onSectionAdd={(section) => {
                            createSection(section, session?.accessToken ?? unauthorized())
                            setReload(reload + 1)
                        }} 
                        onSectionDelete={(section) => {
                            deleteSection(section, session?.accessToken ?? unauthorized())
                            setReload(reload + 1)
                        }}
                        onSectionEdit={() => {}}
                        courseUuid={params.uuid}
                        sections={sections}
                    />
                </div>
            </div>
        </>
    )
}