import React from 'react';
import './Settings.css';

const Settings = () => {
  return (
    <div className="settings-container">
      <h1 className="settings-header">Account Settings</h1>

      <div className="settings-card">
        <h2 className="settings-card-title">Profile Information</h2>
        <div className="settings-item">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" defaultValue="Current User Name" />
        </div>
        <div className="settings-item">
          <label htmlFor="phone">Phone Number</label>
          <input type="text" id="phone" defaultValue="1234567890" readOnly />
        </div>
        <button className="settings-btn">Save Changes</button>
      </div>

      <div className="settings-card">
        <h2 className="settings-card-title">Preferences</h2>
        <div className="settings-item">
          <label htmlFor="language">Language</label>
          <select id="language" defaultValue="en">
            <option value="en">English</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>
        </div>
        <div className="settings-item toggle">
          <label htmlFor="notifications">Enable Push Notifications</label>
          <label className="switch">
            <input type="checkbox" id="notifications" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="settings-card danger-zone">
        <h2 className="settings-card-title">Danger Zone</h2>
        <div className="settings-item">
          <p>Once you delete your account, there is no going back. Please be certain.</p>
          <button className="settings-btn danger-btn">Delete My Account</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
