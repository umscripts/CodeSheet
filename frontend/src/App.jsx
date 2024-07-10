import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Signup from './pages/SignUp/Signup.jsx';
import './index.css';
import 'prismjs/prism';
import 'prismjs/themes/prism-tomorrow.css'; // Importing the dark theme
import Prism from 'prismjs';

const App = () => {
  React.useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route path='/dashboard' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
