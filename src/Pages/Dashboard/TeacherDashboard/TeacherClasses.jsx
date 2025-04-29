import React, { useEffect, useState } from "react";
import Camera from "../Images/Camera.png";
import Clock from "../Images/Clock.png";
import AddClass from "./AddClass";
import { NavLink, useParams } from "react-router-dom";
import YouTube from "react-youtube";

function TeacherClasses() {
  const [showPopup, setShowPopup] = useState(false);
  const { ID } = useParams();
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [Classes, setClasses] = useState([]);
  const [editClassData, setEditClassData] = useState(null); // NEW

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/course/classes/teacher/${ID}`,
          {
            method: "GET",
            credentials: "include",
            cors: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const user = await response.json();
        setData(user.data.classes[0]?.liveClasses || []);
        console.log(user.data);
      } catch (error) {
        setError(error.message); // Handle API error and set the error message
      }
    };
    getData();
  }, [showPopup, ID]);

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
      setClasses(data.data); // Array of courses
    } catch (error) {
      console.error("Error fetching teacher courses:", error);
    }
  };

  useEffect(() => {
    fetchTeacherCourses();
  }, [showPopup]);

  const handleEdit = (classItem, courseId) => {
    setEditClassData({ ...classItem, courseId });
    setShowPopup(true);
  };


  const handleDelete = async (classItem, courseId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${classItem.title}"?`);
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/course/${courseId}/teacher/${ID}/delete-class/${classItem._id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete the class");
      }
  
      const result = await response.json();
      console.log("Class deleted:", result);
  
      // Refetch the course data
      fetchTeacherCourses();
    } catch (error) {
      console.error("Error deleting class:", error);
      alert("Error deleting class: " + error.message);
    }
  };
  

  return (
    <div>
      <div className="ml-60 mt-20 text-white flex flex-col justify-between mr-80">
        <div
          onClick={() => setShowPopup(true)}
          className="absolute right-10 bg-blue-900 p-2 rounded-sm cursor-pointer"
        >
          + ADD CLASS
        </div>

        {showPopup && (
  <AddClass
    onClose={() => {
      setShowPopup(false);
      setEditClassData(null);
    }}
    editData={editClassData} // NEW PROP
  />
)}
        <br />
        <div>
          {Classes.length > 0 && (
            <div className="w-[50%] px-10 mt-10">
              <h2 className="text-2xl text-white font-bold mb-6">
                📚 All Classes by Course
              </h2>
              {Classes.map((course) => (
                <div
                  key={course._id}
                  className="mb-10 border rounded-lg shadow-md bg-white p-6"
                >
                  <h3 className="text-xl font-semibold text-[#1671D8] mb-4">
                    {course.coursename}
                  </h3>

                  {course.liveClasses && course.liveClasses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                      {course.liveClasses.map((classItem) => (
                        <div
                          key={classItem._id}
                          className="border p-4 rounded-lg shadow-sm bg-gray-50 flex flex-col gap-2"
                        >
                        
                          <h4 className="text-lg font-semibold text-gray-800">
                            {classItem.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">
                            {classItem.description}
                          </p>
                          <span
                            className={`inline-block w-fit px-3 py-1 text-xs font-medium rounded-full ${
                              classItem.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : classItem.status === "live"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {classItem.status}
                          </span>
                          <div className="mt-3">
                            <YouTube
                              videoId={classItem.link.split("v=")[1]}
                              opts={{
                                height: "200",
                                width: "100%",
                                playerVars: {
                                  autoplay: 0,
                                },
                              }}
                            />
                          </div>
                          <div className="gap-2 flex">

                          <button
                            className="text-white text-sm px-2 mt-2 w-fit"
                            onClick={() => handleEdit(classItem, course._id)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="text-white bg-red-300 text-sm px-2 mt-2 w-fit"
                            onClick={() => handleDelete(classItem, course._id)}
                          >
                             Delete
                          </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No live classes available for this course.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherClasses;
