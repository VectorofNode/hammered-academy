"use server"

import { env } from "process";

export async function verifyToken(id_token:string) {
    const res = await fetch(`${env.API_URL}/auth/google`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ token: id_token })
    })

    if (res.ok) {
        const data = await res.json()
        return data.access_token
    } else {
        throw new Error("Error on verifying google account")
    }
}