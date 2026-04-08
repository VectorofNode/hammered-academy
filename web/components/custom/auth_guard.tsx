"use client"

import { signOut, useSession } from "next-auth/react"
import { ReactNode, useEffect } from "react"

interface AuthGuardProps {
    children: ReactNode
}

export function AuthGuard({children}:AuthGuardProps) {
    const {data: session} = useSession()

    useEffect(() => {
        if (session?.error == "RefreshAccessTokenError") {
            signOut({callbackUrl: "/login"})
        }
    }, [session])

    return <>{children}</>
}