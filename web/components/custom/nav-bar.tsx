import { NavLink } from "@/lib/models/nav-link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import Link from "next/link";
import { Button } from "../ui/button";
import { LoginButton } from "./login-button";
import { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const links: NavLink[] = [
    {
        name: "Home",
        href: "/"
    },
    {
        name: "Studio",
        href: "/studio"
    }
]

export function NavBar({children, className, ...props }: ComponentProps<"div">) {
    return (
        <>
            <div className={cn("mt-2 ml-4 mr-4 flex flex-row space-x-2", className)} {...props}>
                <div className="w-full">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {
                                links.map((link, index) => 
                                    <NavigationMenuItem key={index}>
                                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                            <Link href={link.href}>{link.name}</Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                )
                            }
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div>{children}</div>
                <LoginButton />
            </div>
        </>
    )
}