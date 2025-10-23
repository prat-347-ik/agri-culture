import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Use your custom auth hook
import useAxiosPrivate from '../hooks/useAxiosPrivate'; // Use your private axios instance
import './Settings.css'; // Your existing CSS file
import { useTranslation } from 'react-i18next'; // 1. Import hook

const Settings = () => {
  const { auth, setAuth, logout } = useAuth(); // Get auth state, setAuth, and logout function
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // 2. Get t and i18n

  // State for profile form
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    village: '',
    taluka: '',
    district: '',
    pincode: '',
  });
  
  // State for other settings
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('en'); // Add language state
  
  const [msg, setMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // When component loads, populate the form with the user's data from context
  useEffect(() => {
    if (auth.user) {
      setFormData({
        fullName: auth.user.fullName || '',
        address: auth.user.address || '',
        village: auth.user.village || '',
        taluka: auth.user.taluka || '',
        district: auth.user.district || '',
        pincode: auth.user.pincode || '',
      });
      setPhone(auth.user.phone || '');
      // Load saved language from auth context
      setLanguage(auth.user.settings?.language || 'en');
    }
  }, [auth.user]); // Re-run if auth.user changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMsg('');

    try {
      const response = await axiosPrivate.put('/api/user/profile', formData);
      const updatedUser = response.data;

      setAuth(prev => ({
        ...prev,
        user: updatedUser,
      }));

      setMsg(t('settings.msg_profile_success', 'Profile updated successfully!'));
    } catch (err) {
      console.error('Failed to save profile', err);
      const errorMsg = err.response?.data?.message || t('settings.msg_profile_fail', 'Failed to save profile');
      setMsg(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingsSave = async () => {
    setIsSaving(true);
    setMsg('');
    try {
      const response = await axiosPrivate.put('/api/user/settings', { language });
      
      setAuth(prev => ({
        ...prev,
        user: response.data 
      }));
      
      i18n.changeLanguage(response.data.settings.language);
      setMsg(t('settings.msg_prefs_success', 'Preferences saved successfully!'));

    } catch (err) {
      console.error('Failed to save settings', err);
      const errorMsg = err.response?.data?.message || t('settings.msg_prefs_fail', 'Failed to save preferences');
      setMsg(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm(t('settings.confirm_delete', 'Are you sure you want to delete your account? This action cannot be undone.'))) {
      setMsg('');
      try {
        await axiosPrivate.delete('/api/users/account');
        await logout(); 
        navigate('/login'); 
      } catch (err) {
        console.error('Failed to delete account', err);
        const errorMsg = err.response?.data?.message || t('settings.msg_delete_fail', 'Failed to delete account');
        setMsg(errorMsg);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="settings-container">
      <h1 className="settings-header">{t('settings.title', 'Account Settings')}</h1>

      {msg && <p className="settings-msg">{msg}</p>}

      {/* --- Profile Information Form --- */}
      <form onSubmit={handleProfileSave}>
        <div className="settings-card">
          <h2 className="settings-card-title">{t('settings.profile_title', 'Profile Information')}</h2> 
          
          <div className="settings-item">
            <label htmlFor="phone">{t('settings.phone_label', 'Phone Number (Read-only)')}</label>
            <input type="text" id="phone" value={phone} readOnly />
          </div>

          <div className="settings-item">
            <label htmlFor="fullName">{t('settings.name_label', 'Full Name')}</label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="settings-item">
            <label htmlFor="address">{t('settings.address_label', 'Address (Building, Street)')}</label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="settings-item">
            <label htmlFor="village">{t('settings.village_label', 'Village/Town')}</label>
            <input
              type="text"
              id="village"
              value={formData.village}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="settings-item">
            <label htmlFor="taluka">{t('settings.taluka_label', 'Taluka')}</label>
            <input
              type="text"
              id="taluka"
              value={formData.taluka}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="settings-item">
            <label htmlFor="district">{t('settings.district_label', 'District')}</label>
            <input
              type="text"
              id="district"
              value={formData.district}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="settings-item">
            <label htmlFor="pincode">{t('settings.pincode_label', 'Pincode')}</label>
            <input
              type="text"
              id="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="settings-btn" disabled={isSaving}>
            {isSaving ? t('settings.saving_btn', 'Saving...') : t('settings.save_profile_btn', 'Save Profile')}
          </button>
        </div>
      </form>

      {/* --- Preferences Card --- */}
      <div className="settings-card">
        <h2 className="settings-card-title">{t('settings.prefs_title', 'Preferences')}</h2>
        <div className="settings-item">
          <label htmlFor="language">{t('settings.lang_label', 'Language')}</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>
        </div>
         <button className="settings-btn" onClick={handleSettingsSave} disabled={isSaving}>
          {t('settings.save_prefs_btn', 'Save Preferences')}
        </button>
      </div>

      {/* --- Authentication Card --- */}
      <div className="settings-card">
        <h2 className="settings-card-title">{t('settings.auth_title', 'Authentication')}</h2>
        <div className="settings-item">
          <p>{t('settings.logout_text', 'Click here to log out of your account on this device.')}</p>
          <button className="settings-btn danger-btn" onClick={handleLogout}>
            {t('settings.logout_btn', 'Log Out')}
          </button>
        </div>
      </div>

      {/* --- Danger Zone Card --- */}
      <div className="settings-card danger-zone">
        <h2 className="settings-card-title">{t('settings.danger_title', 'Danger Zone')}</h2>
        <div className="settings-item">
          <p>{t('settings.danger_text', 'Once you delete your account, there is no going back. Please be certain.')}</p>
          <button className="settings-btn danger-btn" onClick={handleDeleteAccount}>
            {t('settings.delete_btn', 'Delete My Account')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;