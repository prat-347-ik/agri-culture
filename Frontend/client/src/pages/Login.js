import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [step, setStep] = useState('credentials'); // 'credentials', 'otp', 'success'
  
  // Form fields state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // OTP state
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [generatedOtp, setGeneratedOtp] = useState('');
  
  const navigate = useNavigate();

  const handleSendOtp = () => {
    // Validate inputs
    if (!isLoginView && !fullName.trim()) {
        alert('Please enter your full name');
        return;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert('Enter a valid 10-digit number');
      return;
    }

    const newOtp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(newOtp);
    alert(`DEBUG OTP: ${newOtp}`);
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp !== generatedOtp) {
      alert('Invalid OTP');
      return;
    }
    
    if (isLoginView) {
      // --- LOGIN FLOW ---
      localStorage.setItem('auth_verified', '1');
      localStorage.setItem('auth_phone', phone);
      // NOTE: In a real app, you would fetch user data here and save it.
      // We assume the profile is already in localStorage from a previous session.
      setStep('success');
      setTimeout(() => navigate('/home'), 1500);
    } else {
      // --- SIGN UP FLOW ---
      // In a real app, you would send fullName and phone to an API to create the user.
      alert('Sign up successful! Please log in to continue.');
      // After sign-up, we toggle back to the login view.
      toggleView();
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
    // Reset all form fields and state when toggling
    setFullName('');
    setPhone('');
    setOtp(new Array(6).fill(''));
    setStep('credentials');
  };

  return (
    <div className="auth-wrapper login-background">
      <div className="auth-card">
        <h2>{isLoginView ? 'Login' : 'Sign Up'}</h2>
        
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