import { Course } from "@/lib/models/course";
import { CourseCard } from "./course-card";

interface CourseGridProps {
    courses: Course[]
}

export function CourseGrid({courses}: CourseGridProps) {
    return (
        <div className="p-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {courses.map((course, id) => 
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