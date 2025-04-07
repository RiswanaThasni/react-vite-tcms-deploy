// import { Field, Form, Formik, ErrorMessage } from "formik";
// import { ChevronLeft } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { createProject, fetchProjectManagers, fetchRoles, fetchUsersByRole } from "../../../api/projectApi";
// import { useNavigate } from "react-router-dom";

// const CreateProject = ({ onBack }) => {
//   const [selectedRole, setSelectedRole] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [teamMembers, setTeamMembers] = useState({});
//   const [roleChanges, setRoleChanges] = useState({});
//   const [roles, setRoles] = useState([]);
//   const [projectManagers, setProjectManagers] = useState([]);

//   const navigate = useNavigate()

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const rolesData = await fetchRoles();
//         setRoles(rolesData);
//         const pmData = await fetchProjectManagers();
//         setProjectManagers(pmData);
//       } catch (error) {
//         console.error("Error loading data:", error);
//       }
//     };
//     loadData();
//   }, []);

//   useEffect(() => {
//   if (selectedRole) {
//     const selectedRoleObj = roles.find((r) => r.role_name === selectedRole);
//     if (selectedRoleObj) {
//       fetchUsersByRole(selectedRoleObj.id)
//         .then((data) => setFilteredUsers(data))
//         .catch(() => setFilteredUsers([]));
//     }
//   }
// }, [selectedRole]);

// const handleRoleFilter = (roleName) => {
//   setSelectedRole(roleName);
//   const selectedRoleObj = roles.find((r) => r.role_name === roleName);
//   if (selectedRoleObj) {
//     fetchUsersByRole(selectedRoleObj.id) 
//       .then((data) => setFilteredUsers(data))
//       .catch(() => setFilteredUsers([]));
//   }
// };


// const handleUserSelection = (user) => {
//   setTeamMembers((prev) => {
//     const updatedTeam = { ...prev };
    
//     if (updatedTeam[user.id]) {
//       delete updatedTeam[user.id];
//     } else {
//       updatedTeam[user.id] = {
//         id: user.id,
//         name: user.name,
//         role: user.role // Make sure this is included
//       };
//     }
    
//     return updatedTeam;
//   });
// };




// const handleSubmit = async (values) => {  
//   const projectData = {
//     project_id: values.project_id,
//     project_name: values.projectName,
//     project_description: values.description,
//     deadline: values.deadline,
//     project_lead: parseInt(values.projectLead),
//     // Change this line to format team members correctly
//     team_members: Object.values(teamMembers).map((member) => ({ user: member.id })),
//   };

//   console.log("Sending Project Data:", JSON.stringify(projectData, null, 2));

//   try {
//     await createProject(projectData);
//     alert("Project Created Successfully!");
//     navigate("/projectmanager_dashboard");
//   } catch (error) {
//     console.error("Project Creation Failed:", error);
//     console.error("Response data:", error.response?.data);
//     alert(`Failed to create project: ${JSON.stringify(error.response?.data || error.message)}`);
//   }
// }

//   return (
//     <div className="min-h-screen  ">
//       <button
//         onClick={onBack}
//         className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition duration-200 mb-4"
//       >
//         <ChevronLeft size={15} />
//         <span>Back to Project Management</span>
//       </button>

//       <div className="border-null bg-gray-100 p-6 rounded-lg shadow-md">
//         <h4 className="text-gray-600 text-lg font-semibold mb-4">Create Project</h4>

//         <Formik initialValues={{project_id:"", projectName: "", description: "", deadline: "", projectLead: "" }} onSubmit={handleSubmit}>
//           {({ values }) => (
//             <Form className="space-y-4">
//             <div>
//                 <label className="block text-gray-700">Project ID</label>
//                 <Field name="project_id" className="w-full p-2 border border-gray-300 rounded" />
//                 <ErrorMessage name="project_id" component="div" className="text-red-500 text-sm" />
//               </div>
//               <div>
//                 <label className="block text-gray-700">Project Name</label>
//                 <Field name="projectName" className="w-full p-2 border border-gray-300 rounded" />
//                 <ErrorMessage name="projectName" component="div" className="text-red-500 text-sm" />
//               </div>

//               <div>
//                 <label className="block text-gray-700">Description</label>
//                 <Field as="textarea" name="description" className="w-full p-2 border border-gray-300 rounded" />
//                 <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
//               </div>

//               <div>
//                 <label className="block text-gray-700">Deadline</label>
//                 <Field type="date" name="deadline" className="w-full p-2 border border-gray-300 rounded" />
//                 <ErrorMessage name="deadline" component="div" className="text-red-500 text-sm" />
//               </div>

//               <div>
//                 <label className="block text-gray-700">Project Lead</label>
//                 <Field
//                     as="select"
//                     name="projectLead"
//                     className="w-full p-2 border border-gray-300 rounded"
//                   >
//                   <option value="">-- Select Project Lead --</option>
//                   {projectManagers.map((pm) => (
//                     <option key={pm.id} value={pm.id}>
//                       {pm.name} ({pm.role})
//                     </option>
//                   ))}
//                 </Field>

//               </div>

//               <div>
//               <label className="block text-gray-700">Filter by Role</label>
// <select 
//   onChange={(e) => handleRoleFilter(e.target.value)}
//   className="w-full p-2 border border-gray-300 rounded"
// >
//   <option value="">-- Select Role --</option>
//   {roles.map((role) => (
//     <option key={role.id} value={role.role_name}>
//       {role.role_name} 
//     </option>
//   ))}
// </select>


//               </div>

//               {selectedRole && (
//                 <div className="mb-4 border p-4 rounded-md">
//                   <h3 className="font-medium mb-2">Available {selectedRole}s:</h3>
//                   {filteredUsers.length > 0 ? (
//                     filteredUsers.map((user) => (
//                       <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer border-b">
//                         <div className="flex items-center">
//                           <input type="checkbox" checked={!!teamMembers[user.id]} onChange={() => handleUserSelection(user)} className="mr-2" />
//                           <label>{user.name} </label>
//                         </div>

                        
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-500 p-2">No users available for this role</p>
//                   )}
//                 </div>
//               )}
//               {Object.values(teamMembers).length > 0 && (
//   <div className="mb-4 border p-4 rounded-md">
//     <h3 className="font-medium mb-2">Selected Team Members:</h3>
//     {Object.values(teamMembers).map((user) => (
//       <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer border-b">
//         <span>{user.name} </span>
//         <button
//           onClick={() => handleUserSelection(user)}
//           className="text-red-500 hover:text-red-700"
//         >
//           Remove
//         </button>
//       </div>
//     ))}
//   </div>
// )}


//               <button type="submit" className="w-full p-2 bg-sidebar-hover font-semibold  text-black rounded hover:bg-lime-300 transition duration-200">
//                 Create Project
//               </button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default CreateProject;



import { Field, Form, Formik, ErrorMessage } from "formik";
import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createProject, fetchProjectManagers, fetchRoles, fetchUsersByRole } from "../../../api/projectApi";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';

// Add validation schema
const ProjectSchema = Yup.object().shape({
  project_id: Yup.string().required('Project ID is required'),
  projectName: Yup.string().required('Project name is required'),
  description: Yup.string().required('Description is required'),
  deadline: Yup.date().required('Deadline is required'),
  projectLead: Yup.string().required('Project lead is required'),
});

const CreateProject = ({ onBack }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [teamMembers, setTeamMembers] = useState({});
  const [roles, setRoles] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const rolesData = await fetchRoles();
        setRoles(rolesData);
        const pmData = await fetchProjectManagers();
        setProjectManagers(pmData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      const selectedRoleObj = roles.find((r) => r.role_name === selectedRole);
      if (selectedRoleObj) {
        fetchUsersByRole(selectedRoleObj.id)
          .then((data) => setFilteredUsers(data))
          .catch(() => setFilteredUsers([]));
      }
    }
  }, [selectedRole, roles]);

  const handleUserSelection = (user) => {
    setTeamMembers((prev) => {
      const updatedTeam = { ...prev };
      
      if (updatedTeam[user.id]) {
        delete updatedTeam[user.id];
      } else {
        updatedTeam[user.id] = {
          id: user.id,
          name: user.name,
          role: user.role
        };
      }
      
      return updatedTeam;
    });
  };

  const handleSubmit = async (values) => {  
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Ensure team members are properly formatted
      const formattedTeamMembers = Object.values(teamMembers).map(member => {
        // Make sure we're sending just the user ID, not the whole user object
        return { user: member.id };
      });
  
      const projectData = {
        project_id: values.project_id,
        project_name: values.projectName,
        project_description: values.description,
        deadline: values.deadline,
        project_lead: parseInt(values.projectLead),
        team_members: formattedTeamMembers,
      };
  
      console.log("Final payload:", JSON.stringify(projectData, null, 2));
  
      // Make sure to send as JSON, not form-data
      await createProject(projectData);
      alert("Project Created Successfully!");
      navigate("/projectmanager_dashboard");
    } catch (error) {
      console.error("Full error response:", error.response?.data);
      setError(
        error.response?.data?.team_members?.[0]?.user?.[0] || 
        error.response?.data?.message || 
        "Failed to create project"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleRoleFilter = (roleName) => {
      setSelectedRole(roleName);
      const selectedRoleObj = roles.find((r) => r.role_name === roleName);
      if (selectedRoleObj) {
        fetchUsersByRole(selectedRoleObj.id) 
          .then((data) => setFilteredUsers(data))
          .catch(() => setFilteredUsers([]));
      }
    };

  return (
    <div className="min-h-screen">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition duration-200 mb-4"
      >
        <ChevronLeft size={15} />
        <span>Back to Project Management</span>
      </button>

      <div className="border-null bg-gray-100 p-6 rounded-lg shadow-md">
        <h4 className="text-gray-600 text-lg font-semibold mb-4">Create Project</h4>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <Formik 
          initialValues={{
            project_id: "",
            projectName: "", 
            description: "", 
            deadline: "", 
            projectLead: ""
          }}
          validationSchema={ProjectSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-gray-700">Project ID</label>
                <Field 
                  name="project_id" 
                  className={`w-full p-2 border rounded ${
                    errors.project_id && touched.project_id ? 'border-red-500' : 'border-gray-300'
                  }`} 
                />
                <ErrorMessage name="project_id" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-gray-700">Project Name</label>
                <Field 
                  name="projectName" 
                  className={`w-full p-2 border rounded ${
                    errors.projectName && touched.projectName ? 'border-red-500' : 'border-gray-300'
                  }`} 
                />
                <ErrorMessage name="projectName" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-gray-700">Description</label>
                <Field 
                  as="textarea" 
                  name="description" 
                  className={`w-full p-2 border rounded ${
                    errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
                  }`} 
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-gray-700">Deadline</label>
                <Field 
                  type="date" 
                  name="deadline" 
                  className={`w-full p-2 border rounded ${
                    errors.deadline && touched.deadline ? 'border-red-500' : 'border-gray-300'
                  }`} 
                />
                <ErrorMessage name="deadline" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-gray-700">Project Lead</label>
                <Field
                  as="select"
                  name="projectLead"
                  className={`w-full p-2 border rounded ${
                    errors.projectLead && touched.projectLead ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Select Project Lead --</option>
                  {projectManagers.map((pm) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.name} ({pm.role})
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="projectLead" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-gray-700">Filter by Role</label>
                <select 
                  onChange={(e) => handleRoleFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  value={selectedRole}
                >
                  <option value="">-- Select Role --</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.role_name}>
                      {role.role_name} 
                    </option>
                  ))}
                </select>
              </div>

              {selectedRole && (
                <div className="mb-4 border p-4 rounded-md">
                  <h3 className="font-medium mb-2">Available {selectedRole}s:</h3>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer border-b">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={!!teamMembers[user.id]} 
                            onChange={() => handleUserSelection(user)} 
                            className="mr-2" 
                          />
                          <label>{user.name} ({user.role})</label>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 p-2">No users available for this role</p>
                  )}
                </div>
              )}

              {Object.values(teamMembers).length > 0 && (
                <div className="mb-4 border p-4 rounded-md">
                  <h3 className="font-medium mb-2">Selected Team Members:</h3>
                  {Object.values(teamMembers).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer border-b">
                      <span>{user.name} ({user.role})</span>
                      <button
                        type="button"
                        onClick={() => handleUserSelection(user)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full p-2 bg-sidebar-hover font-semibold text-black rounded hover:bg-lime-300 transition duration-200 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create Project'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateProject;
