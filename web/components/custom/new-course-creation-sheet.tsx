"use client"

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useState } from "react";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { SectionCreate } from "@/lib/models/section";
import { LesssonCreate } from "@/lib/models/lesson";
import { Item, ItemHeader, ItemTitle } from "../ui/item";
import { NewLessonDialog } from "./new-lesson-dialog";

interface NewCourseCreationSheetProps {
    onCreate: (section: SectionCreate) => void,
    prevOrder: number,
    courseUuid: string
}

export function NewCourseCreationSheet({ onCreate, prevOrder: prev_order, courseUuid: course_uuid }: NewCourseCreationSheetProps) {
    const [title, setTitle] = useState("")
    const [order, setOrder] = useState("")
    const [lessons, setLessons] = useState<LesssonCreate[]>([])

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
                <div className="flex flex-col px-4 gap-2">
                    <Field>
                        <FieldLabel>Title</FieldLabel>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                        <FieldDescription>Set the title of section.</FieldDescription>
                    </Field>
                    <Field>
                        <FieldLabel>Lessons</FieldLabel>
                        <div className="rounded-xl border-dashed border p-2 flex flex-col gap-2">
                            {lessons.map((val, idx) => (
                                <Item key={idx} variant={"muted"}>
                                    <ItemHeader>
                                        <ItemTitle>{val.title}</ItemTitle>
                                    </ItemHeader>
                                </Item>
                            ))}
                            <NewLessonDialog onCreate={(lesson) => setLessons([...lessons, lesson])} order={lessons.length} />
                        </div>
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