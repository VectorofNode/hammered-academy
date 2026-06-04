"use server"

import { env } from "process";
import { AuthToken } from "../models/auth_token";
import { PasskeyLoginGrantOptionInfo, PasskeyLoginGrantOptionResponse, PasskeyLoginVerificationInfo, UserRegisterationInfo, UserRegisterationVerificationInfo } from "../models/user";
import { cookies } from "next/headers";

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

export async function getPasskeyLoginOptions(info:PasskeyLoginGrantOptionInfo) {
    const res = await fetch(`${env.API_URL}/auth/login/passkey/options`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        // body: JSON.stringify(info)
    })

    if (!res.ok) {
        throw new Error("Failed to get login options.")
    }

    const data: PasskeyLoginGrantOptionResponse = await res.json()

    const cookieStore = await cookies()
    cookieStore.set("login-challange", data.login_challange, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 300,
        path: "/"
    })

    return data
}

export async function verifyPasskeyLogin(info:PasskeyLoginVerificationInfo) {
    const res = await fetch(`${env.API_URL}/auth/login/passkey/verification`, {
        method: "POST",
        body: JSON.stringify(info),
        headers: {
            "login_challange": info.login_challange,
            'Content-Type': 'application/json'
        }
    })

    if (!res.ok) {
        console.log(await res.json())
        throw new Error("Failed to verify passkey login.")
    }

    const data: AuthToken = await res.json()

    const cookieStore = await cookies()
    cookieStore.set("access_token", data.access_token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 300,
        path: "/"
    })
    cookieStore.set("refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 604800,
        path: "/"
    })
}