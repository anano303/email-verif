"use client";
import { useState } from "react";
import VerifyCodeForm from "../VerifyCodeForm/page";

const EmailForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/sendVerificationCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const text = await response.text(); // გამოგიტანს თუნდაც ცარიელ პასუხს
    console.log("Response Text:", text);

    if (!response.ok) {
      console.error("Error response:", text);
      setMessage("Failed to send email. Please try again later.");
      setIsValid(false);
      return;
    }

    const data = await response.json();
    console.log("Response JSON:", data);

    if (response.ok) {
      setIsValid(true);
      setMessage("Verification email sent! Please check your inbox.");
    } else {
      setIsValid(false);
      setMessage(data.error || "Failed to send email");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <button type="submit">Send Verification Code</button>
      </form>
      <p style={{ color: isValid ? "green" : "red" }}>{message}</p>
      <VerifyCodeForm />
    </div>
  );
};

export default EmailForm;
