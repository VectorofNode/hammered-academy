"use client"

import { NavBar } from "@/components/custom/nav-bar"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { uploadFile } from "@/lib/utils/medias"
import { ImageIcon, Upload } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
    const { data: session } = useSession()
    const router = useRouter()

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [imageUuid, setImageUuid] = useState("")

    const uploadImage = () => {
        if (!selectedFile) {
            return
        }
        uploadFile(selectedFile)
            .then((val) => setImageUuid(val.uuid))
    }

    return (
        <>
            <NavBar />
            <div className="flex">
                <div className="flex flex-1/2 p-4 flex-col">
                    <FieldSet>
                        <FieldLegend>Create course</FieldLegend>
                        <FieldDescription>Please provide information to create your course.</FieldDescription>
                        <Field className="flex">
                            <FieldLabel>Image</FieldLabel>
                            <FieldContent>
                                <Empty className="border border-dashed">
                                    <EmptyHeader>
                                        <EmptyMedia>
                                            <ImageIcon />
                                        </EmptyMedia>
                                        <EmptyTitle>Upload Image</EmptyTitle>
                                        <EmptyDescription>Upload the cover image of your course.</EmptyDescription>
                                    </EmptyHeader>
                                    <EmptyContent>
                                        <Button>
                                            <Upload />
                                            Upload
                                        </Button>
                                    </EmptyContent>
                                </Empty>
                            </FieldContent>
                        </Field>
                        <FieldGroup>
                            <Field className="flex">
                                <FieldLabel>Title</FieldLabel>
                                <FieldContent>
                                    <Input placeholder="Enter title" />
                                </FieldContent>
                            </Field>
                            <Field className="flex">
                                <FieldLabel>Description</FieldLabel>
                                <FieldContent>
                                    <Input placeholder="Enter description" />
                                </FieldContent>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </div>
                <div className="flex flex-1/2"></div>
            </div>
        </>
    )
}