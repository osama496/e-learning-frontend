import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Withdrawal from "./Withdrawal";
import { TbMessage2Star } from "react-icons/tb";

function DashboardTeacher() {
  const { ID } = useParams();
  const [activeTab, setActiveTab] = useState('Details');
  const [data, setdata] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState([]);
  const [popup, setPopup] = useState(false);
  const [notification, setNotification] = useState(false);
  const [amount, setAmount] = useState(0);
  const [subjectForm, setsubjectForm] = useState('Math');
  const [Tdec, setTeacherDetails] = useState(null);
  const [starCount, setStar] = useState(5);
  const [formPopup, setFormPopup] = useState(false);

  const price = {
    math: 700,
    physics: 800,
    computer: 1000,
    chemistry: 600,
    biology: 500,
  };

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Teacher/TeacherDocument/${ID}`, {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const user = await response.json();
        setdata(user.data);
      } catch (error) {
        setError(error.message);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const Data = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/teacher/teacherdocuments`, {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teacherID: data.Teacherdetails }),
      });
      const res = await Data.json();
      setTeacherDetails(res.data);
    }

    if (data.Teacherdetails) getData();
  }, [data]);

  useEffect(() => {
    const getAmount = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/teacher/${ID}/balance`, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const user = await response.json();
        setAmount(user.data.newTeacher.Balance);
      } catch (error) {
        console.log(error);
      }
    };
    getAmount();
  }, [popup]); // run when popup changes

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/Teacher/${ID}/enrolled`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const res = await response.json();
        setCourses(res.data);
      } catch (error) {
        setError(error.message);
      }
    };
    getCourses();
  }, []);

  return (
    <>
      <div className="m-5 ml-60 text-white flex flex-col gap-10">
        {/* Tabs */}
        <div className="text-[1.2rem] w-[32rem] flex gap-20 items-center">
          <div
            onClick={() => setActiveTab('Details')}
            className={`p-4 rounded-lg cursor-pointer transition-colors ${activeTab === 'Details' ? 'bg-[#1671D8]' : 'bg-gray-500'}`}
          >
            Details
          </div>
          <div
            onClick={() => setActiveTab('Remuneration')}
            className={`p-4 rounded-lg cursor-pointer transition-colors ${activeTab === 'Remuneration' ? 'bg-[#1671D8]' : 'bg-gray-500'}`}
          >
            Remuneration
          </div>
        </div>

        <hr className="border-gray-400" />

        {/* Content based on activeTab */}
        {activeTab === 'Details' && (
          <div className="flex flex-wrap gap-20">
            <div className="flex flex-col gap-6">
              <p>Name: <span className="text-black font-semibold">{data.Firstname} {data.Lastname}</span></p>
              <p>Email: <span className="text-black font-semibold">{data.Email}</span></p>
              <p>Phone: <span className="text-black font-semibold">{Tdec?.Phone}</span></p>
              <p>Address: <span className="text-black font-semibold">{Tdec?.Address}</span></p>
              <p>Experience: <span className="text-black font-semibold">{Tdec?.Experience} years</span></p>
            </div>

            <div className="flex flex-col gap-5">
              <p className="bg-[#1671D8] py-2 px-4 w-fit rounded-md font-semibold">
                Courses
              </p>

              {courses.length === 0 ? (
                <p className="text-black font-medium">No course found.</p>
              ) : (
                courses.filter((course) => course.isapproved).map((course) => (
                  <p key={course._id} className="py-2 px-4 rounded-lg w-fit bg-gray-100 text-black">
                    {course.coursename}:{" "}
                    <span className="font-semibold">
                      {"[ "}
                      {course.schedule.map(days => (
                        `${daysOfWeek[days.day]} ${Math.floor(days.starttime / 60)}:${days.starttime % 60 === 0 ? "00" : days.starttime % 60} - ${Math.floor(days.endtime / 60)}:${days.endtime % 60 === 0 ? "00" : days.endtime % 60}`
                      )).join(", ")}
                      {" ]"}
                    </span>
                    <span className="text-[#1671D8] font-bold">
                      {" => "} Rs. {price[course.coursename]} per student / per month
                    </span>
                  </p>
                ))
              )}
            </div>

            <div className="ml-28"></div>
          </div>
        )}

        {activeTab === 'Remuneration' && (
          <div className="text-black text-xl">
            <p>Balance: <span className="font-semibold text-[#1671D8]">Rs. {amount}</span></p>

            <button
              onClick={() => setPopup(true)}
              className="bg-[#1671D8] hover:bg-[#145db2] mt-6 rounded-md text-white font-semibold px-4 py-2 w-[200px] text-center h-20"
            >
              Withdraw Balance
            </button>

          </div>
        )}

        {/* Popups */}
        {popup && <Withdrawal onClose={() => setPopup(false)} TA={amount} />}

        {formPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-[#5be0de] text-black w-[70vw] px-14 py-10 rounded-md shadow-lg">
              <p className="text-3xl font-bold mb-2">Teacher Feedback Form</p>
              <p className="border-b-2 py-2 mb-6">We highly appreciate your involvement. Please help us improve by filling out this teacher feedback form. Thank you!</p>

              <div className="flex flex-col gap-4 mb-6">
                <label className="font-medium">Full Name</label>
                <input type="text" className="p-3 rounded-md border border-gray-400" placeholder="Teacher / Instructor Name" />

                <label className="font-medium">Course Name</label>
                <input type="text" className="p-3 rounded-md border border-gray-400" placeholder="Course Name" />

                <label className="font-medium">Number of Years Teaching?</label>
                <input type="text" className="p-3 rounded-md border border-gray-400" placeholder="In years" />
              </div>

              <div className="py-4 flex flex-col items-center">
                <p className="pb-4 text-center font-medium">Do you have suggestions on what we can do to provide you with a better service?</p>
                <textarea className="rounded-md w-[80%] h-32 p-3 border border-gray-400" placeholder="Type here ..."></textarea>
              </div>

              <div className="flex justify-center mt-6">
                <button className="bg-[#1671D8] hover:bg-[#145db2] text-white p-3 rounded-md w-[10rem] transition-colors">
                  Submit Form
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DashboardTeacher;
