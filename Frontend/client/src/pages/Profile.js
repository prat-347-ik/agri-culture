import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate'; // For secure API calls
import useAuth from '../hooks/useAuth'; // To get/set user data

const Profile = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect message from ProfileCompletionRoute, if it exists
  const redirectMessage = location.state?.message;

  const [formData, setFormData] = useState({
    fullName: '', // Changed from 'name' to match backend
    age: '',
    gender: 'male',
    phone: auth.user?.phone || '', // Get phone from auth context
    address: '',
    district: '',
    taluka: '',
    village: '',
    pincode: ''
  });
  
  const [saveMsg, setSaveMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch user data from backend when component mounts
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUserProfile = async () => {
      try {
        const response = await axiosPrivate.get('/api/user/profile', {
          signal: controller.signal
        });
        
        if (isMounted) {
          const userData = response.data;
          // Populate form with existing data from the database
          setFormData({
            fullName: userData.fullName || '',
            age: userData.age || '',
            gender: userData.gender || 'male',
            phone: userData.phone || auth.user?.phone,
            address: userData.address || '',
            district: userData.district || '',
            taluka: userData.taluka || '',
            village: userData.village || '',
            pincode: userData.pincode || ''
          });
          // Also update the global auth state with the full user object
          setAuth(prev => ({ ...prev, user: userData }));
        }
      } catch (err) {
        console.error(err);
        if (err.name !== 'CanceledError') {
          setErrorMsg('Failed to load profile. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getUserProfile();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, setAuth, auth.user?.phone]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  // 2. Save data to backend on submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSaveMsg('');

    try {
      // Send a PUT request to the backend with all form data
      const response = await axiosPrivate.put('/api/user/profile', formData);
      
      // Update the global auth state with the new user data
      setAuth(prev => ({ ...prev, user: response.data }));
      
      setSaveMsg('Profile saved successfully!');
      setTimeout(() => setSaveMsg(''), 3000);

      // Navigate the user back to where they came from (or to home)
      const from = location.state?.from?.pathname || '/home';
      navigate(from, { replace: true });

    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to save profile. Please try again.');
    }
  };

  // 3. Reset clears the form (phone number remains)
  const handleReset = () => {
    setFormData({
      fullName: '',
      age: '',
      gender: 'male',
      phone: auth.user?.phone || '',
      address: '',
      district: '',
      taluka: '',
      village: '',
      pincode: ''
    });
    setErrorMsg('');
    setSaveMsg('');
  };

  if (isLoading) {
    return <div className="auth-wrapper"><p>Loading profile...</p></div>;
  }

  return (
    <div className="auth-wrapper">
      <form id="profileForm" className="auth-card" onSubmit={handleSubmit} onReset={handleReset}>
        <h2>Profile</h2>
        
        {/* Show redirect message if user was forced here */}
        {redirectMessage && <p className="helper" style={{ color: 'red', textAlign: 'center' }}>{redirectMessage}</p>}

        <div className="profile-grid">
          <div className="form-field">
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" type="text" required value={formData.fullName} onChange={handleChange} />
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
            <input id="district" type="text" required value={formData.district} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="taluka">Taluka</label>
            <input id="taluka" type="text" required value={formData.taluka} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="village">Village</label>
            <input id="village" type="text" required value={formData.village} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="pincode">Pincode</label>
            <input id="pincode" type="text" maxLength="6" required value={formData.pincode} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row" style={{ marginTop: '1rem', justifyContent: 'flex-end' }}>
          <button className="btn secondary" type="reset">Reset</button>
          <button className="btn" type="submit">Save</button>
        </div>
        
        {/* Show Save or Error Messages */}
        <div id="saveMsg" className="helper" style={{ marginTop: '0.5rem', color: saveMsg ? 'green' : 'red' }}>
          {saveMsg || errorMsg}
        </div>
      </form>
    </div>
  );
};

export default Profile;