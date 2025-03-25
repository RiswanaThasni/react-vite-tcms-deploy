import { Field, Form, Formik, ErrorMessage } from "formik";
import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createProject, fetchProjectManagers, fetchRoles, fetchUsersByRole } from "../../../api/projectApi";
import { useNavigate } from "react-router-dom";

const CreateProject = ({ onBack }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [teamMembers, setTeamMembers] = useState({});
  const [roleChanges, setRoleChanges] = useState({});
  const [roles, setRoles] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);

  const navigate = useNavigate()

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
}, [selectedRole]);

const handleRoleFilter = (roleName) => {
  setSelectedRole(roleName);
  const selectedRoleObj = roles.find((r) => r.role_name === roleName);
  if (selectedRoleObj) {
    fetchUsersByRole(selectedRoleObj.id) 
      .then((data) => setFilteredUsers(data))
      .catch(() => setFilteredUsers([]));
  }
};


const handleUserSelection = (user) => {
  setTeamMembers((prev) => {
    const updatedTeam = { ...prev };

    if (updatedTeam[user.id]) {
      delete updatedTeam[user.id]; 
    } else {
      updatedTeam[user.id] = user; 
    }

    return updatedTeam;
  });
};


const handleSubmit = async (values) => {  
  const projectData = {
    project_id: values.projectID,
    project_name: values.projectName,
    project_description: values.description,
    deadline: values.deadline,
    project_lead: parseInt(values.projectLead, 10),
    team_members: Object.values(teamMembers).map((member) => ({
      user: member.id,
    })),
  };

  console.log("Sending Project Data:", JSON.stringify(projectData, null, 2));

  try {
    await createProject(projectData);
    alert("Project Created Successfully!");
    navigate("/projectmanager_dashboard");
  } catch (error) {
    console.error("Project Creation Failed:", error.response?.data || error);
    alert("Failed to create project.");
  }
};


  return (
    <div className="min-h-screen bg-white p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 font-medium text-gray-400 hover:text-gray-700 transition duration-200 mb-4"
      >
        <ChevronLeft size={20} />
        <span>Back to Project Management</span>
      </button>

      <div className="border-null bg-gray-100 p-6 rounded-lg shadow-md">
        <h4 className="text-gray-600 text-lg font-semibold mb-4">Create Project</h4>

        <Formik initialValues={{projectID:"", projectName: "", description: "", deadline: "", projectLead: "" }} onSubmit={handleSubmit}>
          {({ values }) => (
            <Form className="space-y-4">
            <div>
                <label className="block text-gray-700">Project ID</label>
                <Field name="projectID" className="w-full p-2 border border-gray-300 rounded" />
                <ErrorMessage name="projectID" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block text-gray-700">Project Name</label>
                <Field name="projectName" className="w-full p-2 border border-gray-300 rounded" />
                <ErrorMessage name="projectName" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-gray-700">Description</label>
                <Field as="textarea" name="description" className="w-full p-2 border border-gray-300 rounded" />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-gray-700">Deadline</label>
                <Field type="date" name="deadline" className="w-full p-2 border border-gray-300 rounded" />
                <ErrorMessage name="deadline" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-gray-700">Project Lead</label>
                <Field
                    as="select"
                    name="projectLead"
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                  <option value="">-- Select Project Lead --</option>
                  {projectManagers.map((pm) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.name} ({pm.role})
                    </option>
                  ))}
                </Field>

              </div>

              <div>
              <label className="block text-gray-700">Filter by Role</label>
<select 
  onChange={(e) => handleRoleFilter(e.target.value)}
  className="w-full p-2 border border-gray-300 rounded"
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
                          <input type="checkbox" checked={!!teamMembers[user.id]} onChange={() => handleUserSelection(user)} className="mr-2" />
                          <label>{user.name} </label>
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
        <span>{user.name} </span>
        <button
          onClick={() => handleUserSelection(user)}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    ))}
  </div>
)}


              <button type="submit" className="w-full p-2 bg-yellow-400 text-white rounded hover:bg-yellow-600 transition duration-200">
                Create Project
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateProject;
