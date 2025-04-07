import * as Yup from 'yup';


export const passwordChangeSchema = Yup.object().shape({
  old_password: Yup.string()
    .required('Current password is required'),
  
  new_password: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  
  confirm_new_password: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
});

export const validatePassword = async (passwordData) => {
  try {
    await passwordChangeSchema.validate(passwordData, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (err) {
    // Transform Yup errors into a more usable format
    const errors = {};
    if (err.inner) {
      err.inner.forEach(error => {
        errors[error.path] = error.message;
      });
    }
    return { isValid: false, errors };
  }
};