"use client"

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";

export function AccountWelcome() {
    const {data: session} = useSession()

    return (
        <div className="flex flex-row p-16 items-center space-x-4">
            <Avatar size="lg">
                <AvatarImage src={session?.user?.image?? ""} />
                <AvatarFallback>
                    <User />
                </AvatarFallback>
            </Avatar>
            <div className="text-4xl">Hi, {session?.user?.name}</div>
        </div>
    )
}