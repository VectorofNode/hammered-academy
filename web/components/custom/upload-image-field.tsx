import { ImageIcon, Upload } from "lucide-react"
import { Button } from "../ui/button"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "../ui/empty"
import { Field, FieldLabel, FieldContent } from "../ui/field"
import { Input } from "../ui/input"
import { useRef, useState } from "react"
import Image from "next/image"

interface UploadImageFieldProps {
    onChange: (file: File) => void
}

export function UploadImageField({ onChange }: UploadImageFieldProps) {
    const uploadRef = useRef<HTMLInputElement>(null)
    
    const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null)

    const uploadImage = () => {
        const currentRef = uploadRef.current
        if (!currentRef) {
            return
        }
        currentRef.click()
    }

    const imageRecieved = (file: File) => {
        onChange(file)
        setSelectedFileUrl(URL.createObjectURL(file))
    }

    return (
        <Field className="flex">
            <FieldLabel>Image</FieldLabel>
            <FieldContent>
                {!selectedFileUrl? 
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
                            <Image src={selectedFileUrl} alt="" fill objectFit="cover" />
                        </div>
                        <Button onClick={() => uploadImage()}>
                            <Upload />
                            Upload
                        </Button>
                    </div>
                }
                <Input 
                    type="file" 
                    ref={uploadRef} 
                    style={{display: "none"}} 
                    accept="image/*" 
                    onChange={(event) => imageRecieved(event.target.files[0])}
                />
            </FieldContent>
        </Field>
    )
}