import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Import all page components
import Home from './pages/Home';
import Map from './pages/Map';
import Marketplace from './pages/Marketplace';
import Enroll from './pages/Enroll';
import Contacts from './pages/Contacts';
import Profile from './pages/Profile';
import Etc from './pages/Etc';
import Login from './pages/Login';

import './App.css';

// A helper component to render the main layout
const MainLayout = ({ children }) => (
  <div className="main-layout">
    <Sidebar />
    <main className="content">
      {children}
    </main>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="container">
      {!isLoginPage && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<Map />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/enroll" element={<Enroll />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/etc" element={<Etc />} />
            </Routes>
          </MainLayout>
        } />
      </Routes>
      {!isLoginPage && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;