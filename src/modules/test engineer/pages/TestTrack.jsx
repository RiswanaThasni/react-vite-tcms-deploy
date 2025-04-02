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
    <div className='p-3'>
      <div className="relative w-64 items-center mb-2">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
        <input
          type="text"
          placeholder="Search Tests..."
          className="w-full p-1 pl-8 bg-white rounded-md text-sm"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="p-1 max-w-6xl mx-auto rounded-lg">
        <div className="border-1 border-dashed bg-slate-100 border-gray-100 mx-auto rounded-lg w-full">
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            {/* Filter options could go here */}
            <div className="w-full flex mt-3 justify-end space-x-2 px-2">
              <select
                className="p-1 border bg-white border-gray-300 focus:outline-none rounded-md text-xs"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          
          <hr className="border-dashed border-gray-300 mt-1 mx-auto" />

          {/* Loading State */}
          {loading && (
            <div className="text-center py-4">
              <p className="text-gray-600 text-sm">Loading tests...</p>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="bg-red-100 p-2 rounded-lg mb-3 mx-2">
              <p className="text-red-700 text-sm">Error: {error}</p>
            </div>
          )}
          
          {/* Tests Progress Line */}
          {!loading && !error && (
            <div className="mt-2 p-2">
              <div className="flex justify-between items-center mb-2 px-1">
                <h2 className="text-sm font-medium text-gray-700">Test Progress</h2>
                <div className="flex space-x-1">
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                    {filteredTests.length} Tests
                  </span>
                </div>
              </div>

              {/* Progress Lines */}
              <div className="space-y-2">
                {filteredTests.length > 0 ? (
                  filteredTests.map((test) => (
                    <div key={test.id} className="bg-white p-2 rounded-md shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(test.priority)} mr-1`}></div>
                            <h3 className="text-sm font-medium text-gray-800">{test.name}</h3>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{test.module}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-1 md:mt-0">
                          <div className="flex items-center text-xs text-gray-600">
                            <Calendar size={14} className="mr-1" />
                            <span className={getDueDateStatus(test.dueDate).class + " text-xs"}>
                              {getDueDateStatus(test.dueDate).text}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <AlertCircle size={14} className="mr-1" />
                            <span className="text-xs">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                test.priority.toLowerCase() === "high" ? "bg-red-100 text-red-800" : 
                                test.priority.toLowerCase() === "medium" ? "bg-orange-100 text-orange-800" : 
                                "bg-green-100 text-green-800"
                              }`}>
                                {test.priority}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-2">
                        <div className="flex justify-between mb-0.5">
                          <span className="text-xs font-medium text-gray-700">{test.completionPercentage}% complete</span>
                          <span className="text-xs text-gray-500">{test.tester}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
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
                  <div className="text-center py-4 bg-white rounded-md border border-gray-200">
                    <p className="text-gray-500 text-sm">No tests match your current filters</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestTrack;