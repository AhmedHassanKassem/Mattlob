import {combineReducers} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import tokenSlice from './Slices/tokenSlice';
import { getCvDataReducer } from './GetCvData/getCvReducer';
import foundCv from './Slices/foundCv';
import { getSkillsReducer } from './Skills/skillsResucer';
import userSlice from './Slices/userSlice';
import resumeColorSlice from './Slices/resumeColorSlice';
import tempsSlice from './Slices/tempsSlice';
import tempSliceImage from './Slices/tempSliceImage';
import { getRolesReducer } from './RecruiterRedux/SerachRoles/getRolesReducer';
import totalPages from './Slices/totalPages';
import { getEngagedRolesReducer } from './RecruiterRedux/EngagedJobs/getEngagedJobsReducer';
import isDarkSlice from './Slices/isDarkSlice';
import langSlice from './Slices/langSlice';

const rootReducer = combineReducers({
   token : tokenSlice,
   pageCount : totalPages,
   user : userSlice,
   cvData : getCvDataReducer,
   foundCv : foundCv,
   skills : getSkillsReducer,
   roles : getRolesReducer,
   engagedRoles : getEngagedRolesReducer,
   resumeColor : resumeColorSlice,
   temps : tempsSlice,
   lang : langSlice,
   isDark : isDarkSlice,
   tempImg : tempSliceImage
})
const store = configureStore({
    reducer : rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          immutableCheck: false,
          serializableCheck: false,
        }),
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;


export default store
