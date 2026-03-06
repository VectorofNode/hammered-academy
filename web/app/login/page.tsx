"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import Image from "next/image"

export default function Page() {
    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Card>
                <CardHeader className="text-2xl">Login</CardHeader>
                <CardContent>
                    <Button onClick={() => signIn("google")}>
                        Login With Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}