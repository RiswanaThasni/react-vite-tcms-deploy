// import React, { useEffect, useState } from 'react';
// import { Search, Filter } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchTestCaseByTestEngineer } from '../../../redux/slices/testEngineerTestSlice';

// const TestDetails = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch()
//   const [statusFilter, setStatusFilter] = useState("");
//   const { tests = [], loading, error } = useSelector((state) => state.testDetails || {});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [projectFilter, setProjectFilter] = useState("");

//   useEffect(() => {
//     dispatch(fetchTestCaseByTestEngineer());
//   }, [dispatch]);

//   // Get unique projects and statuses for filter dropdowns
//   const projects = [...new Set(tests.map((test) => test.project_name))];
//   const statuses = [...new Set(tests.map(test => test.status))];
//   const filteredTestCases = tests.filter(test => {
//     const matchesSearch = test.test_title.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesProject = projectFilter === '' || test.project_name === projectFilter;
//     const matchesStatus = statusFilter === '' || test.status === statusFilter;
//     return matchesSearch && matchesProject && matchesStatus;
//   });
  
//   // Function to handle row click - navigate to test case details
//   const handleRowClick = (testId) => {
//     navigate(`/testengineer_dashboard/tests/${testId}`);
//   };

//   // Function to get status color
//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'passed': return 'bg-green-100 text-green-800';
//       case 'failed': return 'bg-red-100 text-red-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Function to get priority color
//   const getPriorityColor = (priority) => {
//     switch (priority.toLowerCase()) {
//       case 'critical': return 'bg-red-100 text-red-800';
//       case 'high': return 'bg-orange-100 text-orange-800';
//       case 'medium': return 'bg-blue-100 text-blue-800';
//       case 'low': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className='p-1'>
//       <div className="relative w-64 items-center mb-2">
//         <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
//         <input
//           type="text"
//           placeholder="Search Test Cases..."
//           className="w-full p-1 pl-8 bg-white rounded-md text-sm"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>
      
//       <div className="p-1 max-w-6xl mx-auto rounded-lg">
//         <div className="border-1 border-dashed bg-slate-100 border-gray-100 mx-auto rounded-lg w-full">
//           <div className="flex flex-col sm:flex-row gap-2 mb-3">
//             {/* Filters */}
//             <div className="w-full flex mt-3 justify-end space-x-2 px-2">
//               <select
//                 className="p-1 border bg-white border-gray-300 focus:outline-none rounded-md text-xs"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="">All Statuses</option>
//                 {statuses.map((status) => (
//                   <option key={status} value={status}>{status}</option>
//                 ))}
//               </select>
              
//               <select
//                 className="p-1 border bg-white border-gray-300 focus:outline-none rounded-md text-xs"
//                 value={projectFilter}
//                 onChange={(e) => setProjectFilter(e.target.value)}
//               >
//                 <option value="">All Projects</option>
//                 {projects.map((project) => (
//                   <option key={project} value={project}>{project}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
          
//           <hr className="border-dashed border-gray-300 mt-1 mx-auto" />

//           {/* Test Cases Table */}
//           <div className='mt-2 p-2'>
//             <div className="overflow-x-auto rounded-md border border-gray-200">
//               <table className="min-w-full bg-white text-xs">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="py-2 px-3 text-left font-medium text-gray-500 border-b">Test Case</th>
//                     <th className="py-2 px-3 text-left font-medium text-gray-500 border-b">Project</th>
//                     <th className="py-2 px-3 text-left font-medium text-gray-500 border-b">Status</th>
//                     <th className="py-2 px-3 text-left font-medium text-gray-500 border-b">Priority</th>
//                     <th className="py-2 px-3 text-left font-medium text-gray-500 border-b">Assignee</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredTestCases.length > 0 ? (
//                     filteredTestCases.map(test => (
//                       <tr key={test.id} onClick={() => handleRowClick(test.id)} className="hover:bg-gray-50 cursor-pointer">
//                         <td className="py-2 px-3">{test.test_title}</td>
//                         <td className="py-2 px-3">{test.project_name}</td>
//                         <td className="py-2 px-3">
//                           <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(test.status)}`}>
//                             {test.status}
//                           </span>
//                         </td>
//                         <td className="py-2 px-3">
//                           <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(test.priority)}`}>
//                             {test.priority}
//                           </span>
//                         </td>
//                         <td className="py-2 px-3">{test.created_by}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="5" className="py-3 px-3 text-center text-gray-500">
//                         {loading ? "Loading test cases..." : "No test cases found"}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TestDetails;



import React, { useEffect, useState } from 'react';
import { Search, Filter, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTestCaseByTestEngineer } from '../../../redux/slices/testEngineerTestSlice';

const TestDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(10);

  const { tests = [], loading, error } = useSelector((state) => state.testDetails || {});

  useEffect(() => {
    dispatch(fetchTestCaseByTestEngineer());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, projectFilter]);

  const projects = [...new Set(tests.map((test) => test.project_name))];
  const statuses = [...new Set(tests.map(test => test.status))];

  const filteredTestCases = tests.filter(test => {
    const matchesSearch = test.test_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = projectFilter === '' || test.project_name === projectFilter;
    const matchesStatus = statusFilter === '' || test.status === statusFilter;
    return matchesSearch && matchesProject && matchesStatus;
  });

  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = filteredTestCases.slice(indexOfFirstTest, indexOfLastTest);
  const totalPages = Math.ceil(filteredTestCases.length / testsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRowClick = (testId) => {
    navigate(`/testengineer_dashboard/tests/${testId}`);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
    <div className='p-1'>
      <div className="relative w-64 items-center mb-2">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
        <input
          type="text"
          placeholder="Search Test Cases..."
          className="w-full p-1 pl-8 bg-white rounded-md text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="p-1 max-w-6xl mx-auto rounded-lg">
        <div className="border-1 border-dashed bg-slate-200 border-gray-100 mx-auto rounded-lg w-full">
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <div className="w-full flex mt-3 justify-end space-x-2 px-2">
              <select
                className="p-1 border bg-white border-gray-300 focus:outline-none rounded-md text-xs"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                className="p-1 border bg-white border-gray-300 focus:outline-none rounded-md text-xs"
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

          <hr className="border-dashed border-gray-300 mt-1 mx-auto" />

          <div className='mt-2 p-2'>
            <div className="overflow-x-auto rounded-md border border-gray-200">
              <table className="min-w-full bg-white text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 text-left font-medium text-gray-500 border-b">Test Case</th>
                    <th className="py-2 px-3 text-left font-medium text-gray-500 border-b">Project</th>
                    <th className="py-2 px-3 text-left font-medium text-gray-500 border-b">Status</th>
                    <th className="py-2 px-3 text-left font-medium text-gray-500 border-b">Priority</th>
                    <th className="py-2 px-3 text-left font-medium text-gray-500 border-b">Assignee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentTests.length > 0 ? (
                    currentTests.map(test => (
                      <tr key={test.id} onClick={() => handleRowClick(test.id)} className="hover:bg-gray-50 cursor-pointer">
                        <td className="py-2 px-3">{test.test_title}</td>
                        <td className="py-2 px-3">{test.project_name}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(test.status)}`}>
                            {test.status}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(test.priority)}`}>
                            {test.priority}
                          </span>
                        </td>
                        <td className="py-2 px-3">{test.created_by}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-3 px-3 text-center text-gray-500">
                        {loading ? "Loading test cases..." : "No test cases found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredTestCases.length > 0 && (
              <div className="flex justify-between items-center px-2 py-4">
                <div className="text-xs text-gray-600">
                  Showing {indexOfFirstTest + 1} to {Math.min(indexOfLastTest, filteredTestCases.length)} of {filteredTestCases.length} test cases
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${
                      currentPage === 1
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'bg-gray-300 text-white hover:bg-lime-300'
                    }`}
                  >
                    <ChevronsLeft size={16} />
                  </button>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage >= totalPages}
                    className={`px-3 py-1 rounded ${
                      currentPage >= totalPages
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'bg-gray-300 text-white hover:bg-lime-300'
                    }`}
                  >
                    <ChevronsRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetails;
