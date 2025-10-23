import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate'; // For secure API calls
import useAuth from '../hooks/useAuth'; // To get/set user data
import { useTranslation } from 'react-i18next'; // 1. Import hook
import './Profile.css'; // Import the CSS

const Profile = () => {
  const { t } = useTranslation(); // 2. Initialize hook
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectMessage = location.state?.message;

  const [formData, setFormData] = useState({
    fullName: '', age: '', gender: 'male', phone: auth.user?.phone || '',
    address: '', district: '', taluka: '', village: '', pincode: ''
  });

  const [saveMsg, setSaveMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUserProfile = async () => {
      try {
        // --- CORRECTED ENDPOINT ---
        const response = await axiosPrivate.get('/api/user/profile', {
          signal: controller.signal
        });

        if (isMounted) {
          const userData = response.data;
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
          setAuth(prev => ({ ...prev, user: userData }));
        }
      } catch (err) {
        console.error(err);
        if (err.name !== 'CanceledError') {
          setErrorMsg(t('profile.load_fail_msg')); // Translate error
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axiosPrivate, setAuth, auth.user?.phone, t]); // Added t

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSaveMsg('');

    try {
      // --- CORRECTED ENDPOINT ---
      const response = await axiosPrivate.put('/api/user/profile', formData);
      setAuth(prev => ({ ...prev, user: response.data }));
      setSaveMsg(t('profile.save_success_msg')); // Translate success
      setTimeout(() => setSaveMsg(''), 3000);

      const from = location.state?.from?.pathname || '/home';
      navigate(from, { replace: true });

    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || t('profile.save_fail_msg')); // Translate error
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '', age: '', gender: 'male', phone: auth.user?.phone || '',
      address: '', district: '', taluka: '', village: '', pincode: ''
    });
    setErrorMsg('');
    setSaveMsg('');
  };

  if (isLoading) {
    return <div className="auth-wrapper profile-page"><p>{t('profile.loading')}</p></div>; // Translate loading
  }

  return (
    <div className="auth-wrapper profile-page"> {/* Added profile-page class */}
      <form id="profileForm" className="auth-card" onSubmit={handleSubmit} onReset={handleReset}>
        <h2>{t('profile.title')}</h2> {/* Translate title */}

        {redirectMessage && <p className="helper redirect-message">
          {t('profile.redirect_message_prefix', 'Please complete your profile to continue:')} {redirectMessage}
        </p>}

        <div className="profile-grid">
          <div className="form-field">
            <label htmlFor="fullName">{t('profile.full_name_label')}</label> {/* Translate label */}
            <input id="fullName" type="text" required value={formData.fullName} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="age">{t('profile.age_label')}</label> {/* Translate label */}
            <input id="age" type="number" min="10" max="120" required value={formData.age} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="gender">{t('profile.gender_label')}</label> {/* Translate label */}
            <select id="gender" required value={formData.gender} onChange={handleChange}>
              <option value="male">{t('profile.gender_male')}</option> {/* Translate option */}
              <option value="female">{t('profile.gender_female')}</option> {/* Translate option */}
              <option value="other">{t('profile.gender_other')}</option> {/* Translate option */}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="phone">{t('profile.phone_label')}</label> {/* Translate label */}
            <input id="phone" type="tel" maxLength="10" value={formData.phone} onChange={handleChange} readOnly />
          </div>
          <div className="form-field address-field"> {/* Added class */}
            <label htmlFor="address">{t('profile.address_label')}</label> {/* Translate label */}
            <textarea id="address" rows="3" required value={formData.address} onChange={handleChange}></textarea>
          </div>
          <div className="form-field">
            <label htmlFor="district">{t('profile.district_label')}</label> {/* Translate label */}
            <input id="district" type="text" required value={formData.district} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="taluka">{t('profile.taluka_label')}</label> {/* Translate label */}
            <input id="taluka" type="text" required value={formData.taluka} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="village">{t('profile.village_label')}</label> {/* Translate label */}
            <input id="village" type="text" required value={formData.village} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="pincode">{t('profile.pincode_label')}</label> {/* Translate label */}
            <input id="pincode" type="text" maxLength="6" required value={formData.pincode} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row profile-buttons"> {/* Added class */}
          <button className="btn secondary" type="reset">{t('profile.reset_button')}</button> {/* Translate button */}
          <button className="btn" type="submit">{t('profile.save_button')}</button> {/* Translate button */}
        </div>

        <div id="saveMsg" className="helper message-area" style={{ color: saveMsg ? 'green' : 'red' }}> {/* Added class */}
          {saveMsg || errorMsg}
        </div>
      </form>
    </div>
  );
};

export default Profile;