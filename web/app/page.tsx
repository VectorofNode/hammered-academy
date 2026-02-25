import { CourseGrid } from "@/components/custom/course-grid";
import { NavBar } from "@/components/custom/nav-bar";

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="m-4">
        <div className=" text-xl">All Courses</div>
        <CourseGrid courses={[{title: "cc", uuid: "cc", description: "", image: ""}]} />
      </div>
    </>
  );
}
