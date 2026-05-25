"use server"

import { env } from "process";
import { AuthToken } from "../models/auth_token";

export async function verifyToken(id_token:string) {
    const res = await fetch(`${env.API_URL}/auth/google`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ token: id_token })
    })

    if (res.ok) {
        const data: AuthToken = await res.json()
        return data
    } else {
        throw new Error("Error on verifying google account")
    }
}

export async function refreshToken(refresh_token:string) {
    const res = await fetch(`${env.API_URL}/auth/refresh`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: refresh_token
    })

    if (res.ok) {
        const data: AuthToken = await res.json()
        return data
    } else {
        throw new Error("Error on refreshing token")
    }
}