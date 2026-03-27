import { Section, SectionCreate } from "@/lib/models/section";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { NewCourseCreationSheet } from "./new-course-creation-sheet";
import { NewCourseSectionDropdown } from "./new-course-section-dropdown";

interface NewCourseSectionsListProps {
    onSectionAdd: (section: SectionCreate) => void
    onSectionDelete: (section: SectionCreate) => void
    onSectionEdit: (section: SectionCreate) => void
    sections: SectionCreate[]
}

export function NewCourseSectionsList({ onSectionAdd, onSectionDelete, onSectionEdit, sections }: NewCourseSectionsListProps) {
    return (
        <>
            <Table>
                <TableCaption>Sections</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16">No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sections.map(val => (
                        <TableRow key={val.order}>
                            <TableCell>{val.order}</TableCell>
                            <TableCell>{val.title}</TableCell>
                            <TableCell className="text-right">
                                <NewCourseSectionDropdown />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <NewCourseCreationSheet onCreate={(section) => onSectionAdd(section)} prev_order={sections.length} course_uuid="" />
        </>
    )
}