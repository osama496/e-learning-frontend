import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import YouTube from "react-youtube";

function StudentClasses() {
  const { ID } = useParams();
  const [data, setData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/course/classes/student/${ID}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setData(result.data);
        // Set the first course as selected by default
        if (result.data.courses.length > 0) {
          setSelectedCourse(result.data.courses[0]);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    getData();
  }, [ID]);

  const extractVideoId = (url) => {
    // The link in the data is just "v=ID", so we'll split on '=' and take the second part
    return url.split("=")[1];
  };

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
  };

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 0,
    },
  };

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (!data) {
    return <div className="text-white p-4">Loading...</div>;
  }

  return (
    <div className="ml-60 mt-20 text-white mr-10 p-6">
      <h1 className="text-3xl font-bold mb-8 text-[#1671D8]">My Courses</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Courses List */}
        {!selectedClass && (
          <div className="w-full lg:w-1/3">
            <div className="bg-[#1E293B] rounded-lg p-4 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Your Courses
              </h2>
              <div className="space-y-4">
                {data.courses.map((course) => (
                  <div
                    key={course._id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedCourse?._id === course._id
                        ? "bg-[#1671D8]"
                        : "bg-[#2D3748] hover:bg-[#3B4758]"
                    }`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <h3 className="font-bold">{course.coursename}</h3>
                    <p className="text-sm text-gray-300">
                      {course.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Classes List */}
        {!selectedClass && (
          <div className="w-full lg:w-1/3">
            {selectedCourse && (
              <div className="bg-[#1E293B] rounded-lg p-4 shadow-lg">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  Classes
                </h2>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {selectedCourse.liveClasses.map((classItem, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedClass?.title === classItem.title
                          ? "bg-[#1671D8]"
                          : "bg-[#2D3748] hover:bg-[#3B4758]"
                      }`}
                      onClick={() => handleClassSelect(classItem)}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={classItem.thumbnail}
                          alt="Class thumbnail"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-semibold">{classItem.title}</h3>
                          <p className="text-xs text-gray-300 line-clamp-2">
                            {classItem.description}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              classItem.status === "upcoming"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            } text-white mt-1 inline-block`}
                          >
                            {classItem.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Class Details and Video Player */}
        {selectedClass && 
        <div className="w-[100%] ">
          {selectedClass ? (
            <div className="bg-[#1E293B]  flex-col justify-center rounded-lg p-4 shadow-lg">
              <div
                className="my-3 cursor-pointer"
                onClick={() => setSelectedClass(null)}
              >
                ⏪Back
              </div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Class Details
              </h2>
              <div className="space-y-4 flex justify-center flex-col">
                <div className="w-full flex p-5 items-center">
                  <YouTube
                    videoId={extractVideoId(selectedClass.link)}
                    opts={opts}
                    className="w-[100%] flex justify-center"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedClass.title}</h3>
                  <p className="text-lg text-gray-300 mt-2">
                    {selectedClass.description}
                  </p>
                  <div className="mt-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        selectedClass.status === "upcoming"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      } text-white`}
                    >
                      {selectedClass.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1E293B] rounded-lg p-8 text-center shadow-lg flex items-center justify-center h-full">
              <p className="text-gray-400">Select a class to view details</p>
            </div>
          )}
        </div>}
      </div>
    </div>
  );
}

export default StudentClasses;
