import { SectionWithLessons } from "./section"

export interface Course {
    image: string,
    title: string,
    description: string,
    uuid: string
}

export interface CourseFull {
    image: string,
    title: string,
    description: string,
    uuid: string,
    sections: SectionWithLessons[]
}