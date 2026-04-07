"use client"

import { AccountWelcome } from "@/components/custom/account-welcome";
import { NavBar } from "@/components/custom/nav-bar";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
    const { status } = useSession()

    const router = useRouter()

    if (status == "unauthenticated") {
        router.push("/login")
        return
    }

    return(
    <>
        <NavBar />
        <div className="m-4">
            <AccountWelcome />
            <Separator />
        </div>
    </>)
}