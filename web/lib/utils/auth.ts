"use server"

import { env } from "process";
import { AuthToken } from "../models/auth_token";
import { UserRegisterationInfo, UserRegisterationVerificationInfo } from "../models/user";

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

export async function getPasskeySignupOptions(info: UserRegisterationInfo) {
    const res = await fetch(`${env.API_URL}/auth/register/passkey`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(info)
    })

    if (!res.ok) {
        throw new Error("Failed to get registeration info.")
    }

    return await res.json()
}

export async function verifyPasskeyRegisteration(verify_info: UserRegisterationVerificationInfo) {
    const verifyRes = await fetch(`${env.API_URL}/auth/register/passkey/verification`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(verify_info)
    })

    if (!verifyRes.ok) {
        throw new Error("Failed to verify passkey.");
    }
}