import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTestCaseByTestEngineer } from '../../../redux/slices/testEngineerTestSlice';


const TestDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [statusFilter, setStatusFilter] = useState("");


  const { tests = [], loading, error } = useSelector((state) => state.testDetails || {});
  console.log("Redux Tests State:", tests);

   const [searchTerm, setSearchTerm] = useState("");
    const [projectFilter, setProjectFilter] = useState("");

  useEffect(() => {
      dispatch(fetchTestCaseByTestEngineer());
    }, [dispatch]);

 
  

  // Get unique projects and statuses for filter dropdowns
  const projects = [...new Set(tests.map((test) => test.project_name))];
  const statuses = [...new Set(tests.map(test => test.status))];
  const filteredTestCases = tests.filter(test => {
    const matchesSearch = test.test_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = projectFilter === '' || test.project_name === projectFilter;
    const matchesStatus = statusFilter === '' || test.status === statusFilter;
    return matchesSearch && matchesProject && matchesStatus;
  });
  
  // Function to handle row click - navigate to test case details
  const handleRowClick = (testId) => {
    navigate(`/testengineer_dashboard/tests/${testId}`);
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get priority color
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg">
      <div className="relative w-80 items-center mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search Test Cases..."
          className="w-full p-2 pl-10 bg-gray-100 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="border-1 border-dashed border-gray-100 mx-auto rounded-lg w-full">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Filters */}
          <div className="w-full flex mt-6 justify-end space-x-4">
            <select
              className="p-2 border border-gray-300 focus:outline-none rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <select
              className="p-2 border border-gray-300 focus:outline-none rounded-md"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>
        </div>
        
        <hr className="border-dashed border-gray-300 mt-2 mx-auto" />

        {/* Test Cases Table */}
        <div className='mt-4 p-3'>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 border-b">Test Case</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 border-b">Project</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 border-b">Status</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 border-b">Priority</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 border-b">Assignee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
  {filteredTestCases.length > 0 ? (
    filteredTestCases.map(test => (
      <tr key={test.id} onClick={() => handleRowClick(test.id)} className="hover:bg-gray-50 cursor-pointer">
        <td className="py-3 px-4">{test.test_title}</td>
        <td className="py-3 px-4">{test.project_name}</td>
        <td className="py-3 px-4">
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(test.status)}`}>
            {test.status}
          </span>
        </td>
        <td className="py-3 px-4">
          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(test.priority)}`}>
            {test.priority}
          </span>
        </td>
        <td className="py-3 px-4">{test.created_by}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
        {loading ? "Loading test cases..." : "No test cases found"}
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetails;