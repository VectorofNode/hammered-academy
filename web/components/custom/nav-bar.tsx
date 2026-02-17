import { NavLink } from "@/lib/models/nav-link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import Link from "next/link";
import { Button } from "../ui/button";

const links: NavLink[] = [
    {
        name: "Home",
        href: "/"
    }
]

export function NavBar() {
    return (
        <>
            <div className="mt-2 ml-4 mr-4 flex flex-row">
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
                <Button>Login</Button>
            </div>
        </>
    )
}