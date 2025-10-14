import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    phone: '',
    address: '',
    district: '',
    taluka: '',
    village: '',
    pincode: ''
  });
  const [saveMsg, setSaveMsg] = useState('');

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const savedPhone = localStorage.getItem('auth_phone') || '';
    const savedProfile = JSON.parse(localStorage.getItem('profile') || '{}');
    
    // This is the corrected line to fix the warning
    setFormData(prevFormData => ({
      ...prevFormData,
      ...savedProfile,  
      phone: savedPhone,
    }));
  }, []); // The dependency array is now correct

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const profileData = { ...formData };
    localStorage.setItem('profile', JSON.stringify(profileData));
    setSaveMsg('Profile saved successfully!');
    setTimeout(() => setSaveMsg(''), 3000); // Clear message after 3 seconds
  };

  const handleReset = () => {
    setFormData({
      name: '',
      age: '',
      gender: 'male',
      phone: localStorage.getItem('auth_phone') || '',
      address: '',
      district: '',
      taluka: '',
      village: '',
      pincode: ''
    });
    setSaveMsg('');
  };

  return (
    <div className="auth-wrapper">
      <form id="profileForm" className="auth-card" onSubmit={handleSubmit} onReset={handleReset}>
        <h2>Profile</h2>
        <div className="profile-grid">
          <div className="form-field">
            <label htmlFor="name">Full Name</label>
            <input id="name" type="text" required value={formData.name} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="age">Age</label>
            <input id="age" type="number" min="10" max="120" required value={formData.age} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="gender">Gender</label>
            <select id="gender" required value={formData.gender} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" type="tel" maxLength="10" value={formData.phone} onChange={handleChange} readOnly />
          </div>
          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="address">Address</label>
            <textarea id="address" rows="3" required value={formData.address} onChange={handleChange}></textarea>
          </div>
          <div className="form-field">
            <label htmlFor="district">District</label>
            <input id="district" type="text" value={formData.district} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="taluka">Taluka</label>
            <input id="taluka" type="text" value={formData.taluka} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="village">Village</label>
            <input id="village" type="text" value={formData.village} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="pincode">Pincode</label>
            <input id="pincode" type="text" maxLength="6" value={formData.pincode} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row" style={{ marginTop: '1rem', justifyContent: 'flex-end' }}>
          <button className="btn secondary" type="reset">Reset</button>
          <button className="btn" type="submit">Save</button>
        </div>
        <div id="saveMsg" className="helper" style={{ marginTop: '0.5rem', color: 'green' }}>
          {saveMsg}
        </div>
      </form>
    </div>
  );
};

export default Profile;