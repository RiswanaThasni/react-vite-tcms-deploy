import React, { useEffect, useState } from 'react';
import { Calendar, AlertCircle, Search, Filter } from 'lucide-react';
import { fetchTests } from '../../../redux/slices/testCaseSlice';
import { useDispatch, useSelector } from 'react-redux';

const TestTrack = () => {
  const dispatch = useDispatch();
  const { tests = [], loading, error } = useSelector((state) => state.tests);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Function to determine priority color
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-blue-500";
    }
  };

  // Function to determine due date status
  const getDueDateStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { text: "Overdue", class: "text-red-600" };
    if (daysLeft === 0) return { text: "Due today", class: "text-orange-600" };
    if (daysLeft <= 2) return { text: `Due in ${daysLeft} days`, class: "text-yellow-600" };
    return { text: `${daysLeft} days left`, class: "text-green-600" };
  };

  useEffect(() => {
    dispatch(fetchTests());
  }, [dispatch]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter and sort tests
  const filteredTests = tests
    .filter(test => {
      // Search filter
      if (searchTerm && !test.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !test.module.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !test.tester.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Priority filter
      if (filter !== "all" && test.priority.toLowerCase() !== filter) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => b.completionPercentage - a.completionPercentage);

  return (
    <div className='p-2'>
    <div className="relative w-80 flex items-center mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search Tests..."
          className="w-full p-2 pl-10 bg-white rounded-lg"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
<div className="w-full mx-auto bg-white">
      
    
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
       
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading tests...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-100 p-4 rounded-lg mb-6">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}
      
      {/* Tests Progress Line */}
      {!loading && !error && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium text-gray-700">Test Progress</h2>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                {filteredTests.length} Tests
              </span>
            </div>
          </div>

          {/* Progress Lines */}
          <div className="space-y-4">
            {filteredTests.length > 0 ? (
              filteredTests.map((test) => (
                <div key={test.id} className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(test.priority)} mr-2`}></div>
                        <h3 className="text-md font-medium text-gray-800">{test.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{test.module}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
                      <div className="flex items-center text-xs text-gray-600">
                        <Calendar size={14} className="mr-1" />
                        <span className={getDueDateStatus(test.dueDate).class}>
                          {getDueDateStatus(test.dueDate).text}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <AlertCircle size={14} className="mr-1" />
                        <span>{test.priority}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{test.completionPercentage}% complete</span>
                      <span className="text-sm text-gray-500">{test.tester}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          test.completionPercentage >= 75 ? "bg-green-500" : 
                          test.completionPercentage >= 50 ? "bg-blue-500" : 
                          test.completionPercentage >= 25 ? "bg-yellow-500" : "bg-red-500"
                        }`} 
                        style={{width: `${test.completionPercentage}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No tests match your current filters
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
    
  );
};

export default TestTrack;