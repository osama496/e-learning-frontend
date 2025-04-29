import React, { useState, useEffect } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import logo from "../../Images/logo.svg";

const Admin = () => {
  const { data } = useParams();
  const navigator = useNavigate();

  const [StudentData, setStudentData] = useState([]);
  const [TeacherData, setTeacherData] = useState([]);
  const [adminID, setAdminID] = useState(null);
  const [error, setErrors] = useState("");
  const [allmsg, setAllMsg] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getAllMsg = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/messages/all`,
          {
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        setAllMsg(data.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    getAllMsg();
  }, []);

  const Approval = async (ID, type, approve) => {
    try {
      const data = { Isapproved: approve };
      await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/admin/${adminID}/approve/${type}/${ID}`,
        {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (type === "student") {
        setStudentData((prev) => prev.filter((item) => item._id !== ID));
      } else if (type === "teacher") {
        setTeacherData((prev) => prev.filter((item) => item._id !== ID));
      }
    } catch (error) {
      setErrors(error.message);
    }
  };

  const docDetails = (type, ID) => {
    navigator(`/VarifyDoc/${type}/${adminID}/${ID}`);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/${data}/approve`,
          {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        setStudentData(result.data.studentsforApproval);
        setTeacherData(result.data.teachersforApproval);
        setAdminID(result.data.admin._id);
      } catch (err) {
        console.log(err.message);
      }
    };
    getData();
  }, [data]);

  console.log("TeacherData", TeacherData);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#042439] to-[#0a3c5c] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 md:px-10 bg-[#031d30] shadow-md">
        <NavLink to="/" className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-10 md:w-14" />
          <h1 className="text-xl md:text-2xl font-bold text-[#4E84C1]">
            Shiksharthee
          </h1>
        </NavLink>
        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer">
            <IoIosNotificationsOutline className="h-8 w-8 text-white" />
            <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </div>
          <button
            onClick={() => navigator("/")}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Top Buttons */}
      <div className="flex flex-col md:flex-row justify-end gap-6 p-6 relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="bg-green-600 hover:bg-green-700 text-white px-1 py-2 rounded shadow"
        >
          Messages
        </button>
        <button
          onClick={() => navigator(`/admin/course/${data}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded shadow whitespace-nowrap px-4"
          style={{ minWidth: "150px" }}
        >
          Course Requests
        </button>
      </div>

      {/* Messages */}
      {open && (
        <div className="bg-gray-700 rounded-lg shadow-lg mx-6 md:mx-10 p-6">
          <h2 className="text-2xl mb-4 font-semibold">All Messages</h2>
          <div className="space-y-4">
            {allmsg.map((msg, index) => (
              <div
                key={index}
                className="bg-gray-600 p-4 rounded hover:bg-gray-500 transition"
              >
                <p>
                  <span className="font-semibold">Name:</span> {msg.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {msg.email}
                </p>
                <p>
                  <span className="font-semibold">Message:</span> {msg.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-10">
        {/* Student Requests */}
        <div className="bg-[#0b2f47] p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-center text-xl font-semibold mb-6 border-b border-white pb-2">
            Student Requests
          </h2>

          {/* Check if there are any students with a 'pending' approval status */}
          {StudentData.some((s) => s.Isapproved === "pending") ? (
            StudentData.filter((s) => s.Isapproved === "pending").map(
              (student) => (
                <div
                  key={student._id}
                  onClick={() => docDetails("student", student._id)}
                  className="bg-blue-700 hover:bg-blue-600 rounded-lg p-4 mb-4 cursor-pointer transition"
                >
                  <h3 className="text-lg font-bold">
                    {student.Firstname} {student.Lastname}
                  </h3>
                  <p>
                    Status: <span className="italic">{student.Isapproved}</span>
                  </p>
                </div>
              )
            )
          ) : (
            <p className="text-center text-gray-300">No pending students</p>
          )}
        </div>

        {/* Teacher Requests */}
        <div className="bg-[#0b2f47] p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-center text-xl font-semibold mb-6 border-b border-white pb-2">
            Teacher Requests
          </h2>

          {/* Check if there are any teachers with a 'pending' approval status */}
          {TeacherData.some((t) => t.Isapproved === "pending") ? (
            TeacherData.filter((t) => t.Isapproved === "pending").map(
              (teacher) => (
                <div
                  key={teacher._id}
                  onClick={() => docDetails("teacher", teacher._id)}
                  className="bg-blue-700 hover:bg-blue-600 rounded-lg p-4 mb-4 cursor-pointer transition"
                >
                  <h3 className="text-lg font-bold">
                    {teacher.Firstname} {teacher.Lastname}
                  </h3>
                  <p>
                    Status: <span className="italic">{teacher.Isapproved}</span>
                  </p>
                </div>
              )
            )
          ) : (
            <p className="text-center text-gray-300">No pending teachers</p>
          )}
        </div>

        {/* Rejected Requests */}
        <div className="bg-[#0b2f47] p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-center text-xl font-semibold mb-6 border-b border-white pb-2">
            Rejected Requests
          </h2>

          {/* Check if there are any rejected users */}
          {[...TeacherData, ...StudentData].some(
            (u) => u.Isapproved === "rejected"
          ) ? (
            [...TeacherData, ...StudentData]
              .filter((u) => u.Isapproved === "rejected")
              .map((user) => (
                <div
                  key={user._id}
                  onClick={() => docDetails(user.role || "teacher", user._id)}
                  className="bg-red-700 hover:bg-red-600 rounded-lg p-4 mb-4 cursor-pointer transition"
                >
                  <h3 className="text-lg font-bold">
                    {user.Firstname} {user.Lastname}
                  </h3>
                  <p>
                    Remark: <span className="italic">{user.Remarks}</span>
                  </p>
                </div>
              ))
          ) : (
            <p className="text-center text-gray-300">No rejected requests</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Admin;
