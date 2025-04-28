import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function VarifyDoc() {
  const { type, adminID, ID } = useParams();
  const [data, setData] = useState(null);
  const navigator = useNavigate();
  const [value, setValue] = useState("");
  const [previewImage, setPreviewImage] = useState(null); // 👈 For full image preview

  const handleMessage = (event) => {
    setValue(event.target.value);
  };

  const Approval = async (id, type, approve, email) => {
    try {
      const bodyData = {
        Isapproved: approve,
        remarks: value,
        email: email,
      };

      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/${adminID}/approve/${type}/${id}`,
        {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      );

      navigator(`/admin/${adminID}`);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const docData = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/${adminID}/documents/${type}/${ID}`,
          {
            method: "GET",
            mode: "cors",
            credentials: "include",
          }
        );
        const response = await docData.json();
        setData(response.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    getData();
  }, []);

  const renderUserDetails = () => {
    const user = type === "student" ? data?.theStudent : data?.theTeacher;
    const docs = type === "student" ? data?.studentDocs : data?.teacherDocs;

    return (
      <>
        <div className="flex flex-col items-center justify-center mt-5 space-y-3 text-gray-300">
          <p className="text-lg sm:text-xl font-semibold">
            Full Name: {user.Firstname} {user.Lastname}
          </p>
          <p className="text-lg sm:text-xl font-semibold">Phone: {docs.Phone}</p>
          {type === "student" ? (
            <p className="text-lg sm:text-xl font-semibold">
              Highest Education: {docs.Highesteducation}
            </p>
          ) : (
            <p className="text-lg sm:text-xl font-semibold">
              Experience: {docs.Experience} years
            </p>
          )}
          <p className="text-lg sm:text-xl font-semibold">Address: {docs.Address}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-10 px-4">
          {type === "student" && (
            <>
              {renderDocCard(docs.Secondary, "10th Marksheet", docs.SecondaryMarks)}
              {renderDocCard(docs.Higher, "12th Marksheet", docs.HigherMarks)}
              {renderDocCard(docs.Aadhaar, "Aadhar Card")}
            </>
          )}
          {type === "teacher" && (
            <>
              {renderDocCard(docs.Secondary, "10th Marksheet", docs.SecondaryMarks)}
              {renderDocCard(docs.Higher, "12th Marksheet", docs.HigherMarks)}
              {renderDocCard(docs.UG, "U.G. Marksheet", docs.UGmarks)}
              {renderDocCard(docs.PG, "P.G. Marksheet", docs.PGmarks)}
              {renderDocCard(docs.Aadhaar, "Aadhar Card")}
            </>
          )}
        </div>

        <div className="flex flex-col items-center gap-5 my-10 px-4">
          <textarea
            value={value}
            onChange={handleMessage}
            className="w-full max-w-md h-40 p-4 text-gray-900 rounded-lg shadow focus:outline-none"
            placeholder="Write reason for rejecting application..."
          />
          <div className="flex flex-wrap justify-center gap-8 mt-5">
            {["approved", "rejected", "reupload"].map((status) => (
              <button
                key={status}
                onClick={() => Approval(user._id, type, status, user.Email)}
                className={`px py-2 rounded-md text-lg font-bold text-white transition-transform transform hover:scale-105 ${
                  status === "approved"
                    ? "bg-green-600 hover:bg-green-800"
                    : status === "rejected"
                    ? "bg-red-600 hover:bg-red-800"
                    : "bg-blue-600 hover:bg-blue-800"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}!
              </button>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderDocCard = (imgSrc, title, marks) => (
    <div className="flex flex-col items-center bg-[#1f2937] rounded-lg shadow-lg p-4 w-72 cursor-pointer">
      <img
        src={imgSrc}
        alt={title}
        className="rounded-md object-cover h-48 w-full hover:scale-105 transition-transform"
        onClick={() => setPreviewImage(imgSrc)} // 👈 Open image preview on click
      />
      <h3 className="text-white mt-3 font-semibold text-center">{title}</h3>
      {marks && (
        <p className="text-[#8DE855] mt-1 text-center">
          Marks: {marks}%
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0e1a2b] pb-20 relative">
      <nav className="h-16 sm:h-20 w-full bg-[#042439] flex justify-between items-center px-6 sm:px-10 md:px-16">
        <h1
          onClick={() => navigator(`/admin/${adminID}`)}
          className="text-xl sm:text-2xl text-blue-400 font-bold cursor-pointer hover:underline"
        >
          ◀ Back
        </h1>
        <h2 className="text-2xl sm:text-3xl text-white font-bold">
          Document Details
        </h2>
        <button
          onClick={() => navigator("/")}
          className="bg-blue-500 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-white font-semibold"
        >
          Logout
        </button>
      </nav>

      {data ? renderUserDetails() : (
        <div className="text-white text-center mt-20 text-xl">
          Loading...
        </div>
      )}

      {/* Full Screen Image Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Full Preview"
            className="max-h-[90%] max-w-[90%] object-contain rounded-lg"
          />
          <button
            className="absolute top-5 right-5 bg-red-500 hover:bg-red-700 text-white p-2 rounded-full text-xl"
            onClick={(e) => {
              e.stopPropagation(); // Don't trigger outside click
              setPreviewImage(null);
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default VarifyDoc;
