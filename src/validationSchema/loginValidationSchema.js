import * as Yup from 'yup'

const loginValidationSchema = Yup.object({
      username : Yup.string().required('Username is required'),
      password : Yup.string().required('Password required')
})

export default loginValidationSchema