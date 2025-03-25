import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { viewProjectsByProjectManager } from '../../../redux/slices/projectSlice';
import { useParams } from 'react-router-dom';

const ProjectDetails = () => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  console.log("Project ID:", projectId); // Debugging
    const { projects, loading, error } = useSelector((state) => state.projects);
  const [project, setProject] = useState(null);

  useEffect(() => {
    // Fetch project data when component mounts
    dispatch(viewProjectsByProjectManager(projectId));
  }, [dispatch, projectId]);

  useEffect(() => {
    // When projects are loaded, find the current project by ID
    if (projects && projects.length > 0) {
      setProject(projects.find(p => p.project_id === projectId) || projects[0]);
    }
  }, [projects, projectId]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="bg-red-100 text-red-800 p-4 rounded">Error: {error}</div>;
  if (!project) return <div className="p-6">No project data available</div>;

  // Transform backend data structure to match component expectations
  const transformedProject = {
    id: project.project_id,
    name: project.project_name,
    description: project.project_description,
    status: project.status,
    manager: project.project_lead ? `${project.project_lead.first_name} ${project.project_lead.last_name}` : 'Not Assigned',
    createdDate: new Date(project.created_at).toLocaleDateString(),
    deadline: new Date(project.deadline).toLocaleDateString(),
    completion: `${Math.round(project.progress * 100)}%`,
    modules: project.modules.map(module => ({
      id: module.id,
      name: module.module_name,
      description: module.module_description,
      // Transform tasks, test cases, and bugs if they exist in your backend
      tasks: module.tasks ? module.tasks.map(task => ({
        id: task.id,
        name: task.task_name,
        status: task.status,
        assignee: task.assignee ? `${task.assignee.first_name} ${task.assignee.last_name}` : 'Unassigned',
        dueDate: new Date(task.due_date).toLocaleDateString(),
        description: task.task_description
      })) : [],
      testCases: module.test_cases ? module.test_cases.map(testCase => ({
        id: testCase.id,
        name: testCase.test_case_name || `TC-${testCase.id}`,
        description: testCase.description
      })) : [],
      bugs: module.bugs ? module.bugs.map(bug => ({
        id: bug.id,
        name: bug.bug_name || `BUG-${bug.id}`,
        status: bug.status,
        reporter: bug.reporter ? `${bug.reporter.first_name} ${bug.reporter.last_name}` : 'Unknown',
        reportDate: new Date(bug.created_at).toLocaleDateString(),
        description: bug.description
      })) : []
    }))
  };

  return (
    <main className="bg-gray-100 p-6">
      <ProjectHeader project={transformedProject} />
      <ModulesGrid modules={transformedProject.modules} />
    </main>
  );
};

const ProjectHeader = ({ project }) => (
  <header className="bg-white p-5 mb-5 border border-gray-200">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-bold">{project.name}</h1>
      <StatusBadge status={project.status} />
    </div>
    
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <MetaItem label="Project Manager" value={project.manager} />
      <MetaItem label="Created Date" value={project.createdDate} />
      <MetaItem label="Deadline" value={project.deadline} />
      <MetaItem label="Completion" value={project.completion} />
    </section>
    
    <p className="text-gray-600">{project.description}</p>
  </header>
);

const MetaItem = ({ label, value }) => (
  <div className="border border-gray-200 p-3">
    <h4 className="text-sm text-gray-500">{label}</h4>
    <p>{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const getStatusClasses = () => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'in progress': 
      case 'ongoing': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'to do': 
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  return (
    <span className={`px-3 py-1 border rounded text-sm ${getStatusClasses()}`}>
      {status || 'Unknown'}
    </span>
  );
};

const ModulesGrid = ({ modules }) => (
  <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
    {modules.map(module => (
      <ModuleCard key={module.id} module={module} />
    ))}
  </section>
);

const ModuleCard = ({ module }) => {
  const [activeTab, setActiveTab] = useState('tasks');
  
  return (
    <article className="bg-white border border-gray-200">
      <header className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">{module.name}</h2>
      </header>
      
      <section className="p-4">
        <p className="text-gray-600 mb-4">{module.description}</p>
        
        <nav className="flex border-b mb-4">
          <TabButton 
            label="Tasks" 
            isActive={activeTab === 'tasks'} 
            onClick={() => setActiveTab('tasks')} 
          />
          <TabButton 
            label="Test Cases" 
            isActive={activeTab === 'testCases'} 
            onClick={() => setActiveTab('testCases')} 
          />
          <TabButton 
            label="Bugs" 
            isActive={activeTab === 'bugs'} 
            onClick={() => setActiveTab('bugs')} 
          />
        </nav>
        
        {activeTab === 'tasks' && <TasksTab tasks={module.tasks || []} />}
        {activeTab === 'testCases' && <TestCasesTab testCases={module.testCases || []} />}
        {activeTab === 'bugs' && <BugsTab bugs={module.bugs || []} />}
      </section>
    </article>
  );
};

const TabButton = ({ label, isActive, onClick }) => (
  <button
    className={`px-4 py-2 text-sm ${
      isActive 
        ? 'border-b-2 border-gray-600 text-gray-800' 
        : 'text-gray-500 hover:text-gray-700'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const TasksTab = ({ tasks }) => {
  if (tasks.length === 0) return <p className="text-gray-500">No tasks available.</p>;
  
  return (
    <div>
      <h3 className="text-lg mb-3">Tasks</h3>
      {tasks.map(task => (
        <div key={task.id} className="border border-gray-200 p-3 mb-3">
          <div className="flex justify-between">
            <h4>{task.name}</h4>
            <StatusBadge status={task.status} />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Assignee: {task.assignee}</span>
            <span>Due: {task.dueDate}</span>
          </div>
          <p className="mt-2 text-sm">{task.description}</p>
        </div>
      ))}
    </div>
  );
};

const TestCasesTab = ({ testCases }) => {
  if (testCases.length === 0) return <p className="text-gray-500">No test cases available.</p>;
  
  return (
    <div>
      <h3 className="text-lg mb-3">Test Cases</h3>
      {testCases.map(testCase => (
        <div key={testCase.id} className="border border-gray-200 p-3 mb-3">
          <h4>{testCase.name}</h4>
          <p className="mt-2 text-sm">{testCase.description}</p>
        </div>
      ))}
    </div>
  );
};

const BugsTab = ({ bugs }) => {
  if (bugs.length === 0) return <p className="text-gray-500">No bugs reported yet.</p>;
  
  return (
    <div>
      <h3 className="text-lg mb-3">Bugs</h3>
      {bugs.map(bug => (
        <div key={bug.id} className="border border-gray-200 p-3 mb-3">
          <div className="flex justify-between">
            <h4>{bug.name}</h4>
            <StatusBadge status={bug.status} />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Reported by: {bug.reporter}</span>
            <span>{bug.reportDate}</span>
          </div>
          <p className="mt-2 text-sm">{bug.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ProjectDetails;