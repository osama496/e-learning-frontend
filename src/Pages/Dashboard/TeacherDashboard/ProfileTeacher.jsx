import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ProfileTeacher() {
  const { ID } = useParams();
  const [data, setData] = useState({});
  const [Tdec, setTeacherDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    Firstname: "",
    Lastname: "",
    Email: "",
    Phone: "",
    Address: "",
    Experience: "",
  });

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Teacher/TeacherDocument/${ID}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        setData(result.data);
        setForm((prev) => ({
          ...prev,
          Firstname: result.data.Firstname,
          Lastname: result.data.Lastname,
          Email: result.data.Email
        }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchTeacherData();
  }, [ID]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
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
        setForm((prev) => ({
          ...prev,
          Phone: result.data.Phone || "",
          Address: result.data.Address || "",
          Experience: result.data.Experience || ""
        }));
      } catch (err) {
        console.error(err);
      }
    };

    if (data.Teacherdetails) fetchDetails();
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // 1. Update profile data
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/teacher/update-profile/${ID}`, {
        method: "PUT",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Firstname: form.Firstname,
          Lastname: form.Lastname,
          Email: form.Email,
        }),
      });

      // 2. Update document data
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/teacher/update-documents/${ID}`, {
        method: "PUT",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Phone: form.Phone,
          Address: form.Address,
          Experience: form.Experience,
        }),
      });

      alert("Profile updated successfully");
      setEditMode(false);
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  return (
    <div className="ml-60 px-6 py-10 text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Teacher Profile</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {["Firstname", "Lastname", "Email", "Phone", "Address", "Experience"].map((field) => (
            <p key={field}>
              <span className="font-semibold">{field}:</span>{" "}
              {editMode ? (
                <input
                  type="text"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-2 py-1 ml-2"
                />
              ) : (
                <span className="ml-2">{form[field] || "N/A"} {field === "Experience" ? "years" : ""}</span>
              )}
            </p>
          ))}
        </div>

        {editMode && (
          <div className="mt-6">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
