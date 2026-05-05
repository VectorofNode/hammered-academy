'use server'

import { env } from "process"
import { Course, CourseCreate, CourseFull } from "../models/course"
import { notFound } from "next/navigation"
import { SectionCreate, SectionCreateBatch, SectionWithLessons } from "../models/section"

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

export async function deleteCoursesByUuid(uuid:string, accessToken: string) {
    const res = await fetch(`${env.API_URL}/courses/${uuid}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    })
    if (res.status == 404) {
        notFound()
    }
}

export async function getFullCourseByUuid(uuid:string): Promise<CourseFull> {
    const res = await fetch(`${env.API_URL}/courses/${uuid}/curriculum`)
    if (res.status == 404) {
        notFound()
    }

    return res.json()
}

export async function createNewCourse(course:CourseCreate, accessToken: string): Promise<Course> {
    const res = await fetch(`${env.API_URL}/courses`, {
        method: "POST",
        body: JSON.stringify(course),
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    })

    if (res.status != 200) {
        throw new Error(`${res.status}: ${res.statusText}`)
    }

    return res.json()
}

export async function updateCourse(course:CourseCreate, accessToken: string): Promise<Course> {
    const res = await fetch(`${env.API_URL}/courses`, {
        method: "PUT",
        body: JSON.stringify(course),
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    })

    if (res.status != 200) {
        throw new Error(`${res.status}: ${res.statusText}`)
    }

    return res.json()
}

export async function createSectionsForCourse(course_uuid: string, sections: SectionCreate[], accessToken: string): Promise<SectionWithLessons> {
    sections.every(val => val.course_uuid = course_uuid)
    const sectionBatch: SectionCreateBatch = {
        course_uuid: course_uuid,
        sections: sections
    }

    console.log(sectionBatch)

    const res = await fetch(`${env.API_URL}/sections/batch`, {
        method: "POST",
        body: JSON.stringify(sectionBatch),
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    })

    if (res.status != 200) {
        throw new Error(`${res.status}: ${res.statusText}`)
    }

    return res.json()
}

export async function getTeachingCourses(accessToken: string): Promise<Course[]> {
    const res = await fetch(`${env.API_URL}/courses/teaching`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    })

    if (res.status != 200) {
        throw new Error(`${res.status}: ${res.statusText}`)
    }

    return res.json()
}