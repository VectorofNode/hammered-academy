"use client"

import { Course } from "@/lib/models/course"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { getTeachingCourses } from "@/lib/utils/courses";
import { unauthorized, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { TeachingCourseTableAction } from "./teaching-course-table-action";

export function TeachingCourseTable() {
    const { data: session } = useSession()

    const router = useRouter()

    const [courses, setCourses] = useState<Course[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(0)

    useEffect(() => {
        getTeachingCourses(session?.accessToken ?? unauthorized())
            .then(res => setCourses(res))
            .catch(err => toast(`${err}`))
            .finally(() => setIsLoading(false))
    }, [reload])

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
                <TableBody>
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
                                    <TeachingCourseTableAction 
                                        uuid={course.uuid} 
                                        accessToken={session?.accessToken ?? unauthorized()}
                                        onChange={() => setReload(reload + 1)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                        : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">No data</TableCell>
                            </TableRow>
                        )}
                </TableBody>
            </Table>
    )
}