import * as Yup from "yup";

const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default forgotPasswordValidationSchema;
