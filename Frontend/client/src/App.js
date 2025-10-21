import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; // Correctly imported
import PersistLogin from './components/PersistLogin'; // 1. Import PersistLogin

// Import all page components
import Landing from './pages/Landing';
import Home from './pages/Home';
import Map from './pages/Map';
import Marketplace from './pages/Marketplace';
import Enroll from './pages/Enroll';
import Contacts from './pages/Contacts';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Etc from './pages/Etc';
import Login from './pages/Login';
import Admin from './pages/Admin';

import './App.css';

// This component contains the main layout with sidebar and header
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

    return (
        <Routes>
            {/* Full Page Routes - No Layout */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Routes Wrapped in Session Persistence */}
            <Route element={<PersistLogin />}>

            

            {/* Routes with Main Layout */}
            <Route
                path="*"
                element={
                    !isFullPage ? (
                        <MainLayout>
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/home" element={<Home />} />
                                <Route path="/map" element={<Map />} />
                                <Route path="/marketplace" element={<Marketplace />} />
                                <Route path="/contacts" element={<Contacts />} />
                                <Route path="/etc" element={<Etc />} />

                                {/* Protected Routes */}
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/enroll" element={<Enroll />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="/admin" element={<Admin />} />
                                </Route>
                            </Routes>
                        </MainLayout>
                    ) : null
                }
            />
            </Route>
        </Routes>
    );
};

const App = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;