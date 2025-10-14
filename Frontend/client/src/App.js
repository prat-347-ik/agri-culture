import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Import all page components
import Landing from './pages/Landing'; // New
import Home from './pages/Home';
import Map from './pages/Map';
import Marketplace from './pages/Marketplace';
import Enroll from './pages/Enroll';
import Contacts from './pages/Contacts';
import Profile from './pages/Profile';
import Etc from './pages/Etc';
import Login from './pages/Login';
import Admin from './pages/Admin';

import './App.css';

// This component will contain the main layout with sidebar and header
const MainLayout = ({ children }) => (
    <div className="container">
        <Header />
        <div className="main-layout">
            <Sidebar />
            <main className="content">
                {children}
            </main>
        </div>
        <Footer />
    </div>
);

const AppContent = () => {
    const location = useLocation();
    // These pages should not have the main layout
    const isFullPage = location.pathname === '/' || location.pathname === '/login';

    if (isFullPage) {
        return (
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        );
    }

    return (
        <MainLayout>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/map" element={<Map />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/enroll" element={<Enroll />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/etc" element={<Etc />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </MainLayout>
    );
};

const App = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;