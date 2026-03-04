'use server'

import { env } from "process"
import { Course, CourseFull } from "../models/course"
import { notFound } from "next/navigation"

export async function getAllCourses(offset: number = 0, limit: number = 100): Promise<Course[]> {
    const res = await fetch(`${env.API_URL}/courses?offset=${offset}&limit=${limit}`)
    return res.json()
}

export async function getCoursesByUuid(uuid:string): Promise<Course> {
    const res = await fetch(`${env.API_URL}/courses/${uuid}`)
    if (res.status == 404) {
        notFound()
    }

    return res.json()
}

export async function getFullCourseByUuid(uuid:string): Promise<CourseFull> {
    const res = await fetch(`${env.API_URL}/courses/${uuid}/curriculum`)
    if (res.status == 404) {
        notFound()
    }

    return res.json()
}