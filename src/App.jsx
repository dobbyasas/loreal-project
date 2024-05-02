import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Video from './pages/Video';

import './styles/App.scss';

function App() { 
  return (
    <>
      <Router> 
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/video/:videoName" element={<Video />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
