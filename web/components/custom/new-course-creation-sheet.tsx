import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useState } from "react";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { SectionCreate } from "@/lib/models/section";

interface NewCourseCreationSheetProps {
    onCreate: (section: SectionCreate) => void,
    prevOrder: number,
    courseUuid: string
}

export function NewCourseCreationSheet({ onCreate, prevOrder: prev_order, courseUuid: course_uuid }: NewCourseCreationSheetProps) {
    const [title, setTitle] = useState("")
    const [order, setOrder] = useState("")

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>
                    <Plus />
                    Create Section
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Create Section</SheetTitle>
                    <SheetDescription>
                        Create new section for your course.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col px-4">
                    <Field>
                        <FieldLabel>Title</FieldLabel>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                        <FieldDescription>Set the title of section.</FieldDescription>
                    </Field>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button onClick={() => onCreate({title: title, order: prev_order + 1, course_uuid: course_uuid})}>Save</Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button variant={"outline"}>Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}