"use client"

import { Course } from "@/lib/models/course"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./datatable";
import { deleteCoursesByUuid, getTeachingCourses } from "@/lib/utils/courses";
import { unauthorized, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { Checkbox } from "../ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Delete, Edit, MoreHorizontal, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { TeachingCourseTableAction } from "./teaching-course-table-action";

export function TeachingCourseTable() {
    const { data: session } = useSession()

    const router = useRouter()

    const [courses, setCourses] = useState<Course[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getTeachingCourses(session?.accessToken ?? unauthorized())
            .then(res => setCourses(res))
            .catch(err => toast(`${err}`))
            .finally(() => setIsLoading(false))
    }, [])

    const navToCourse = (uuid: string) => {
        router.push(`/courses/${uuid}`)
    }

    return (
        isLoading
            ? <Spinner />
            : <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                {courses.length
                    ? courses.map(course => (
                        <TableRow key={course.uuid}>
                            <TableCell>
                                <Button variant={"link"}  onClick={() => navToCourse(course.uuid)}>
                                    {course.title}
                                </Button>
                            </TableCell>
                            <TableCell>{course.description}</TableCell>
                            <TableCell className="text-right">
                                <TeachingCourseTableAction uuid={course.uuid} accessToken={session?.accessToken ?? unauthorized()} />
                            </TableCell>
                        </TableRow>
                    ))
                    : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">No data</TableCell>
                        </TableRow>
                    )}
            </Table>
    )
}