import React, { useEffect, useState } from "react"
import { ErrorMessage, Field, Form, Formik } from "formik"
import { Link, useNavigate } from "react-router-dom"
import loginValidationSchema from "../validationSchema/loginValidationSchema"
import logo1 from "../assets/images/logo1.svg"
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";

const Login = () => {
  const navigate = useNavigate()
  const [role,setRole] =useState(null)
  const [isSubmitting, setSubmitting] = useState(false)
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);



  const handleLogin = async (values, { setSubmitting, setStatus }) => {
  setStatus(null);
  dispatch(login(values))
    .unwrap()
    .then((response) => {
      if (response.role === "Admin") navigate("/admin_dashboard");
      else if (response.role === "Project Manager") navigate("/projectmanager_dashboard");
      else if (response.role === "QA") navigate("/qa_dashboard");
      else if (response.role === "Developer") navigate("/dev_dashboard");
      else if (response.role === "Test Engineer") navigate("/testengineer_dashboard");
      else navigate("/");
    })
    .catch((err) => {
      setStatus(err);
    });
};

  return (
    <div className="min-h-screen flex-col bg-radial-custom">
      <div className="p-8">
        <img src={logo1} alt="Logo" className="w-18 h-auto" />
      </div>
      <div className="flex flex-1 flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Welcome Back!</h2>
          <p className="mb-6 text-gray-500 font-normal">Please login to your account.</p>

          <Formik initialValues={{ username: "", password: "" }} validationSchema={loginValidationSchema} onSubmit={handleLogin}>
            {({status}) => (
              <Form>
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Username</label>
                  <Field name="username"  type="text" className="w-full border-gray-300  text-sm rounded border py-1.5 px-3 focus:outline-none" />
                  <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div className="mt-5">
                  <label className="block text-gray-500 text-sm mb-1">Password</label>
                  <Field name="password"  type="password" className="w-full border-gray-300  text-sm rounded border py-1.5 px-3 focus:outline-none" />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {status && <div className="text-red-500 text-sm mt-2">{status}</div>}

                <Link to="/forgot_password" className="text-custom font-medium hover:text-slate-500 text-sm">
                  Forgot Password?
                </Link>

                <button type="submit" disabled={isLoading} className="bg-custom text-white font-semibold mt-4 rounded w-full py-1.5 px-3 text-sm disabled:opacity-50">
  {isLoading ? "Signing in..." : "Sign in"}
</button>


              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
