"use client"

import { AccountWelcome } from "@/components/custom/account-welcome";
import { CourseGrid } from "@/components/custom/course-grid";
import { NavBar } from "@/components/custom/nav-bar";

export default function Home() {
  return (
    <>
      <NavBar />
      <AccountWelcome />
      <div className="m-4">
        <div className="text-xl">All Courses</div>
        <CourseGrid />
      </div>
    </>
  );
}
