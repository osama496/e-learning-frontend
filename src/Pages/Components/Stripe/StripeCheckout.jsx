// StripeCheckout.jsx
import {
    CardElement,
    useElements,
    useStripe,
  } from "@stripe/react-stripe-js";
  import { useState } from "react";
  
  const StripeCheckout = ({ courseID, courseName, fees, studentID, onClose ,fetchData}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    //  remove space frmom courseName
    const courseNameWithoutSpaces = courseName.replace(/\s+/g, "");
    const handleStripePayment = async (e) => {
      e.preventDefault();
      setLoading(true);
    
      try {
        // Step 1: Verify student eligibility
        const verifyRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/course/${courseNameWithoutSpaces}/${courseID}/verify/student/${studentID}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const verifyData = await verifyRes.json();
    
        if (verifyData.statusCode !== 200) {
          alert(verifyData.message || "Student verification failed.");
          setLoading(false);
          return;
        }
    
        // ✅ Step 2: If fees is 0, enroll the student directly
        if (Number(fees) === 0) {
          const enrollRes = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/course/${courseNameWithoutSpaces}/${courseID}/add/student/${studentID}`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const enrollData = await enrollRes.json();
          console.log(enrollData);
          alert("Successfully enrolled in the course for free!");
          onClose();
          fetchData()
          setLoading(false);
          return;
        }
    
        // Step 3: Create payment intent
        const intentRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/payment/course/${courseID}/${courseNameWithoutSpaces}`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fees }),
          }
        );
    
        const intentData = await intentRes.json();
        const clientSecret = intentData?.data?.clientSecret;
    
        if (!clientSecret) {
          alert("Failed to create payment intent.");
          setLoading(false);
          return;
        }
    
        // Step 4: Confirm payment with Stripe
        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });
    
        if (paymentResult.error) {
          alert("Payment failed: " + paymentResult.error.message);
          setLoading(false);
          return;
        }
    
        if (paymentResult.paymentIntent.status !== "succeeded") {
          alert("Payment was not successful.");
          setLoading(false);
          return;
        }
    
        // Step 5: Confirm payment on server
        const confirmRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/payment/confirmation/course/${courseID}`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentIntentId: paymentResult.paymentIntent.id,
            }),
          }
        );
    
        const confirmData = await confirmRes.json();
    
        if (confirmData.statusCode === 200) {
          // Step 6: Enroll the student
          const enrollRes = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/course/${courseNameWithoutSpaces}/${courseID}/add/student/${studentID}`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          const enrollData = await enrollRes.json();
          console.log(enrollData);
          alert("Payment successful and course enrolled!");
          onClose();
        } else {
          alert("Payment confirmed but enrollment failed.");
        }
      } catch (error) {
        console.error("Error during payment:", error);
        alert("An error occurred during payment.");
      }
    
      setLoading(false);
    };
    
    
  
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center">Course Payment</h2>

        <form onSubmit={handleStripePayment} className="space-y-4">
          <div className="border p-4 rounded">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#32325d",
                    "::placeholder": {
                      color: "#a0aec0",
                    },
                  },
                  invalid: {
                    color: "#fa755a",
                    iconColor: "#fa755a",
                  },
                },
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
          >
            {loading ? "Processing..." : `Pay ${fees} Rs`}
          </button>
        </form>
      </div>
    </div>
    );
  };
  
  export default StripeCheckout;
  