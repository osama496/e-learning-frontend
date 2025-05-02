import React, { useEffect, useState } from "react";
import "./Search.css";
import { useParams } from "react-router-dom";
import logo from "../../Images/logo.svg";
import Success from "./Success";
import StripeCheckout from "../Stripe/StripeCheckout";

function Search() {
  const [data, setData] = useState("");
  const [course, setCourse] = useState([]);
  const [courseID, setCourseID] = useState([]);
  const [popup, setPopup] = useState(false);
  const [idArray, setIdArray] = useState([]);
  const { ID } = useParams();
  const [openTM, setOpenTM] = useState(false);
  const [Tdec, setTeacherDetails] = useState(null);
  const [tname, setTname] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  console.log("selectedCourse", selectedCourse);

  const closePopup = () => {
    setPopup(false);
    window.location.reload();
  };

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  console.log("selectedCourse", selectedCourse);

  const openTeacherDec = async (id, fname, lname, sub) => {
    setTname({ fname, lname, sub });

    const data = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/teacher/teacherdocuments`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teacherID: id }),
      }
    );

    const res = await data.json();
    console.log(res.data);
    setTeacherDetails(res.data);
    setOpenTM(true);
  };

  const getData = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/course/student/${ID}/enrolled`,
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
      setCourseID(user.data);
      console.log(user.data);
      setIdArray((prevIdArray) => [
        ...prevIdArray,
        ...user.data.map((res) => res._id),
      ]);
      // Using a callback in setIdArray to ensure you're working with the most up-to-date state
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
   
    getData();
  }, []);

  console.log("course", course);

  const GetALLCourses = async () => {
    const Data = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/course/all`,
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = await Data.json();
    if (response.statusCode === 200) {
      setCourse(response.data);
      // console.log(response.data);
    }
    setData("");
  };

  useEffect(() => {
    GetALLCourses();
  }, []);

  // const handleEnroll = async (courseName, id) => {
  //   let check = await fetch(
  //     `${import.meta.env.VITE_API_BASE_URL}/api/course/${courseName}/${id}/verify/student/${ID}`,
  //     {
  //       method: "POST",
  //       credentials: "include",
  //       cors: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       // body: JSON.stringify({}),
  //     }
  //   );
  //   const res = await check.json();

  //   console.log(res);

  //   if(res.statusCode === 200){

  //   const data = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/course/${id}/${courseName}`, {
  //     method: "POST",
  //     credentials: "include",
  //     cors: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ fees: price[courseName]*100 }),
  //   });

  //   const DATA = await data.json();
  //   // console.log(DATA.data.id)

  //   const Key = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/razorkey`, {
  //     method: "GET",
  //     credentials: "include",
  //     cors: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const response = await Key.json();

  //   const options = {
  //     key: response.data.key,
  //     amount: price[courseName]*100,
  //     currency: "INR",
  //     name: " SkillBridge",
  //     description: "Enroll in a course",
  //     image: logo,
  //     order_id: DATA.data.id, // Include the order_id from the response
  //     handler: async (response) => {
  //       const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
  //         response;

  //       // Send the payment details to the server for verification
  //       const verificationData = {
  //         razorpay_payment_id,
  //         razorpay_order_id,
  //         razorpay_signature,
  //       };

  //       const verificationResponse = await fetch(
  //         `${import.meta.env.VITE_API_BASE_URL}/api/payment/confirmation/course/${id}`,
  //         {
  //           method: "POST",
  //           credentials: "include",
  //           cors: "include",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(verificationData),
  //         }
  //       );

  //       const res = await verificationResponse.json();
  //       console.log(res.statusCode);
  //       if (res.statusCode === 200) {
  //         try {
  //           let response = await fetch(
  //             `${import.meta.env.VITE_API_BASE_URL}/api/course/${courseName}/${id}/add/student/${ID}`,
  //             {
  //               method: "POST",
  //               credentials: "include",
  //               cors: "include",
  //               headers: {
  //                 "Content-Type": "application/json",
  //               },
  //               // body: JSON.stringify({}),
  //             }
  //           );

  //           let res = await response.json();
  //           console.log(res);
  //           setPopup(true);
  //         } catch (error) {
  //           console.log(error);
  //         }
  //       }
  //     },
  //     prefill: {
  //       name: "Gaurav Kumar",
  //       email: "gaurav.kumar@example.com",
  //     },
  //     notes: {
  //       address: "Razorpay Corporate Office",
  //     },
  //     theme: {
  //       color: "#3399cc",
  //     },
  //   };

  //   const rzp1 = new window.Razorpay(options);
  //   rzp1.open();
  //   }else{
  //     alert(res.message)
  //   }
  // };

  const handleEnroll = async (courseName, id) => {
    let check = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/api/course/${courseName}/${id}/verify/student/${ID}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const res = await check.json();
    console.log(res);

    if (res.statusCode === 200) {
      // --- FAKE PAYMENT FLOW START ---
      const fakePaymentData = {
        razorpay_payment_id: `pay_${Math.random()
          .toString(36)
          .substring(2, 15)}`,
        razorpay_order_id: `order_${Math.random()
          .toString(36)
          .substring(2, 15)}`,
        razorpay_signature: `signature_${Math.random()
          .toString(36)
          .substring(2, 15)}`,
      };

      // Directly call confirmation API with fake data
      const verificationResponse = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/payment/confirmation/course/${id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fakePaymentData),
        }
      );

      const verificationResult = await verificationResponse.json();
      console.log(verificationResult.statusCode);

      if (verificationResult.statusCode === 200) {
        try {
          let response = await fetch(
            `${
              import.meta.env.VITE_API_BASE_URL
            }/api/course/${courseName}/${id}/add/student/${ID}`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          let res = await response.json();
          console.log(res);
          setPopup(true);
        } catch (error) {
          console.log(error);
        }
      }
      // --- FAKE PAYMENT FLOW END ---
    } else {
      alert(res.message);
    }
  };

  const filteredCourses = course.filter((courseItem) =>
    courseItem.coursename.toLowerCase().includes(data.toLowerCase())
  );

  return (
    <>
   
      <div className="search mb-4">
        <img
          src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/6c476f454537d7f27cae2b4d0f31e2b59b3020f5"
          width={30}
          alt=""
        />
        <input
          type="text"
          placeholder="Search for courses..."
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </div>
      <div className="overflow-auto grid md:grid-cols-1 lg:grid-cols-2 gap-6 mx-4 justify-center items-center ">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((Data) => (
            <div
              key={Data._id}
              className="relative bg-white shadow-lg rounded-lg p-4 mb-6 max-w-lg flex flex-col md:flex-row items-center gap-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-full md:w-1/3">
                <img
                  src={Data.thumbnailimage}
                  alt={Data.coursename}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>

              <div className="w-full md:w-2/3 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-blue-900">
                    {Data.coursename}
                  </h2>
                  <p className="text-gray-600">{Data.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      Teacher: {Data.enrolledteacher.Firstname}{" "}
                      {Data.enrolledteacher.Lastname}
                    </p>
                    <p>Email: {Data.enrolledteacher.Email} </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-900">
                    <p className="text-gray-900">
                      Price: <span className="font-bold">{Data.price}</span>
                    </p>
                      Enrolled: {Data.enrolledStudent.length}
                    </p>
                  </div>

                  {idArray.includes(Data._id) ? (
                    <div className="bg-green-900 text-white py-2 px-4 rounded-lg cursor-not-allowed">
                      Already Enrolled
                    </div>
                  ) : Data.enrolledStudent.length < 20 ? (
                    <div
                      onClick={() => {
                        handleEnrollClick(Data);
                      }}
                      className="bg-blue-900 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-700 transition-all duration-200"
                    >
                      Enroll Now
                    </div>
                  ) : (
                    <div className="bg-red-900 text-white py-2 px-4 rounded-lg cursor-not-allowed">
                      Course Full
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-6">No courses found</p>
        )}
      </div>

      {showModal && selectedCourse && (
        <StripeCheckout
          courseID={selectedCourse._id}
          courseName={selectedCourse.coursename}
          fees={selectedCourse.price}
          studentID={ID}
          onClose={() => setShowModal(false)}
          fetchData={getData}
        />
      )}

      {popup && <Success onClose={closePopup} />}
    </>
  );
}

export default Search;
