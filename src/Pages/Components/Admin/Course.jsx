import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosNotificationsOutline } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

const Course = () => {
  const [courseReq, setCourseReq] = useState([]);
  const { data } = useParams();
  const navigator = useNavigate();

  useEffect(() => {
    const fetchCourseRequests = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/${data}/approve/course`, {
          withCredentials: true,
        });
        setCourseReq(response.data.data || []);
      } catch (error) {
        console.error('Error fetching course requests:', error);
      }
    };
    fetchCourseRequests();
  }, [data]);

  const handleAccept = async (id, info) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/${data}/approve/course/${id}`,
        {
          Isapproved: true,
          email: info.Email,
          Firstname: info.enrolledteacher,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        setCourseReq(courseReq.filter(req => req._id !== id));
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error approving course request:', error);
    }
  };

  const handleReject = async (id, info) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/${data}/approve/course/${id}`,
        {
          Isapproved: false,
          email: info.Email,
          Firstname: info.enrolledteacher,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        setCourseReq(courseReq.filter(req => req._id !== id));
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error rejecting course request:', error);
    }
  };

  return (
    <div className='min-h-screen bg-[#0c1a25] text-white'>
      {/* Navbar */}
      <nav className="h-20 w-full bg-[#042439] flex justify-between items-center px-8">
        <h1 onClick={() => navigator(`/admin/${data}`)} className="text-2xl text-blue-500 font-bold cursor-pointer">
          ◀ Back
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <IoIosNotificationsOutline className="h-7 w-7 text-white" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </div>
          <button onClick={() => navigator('/')} className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 rounded-md">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6">
        {courseReq.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {courseReq.map((req, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded-xl shadow-lg flex flex-col justify-between">
                <img src={req.thumbnailimage} alt="Course Thumbnail" className="rounded-md mb-4 w-full h-40 object-cover" />
                <h2 className="text-xl font-semibold text-yellow-400 mb-1">{req.coursename}</h2>
                <p className="text-sm text-gray-300 mb-2">{req.description}</p>
                <p className="text-sm text-gray-400 mb-2">Teacher: <span className="font-semibold text-white">{req.enrolledteacher?.Firstname} {req.enrolledteacher?.Lastname}</span></p>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleAccept(req._id, req.enrolledteacher)}
                    className="bg-green-600 hover:bg-green-700 w-full py-1 rounded text-white"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req._id, req.enrolledteacher)}
                    className="bg-red-600 hover:bg-red-700 w-full py-1 rounded text-white"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20">
            <img src="https://www.svgrepo.com/show/79149/no-data.svg" alt="No Course" className="w-40 mb-4" />
            <p className="text-xl text-gray-300">No course found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Course;
