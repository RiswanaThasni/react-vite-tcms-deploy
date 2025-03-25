import { ChevronLeft } from 'lucide-react';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { viewProjectsByAdmin } from '../../../redux/slices/projectSlice';
import { useDispatch, useSelector } from 'react-redux';



const AdminProjectDetails = ({onBack}) => {
  const { projectId } = useParams();
  const navigate = useNavigate(); 
  const dispatch = useDispatch()

  const { projects, loading, error } = useSelector((state) => state.projects);
useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      dispatch(viewProjectsByAdmin(token));
    }
  }, [dispatch]);



  return (
    <div>
    <button
        onClick={onBack}
        className="flex items-center gap-2 font-medium text-gray-400 hover:text-gray-700 transition duration-200 mb-4"
      >
        <ChevronLeft size={20} />
        <span>Back to Projects</span>
      </button>

      <h2>Project Details for Project ID: {projectId}</h2>
      {/* Add your project details rendering logic */}
    </div>
  );
};

export default AdminProjectDetails;