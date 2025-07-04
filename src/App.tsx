import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Components/Register/Register.tsx';
import Login from './Login/Login.tsx';
import BuildResume from './Components/Build/BuildResume.tsx';
import Choose from './Components/Build/ChooseTemplate/Choose.tsx';
import SelectResume from './Components/Build/SelectResume/Select.tsx';
import Fill from './Components/Build/FillForm/Fill.tsx';
import History from './Components/Build/WorkHistory/History.tsx';
import Skills from './Components/Build/Skills/Skills.tsx';
import Summary from './Components/Build/Summary/Summary.tsx';
import Education from './Components/Build/Education/Education.tsx';
import Finish from './Components/Build/Finish/Finish.tsx';
import Start from './Components/Start/Start.tsx';
import '@fontsource/ubuntu-mono/700.css'; // Bold weight

const App = () => {
  // const path = window.location.pathname  
  return (
    <div className="">
      <header className="App-header">
      <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
            integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          {/* {path.includes('/login') || path.includes('/register')  ? <Navbar/> :null } */}
      <main className='min-h-screen siteWidth' >    
      <Router>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/build-resume" element={<BuildResume />} />
            <Route path="/build-resume/choose-temp" element={<Choose />} />
            <Route path="/build-resume/select-resume" element={<SelectResume />} />
            <Route path="/build-resume/work-history" element={<History />} /> 
            <Route path="/build-resume/add-skills" element={<Skills />} /> 
            <Route path="/build-resume/add-summary" element={<Summary />} /> 
            <Route path="/build-resume/add-educ" element={<Education />} /> 
            <Route path="/build-resume/add-skills" element={<Skills />} /> 
            <Route path="/build-resume/finalize" element={<Finish />} /> 
            <Route path="/build-resume/fill-data" element={<Fill />} /> 
          </Routes>          
        </Router>
      </main>
      </header>
    </div>
  );
};

export default App;
