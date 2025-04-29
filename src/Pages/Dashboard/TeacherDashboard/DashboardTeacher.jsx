import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function DashboardTeacher() {
  const { ID } = useParams();
  const [data, setData] = useState({});
  const [courses, setCourses] = useState([]);
  const [Tdec, setTeacherDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Teacher/TeacherDocument/${ID}`, {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch teacher data");

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTeacherData();
  }, [ID]);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/teacher/teacherdocuments`, {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teacherID: data.Teacherdetails }),
      });

      const result = await res.json();
      setTeacherDetails(result.data);
    };

    if (data.Teacherdetails) fetchDetails();
  }, [data]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/Teacher/${ID}/enrolled`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch courses");

        const result = await response.json();
        setCourses(result.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCourses();
  }, [ID]);

  return (
    <div className="ml-60 px-6 py-10 text-white">
      <h1 className="text-3xl font-bold text-white mb-10">Teacher Dashboard</h1>

      {/* Profile Section */}
      <div className="bg-white text-black p-6 rounded-lg shadow-lg mb-10">
        <h2 className="text-2xl font-bold mb-4">Teacher Profile</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <p><span className="font-semibold">Name:</span> {data.Firstname} {data.Lastname}</p>
          <p><span className="font-semibold">Email:</span> {data.Email}</p>
          <p><span className="font-semibold">Phone:</span> {Tdec?.Phone || "N/A"}</p>
          <p><span className="font-semibold">Address:</span> {Tdec?.Address || "N/A"}</p>
          <p><span className="font-semibold">Experience:</span> {Tdec?.Experience || "N/A"} years</p>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-white text-black p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Courses</h2>

        {courses.length === 0 ? (
  <div className="text-center text-gray-600 font-medium">🚫 No courses found for this teacher.</div>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {courses.map(course => (
      <div key={course._id} className="border rounded-lg shadow-md overflow-hidden bg-gray-50">
        <img
          src={course.thumbnailimage}
          alt={course.coursename}
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-bold text-[#1671D8] mb-2 capitalize">{course.coursename}</h3>
          <p className="text-sm text-gray-700 mb-3">{course.description}</p>
          <p className="font-semibold mb-2">
            Price: <span className="text-[#1671D8]">Rs. {course.price}</span>
          </p>
          <p className={`inline-block px-3 py-1 text-sm rounded-full font-semibold ${
            course.isapproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {course.isapproved ? 'Approved' : 'Pending Approval'}
          </p>
        </div>
      </div>
    ))}
  </div>
)}

      </div>
    </div>
  );
}

export default DashboardTeacher;
