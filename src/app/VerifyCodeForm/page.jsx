"use client";
import { useState } from "react";

const VerifyCodeForm = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/verifyCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (response.ok) {
      setIsValid(true);
      setMessage("Code verified successfully");
    } else {
      setIsValid(false);
      setMessage(data.error || "Failed to verify code");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
        />
        <button type="submit">Verify Code</button>
      </form>
      <p style={{ color: isValid ? "green" : "red" }}>{message}</p>
    </div>
  );
};

export default VerifyCodeForm;
