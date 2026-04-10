"use client"

import { Course } from "@/lib/models/course"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./datatable";
import { getTeachingCourses } from "@/lib/utils/courses";
import { unauthorized } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "title",
        header: "Title"
    },
    {
        accessorKey: "description",
        header: "Description"
    }
]

export function TeachingCourseTable() {
    const { data: session } = useSession()

    const [courses, setCourses] = useState<Course[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getTeachingCourses(session?.accessToken ?? unauthorized())
            .then(res => setCourses(res))
            .catch(err => toast(`${err}`))
            .finally(() => setIsLoading(false))
    }, [])

    return (
        !isLoading 
            ? <DataTable columns={columns} data={courses} className="outline rounded-xl" /> 
            : <div><Spinner /></div>
    )
}