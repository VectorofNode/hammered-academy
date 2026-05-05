"use server"

import { env } from "process";
import { Section, SectionCreate } from "../models/section";

export async function createSection(section:SectionCreate, accessToken: string): Promise<Section> {
    const res = await fetch(`${env.API_URL}/sections`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(section),
        method: "POST"
    })

    return await res.json()
}

export async function deleteSection(section:SectionCreate, accessToken:string) {
    await fetch(`${env.API_URL}/sections/${section.course_uuid}/${section.order}`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        method: "DELETE"
    })
}