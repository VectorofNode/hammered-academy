'use server'

import { NextRequest, NextResponse } from "next/server";
import { env } from "process";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("file")

    if (!filename) return new NextResponse("Missing file name", {status: 400})

    const backendUrl = `${env.API_URL}/medias/images/${filename}`

    const data = await fetch(backendUrl)
    if (!data.ok) {
        return new NextResponse("File not found", {status: 404})
    }

    const blob = await data.blob()
    return new NextResponse(blob, {
        'headers': {
            'Content-Type': data.headers.get('Content-Type') || 'image/*',
            'Cache-Control': 'public, max-age=31536000, immutable',
        }
    })
}