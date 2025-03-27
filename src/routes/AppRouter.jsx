import React from 'react'
import { BrowserRouter as Router , Routes ,Route,Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import AdminDashboard from '../modules/admin/pages/AdminDashboard'
import PrivateRoute from './PrivateRoute'
import ForgotPassword from '../pages/ForgotPassword'
import ForgotPasswordConfirmation from '../pages/ForgotPasswordConfirmation'
import ChangePassword from '../pages/ChangePassword'
import UserManagement from '../modules/admin/pages/UserManagement'
import ViewProject from '../modules/admin/pages/ViewProject'
import Report from '../modules/admin/pages/Report'
import MainSection from '../modules/admin/pages/MainSection'
import ProjectManagerDashboard from '../modules/project manager/pages/ProjectManagerDashboard'
import ProjectManagement from '../modules/project manager/pages/ProjectManagement'
import TaskManagement from '../modules/project manager/pages/TaskManagement'
import ReportAnalysis from '../modules/project manager/pages/ReportAnalysis'
import PmMainSection from '../modules/project manager/pages/PmMainSection'
import CreateProject from '../modules/project manager/pages/CreateProject'
import QaDashboard from '../modules/qa/pages/QaDashboard'
import QaMainSection from '../modules/qa/pages/QaMainSection'
import ReportQa from '../modules/qa/pages/ReportQa'
import TestCaseManagement from '../modules/qa/pages/TestCaseManagement'
import CreateTestCase from '../modules/qa/pages/CreateTestCase'
import BugManagement from '../modules/qa/pages/BugManagement'
import DeveloperDashboard from '../modules/developer/pages/DeveloperDashboard'
import DevMainSection from '../modules/developer/pages/DevMainSection'
import TaskDetails from '../modules/developer/pages/TaskDetails'
import TrackTask from '../modules/developer/pages/TrackTask'
import TestDetails from '../modules/test engineer/pages/TestDetails'
import TestMainSection from '../modules/test engineer/pages/TestMainSection'
import TestTrack from '../modules/test engineer/pages/TestTrack'
import TestEngineerDashboard from '../modules/test engineer/pages/TestEngineerDashboard'
import Tasks from '../modules/developer/pages/Tasks'
import Tests from '../modules/test engineer/pages/Tests'
import ProjectDetails from '../modules/project manager/pages/ProjectDetails'
import Bugs from '../modules/test engineer/pages/Bugs'
import AdminProjectDetails from '../modules/admin/pages/AdminProjectDetails'


const AppRouter = () => {
  return (
    <div>
      <Router>
            <Routes>
                  <Route path='/' element={<Login/>}/>
                  <Route path='/forgot_password' element={<ForgotPassword/>}/>
                  <Route path='/forgot-password-confirmation' element={<ForgotPasswordConfirmation/>}/>
                  <Route path='/reset-password/:uid/:token' element={<ChangePassword/>}/>
                  
                  
                  
                  <Route element={<PrivateRoute allowedRoles={["Admin"]} />}>
  <Route path="/admin_dashboard" element={<AdminDashboard />}>
    <Route index element={<Navigate to="mainsection" replace />} />
    <Route path="mainsection" element={<MainSection />} />
    <Route path="/admin_dashboard/user_management" element={<UserManagement />} />
    <Route path="/admin_dashboard/overview" element={<ViewProject />} />
    <Route path="/admin_dashboard/report_analysis" element={<Report />} />
    <Route path='/admin_dashboard/project_details/:projectId' element={<AdminProjectDetails/>}/>
  </Route>
</Route>

<Route element={<PrivateRoute allowedRoles={["Project Manager"]} />}>
  <Route path="/projectmanager_dashboard" element={<ProjectManagerDashboard />} >
  <Route index element={<Navigate to="mainsection" replace/>}/>
  <Route path='mainsection' element={<PmMainSection/>}/>
  <Route path='/project_management' element={<ProjectManagement/>}/>
  <Route path='/project_details/:projectId' element={<ProjectDetails/>}/>
  <Route path='/task_management' element={<TaskManagement/>}/>
  <Route path='/report_analysis' element={<ReportAnalysis/>}/> 
  <Route path='/create_project' element={<CreateProject/>}/>
</Route>
</Route>

<Route element={<PrivateRoute allowedRoles={["QA"]} />}>
  <Route path="/qa_dashboard" element={<QaDashboard />} >
  <Route index element={<Navigate to="mainsection" replace/>}/>
  <Route path='mainsection' element={<QaMainSection/>}/>
  <Route path='/qa_dashboard/testcase_management' element={<TestCaseManagement/>}/>
  <Route path='/qa_dashboard/report_analysis' element={<ReportQa/>}/> 
  <Route path='/qa_dashboard/create_testcase' element={<CreateTestCase/>}/>
  <Route path='/qa_dashboard/bug_management' element={<BugManagement/>}/>
</Route>
</Route>

<Route element={<PrivateRoute allowedRoles={["Developer"]} />}>
<Route path="/dev_dashboard" element={<DeveloperDashboard/>} >
  <Route index element={<Navigate to="mainsection" replace/>}/>
  <Route path='mainsection' element={<DevMainSection/>}/>
  <Route path='/dev_dashboard/task_details' element={<TaskDetails/>}/> 
  <Route path='/dev_dashboard/track_task' element={<TrackTask/>}/>
  <Route path='/dev_dashboard/tasks/:taskId' element={<Tasks/>}/>
</Route>

  
 </Route>
 



<Route element={<PrivateRoute allowedRoles={["Test Engineer"]}/>}>

<Route path="/testengineer_dashboard" element={<TestEngineerDashboard/>} >
  <Route index element={<Navigate to="mainsection" replace/>}/>
  <Route path='mainsection' element={<TestMainSection/>}/>
  <Route path='/testengineer_dashboard/test_details' element={<TestDetails/>}/> 
  <Route path='/testengineer_dashboard/test_track' element={<TestTrack/>}/>
  <Route path='/testengineer_dashboard/tests/:testId' element={<Tests/>}/>
    <Route path='testengineer_dashboard/tests/bugs/:testId' element={<Bugs/>}/> 
    </Route>
  
 
</Route>


            </Routes>
      </Router>
    </div>
  )
}

export default AppRouter
