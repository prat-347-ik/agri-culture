import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; 
import { axiosPublic } from '../api/axios'; 
import './Login.css';

const Login = () => {
  const { login } = useContext(AuthContext); 
  const [isLoginView, setIsLoginView] = useState(true);
  const [step, setStep] = useState('credentials'); 
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!isLoginView && !fullName.trim()) {
        alert('Please enter your full name');
        return;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert('Enter a valid 10-digit number');
      return;
    }

    const endpoint = isLoginView ? '/api/auth/login' : '/api/auth/signup';
    const payload = { phoneNumber: phone, ...(isLoginView ? {} : { fullName }) };

    try {
        const response = await axiosPublic.post(endpoint, JSON.stringify(payload));
        alert(response.data.message);
        setStep('otp');
    } catch (error) {
        console.error('Error sending OTP:', error);
        alert(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      alert('Please enter the 6-digit OTP.');
      return;
    }

    try {
        // FINAL FIX: This 'withCredentials: true' option is absolutely
        // essential. It tells the browser to accept the cookie from the backend.
        const response = await axiosPublic.post('/api/auth/verify', 
            JSON.stringify({ phoneNumber: phone, code: enteredOtp }),
            {
                withCredentials: true 
            }
        );

        if (response.status === 200) {
            if (isLoginView) {
                const { accessToken, user } = response.data;
                login(accessToken, user); 
                
                setStep('success');
                setTimeout(() => navigate('/home'), 1500);
            } else {
                alert('Sign up successful! Please log in to continue.');
                toggleView();
            }
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        alert(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setFullName('');
    setPhone('');
    setOtp(new Array(6).fill(''));
    setStep('credentials');
  };

  return (
    <div className="auth-wrapper login-background">
      <div className="auth-card">
        <h2>{isLoginView ? 'Login' : 'Sign Up'}</h2>
        
        {/* The rest of your JSX remains the same */}
        
        {step === 'credentials' && (
          <div id="stepCredentials">
            {!isLoginView && (
              <div className="form-field">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="form-field">
              <label>Phone Number</label>
              <input
                type="tel"
                maxLength="10"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <div className="helper">Enter 10-digit mobile number</div>
            </div>
            <button className="btn" onClick={handleSendOtp}>Send OTP</button>
          </div>
        )}

        {step === 'otp' && (
             <div id="stepOtp">
                <div className="form-field">
                    <label>Enter OTP</label>
                    <div className="otp-row">
                        {otp.map((data, index) => (
                        <input
                            className="otp-input"
                            type="text"
                            maxLength="1"
                            key={index}
                            value={data}
                            onChange={e => handleOtpChange(e.target, index)}
                            onFocus={e => e.target.select()}
                        />
                        ))}
                    </div>
                </div>
                <div className="form-row">
                    <button className="btn secondary" onClick={handleSendOtp}>Resend</button>
                    <button className="btn" onClick={handleVerifyOtp}>Verify</button>
                </div>
            </div>
        )}

        {step === 'success' && (
            <div id="stepSuccess">
                <p className="success">Login successful!</p>
                <p>Redirecting you...</p>
            </div>
        )}

        <div className="auth-switch">
          {isLoginView ? (
            <p>Don't have an account? <span onClick={toggleView}>Sign Up</span></p>
          ) : (
            <p>Already have an account? <span onClick={toggleView}>Login</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;