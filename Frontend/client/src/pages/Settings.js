import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = () => {
  const [user, setUser] = useState({
    fullName: '',
    phone: '',
  });
  const [settings, setSettings] = useState({
    language: 'en',
    notifications: true,
  });

  // Replace with your actual token retrieval logic
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile', {
          headers: { 'x-auth-token': token },
        });
        const data = await res.json();
        if (res.ok) {
          setUser({ fullName: data.fullName, phone: data.phone });
          setSettings(data.settings);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleProfileChange = (e) => {
    setUser({ ...user, [e.target.id]: e.target.value });
  };

  const handleSettingsChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings({ ...settings, [e.target.id]: value });
  };

  const handleProfileSave = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Profile updated successfully!');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Failed to save profile', error);
    }
  };

  const handleSettingsSave = async () => {
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Settings updated successfully!');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Failed to save settings', error);
    }
  };


  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const res = await fetch('/api/user/account', {
          method: 'DELETE',
          headers: { 'x-auth-token': token },
        });
        const data = await res.json();
        if (res.ok) {
          alert('Account deleted successfully.');
          // Log the user out and redirect
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Failed to delete account', error);
      }
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-header">Account Settings</h1>

      <div className="settings-card">
        <h2 className="settings-card-title">Profile Information</h2>
        <div className="settings-item">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={user.fullName}
            onChange={handleProfileChange}
          />
        </div>
        <div className="settings-item">
          <label htmlFor="phone">Phone Number</label>
          <input type="text" id="phone" value={user.phone} readOnly />
        </div>
        <button className="settings-btn" onClick={handleProfileSave}>
          Save Changes
        </button>
      </div>

      <div className="settings-card">
        <h2 className="settings-card-title">Preferences</h2>
        <div className="settings-item">
          <label htmlFor="language">Language</label>
          <select
            id="language"
            value={settings.language}
            onChange={handleSettingsChange}
          >
            <option value="en">English</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>
        </div>
        <div className="settings-item toggle">
          <label htmlFor="notifications">Enable Push Notifications</label>
          <label className="switch">
            <input
              type="checkbox"
              id="notifications"
              checked={settings.notifications}
              onChange={handleSettingsChange}
            />
            <span className="slider round"></span>
          </label>
        </div>
         <button className="settings-btn" onClick={handleSettingsSave}>
          Save Preferences
        </button>
      </div>

      <div className="settings-card danger-zone">
        <h2 className="settings-card-title">Danger Zone</h2>
        <div className="settings-item">
          <p>Once you delete your account, there is no going back. Please be certain.</p>
          <button className="settings-btn danger-btn" onClick={handleDeleteAccount}>
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;