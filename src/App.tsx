import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Components/Register/Register.tsx';
import Login from './Login/Login.tsx';

const App = () => {
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
      <main className='min-h-screen'>
      <Router>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </main>
      </header>
    </div>
  );
};

export default App;
