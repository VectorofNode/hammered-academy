'use client'

import { Course } from "@/lib/models/course";
import { CourseCard } from "./course-card";
import { useEffect, useState } from "react";
import { getAllCourses } from "@/lib/utils/courses";

export function CourseGrid() {
    const [courses, setCourses] = useState<Course[]>()

    useEffect(() => {
        getAllCourses().then(val => {
            setCourses(val)
            console.log(val)
        })
        console.log(courses)
    }, [])
    return (
        <div className="p-4 grid gap-4 sm:justify-center md:justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(258px,1fr))]">
            {courses?.map((course, id) => 
                <CourseCard 
                    image={course.image} 
                    title={course.title} 
                    description={course.description} 
                    uuid={course.uuid} 
                    key={id}
                />
            )}
        </div>
    )
}