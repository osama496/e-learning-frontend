import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { uploadImageToCloudinary } from '../../../Utils/Clodinary';

function AddClass({ onClose , editData }) {
  const { ID } = useParams();
  const [courses, setCourses] = useState([]);
  const [CourseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setCourseId(editData.courseId);
      setTitle(editData.title);
      setDescription(editData.description);
      setLink(editData.link);
      setThumbnail(null); // Keep null unless updating image
    }
  }, [editData]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/Teacher/${ID}/enrolled`, {
          credentials: "include",
          headers: { 'Content-Type': 'application/json' },
        });

        const res = await response.json();
        const approvedCourses = res.data.filter(course => course.isapproved);

        setCourses(approvedCourses);
        if (approvedCourses.length > 0) setCourseId(approvedCourses[0]._id);
      } catch (err) {
        setError('Failed to fetch courses');
      }
    };

    fetchCourses();
  }, [ID]);



  const handleSubmit = async () => {
    if (!title || !description) {
      alert("Title and description are required");
      return;
    }
  
    setLoading(true);
  
    try {
      let imageUrl = editData?.thumbnail || "";
      if (thumbnail) {
        imageUrl = await uploadImageToCloudinary(thumbnail);
      }
  
      const payload = {
        title,
        link,
        thumbnail: imageUrl,
        description,
        status: editData ? editData.status : "upcoming",
      };
  
      const url = editData
        ? `${import.meta.env.VITE_API_BASE_URL}/api/course/${CourseId}/teacher/${ID}/update-class/${editData._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/course/${CourseId}/teacher/${ID}/add-class`;
  
      const method = editData ? "PUT" : "POST";
  
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const result = await res.json();
      alert(result.message);
  
      if (res.ok) onClose();
    } catch (err) {
      setError("Failed to submit class");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-2xl bg-white text-gray-900 rounded-lg shadow-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-lg font-bold text-gray-500 hover:text-red-500">
          ✖️
        </button>

        <div className="px-6 py-5 border-b">
          <h2 className="text-2xl font-semibold">Add New Class</h2>
        </div>

        {courses?.length < 0 ? (
          <div className="px-6 py-10 text-center text-red-500 font-semibold text-lg">
            No approved course available. Please wait for admin approval.
          </div>
        ) : (
          <>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block font-medium">Select Course:</label>
                <select
                  value={CourseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                >
                  {courses?.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.coursename.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium">Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="block font-medium">Description:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border rounded px-3 py-2 mt-1"
                ></textarea>
              </div>

              <div>
                <label className="block font-medium">YouTube Video ID</label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="block font-medium">Thumbnail Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="px-6 py-5 flex justify-end border-t">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded disabled:opacity-50"
              >
             {loading ? "Submitting..." : editData ? "Update Class" : "Add Class"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AddClass;
