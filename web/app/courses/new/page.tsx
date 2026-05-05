"use client"

import { NavBar } from "@/components/custom/nav-bar"
import { NewCourseForm } from "@/components/custom/new-course-form"
import { Button } from "@/components/ui/button"
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field"
import { uploadFile } from "@/lib/utils/medias"
import { courseSchema } from "@/lib/validations/course"
import { zodResolver } from "@hookform/resolvers/zod"
import { SaveIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { UploadImageField } from "@/components/custom/upload-image-field"
import { SectionCreate } from "@/lib/models/section"
import { NewCourseSectionsList } from "@/components/custom/new-course-sections-table"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { CourseCreate } from "@/lib/models/course"
import { createNewCourse, createSectionsForCourse } from "@/lib/utils/courses"
import { toast } from "sonner"

export default function Page() {
    const { data: session } = useSession()
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(courseSchema as any),
        defaultValues: {
            title: "",
            description: ""
        }
    })

    const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null)
    const [imageUuid, setImageUuid] = useState("")

    const [sections, setSections] = useState<SectionCreate[]>([])

    const [courseUuid, setCourseUuid] = useState("")

    const imageRecieved = (file: File) => {
        setSelectedFileUrl(URL.createObjectURL(file))
        console.log(session?.accessToken)
        uploadFile(file, session?.accessToken)
            .then((value) => setImageUuid(value.uuid))
            .catch((err) => {
                toast.error(`Error: ${err}`)
                setSelectedFileUrl(null)
            })
    }

    const createCourse = async () => {
        const course: CourseCreate = {
            title: form.getValues("title"), 
            description: form.getValues("description"),
            image: imageUuid
        }
        try {
            const courseRes = await createNewCourse(course, session?.accessToken)
            setCourseUuid(courseRes.uuid)
            
            createSectionsForCourse(courseRes.uuid, sections, session?.accessToken)
        } catch (error) {
            toast(`${error}`)
        }
    }

    return (
        <>
            <NavBar />
            <div className="flex flex-col h-full">
                <div className="flex">
                    <div className="flex flex-1/2 p-4 flex-col">
                        <FieldSet>
                            <FieldLegend>Create course</FieldLegend>
                            <FieldDescription>Please provide information to create your course.</FieldDescription>
                            <UploadImageField onChange={(file) => imageRecieved(file)} imageObjectUrl={selectedFileUrl} />
                            <NewCourseForm form={form} />
                        </FieldSet>
                    </div>
                    <div className="flex flex-1/2 flex-col items-center p-4 justify-between">
                        <NewCourseSectionsList 
                            sections={sections} 
                            onSectionAdd={(section) => setSections(prev => [...prev, section])} 
                            onSectionDelete={() => {}} 
                            onSectionEdit={() => {}} 
                            courseUuid={courseUuid}
                        />
                    </div>
                </div>
                <div className="flex p-4">
                    <Item variant={"muted"} className="w-full">
                        <ItemMedia variant={"icon"}>
                            <SaveIcon />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>Save</ItemTitle>
                            <ItemDescription>Save your course now.</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <Button onClick={() => createCourse()}>Save</Button>
                        </ItemActions>
                    </Item>
                </div>
            </div>
        </>
    )
}