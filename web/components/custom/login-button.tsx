"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { LogIn, LogOut } from "lucide-react";
import { UserInfoPopover } from "./user-info-popover";

export function LoginButton() {
    const {data: session} = useSession()

    if (session) {
        return(
            <UserInfoPopover />
        )
    }

    return(
        <Button size={"icon"} onClick={() => signIn()}>
            <LogIn />
        </Button>
    )
}