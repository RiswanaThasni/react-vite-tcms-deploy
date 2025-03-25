import * as Yup from 'yup'

const projectValidationSchema = Yup.object().shape({
    projectName: Yup.string()
      .required("Project Name is required")
      .min(3, "Must be at least 3 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Must be at least 10 characters"),
    deadline: Yup.date().required("Deadline is required"),
    projectLead: Yup.string().required("Project Lead is required"),
    teamMembers: Yup.array()
      .min(1, "Select at least one team member")
      .required("Team members are required"),
  });

export default projectValidationSchema