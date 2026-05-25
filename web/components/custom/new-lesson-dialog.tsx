import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { LesssonCreate } from "@/lib/models/lesson";
import { useState } from "react";

interface Props {
    onCreate: (lesson: LesssonCreate) => void,
    order: number
}

export function NewLessonDialog({onCreate, order}: Props) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const save = () => {
        const lesson: LesssonCreate = {
            content_type: "url",
            order: order,
            content_url: "",
            section_uuid: "",
            title: title
        }
        onCreate(lesson)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"secondary"}>
                    <Plus />
                    Add new lesson
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add new lesson.</DialogTitle>
                    <DialogDescription>Add new lesson for section.</DialogDescription>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Title</FieldLabel>
                        <Input value={title} onChange={e => setTitle(e.target.value)} />
                        <FieldDescription>Enter title for lesson.</FieldDescription>
                    </Field>
                    <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Textarea value={description} onChange={e => setDescription(e.target.value)} />
                        <FieldDescription>Enter description for lesson.</FieldDescription>
                    </Field>
                </FieldGroup>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={() => save()}>Save</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}