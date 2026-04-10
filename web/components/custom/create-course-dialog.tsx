import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { UploadImageField } from "./upload-image-field";
import { NewCourseForm } from "./new-course-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema } from "@/lib/validations/course";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { NewCourseSectionsList } from "./new-course-sections-table";
import { useSession } from "next-auth/react";
import { uploadFile } from "@/lib/utils/medias";
import { unauthorized } from "next/navigation";
import { toast } from "sonner";
import { CourseCreate } from "@/lib/models/course";
import { createNewCourse } from "@/lib/utils/courses";

export function CreateCourseDialog() {
    const {data: session} = useSession()

    const [isClosable, setIsClosable] = useState(false)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [imageUuid, setImageUuid] = useState("")
    const [courseUuid, setCourseUuid] = useState("")

    const form = useForm({
        resolver: zodResolver(courseSchema as any),
        defaultValues: {
            title: "",
            description: ""
        }
    })

    const imageRecieved = (file: File) => {
        setImageUrl(URL.createObjectURL(file))
        console.log(session?.accessToken)
        uploadFile(file, session?.accessToken ?? unauthorized())
            .then((value) => setImageUuid(value.uuid))
            .catch((err) => {
                toast.error(`Error: ${err}`)
                setImageUrl(null)
            })
    }

    const createCourse = async () => {
        const course: CourseCreate = {
            title: form.getValues("title"), 
            description: form.getValues("description"),
            image: imageUuid
        }
        try {
            const courseRes = await createNewCourse(course, session?.accessToken ?? unauthorized())
            setCourseUuid(courseRes.uuid)
        } catch (error) {
            toast(`${error}`)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Create Course
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create new course
                    </DialogTitle>
                </DialogHeader>
                <UploadImageField imageObjectUrl={imageUrl} onChange={(file) => imageRecieved(file)} />
                <NewCourseForm form={form} />
                <DialogClose disabled={!isClosable} asChild>
                    <div className="flex flex-row justify-end space-x-2">
                        <Button variant={"ghost"}>Cancel</Button>
                        <Button onClick={() => createCourse()}>Save</Button>
                    </div>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}