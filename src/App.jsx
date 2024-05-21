import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import VideoPlayer from './pages/VideoPlayer';
import Admin from './pages/Admin';

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/video/:fileName" element={<VideoPlayer />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;