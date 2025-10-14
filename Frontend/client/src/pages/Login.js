import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Make sure you've created and populated this file

const Login = () => {
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'success'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [generatedOtp, setGeneratedOtp] = useState('');
  const navigate = useNavigate();
  const otpInputs = useRef([]);

  // Focus the first OTP input when the OTP step is shown
  useEffect(() => {
    if (step === 'otp') {
      otpInputs.current[0]?.focus();
    }
  }, [step]);

  const generateAndShowOtp = () => {
    const newOtp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(newOtp);
    // In a real app, you would send this OTP via SMS.
    // For this demo, we'll alert it.
    console.log('DEBUG OTP:', newOtp);
    alert(`OTP Sent: ${newOtp}`);
  };

  const handleSendOtp = () => {
    if (!/^\d{10}$/.test(phone)) {
      alert('Enter a valid 10-digit number');
      return;
    }
    localStorage.setItem('auth_phone', phone);
    generateAndShowOtp();
    setStep('otp');
  };

  const handleResendOtp = () => {
    // Clear the inputs before resending
    setOtp(new Array(6).fill(''));
    generateAndShowOtp();
    otpInputs.current[0]?.focus();
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      alert('Enter the 6-digit OTP');
      return;
    }
    if (enteredOtp !== generatedOtp) {
      alert('Invalid OTP');
      return;
    }
    localStorage.setItem('auth_verified', '1');
    setStep('success');
  };

  const handleOtpChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, '');
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input if a digit was entered
    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    // Move focus to the previous input on backspace if the current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <h1>Agri-Culture</h1>
        </div>
        <div className="header-right">
          <a href="#" className="login-link">Login</a>
          <select id="langSelect" className="lang-select" aria-label="Language">
            <option value="en">English</option>
            <option value="mr">मराठी</option>
          </select>
        </div>
      </header>

      <main className="content" style={{ height: 'calc(100vh - var(--header-height))' }}>
        <div className="auth-wrapper">
          <div className="auth-card">
            <h2>Login</h2>

            {step === 'phone' && (
              <div id="stepPhone">
                <div className="form-field">
                  <label>Phone Number</label>
                  <input
                    id="phoneInput"
                    type="tel"
                    inputMode="numeric"
                    maxLength="10"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                  <div className="otp-row" id="otpRow">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        ref={(el) => (otpInputs.current[index] = el)}
                      />
                    ))}
                  </div>
                  <div className="helper" id="otpHelper">OTP sent to your phone</div>
                </div>
                <div className="form-row">
                  <button className="btn secondary" onClick={handleResendOtp}>Resend</button>
                  <button className="btn" onClick={handleVerifyOtp}>Verify</button>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div id="stepSuccess">
                <div className="success-step-content">
                  <p className="success">Phone verified!</p>
// Inside the 'success' step JSX
                   <Link className="btn continue-btn" to="/">Continue</Link>                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;