import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import VideoPlayer from './pages/VideoPlayer';

import './styles/App.scss';

function App() { 
  return (
    <>
      <Router> 
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/video/:url" component={VideoPlayer} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
