import React, { useState } from 'react'
import "../Landing/Landing.css";
import Mail from "../../Images/Meet-the-team.svg";
import Header from '../Header/Header';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handlemsg = async (e) => {
    e.preventDefault();
    if (name === '' || email === '' || msg === '') {
      alert("All fields are required!");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Enter a valid email!");
    } else {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/contact-us`, {
          method: 'POST',
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, message: msg }),
        });

        const text = await res.text();
        const response = text ? JSON.parse(text) : {};

        alert(response.message || "Message sent!");
        setName('');
        setEmail('');
        setMsg('');
      } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong while sending the message.");
      }
    }
  }
 

  return (
    <>
      <Header />
      <div className="contact">
        <h4>Contact Us</h4>
        <hr className="underLine" />
        <div className="content">
          <img src={Mail} width={700} alt="" />
          <form className="form-submit">
            <h4>Send Message</h4>
            <input
              type="text"
              placeholder="Name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              placeholder="Message"
              className="textArea"
              name="message"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <button onClick={handlemsg} className="w-[19rem] bg-light-blue-800">Send A Message</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Contact