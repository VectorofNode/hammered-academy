"use client"

import { Edit, MoreHorizontal, MoreVertical, Trash } from "lucide-react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { deleteCoursesByUuid } from "@/lib/utils/courses"
import { toast } from "sonner"

interface TeachingCourseTableActionProps {
    uuid: string
    accessToken: string
}

export function TeachingCourseTableAction({uuid, accessToken}: TeachingCourseTableActionProps) {
    const deleteCourse = () => {
        deleteCoursesByUuid(uuid, accessToken)
            .catch(err => toast(`${err}`))
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                    <Edit />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => deleteCourse()} variant={"destructive"}>
                    <Trash />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}