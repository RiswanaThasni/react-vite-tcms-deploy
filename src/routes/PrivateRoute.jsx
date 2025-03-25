import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles = [] }) => {
  const accessToken = localStorage.getItem("access_token");
  const role = localStorage.getItem("role"); // Get role from localStorage

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  return allowedRoles.length === 0 || allowedRoles.includes(role) ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoute;
