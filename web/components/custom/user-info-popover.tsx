"use client"

import { signOut, useSession } from "next-auth/react";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { LogOut, PopcornIcon, Settings, User } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";

export function UserInfoPopover() {
    const {data: session} = useSession()
    const router = useRouter()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Avatar>
                    <AvatarImage src={session?.user?.image?? ""} />
                </Avatar>
            </PopoverTrigger>
            <PopoverContent align="end">
                <PopoverHeader>
                    <PopoverTitle>{session?.user?.name}</PopoverTitle>
                    <PopoverDescription>{session?.user?.email}</PopoverDescription>
                </PopoverHeader>
                <div className="flex flex-row justify-end gap-2 pt-4">
                    <Button size={"icon"} onClick={() => router.push("/account")}>
                        <Settings/>
                    </Button>
                    <Button size={"icon"} variant={"secondary"} onClick={() => signOut({callbackUrl: "/login"})}>
                        <LogOut />
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}