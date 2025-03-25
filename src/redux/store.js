import { configureStore } from "@reduxjs/toolkit"
import  userReducer  from "./slices/userSlice"
import projectReducer from "./slices/projectSlice"
import moduleReducer from "./slices/moduleSlice"
import taskReducer from "./slices/taskSlice"
import developerReducer from "./slices/developerSlice"
import developerTasksReducer from "./slices/developerTaskSlice"
import notificationReducer from "./slices/notificationSlice"
import authReducer from "./slices/authSlice"
import testReducer from "./slices/testCaseSlice"
import testDetailsReducer from './slices/testEngineerTestSlice'
import profileReducer from './slices/profileSlice'

 const store = configureStore({
      reducer :{
            user : userReducer,
            projects : projectReducer ,
            modules : moduleReducer,
            tasks : taskReducer ,
            developers : developerReducer ,
            developerTasks: developerTasksReducer ,
            notifications: notificationReducer,
            auth: authReducer,          
            tests : testReducer ,
            testDetails : testDetailsReducer ,
            profile : profileReducer ,
            
      }
})

export default store