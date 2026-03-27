import { Lessson } from "./lesson"

export interface Section {
    uuid: string,
    title: string,
    order: number
}

export interface SectionCreate {
    course_uuid: string,
    title: string,
    order: number
}

export interface SectionWithLessons {
    uuid: string,
    title: string,
    order: number,
    lessons: Lessson[]
}