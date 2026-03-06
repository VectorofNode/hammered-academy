import { useSession } from "next-auth/react";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { PopcornIcon, User } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";

export function UserInfoPopover() {
    const {data: session} = useSession()

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
            </PopoverContent>
        </Popover>
    )
}