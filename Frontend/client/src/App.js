import React from 'react';
import { Route, Routes, useLocation, Navigate, Outlet } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PersistLogin from './components/PersistLogin';
import ProfileCompletionRoute from './components/ProfileCompletionRoute';
import AdminRoute from './components/AdminRoute'; // <-- 1. IMPORT THE NEW ADMIN ROUTE

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
import Admin from './pages/Admin'; // <-- 2. Duplicate import removed, this is the only one
import Listing from './pages/Listing';
import TrainingPrograms from './pages/TrainingPrograms'; 
import CropCalendar from './pages/CropCalendar'; 
import Insurance from './pages/Insurance';
import PriceUpdates from './pages/PriceUpdates'; 

// (We no longer import CropCalendar)

import './App.css';

// This is the main layout for the app.
// It uses <Outlet /> to render the child routes (e.g., Home, Map, etc.)
const MainLayout = () => (
    <div className="container">
        <Header />
        <div className="main-layout">
            <Sidebar />
            <main className="content">
                <Outlet /> {/* Child routes will render here */}
            </main>
        </div>
        <Footer />
    </div>
);

const AppContent = () => {
    return (
        <Routes>
            {/* Full Page Routes - No Layout */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* --- All other routes are wrapped in the MainLayout --- */}
            <Route element={<PersistLogin />}>
                <Route element={<MainLayout />}>
                    
                    {/* Public Routes */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/map" element={<Map />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/etc" element={<Etc />} />
                    <Route path="/training-programs" element={<TrainingPrograms />} /> 
                    <Route path="/crop-calendar" element={<CropCalendar />} />
                    <Route path="/insurance" element={<Insurance />} />
                    <Route path="/price-updates" element={<PriceUpdates />} />
                    <Route path="/listing/:id" element={<Listing />} />

                    {/* Placeholder route for Weather Widget */}
                    <Route 
                        path="/weather-details" 
                        element={
                            <div style={{ padding: '50px', textAlign: 'center' }}>
                                <h2>Detailed 5-Day Forecast</h2>
                                <p>This page is coming soon!</p>
                            </div>
                        } 
                    />

                    {/* --- 3. APPLY ADMIN ROUTE --- */}
                    {/* This route needs login AND admin role */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<Admin />} />
                    </Route>

                    {/* Routes that require login */}
                    <Route element={<ProtectedRoute />}>
                        
                        {/* Routes that ALSO require a COMPLETE profile */}
                        <Route element={<ProfileCompletionRoute />}>
                            <Route path="/enroll" element={<Enroll />} />
                            <Route path="/marketplace" element={<Marketplace />} />
                        </Route>
                        
                        {/* Routes that just need login, but not completion */}
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                        {/* <Route path="/admin" element={<Admin />} /> <-- 4. REMOVED FROM HERE */}
                    </Route>
                    
                    {/* Default route to redirect to home */}
                    <Route path="*" element={<Navigate to="/home" replace />} />

                </Route>
            </Route>
        </Routes>
    );
};

const App = () => (
    <AppContent />
);

export default App;