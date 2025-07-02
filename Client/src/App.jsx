import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './Components/Navbar';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import LandingPage from './pages/LandingPage/LandingPage';
import CreateSuperAdmin from './pages/CreateSuperAdmin/CreateSuperAdmin';
import RecieverDashboard from './pages/RecieverDashboard/RecieverDashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import DonaterDashboard from './pages/DonaterDashboard/DonaterDashboard';
import Profile from './pages/Profile/Profile';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-first-super-admin" element={<CreateSuperAdmin />} />
              <Route path="/dashboard" element={<RecieverDashboard />} />
              <Route path="/reciever-dashboard" element={<RecieverDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/donater-dashboard" element={<DonaterDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {/* Add more routes here as needed */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
