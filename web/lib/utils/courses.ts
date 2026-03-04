'use server'

import { env } from "process"
import { Course } from "../models/course"

export async function getAllCourses(offset: number = 0, limit: number = 100): Promise<Course[]> {
    const res = await fetch(`${env.API_URL}/courses?offset=${offset}&limit=${limit}`)
    return res.json()
}