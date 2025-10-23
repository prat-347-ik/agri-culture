import React, { Suspense } from 'react'; // 1. Import Suspense
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './i18n'; // 2. Import your new config file

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 3. Wrap App in Suspense */}
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);