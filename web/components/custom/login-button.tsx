"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { LogIn, LogOut } from "lucide-react";

export function LoginButton() {
    const {data: session} = useSession()

    if (session) {
        return(
            <div>
                {session.user?.email}
                <Button size={"icon"} onClick={() => signOut()}>
                    <LogOut />
                </Button>
            </div>
        )
    }

    return(
        <Button size={"icon"} onClick={() => signIn()}>
            <LogIn />
        </Button>
    )
}