import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { uploadImageToCloudinary } from "../../../Utils/Clodinary";

function Popup({ onClose, subject, existingCourse }) {
  const [desc, setDesc] = useState(existingCourse?.description || "");
  const [thumbnailimage, setThumbnailimage] = useState(null); // for new upload
  const [price, setPrice] = useState(existingCourse?.price || 0);
  const [course, setCourse] = useState(() => existingCourse?.coursename || subject || "");
  const { ID } = useParams();
  const [loading, setLoading] = useState(false);

  console.log("existingCourse",existingCourse)

  const addCourse = async () => {
    if (!desc) return alert('Fill the description.');
    if (price <= 0) return alert('Please provide a valid price.');
  
    try {
      setLoading(true);
      let imageUrl = existingCourse?.thumbnailimage;
  
      if (thumbnailimage) {
        imageUrl = await uploadImageToCloudinary(thumbnailimage);
      }
  
      const payload = {
        coursename: course.toLowerCase(),
        description: desc,
        price,
        thumbnailimage: imageUrl,
      };
  
      let apiURL;
      let method;
  
      if (existingCourse) {
        // Edit Mode
        apiURL = `${import.meta.env.VITE_API_BASE_URL}/api/course/${existingCourse._id}/update/${existingCourse.enrolledteacher}`;
        method = 'PUT';
      } else {
        // Create Mode
        const courseName = (course || subject).replace(/\s+/g, '');
        apiURL = `${import.meta.env.VITE_API_BASE_URL}/api/course/${courseName}/create/${ID}`;
        method = 'POST';
      }
  
      const response = await fetch(apiURL, {
        method,
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const responseData = await response.json();
      alert(responseData.message);
      onClose();
    } catch (error) {
      console.error('Error submitting course:', error);
      alert('Error submitting course. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center">
      <div className="bg-[#008280] w-[30rem] h-fit py-4 mt-1 rounded-md">
        <div
          className="absolute w-9 h-9 bg-white rounded-xl cursor-pointer flex items-center justify-center m-2"
          onClick={onClose}
        >
          ✖️
        </div>
        <div className="text-center my-10 text-white text-3xl font-semibold">
          <p>{subject}</p>
        </div>
        <div className="m-5 flex flex-col gap-4 text-white text-xl">
          <div>
            <label>Coursename: </label>
            <input
              type="text"
              className="bg-[#32B0AE] p-2 rounded-md w-52 border-0 outline-0"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              
            />
          </div>

          <div>
            <label>Description: </label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="bg-[#32B0AE] p-2 rounded-md w-52 ml-3 border-0 outline-0"
            />
          </div>

          <div>
            <label>Thumbnail Image URL: </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailimage(e.target.files[0])}
              className="bg-[#32B0AE] p-2 rounded-md w-52 ml-3 border-0 outline-0"
            />
            {existingCourse?.thumbnailimage && !thumbnailimage && (
              <img
                src={existingCourse.thumbnailimage}
                alt="Course thumbnail"
                className="w-32 h-20 object-cover rounded mt-2"
              />
            )}
          </div>

          <div>
            <label>Price: </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-[#32B0AE] p-2 rounded-md w-52 ml-3 border-0 outline-0"
              min="0"
            />
          </div>
        </div>

        <div className="flex items-center justify-center mt-7">
          <span
            onClick={addCourse}
            className="bg-[#335699] text-white px-10 py-3 rounded-md text-xl cursor-pointer"
          >
            {loading ? "Wait..." : "Create Course"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Popup;
