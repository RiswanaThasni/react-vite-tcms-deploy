import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { changePasswordApi } from "../api/authApi";



const ChangePassword = () => {
  const {uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
  
    try {
      await (changePasswordApi(uid, token, password, confirmPassword));
      alert("Password changed successfully! You can now log in.");
      navigate("/");
    } catch (err) {
      setMessage("Invalid or expired token. Please request a new reset link.");
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sidebar">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">New Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg mt-1"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {message && <p className="text-red-500 text-sm">{message}</p>}
          <button
            type="submit"
            className="w-full mt-4 bg-custom text-white font-semibold px-6 py-2 rounded-lg hover:bg-custom"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
