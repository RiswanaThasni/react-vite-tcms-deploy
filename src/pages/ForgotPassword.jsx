import React, { useState } from 'react';
import logo from "../assets/images/logo.svg";
import forgottpassword1 from '../assets/images/forgottpassword1.svg';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import forgotPasswordValidationSchema from '../validationSchema/forgotPasswordValidation';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../api/authApi';

const ForgotPassword = () => {

      const navigate = useNavigate()

      const [isSubmitting, setSubmitting] = useState(false);
      const [message, setMessage] = useState("");
    
      const handleSubmit = async (values, { setErrors }) => {
  setSubmitting(true);
  setMessage(""); 
  try {
    await (forgotPassword(values.email));
    navigate("/forgot-password-confirmation", { state: { email: values.email } });
  } catch (err) {
    setErrors({ email: err.response?.data?.message || "Something went wrong" });
  } finally {
    setSubmitting(false);
  }
};
    

      
  return (
    <div className="min-h-screen flex  bg-sidebar">
            <div className="p-8">
             <img src={logo} alt="Logo" className='w-15 h-auto'  />
            </div>
            <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8'>
                  <h2 className='text-2xl text-white font-bold mb-4'>Forgot Password</h2>  
                  <p className=' text-white text-center mb-6'>Enter your email address to reset your password.</p>
                  <Formik 
                  initialValues={{email :''}}
                  validationSchema ={forgotPasswordValidationSchema}
                  onSubmit={handleSubmit}
                  >
                        <Form className='w-full max-w-md '>
                        <div className='mb-4'>
                        <Field type='email' name='email' placeholder='Enter your email address' className='w-full p-3 border rounded-lg bg-white focus:ring-2  outline-none'/>
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1"/>
                        {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
                        </div>
                        <div className='flex justify-center' >
                              <button className="mt-4 bg-custom text-white font-semibold px-6 py-2 rounded-lg bg-sidebar-hover hover:bg-lime-400 " type='submit'> {isSubmitting ? "Sending..." : "Send Email"}</button>
                        </div>
                             
                        </Form>
                  </Formik>
            </div>

            <div className='flex justify-center'>
                  <img src={forgottpassword1} alt="Forgot Password" />
            </div>


      
      
    </div>
  );
};

export default ForgotPassword;