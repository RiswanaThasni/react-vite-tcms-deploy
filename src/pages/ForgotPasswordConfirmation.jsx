import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { forgotPassword } from '../api/authApi';



const ForgotPasswordConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleResendEmail = async () => {
    try {
      await (forgotPassword(email));
      alert("A new reset link has been sent to your email.");
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-radial-custom">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Check Your Email</h2>
        <p className="text-gray-600 text-center mb-4">
          A reset link has been sent to <b>{email}</b>. Click the link in your email to reset your password.
        </p>
        <button
          onClick={handleResendEmail}
          className="w-full mt-4 bg-custom text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Resend Email
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordConfirmation;
