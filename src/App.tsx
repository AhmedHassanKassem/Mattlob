import {Routes, Route, useNavigate, Navigate } from 'react-router';
// import Register from './Components/Register/Register.tsx';
import Choose from './Components/Build/ChooseTemplate/Choose.tsx';
import SelectResume from './Components/Build/SelectResume/Select.tsx';
import Fill from './Components/Build/FillForm/Fill.tsx';
import History from './Components/Build/WorkHistory/History.tsx';
import Skills from './Components/Build/Skills/Skills.tsx';
import Education from './Components/Build/Education/Education.tsx';
import Finish from './Components/Build/Finish/Finish.tsx';
import Start from './Components/Start/Start.tsx';
import '@fontsource/ubuntu-mono/700.css'; // Bold weight
import { toast, ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import { AppDispatch, RootState } from './Redux/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import { setTokenValue } from './Redux/Slices/tokenSlice.ts';
// import { getCvDataAction } from './Redux/GetCvData/getCvAction.ts';
import {jwtDecode} from 'jwt-decode'; // ✅ Default import

import { axiosInst } from './axios/axios.ts';
import Home from './Components/Home/Home.tsx';
import Navbar from './Components/Navbar/Nav.tsx';
import Forget from './Components/ForgetPassword/Forget.tsx';
import SuccessMessage from './Containers/SuccessMessage.tsx';
import ResetPassword from './Components/ResetPassword/Reset.tsx';
import VerifyEmail from './Components/VerifyEmail/Verify.tsx';
import Register from './Components/Register/Register.tsx';
import { getCvDataAction } from './Redux/GetCvData/getCvAction.ts';
import { EMAIL_CLAIM, ICVData, IUser, NAME_CLAIM } from './Interfaces/interface.ts';
import { setFoundUser } from './Redux/Slices/userSlice.ts';
import { setResumeColor } from './Redux/Slices/resumeColorSlice.ts';
import MyCvs from './Components/Build/MyCvs/MyCvs.tsx';
import { setFoundCv } from './Redux/Slices/foundCv.ts';
import Main from './Components/Dashboard/Main.tsx';
import Job from './Components/Recruiter/Job.tsx';
import EngagedRoles from './Components/Recruiter/EngagedRoles.tsx';
import SearchRoles from './Components/Recruiter/Search.tsx';
import RoleDetails from './Components/Recruiter/RoleDetails.tsx';
import PostJob from './Components/Recruiter/ManageJobs.tsx';
import i18n from './i18n.ts';
import { setLangSlice } from './Redux/Slices/langSlice.ts';
import { setIsDarkState } from './Redux/Slices/isDarkSlice.ts';
import Login from './Components/Login/Login.tsx';
import { getCookie, setCookie } from './Utils/cookies.ts';
import Templates from './Components/Build/ChooseTemplate/Templates.tsx';
import Candidate from './Components/Recruiter/Candidate/Candidate.tsx';
import AllCandidates from './Components/Recruiter/Candidate/AllCandidates.tsx';
import Plans from './Components/Plans/Plans.tsx';


const App = () => {
const dispatch : AppDispatch = useDispatch()
 const navigate = useNavigate()
 const userResumes = useSelector((state : RootState)=> state.cvData.cvData)
 const path = window.location.pathname
const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);

useEffect(() => {
    const token = getCookie('token');
    if (token) {
      dispatch(setTokenValue(token));
      const decoded: any = jwtDecode(token);
      const user: IUser = {
        email: decoded[EMAIL_CLAIM],
        name: decoded[NAME_CLAIM],
        user_id: decoded.user_id,
      };
      
      dispatch(setFoundUser(user));
      dispatch(getCvDataAction(token));
    }
  }, [dispatch]);
  
  useEffect(() => {
      const color = localStorage.getItem('color');
       if(color){
        dispatch(setResumeColor(color))
       }
    }, [dispatch]);



  const safeParse = <T,>(str: string | null): T | null => {
    if (!str) return null;
    try {
      return JSON.parse(str) as T;
    } catch (err) {
      console.warn("safeParse: invalid JSON:", err);
      return null;
    }
  };





useEffect(() => {
  const resumeLocalRaw = localStorage.getItem("resumeData");
  const resumeLocal = safeParse<ICVData>(resumeLocalRaw);

  if (resumeLocal) {
    dispatch(setFoundCv(resumeLocal));
    return;
  }

  const tempId = Number(localStorage.getItem("tempId"));
  if (!tempId) return;

  const foundCv = userResumes.find((resume: ICVData) => resume.temp_id === tempId);
  if (!foundCv) return;

  // نفك الحقول اللي جوا DB بعناية (قد تكون نصوص JSON أو فارغة)
  const parsedHeading = safeParse<any>(foundCv.heading as any) || {};
  const parsedWork = safeParse<any>(foundCv.work_History as any) || [];
  const parsedEdu = safeParse<any>(foundCv.education as any) || [];
  const parsedSkills = safeParse<any>(foundCv.skills as any) || [];
  const resume: ICVData = {
    temp_id: foundCv.temp_id,
    color: foundCv.color,
    heading: parsedHeading,
    work_History: parsedWork,
    education: parsedEdu,
    languages: JSON.parse(foundCv.languages) || [],
    skills: parsedSkills,
    personal_Links: foundCv.personal_Links || [],
    is_paid: foundCv.is_paid,
    image: foundCv.image || null,
    attach: foundCv.attach || null,
  };

  // خزّن الكائن كله (مش نصوص فردية) في localStorage
  try {
    localStorage.setItem("resumeData", JSON.stringify(resume));
    dispatch(setFoundCv(resume));
  } catch (err) {
    console.error("Failed to save resumeData to localStorage:", err);
  }
}, [userResumes, dispatch]);


const getAuthLinkedinData = async (code : string) => {
  try {
    const res = await axiosInst.get(`api/Auth/signin-linkedin?code=${code}`);
    const $tok = res.data.sysToken;
    if ($tok) {     
      dispatch(setTokenValue($tok));
      const decoded: any = jwtDecode($tok);
      toast.success("Logged in successfully");
      localStorage.setItem('token', $tok);
         const user: IUser = {
        email: decoded[EMAIL_CLAIM],
        name: decoded[NAME_CLAIM],
        user_id: decoded.user_id,
      };   
      dispatch(setFoundUser(user));
      navigate('/home');
    } else {
      toast.error('Invalid LinkedIn credentials');
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'LinkedIn login failed');
    console.error(error);
  }
};

  const getAuthGoogleData = async(code : string)=>{
     const res = await axiosInst.post(`api/Auth/google`, code, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
    if(res){
      const $tok = res.data.token
       if ($tok) {     
      dispatch(setTokenValue($tok));
      const decoded: any = jwtDecode($tok);
      toast.success("Logged in successfully");
      setCookie('token', $tok , 1);
         const user: IUser = {
        email: decoded[EMAIL_CLAIM],
        name: decoded[NAME_CLAIM],
        user_id: decoded.user_id,
        role_id: decoded.role_id,
      };
      
      dispatch(setFoundUser(user))
      navigate('/home')
      }
    }else{
      toast.error('Invalid linkedIn credentilas')
    }
  }
useEffect(() => {
  const code = urlParams.get('code');
  const state = urlParams.get('state');

  if (code && state === 'google') {
    getAuthGoogleData(code);
  } else if (code && state === 'linkedin') {
    getAuthLinkedinData(code);
  }
}, []);

useEffect(() => {
  const isDark = localStorage.getItem("DarkMode")
  if(isDark === "on"){
     dispatch(setIsDarkState(true))
  }else{
     dispatch(setIsDarkState(false))
  } 
}, []);





  
useEffect(() => {
  const supportedLangs = ["en", "ar"];
  const url = new URL(window.location.href);
  let lang = url.searchParams.get("lang");

  // لو مفيش لغة في الـ URL → استخدم اللي في localStorage
  if (!lang) {
    const storedLang = localStorage.getItem("lang");
    if (supportedLangs.includes(storedLang || "")) {
      lang = storedLang!;
    } else {
      lang = "en"; // default
    }

    // ضيفها للـ URL بدون Reload
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url.toString());
  }

  // احفظ اللغة في localStorage
  localStorage.setItem("lang", lang);

  // ابعتها للـ Redux
  dispatch(setLangSlice(lang));

  // حدّث i18n
  i18n.changeLanguage(lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  // classes للـ body
  document.body.classList.remove("en", "ar");
  document.body.classList.add(lang);

}, []);





  return (
    <div>
      <header className="App-header">
      <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
            integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          {path.includes('/dashboard')  || path.includes('/login') 
          || path.includes('/register')? null : <Navbar/> }
      <main className='min-h-screen siteWidth' >    
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/start" element={<Start />} />
            <Route path="/pricing" element={<Plans />} />
            <Route path="/login" element={<Login />} />
            <Route path="/state" element={<SuccessMessage />} />
            <Route path="/forgotPassword" element={<Forget />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/build-resume/choose-temp" element={<Choose />} />
            <Route path="/build-resume/select-resume" element={<SelectResume />} />
            <Route path="/build-resume/work-history" element={<History />} /> 
            <Route path="/build-resume/add-skills" element={<Skills />} /> 
            <Route path="/build-resume/myresumes" element={<MyCvs />} /> 
            <Route path="/build-resume/add-educ" element={<Education />} /> 
            <Route path="/build-resume/add-skills" element={<Skills />} /> 
            <Route path="/build-resume/finalize" element={<Finish />} /> 
            <Route path="/build-resume/fill-data" element={<Fill />} />
           <Route path="/build-resume/temps" element={<Templates/>} />
            ///////////////////// Dashboard Routes /////////////////////////
         <Route path="/dashboard" element={<Main isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />}>
         <Route index element={<Navigate to="searchRoles" replace />} />
    <Route path="jobs" element={<Job />} />
    <Route path="add-candidate" element={<Candidate />} />
    <Route path="all-candidates" element={<AllCandidates />} />
    <Route path="managejobs" element={<PostJob />} />
    <Route path="engagedRoles" element={<EngagedRoles />} />
    <Route path="searchRoles" element={<SearchRoles />} />
    <Route path="roleDetails" element={<RoleDetails />} />
  </Route>
          </Routes>
    

        <ToastContainer/>
      </main>
      </header>
    </div>
  );
};

export default App;
