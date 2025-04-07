
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { completeTestCase, getTestById, updateTestStep } from '../../../api/testApi';



const Tests = () => {
  const navigate = useNavigate();
  const { testId } = useParams();

  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isStepExpanded, setIsStepExpanded] = useState({});
  const [steps, setSteps] = useState([]);
  const [notes, setNotes] = useState({});
  const [stepErrors, setStepErrors] = useState({});
  const [savingSteps, setSavingSteps] = useState({});
  const [completingTest, setCompletingTest] = useState(false);
const [completionMessage, setCompletionMessage] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await getTestById(testId);
        setTestData(data);
        
        if (data.test_steps) {
          const formattedSteps = data.test_steps.map(step => ({
            id: step.id, 
            stepNumber: step.step_number,
            step: step.step_description,
            expectedResult: step.expected_result,
            status: step.status_details[0]?.status === 'pass' ? true : 
                    step.status_details[0]?.status === 'fail' ? false : null,
            status_details: step.status_details
          }));
          setSteps(formattedSteps);
        }
      } catch (err) {
        setError(err.message || "Failed to load test case");
      } finally {
        setLoading(false);
      }
    };
  
    if (testId) {
      fetchTest();
    }
  }, [testId]);
  
  const handleBackClick = () => {
    navigate('/testengineer_dashboard/test_details');
  };

 
const markStep = async (id, status) => {
  const step = steps.find(s => s.id === id);
  
  const statusDetailId = step?.status_details?.[0]?.id;
  
  if (!statusDetailId) {
    setStepErrors(prev => ({...prev, [id]: "No status detail found for this step"}));
    return;
  }
  
  setSavingSteps(prev => ({...prev, [id]: true}));
  
  setSteps(prevSteps => prevSteps.map(s => 
    s.id === id ? { ...s, status } : s
  ));
  
  try {
    const remark = notes[id] || '';
    
    await updateTestStep(statusDetailId, status ? 'pass' : 'fail', remark);
    
    setSteps(prevSteps => prevSteps.map(s => {
      if (s.id === id && s.status_details && s.status_details.length > 0) {
        const updatedStatusDetails = [...s.status_details];
        updatedStatusDetails[0] = {
          ...updatedStatusDetails[0],
          status: status ? 'pass' : 'fail',
          remarks: remark  
        };
        
        return {
          ...s,
          status,
          status_details: updatedStatusDetails
        };
      }
      return s;
    }));
    
    if (stepErrors[id]) {
      setStepErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[id];
        return newErrors;
      });
    }
  } catch (error) {
    console.error('Failed to update step status:', error);
    setStepErrors(prev => ({...prev, [id]: error.message}));
    
    setSteps(prevSteps => prevSteps.map(s => 
      s.id === id ? { ...s, status: step.status } : s
    ));
  } finally {
    setSavingSteps(prev => {
      const newSaving = {...prev};
      delete newSaving[id];
      return newSaving;
    });
  }
};
  const handleFileUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prevFiles => [...prevFiles, ...files]);
  }, []);

  const toggleStepExpansion = (id) => {
    setIsStepExpanded({
      ...isStepExpanded,
      [id]: !isStepExpanded[id]
    });
  };

const handleNoteChange = (id, note) => {
  setNotes({
    ...notes,
    [id]: note
  });
  
};

  if (loading) {
    return <div className="p-4 text-center">Loading test case details...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (!testData) {
    return <div className="p-4 text-center">No test case found with ID {testId}</div>;
  }

  const formattedTestData = {
    "ID": testData.test_id || testData.id,
    "Title": testData.test_title,
    "Description": testData.test_description,
    "Priority": testData.priority,
    "Status": testData.status,
    "Type": testData.test_type_name,
    "Created By": testData.created_by,
    "Due Date": testData.due_date,
    "Due Status": testData.due_status,
    "Module": testData.module_name,
    "Project": testData.project_name,
    "Precondition": testData.precondition,
    "Postcondition": testData.postcondition
  };

  const allStepsChecked = steps.every(step => step.status !== null);

  const hasFailedSteps = steps.some(step => step.status === false);

  const handleCompleteTest = async () => {
    setCompletingTest(true);
    
    try {
      // Use the user_test_case_id instead of id or test_id
      const userTestCaseId = testData.user_test_case_id;
      await completeTestCase(userTestCaseId);
      
      setTestData(prev => ({
        ...prev,
        status: 'Completed'
      }));
      
      setCompletionMessage({
        type: 'success',
        text: 'Test case successfully marked as complete!'
      });
      
    } catch (error) {
      console.error('Failed to complete test case:', error);
      setCompletionMessage({
        type: 'error',
        text: error.message || 'Failed to complete test case. Please try again.'
      });
    } finally {
      setCompletingTest(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleBackClick}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to Test List
      </button>


      {completionMessage && (
  <div className={`p-3 mb-4 rounded ${
    completionMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
  }`}>
    {completionMessage.text}
  </div>
)}

      <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium mb-4">Test Case Details {formattedTestData.ID ? `#${formattedTestData.ID}` : ''}</h2>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(formattedTestData).map(([key, value], index) => (
                <tr key={index} className={key === "Description" ? "align-top" : ""}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 w-1/4">
                    {key}
                  </td>
                  <td className={`px-4 py-3 text-sm text-gray-500 ${
                    key === "Description" ? "whitespace-normal break-words" : "whitespace-nowrap"
                  }`}>
                    {key === "Status" ? (
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        value === 'Completed' || value === 'passed' ? 'bg-green-100 text-green-800' :
                        value === 'Failed' || value === 'failed' ? 'bg-red-100 text-red-800' :
                        value === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {value}
                      </span>
                    ) : (
                      <div>{value}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Test Steps</h3>

          <div className="space-y-4">
            {steps.length > 0 ? (
              steps.map((step) => (
                <div key={step.id} className="border rounded-lg border-gray-200">
                  <div 
                    className={`p-4 cursor-pointer ${
                      step.status === true ? 'bg-green-50' : 
                      step.status === false ? 'bg-red-50' : 'bg-white'
                    }`}
                    onClick={() => toggleStepExpansion(step.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {step.status === true && <CheckCircle size={18} className="text-green-500 mr-2" />}
                        {step.status === false && <AlertCircle size={18} className="text-red-500 mr-2" />}
                        <span className="font-medium">Step {step.id}: {step.step}</span>
                      </div>
                      <div>
                        {step.status === null ? (
                          <span className="text-gray-500 text-sm">Not tested</span>
                        ) : step.status ? (
                          <span className="text-green-500 text-sm">Pass</span>
                        ) : (
                          <span className="text-red-500 text-sm">Fail</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isStepExpanded[step.id] && (
                    <div className="p-4 border-t">
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700">Expected Result:</p>
                        <p className="text-sm text-gray-600 mt-1">{step.expectedResult}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700">Notes:</p>
                        <textarea
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          rows="2"
                          placeholder="Add any notes or observations here..."
                          value={notes[step.id] || ''}
                          onChange={(e) => handleNoteChange(step.id, e.target.value)}
                        ></textarea>
                      </div>

                      <div className="flex space-x-2">
  <button
    className={`px-3 py-1 rounded ${
      step.status === true 
        ? 'bg-green-600 text-white' 
        : 'bg-green-100 text-green-700 hover:bg-green-200'
    }`}
    onClick={() => markStep(step.id, true)}
    disabled={savingSteps[step.id] || step.status !== null}
  >
    {savingSteps[step.id] ? 'Saving...' : 'Pass'}
  </button>
  <button
    className={`px-3 py-1 rounded ${
      step.status === false 
        ? 'bg-red-600 text-white' 
        : 'bg-red-100 text-red-700 hover:bg-red-200'
    }`}
    onClick={() => markStep(step.id, false)}
    disabled={savingSteps[step.id] || step.status !== null}
  >
    {savingSteps[step.id] ? 'Saving...' : 'Fail'}
  </button>
</div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-gray-500">No test steps available</div>
            )}
          </div>
        </div>

        {testData.test_comments && testData.test_comments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Comments</h3>
            <div className="space-y-3">
              {testData.test_comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between">
                    <span className="font-medium">{comment.user_name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-600">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 border p-4 rounded-md">
          <h3 className="font-medium mb-2">Evidence Attachments</h3>
          <p className="text-sm text-gray-500 mb-4">Upload screenshots, videos, or any other evidence for this test case</p>
          
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload size={24} className="text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">Images, videos or documents</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                multiple 
                onChange={handleFileUpload} 
              />
            </label>
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Uploaded Files ({uploadedFiles.length})</h4>
              <ul className="text-sm text-gray-600">
                {uploadedFiles.map((file, index) => (
                  <li key={index} className="flex items-center py-1">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 justify-between mt-6">
          <div className="flex gap-2">
          <button 
  className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400" 
  disabled={!allStepsChecked || hasFailedSteps || completingTest || testData.status === 'Completed'}
  onClick={handleCompleteTest}
>
  {completingTest ? 'Processing...' : 'Mark Test as Complete Successfully'}
</button>
<button 
  className="bg-red-600 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-red-700"
  disabled={!hasFailedSteps}
  onClick={() => navigate(`/testengineer_dashboard/tests/bugs/${testId}`, { replace: true })}>
  Raise a Bug
</button>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default Tests;



// import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react';
// import React, { useCallback, useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { completeTestCase, getTestById, updateTestStep } from '../../../api/testApi';

// const Tests = () => {
//   const navigate = useNavigate();
//   const { testId } = useParams();

//   const [testData, setTestData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [isStepExpanded, setIsStepExpanded] = useState({});
//   const [steps, setSteps] = useState([]);
//   const [notes, setNotes] = useState({});
//   const [stepErrors, setStepErrors] = useState({});
//   const [savingSteps, setSavingSteps] = useState({});
//   const [completingTest, setCompletingTest] = useState(false);
//   const [completionMessage, setCompletionMessage] = useState(null);

//   useEffect(() => {
//     const fetchTest = async () => {
//       try {
//         const data = await getTestById(testId);
//         setTestData(data);
        
//         if (data.test_steps) {
//           const formattedSteps = data.test_steps.map(step => ({
//             id: step.id, 
//             stepNumber: step.step_number,
//             step: step.step_description,
//             expectedResult: step.expected_result,
//             status: step.status_details[0]?.status === 'pass' ? true : 
//                     step.status_details[0]?.status === 'fail' ? false : null,
//             status_details: step.status_details
//           }));
//           setSteps(formattedSteps);
//         }
//       } catch (err) {
//         setError(err.message || "Failed to load test case");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     if (testId) {
//       fetchTest();
//     }
//   }, [testId]);
  
//   const handleBackClick = () => {
//     navigate('/testengineer_dashboard/test_details');
//   };

//   const markStep = async (id, status) => {
//     const step = steps.find(s => s.id === id);
    
//     const statusDetailId = step?.status_details?.[0]?.id;
    
//     if (!statusDetailId) {
//       setStepErrors(prev => ({...prev, [id]: "No status detail found for this step"}));
//       return;
//     }
    
//     setSavingSteps(prev => ({...prev, [id]: true}));
    
//     setSteps(prevSteps => prevSteps.map(s => 
//       s.id === id ? { ...s, status } : s
//     ));
    
//     try {
//       const remark = notes[id] || '';
      
//       await updateTestStep(statusDetailId, status ? 'pass' : 'fail', remark);
      
//       setSteps(prevSteps => prevSteps.map(s => {
//         if (s.id === id && s.status_details && s.status_details.length > 0) {
//           const updatedStatusDetails = [...s.status_details];
//           updatedStatusDetails[0] = {
//             ...updatedStatusDetails[0],
//             status: status ? 'pass' : 'fail',
//             remarks: remark  
//           };
          
//           return {
//             ...s,
//             status,
//             status_details: updatedStatusDetails
//           };
//         }
//         return s;
//       }));
      
//       if (stepErrors[id]) {
//         setStepErrors(prev => {
//           const newErrors = {...prev};
//           delete newErrors[id];
//           return newErrors;
//         });
//       }
//     } catch (error) {
//       console.error('Failed to update step status:', error);
//       setStepErrors(prev => ({...prev, [id]: error.message}));
      
//       setSteps(prevSteps => prevSteps.map(s => 
//         s.id === id ? { ...s, status: step.status } : s
//       ));
//     } finally {
//       setSavingSteps(prev => {
//         const newSaving = {...prev};
//         delete newSaving[id];
//         return newSaving;
//       });
//     }
//   };

//   const handleFileUpload = useCallback((e) => {
//     const files = Array.from(e.target.files);
//     setUploadedFiles(prevFiles => [...prevFiles, ...files]);
//   }, []);

//   const toggleStepExpansion = (id) => {
//     setIsStepExpanded({
//       ...isStepExpanded,
//       [id]: !isStepExpanded[id]
//     });
//   };

//   const handleNoteChange = (id, note) => {
//     setNotes({
//       ...notes,
//       [id]: note
//     });
//   };

//   if (loading) {
//     return <div className="p-2 text-center text-xs">Loading test case details...</div>;
//   }

//   if (error) {
//     return <div className="p-2 text-center text-xs text-red-500">Error: {error}</div>;
//   }

//   if (!testData) {
//     return <div className="p-2 text-center text-xs">No test case found with ID {testId}</div>;
//   }

//   const formattedTestData = {
//     "ID": testData.test_id || testData.id,
//     "Title": testData.test_title,
//     "Description": testData.test_description,
//     "Priority": testData.priority,
//     "Status": testData.status,
//     "Type": testData.test_type_name,
//     "Created By": testData.created_by,
//     "Due Date": testData.due_date,
//     "Due Status": testData.due_status,
//     "Module": testData.module_name,
//     "Project": testData.project_name,
//     "Precondition": testData.precondition,
//     "Postcondition": testData.postcondition
//   };

//   const allStepsChecked = steps.every(step => step.status !== null);
//   const hasFailedSteps = steps.some(step => step.status === false);

//   const handleCompleteTest = async () => {
//     setCompletingTest(true);
    
//     try {
//       const userTestCaseId = testData.id || testData.test_id;
//       await completeTestCase(userTestCaseId);
      
//       setTestData(prev => ({
//         ...prev,
//         status: 'Completed'
//       }));
      
//       setCompletionMessage({
//         type: 'success',
//         text: 'Test case successfully marked as complete!'
//       });
      
//     } catch (error) {
//       console.error('Failed to complete test case:', error);
//       setCompletionMessage({
//         type: 'error',
//         text: error.message || 'Failed to complete test case. Please try again.'
//       });
//     } finally {
//       setCompletingTest(false);
//     }
//   };


//   // const handleCompleteTest = async () => {
//   //   setCompletingTest(true);
//   //   setCompletionMessage(null);
    
//   //   try {
//   //     if (!testData.user_test_case_id) {
//   //       throw new Error("User test case ID not found");
//   //     }
  
//   //     await completeTestCase(testData.user_test_case_id);
      
//   //     setTestData(prev => ({
//   //       ...prev,
//   //       status: 'completed'
//   //     }));
      
//   //     setCompletionMessage({
//   //       type: 'success',
//   //       text: 'Test case successfully marked as complete!'
//   //     });
      
//   //   } catch (error) {
//   //     console.error('Failed to complete test case:', error);
//   //     setCompletionMessage({
//   //       type: 'error',
//   //       text: error.message || 'Failed to complete test case. Please try again.'
//   //     });
//   //   } finally {
//   //     setCompletingTest(false);
//   //   }
//   // };

//   return (
//     <div className="p-2">
//       <button
//         onClick={handleBackClick}
//         className="flex items-center text-gray-600 hover:text-gray-900 mb-1 text-xs"
//       >
//         <ArrowLeft size={14} className="mr-1" />
//         Back to Test List
//       </button>

//       {completionMessage && (
//         <div className={`p-2 mb-2 rounded text-xs ${
//           completionMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//         }`}>
//           {completionMessage.text}
//         </div>
//       )}

//       <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
//         <h2 className="text-sm font-medium mb-2">Test Case Details {formattedTestData.ID ? `#${formattedTestData.ID}` : ''}</h2>

//         <div className="overflow-x-auto mb-3">
//           <table className="min-w-full divide-y divide-gray-200">
//             <tbody className="bg-white divide-y divide-gray-200 text-xs">
//               {Object.entries(formattedTestData).map(([key, value], index) => (
//                 <tr key={index} className={key === "Description" ? "align-top" : ""}>
//                   <td className="px-2 py-1 whitespace-nowrap font-medium text-gray-900 w-1/4">
//                     {key}
//                   </td>
//                   <td className={`px-2 py-1 text-gray-500 ${
//                     key === "Description" ? "whitespace-normal break-words" : "whitespace-nowrap"
//                   }`}>
//                     {key === "Status" ? (
//                       <span className={`px-1 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         value === 'Completed' || value === 'passed' ? 'bg-green-100 text-green-800' :
//                         value === 'Failed' || value === 'failed' ? 'bg-red-100 text-red-800' :
//                         value === 'In Progress' ? 'bg-blue-100 text-blue-800' :
//                         'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {value}
//                       </span>
//                     ) : (
//                       <div>{value}</div>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="mt-3">
//           <h3 className="text-sm font-medium mb-2">Test Steps</h3>

//           <div className="space-y-2">
//             {steps.length > 0 ? (
//               steps.map((step) => (
//                 <div key={step.id} className="border rounded-lg border-gray-200">
//                   <div 
//                     className={`p-2 cursor-pointer text-xs ${
//                       step.status === true ? 'bg-green-50' : 
//                       step.status === false ? 'bg-red-50' : 'bg-white'
//                     }`}
//                     onClick={() => toggleStepExpansion(step.id)}
//                   >
//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center">
//                         {step.status === true && <CheckCircle size={14} className="text-green-500 mr-1" />}
//                         {step.status === false && <AlertCircle size={14} className="text-red-500 mr-1" />}
//                         <span className="font-medium">Step {step.id}: {step.step}</span>
//                       </div>
//                       <div>
//                         {step.status === null ? (
//                           <span className="text-gray-500">Not tested</span>
//                         ) : step.status ? (
//                           <span className="text-green-500">Pass</span>
//                         ) : (
//                           <span className="text-red-500">Fail</span>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {isStepExpanded[step.id] && (
//                     <div className="p-2 border-t text-xs">
//                       <div className="mb-2">
//                         <p className="font-medium text-gray-700">Expected Result:</p>
//                         <p className="text-gray-600 mt-0.5">{step.expectedResult}</p>
//                       </div>

//                       <div className="mb-2">
//                         <p className="font-medium text-gray-700">Notes:</p>
//                         <textarea
//                           className="mt-0.5 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs"
//                           rows="2"
//                           placeholder="Add any notes or observations here..."
//                           value={notes[step.id] || ''}
//                           onChange={(e) => handleNoteChange(step.id, e.target.value)}
//                         ></textarea>
//                       </div>

//                       <div className="flex space-x-2">
//                         <button
//                           className={`px-2 py-0.5 rounded text-xs ${
//                             step.status === true 
//                               ? 'bg-green-600 text-white' 
//                               : 'bg-green-100 text-green-700 hover:bg-green-200'
//                           }`}
//                           onClick={() => markStep(step.id, true)}
//                           disabled={savingSteps[step.id] || step.status !== null}
//                         >
//                           {savingSteps[step.id] ? 'Saving...' : 'Pass'}
//                         </button>
//                         <button
//                           className={`px-2 py-0.5 rounded text-xs ${
//                             step.status === false 
//                               ? 'bg-red-600 text-white' 
//                               : 'bg-red-100 text-red-700 hover:bg-red-200'
//                           }`}
//                           onClick={() => markStep(step.id, false)}
//                           disabled={savingSteps[step.id] || step.status !== null}
//                         >
//                           {savingSteps[step.id] ? 'Saving...' : 'Fail'}
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <div className="text-center p-2 text-gray-500 text-xs">No test steps available</div>
//             )}
//           </div>
//         </div>

//         {testData.test_comments && testData.test_comments.length > 0 && (
//           <div className="mt-3">
//             <h3 className="text-sm font-medium mb-2">Comments</h3>
//             <div className="space-y-2">
//               {testData.test_comments.map((comment) => (
//                 <div key={comment.id} className="bg-gray-50 p-2 rounded text-xs">
//                   <div className="flex justify-between">
//                     <span className="font-medium">{comment.user_name}</span>
//                     <span className="text-gray-500">
//                       {new Date(comment.created_at).toLocaleString()}
//                     </span>
//                   </div>
//                   <p className="mt-0.5 text-gray-600">{comment.content}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="mt-3 border p-2 rounded-md">
//           <h3 className="text-sm font-medium mb-1">Evidence Attachments</h3>
//           <p className="text-xs text-gray-500 mb-2">Upload screenshots, videos, or any other evidence for this test case</p>
          
//           <div className="flex items-center justify-center w-full">
//             <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//               <div className="flex flex-col items-center justify-center pt-3 pb-3">
//                 <Upload size={18} className="text-gray-400" />
//                 <p className="mb-1 text-xs text-gray-500">
//                   <span className="font-semibold">Click to upload</span> or drag and drop
//                 </p>
//                 <p className="text-xs text-gray-500">Images, videos or documents</p>
//               </div>
//               <input 
//                 type="file" 
//                 className="hidden" 
//                 multiple 
//                 onChange={handleFileUpload} 
//               />
//             </label>
//           </div>
          
//           {uploadedFiles.length > 0 && (
//             <div className="mt-2">
//               <h4 className="text-xs font-medium mb-1">Uploaded Files ({uploadedFiles.length})</h4>
//               <ul className="text-xs text-gray-600">
//                 {uploadedFiles.map((file, index) => (
//                   <li key={index} className="flex items-center py-0.5">
//                     <CheckCircle size={12} className="text-green-500 mr-1" />
//                     {file.name}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>

//         <div className="flex flex-wrap gap-2 justify-between mt-3">
//           <div className="flex gap-2">
//             <button 
//               className="bg-green-600 text-white px-2 py-1 rounded text-xs disabled:bg-gray-400" 
//               disabled={!allStepsChecked || hasFailedSteps || completingTest || testData.status === 'Completed'}
//               onClick={handleCompleteTest}
//             >
//               {completingTest ? 'Processing...' : 'Mark Test as Complete'}
//             </button>
//             <button 
//               className="bg-red-600 text-white px-2 py-1 rounded text-xs disabled:bg-gray-400 hover:bg-red-700"
//               disabled={!hasFailedSteps}
//               onClick={() => navigate(`/testengineer_dashboard/tests/bugs/${testId}`, { replace: true })}
//             >
//               Raise a Bug
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Tests;