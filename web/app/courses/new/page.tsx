"use client"

import { NavBar } from "@/components/custom/nav-bar"
import { NewCourseForm } from "@/components/custom/new-course-form"
import { Button } from "@/components/ui/button"
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field"
import { uploadFile } from "@/lib/utils/medias"
import { courseSchema } from "@/lib/validations/course"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Save, SaveIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { UploadImageField } from "@/components/custom/upload-image-field"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Section, SectionCreate } from "@/lib/models/section"
import { NewCourseSectionsList } from "@/components/custom/new-course-sections-table"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"

export default function Page() {
    const { data: session } = useSession()
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: "",
            description: ""
        }
    })

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [imageUuid, setImageUuid] = useState("")

    const [sections, setSections] = useState<SectionCreate[]>([])

    const imageRecieved = (file: File) => {
        setSelectedFile(file)
        uploadFile(file).then((value) => setImageUuid(value.uuid))
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
                            <UploadImageField onChange={(file) => imageRecieved(file)} />
                            <NewCourseForm form={form} />
                        </FieldSet>
                    </div>
                    <div className="flex flex-1/2 flex-col items-center p-4 justify-between">
                        <NewCourseSectionsList 
                            sections={sections} 
                            onSectionAdd={(section) => setSections(prev => [...prev, section])} 
                            onSectionDelete={() => {}} 
                            onSectionEdit={() => {}} 
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
                            <Button>Save</Button>
                        </ItemActions>
                    </Item>
                </div>
            </div>
        </>
    )
}