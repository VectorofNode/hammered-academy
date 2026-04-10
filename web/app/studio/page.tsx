"use client"

import { AccountWelcome } from "@/components/custom/account-welcome";
import { CreateCourseDialog } from "@/components/custom/create-course-dialog";
import { NavBar } from "@/components/custom/nav-bar";
import { TeachingCourseTable } from "@/components/custom/teaching-course-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Page() {
    const {data: session} = useSession()

    return (
        <>
            <NavBar>
                <CreateCourseDialog />
            </NavBar>
            <AccountWelcome prefix="" suffix=", welcome to the studio!" />
            <div className="flex flex-col m-4 space-y-4">
                <div className="text-xl">My Courses</div>
                <TeachingCourseTable />
            </div>
        </>
    )
}