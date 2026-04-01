import { ImageIcon, Upload } from "lucide-react"
import { Button } from "../ui/button"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "../ui/empty"
import { Field, FieldLabel, FieldContent } from "../ui/field"
import { useRef } from "react"
import Image from "next/image"

interface UploadImageFieldProps {
    onChange: (file: File) => void
    imageObjectUrl: string | null
}

export function UploadImageField({ onChange, imageObjectUrl }: UploadImageFieldProps) {
    const uploadRef = useRef<HTMLInputElement>(null)

    const uploadImage = async () => {
        const [fileHandle] = await window.showOpenFilePicker()
        const file = await fileHandle.getFile()

        onChange(file)
    }

    return (
        <Field className="flex">
            <FieldLabel>Image</FieldLabel>
            <FieldContent>
                {!imageObjectUrl? 
                    <Empty className="border border-dashed">
                        <EmptyHeader>
                            <EmptyMedia>
                                <ImageIcon />
                            </EmptyMedia>
                            <EmptyTitle>Upload Image</EmptyTitle>
                            <EmptyDescription>Upload the cover image of your course.</EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button onClick={() => uploadImage()}>
                                <Upload />
                                Upload
                            </Button>
                        </EmptyContent>
                    </Empty> :
                    <div className="w-full flex flex-col">
                        <div className="flex w-full overflow-hidden border border-dashed h-60 rounded-xl relative justify-center items-center">
                            <Image src={imageObjectUrl} alt="" fill objectFit="cover" />
                        </div>
                        <Button onClick={() => uploadImage()}>
                            <Upload />
                            Upload
                        </Button>
                    </div>
                }
            </FieldContent>
        </Field>
    )
}