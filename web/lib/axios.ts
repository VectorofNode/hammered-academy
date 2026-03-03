'use server'

import { Axios } from "axios";
import { env } from "process";
import { Course } from "./models/course";

const instance = new Axios({
    baseURL: env.API_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
})

export async function getCourses(): Promise<Course[]> {
    const courses = await instance.get("/courses?offset=0&limit=100", {headers: {"Content-Type": "application/json"}})
    console.log(courses.data)
    console.log(courses.headers["Content-Type"])
    return JSON.parse(courses.data) as Course[]
}