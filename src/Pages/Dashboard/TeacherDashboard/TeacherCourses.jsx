import React, { useEffect, useState } from "react";
import Popup from "./Popup";

function TeacherCourses() {
  const [showPopup, setShowPopup] = useState(false);
  const [subject, setSubject] = useState("");
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const createCourse = (sub) => {
    setShowPopup(true);
    setSubject(sub);
  };

  const fetchTeacherCourses = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/course/teacher/courses`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch teacher courses");
      }

      const data = await response.json();
      console.log("Teacher Courses", data.data);
      setCourses(data.data); // Array of courses
    } catch (error) {
      console.error("Error fetching teacher courses:", error);
    }
  };

  useEffect(() => {
    fetchTeacherCourses();
  }, [showPopup]);

  const editCourse = (course) => {
    setEditingCourse(course);
    setSubject(course.coursename); // Optional, if you want to show it on top
    setShowPopup(true);
  };

  return (
    <>
      <div className="flex gap-10 pl-48 mx-48 mt-11 flex-wrap justify-center">
        <div
          className="subject cursor-pointer"
          onClick={() => createCourse("Physics")}
        >
          <img
            src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/8e9bf690d23d886f63466a814cfbec78187f91d2"
            alt="Physics"
          />
          <p>Physics</p>
        </div>
        <div
          className="subject cursor-pointer"
          onClick={() => createCourse("Chemistry")}
        >
          <img
            src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/3e546b344774eb0235acc6bf6dad7814a59d6e95"
            alt="Chemistry"
          />
          <p>Chemistry</p>
        </div>
        <div
          className="subject cursor-pointer"
          onClick={() => createCourse("Biology")}
        >
          <img
            src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/28ac70002ae0a676d9cfb0f298f3e453d12b5555"
            alt="Zoology"
          />
          <p>Biology</p>
        </div>
        <div
          className="subject cursor-pointer"
          onClick={() => createCourse("Math")}
        >
          <img
            src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/61930117e428a1f0f7268f888a84145f93aa0664"
            alt="Math"
          />
          <p>Math</p>
        </div>
        <div
          className="subject cursor-pointer"
          onClick={() => createCourse("Computer")}
        >
          <img
            src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/a64c93efe984ab29f1dfb9e8d8accd9ba449f272"
            alt="Computer"
          />
          <p>Computer</p>
        </div>
        <div
          className="subject cursor-pointer"
          onClick={() => createCourse("")}
        >
          <p>Add Course</p>
        </div>
      </div>

      {/* Popup for creating a new course */}
      {showPopup && (
        <Popup
          onClose={() => {
            setShowPopup(false);
            setEditingCourse(null);
          }}
          subject={subject}
          existingCourse={editingCourse}
        />
      )}

      {/* Display the courses in a card format */}
      <h1 className="text-center  text-blue-500 font-bold text-2xl mt-10">
        Your All Courses{" "}
      </h1>
      <div className="courses-container mt-10 flex flex-wrap justify-center gap-8">
        {courses.map((course) => (
          <div
            key={course._id}
            className="course-card p-6 bg-white shadow-lg rounded-lg max-w-sm w-full"
          >
          
            <img
              src={course.thumbnailimage}
              alt={course.coursename}
              className="w-full h-40 object-contain rounded-t-lg mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{course.coursename}</h3>
            <p className="text-sm text-gray-500 mb-2">{course.description}</p>
            <p className="text-lg font-medium mb-2">
              Price: ${course.price || "Free"}
            </p>
            <p className="text-sm text-blue-500 font-bold mb-2">
              Status: {course.isapproved ? "Approved" : "Pending Approval"}
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Total Lectures: {course.liveClasses.length || 0}
            </p>
            <button onClick={() => editCourse(course)} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
              Edit
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default TeacherCourses;
