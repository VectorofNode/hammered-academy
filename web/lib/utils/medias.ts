'use server'

import { env } from "process";
import { FileInfo } from "../models/file-info";

export async function getFile(uuid:string) {
    const res = await fetch(`${env.API_URL}`)
    const data = await res.json()
}

export async function uploadFile(file: File): Promise<FileInfo> {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(`${env.API_URL}/medias/images`, {
        method: "POST",
        body: formData
    })

    return await res.json()
}