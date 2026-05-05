import { Delete, Edit, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface NewCourseSectionDropdownProps {
    onDelete: () => void
    onEdit: () => void
}

export function NewCourseSectionDropdown({onDelete, onEdit}:NewCourseSectionDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit()}>
                    <Pencil />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem variant={"destructive"} onClick={() => onDelete()}>
                    <Trash />
                    Remove
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}