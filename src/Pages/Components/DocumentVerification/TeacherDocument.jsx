import React, { useState, useEffect } from "react";
import Input from "../DocumentVerification/InputComponent/Input.jsx";
import InputUpload from "../DocumentVerification/Inputupload/InputUpload.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import logo from "../../Images/logo.svg";

const TeacherDocument = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const { Data } = useParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/teacher/TeacherDocument/${Data}`,
          {
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const user = await response.json();
        setData(user.data);
      } catch (error) {
        setError(error.message);
      }
    };

    getData();
  }, []);

  const [formData, setFormData] = useState({
    Phone: data.Phone || "",
    Address: data.Address || "",
    Experience: data.Experience || "",
    SecondarySchool: data.SecondarySchool || "",
    SecondaryMarks: data.SecondaryMarks || "",
    HigherSchool: data.HigherSchool || "",
    HigherMarks: data.HigherMarks || "",
    UGcollege: data.UGcollege || "",
    UGmarks: data.UGmarks || "",
    PGcollege: data.PGcollege || "",
    PGmarks: data.PGmarks || "",
    Aadhaar: null,
    Secondary: null,
    Higher: null,
    UG: null,
    PG: null,
  });

  const handleFileChange = (fileType, e) => {
    setFormData({
      ...formData,
      [fileType]: e.target.files[0],
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/teacher/verification/${Data}`,
        {
          method: "POST",
          credentials: "include",
          mode: "cors",
          body: formDataObj,
        }
      );

      const responseData = await response.json();
      setLoader(false);

      if (!response.ok) {
        setError(responseData.message);
      } else {
        navigate("/pending");
      }
    } catch (e) {
      console.error("Error:", e);
    }
  };

  return (
    <>
      {loader && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
          <RotatingLines
            visible={true}
            height="100"
            width="100"
            color="#0D286F"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
          <span className="text-white text-xl mt-4">Uploading ...</span>
        </div>
      )}

      <header className="flex flex-col md:flex-row items-center justify-between gap-6 px-6 py-4 bg-[#0D286F]">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-12 md:w-14" alt="Logo" />
          <h1 className="text-xl md:text-2xl text-[#4E84C1] font-bold">Shiksharthee</h1>
        </div>
        <h2 className="text-white text-lg md:text-xl text-center md:text-left">
          Document Verification (Teacher)
        </h2>
      </header>

      <hr />

      <form onSubmit={handleSubmit} className="px-4 md:px-10 py-8 space-y-10">
        <section>
          <h3 className="text-[#4E84C1] mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input label={"First Name"} placeholder={"First Name"} value={data.Firstname} readonly />
            <Input label={"Last Name"} placeholder={"Last Name"} value={data.Lastname} readonly />
            <Input
              label={"Phone No."}
              placeholder={"Phone No."}
              value={formData.Phone}
              onChange={(e) => handleInputChange("Phone", e.target.value)}
            />
            <Input
              label={"Home Address"}
              placeholder={"Home Address"}
              value={formData.Address}
              onChange={(e) => handleInputChange("Address", e.target.value)}
            />
            <Input
              label={"Experience (years)"}
              placeholder={"Experience (years)"}
              value={formData.Experience}
              onChange={(e) => handleInputChange("Experience", e.target.value)}
            />
            <InputUpload
              label={"Upload Aadhar Card"}
              placeholder={"Upload Aadhar Card"}
              value={formData.Aadhaar}
              onChange={(e) => handleFileChange("Aadhaar", e)}
            />
          </div>
        </section>

        <section>
          <h3 className="text-[#4E84C1] mb-6">Educational Information</h3>

          {/* Secondary */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="bg-[#0D286F] text-white px-4 py-2 rounded-sm text-sm">Secondary</span>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  placeholder={"10th Board Name"}
                  value={formData.SecondarySchool}
                  onChange={(e) => handleInputChange("SecondarySchool", e.target.value)}
                />
                <Input
                  placeholder={"Total Marks (%)"}
                  value={formData.SecondaryMarks}
                  onChange={(e) => handleInputChange("SecondaryMarks", e.target.value)}
                />
                <InputUpload
                  placeholder={"Upload 10th Result"}
                  value={formData.Secondary}
                  onChange={(e) => handleFileChange("Secondary", e)}
                />
              </div>
            </div>
          </div>

          {/* Higher Secondary */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="bg-[#0D286F] text-white px-4 py-2 rounded-sm text-sm">Higher Secondary</span>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  placeholder={"12th Board Name"}
                  value={formData.HigherSchool}
                  onChange={(e) => handleInputChange("HigherSchool", e.target.value)}
                />
                <Input
                  placeholder={"Total Marks (%)"}
                  value={formData.HigherMarks}
                  onChange={(e) => handleInputChange("HigherMarks", e.target.value)}
                />
                <InputUpload
                  placeholder={"Upload 12th Result"}
                  value={formData.Higher}
                  onChange={(e) => handleFileChange("Higher", e)}
                />
              </div>
            </div>
          </div>

          {/* Graduation */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="bg-[#0D286F] text-white px-4 py-2 rounded-sm text-sm">Graduation</span>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  placeholder={"Graduation University Name"}
                  value={formData.UGcollege}
                  onChange={(e) => handleInputChange("UGcollege", e.target.value)}
                />
                <Input
                  placeholder={"UG Marks/SGPA out of 10"}
                  value={formData.UGmarks}
                  onChange={(e) => handleInputChange("UGmarks", e.target.value)}
                />
                <InputUpload
                  placeholder={"Upload Graduation"}
                  value={formData.UG}
                  onChange={(e) => handleFileChange("UG", e)}
                />
              </div>
            </div>
          </div>

          {/* Post Graduation */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="bg-[#0D286F] text-white px-4 py-2 rounded-sm text-sm">Post Graduation</span>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  placeholder={"P.G. University Name"}
                  value={formData.PGcollege}
                  onChange={(e) => handleInputChange("PGcollege", e.target.value)}
                />
                <Input
                  placeholder={"CGPA out of 10"}
                  value={formData.PGmarks}
                  onChange={(e) => handleInputChange("PGmarks", e.target.value)}
                />
                <InputUpload
                  placeholder={"Upload P.G. Result"}
                  value={formData.PG}
                  onChange={(e) => handleFileChange("PG", e)}
                />
              </div>
            </div>
          </div>
        </section>

        {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

        <div className="flex justify-center md:justify-end">
          <button
            type="submit"
            className="bg-[#0D286F] text-white px-2 py-3 rounded-md hover:bg-[#0b1e4a] transition"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default TeacherDocument;
