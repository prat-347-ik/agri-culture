import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
// Correctly imports the default export from axios.js as 'axiosPublic'
import {axiosPublic} from '../api/axios';
import './Login.css';

// API Endpoints
const ADMIN_LOGIN_URL = '/api/auth/admin/login';
const USER_LOGIN_URL = '/api/auth/login';
const USER_SIGNUP_URL = '/api/auth/signup';
const VERIFY_OTP_URL = '/api/auth/verify';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [authMode, setAuthMode] = useState('user'); // 'user' or 'admin'
    const [isLoginView, setIsLoginView] = useState(true); // For user mode: true = login, false = signup
    const [step, setStep] = useState('credentials'); // 'credentials', 'otp', 'success'
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState(''); // For admin login
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

        const endpoint = isLoginView ? USER_LOGIN_URL : USER_SIGNUP_URL;
        const payload = { phoneNumber: phone, ...(isLoginView ? {} : { fullName }) };

        try {
            const response = await axiosPublic.post(endpoint, JSON.stringify(payload), {
                headers: { 'Content-Type': 'application/json' }
            });
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
            const response = await axiosPublic.post(VERIFY_OTP_URL,
                JSON.stringify({ phoneNumber: phone, code: enteredOtp }),
                {
                    withCredentials: true // Essential for cookie-based sessions
                }
            );

            if (response.status === 200) {
                if (isLoginView) {
                    const { accessToken, user } = response.data;
                    login(accessToken, user); // Use login from context

                    setStep('success');
                    
                    // --- ADMIN/USER NAVIGATION ---
                    // Check role for navigation
                    if (user && user.role === 'admin') {
                        setTimeout(() => navigate('/admin'), 1500);
                    } else {
                        setTimeout(() => navigate('/home'), 1500);
                    }
                    // --- END NAVIGATION ---

                } else {
                    alert('Sign up successful! Please log in to continue.');
                    toggleUserView(); // Switch to login view after signup
                }
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
        }
    };

    // --- Admin Login Handler ---
    const handleAdminLogin = async (e) => {
        e.preventDefault();

        if (!/^\d{10}$/.test(phone)) {
            alert('Enter a valid 10-digit number');
            return;
        }
        if (!password) {
            alert('Please enter your password');
            return;
        }

        try {
            const response = await axiosPublic.post(ADMIN_LOGIN_URL,
                JSON.stringify({ phone, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            const { accessToken, user } = response.data;
            login(accessToken, user); // Use login from context

            setPhone('');
            setPassword('');

            // Navigate directly to admin page
            navigate('/admin', { replace: true });

        } catch (err) {
            console.error('Error in admin login:', err);
            if (err.response?.status === 400 || err.response?.status === 401) {
                alert('Invalid phone number or password.');
            } else if (err.response?.status === 403) {
                alert('You are not authorized as an admin.');
            } else {
                alert(err.response?.data?.message || 'Login failed. Please try again.');
            }
        }
    };

    // --- START: NEW/MODIFIED OTP HANDLERS ---

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false; // Only allow numbers
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // If a value was entered (not deleted) and it's not the last box, move forward
        if (element.value && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleOtpPaste = (e) => {
        const pasteData = e.clipboardData.getData('text');
        
        // Check if it's purely numeric and 6 digits
        if (/^\d{6}$/.test(pasteData)) {
            e.preventDefault(); // Stop the default paste
            const newOtp = pasteData.split('');
            setOtp(newOtp);
            
            // Focus the last input box
            const row = e.target.parentNode;
            if (row && row.lastChild && row.lastChild.focus) {
                 row.lastChild.focus();
            }
        }
        // If not 6 digits, let the default behavior happen
        // (e.g., pasting "1" into a box, which triggers onChange)
    };

    const handleOtpKeyDown = (e, index) => {
        const currentInput = e.target;
        
        // 1. Handle Enter key: Trigger verify
        if (e.key === 'Enter') {
            e.preventDefault();
            handleVerifyOtp();
            return;
        }

        // 2. Handle Backspace key: Move focus back and clear previous input
        if (e.key === 'Backspace') {
            // If the current input is empty and it's not the first input
            if (currentInput.value === '' && index > 0) {
                e.preventDefault(); // Prevent browser back navigation
                
                const prevInput = currentInput.previousSibling;
                
                if (prevInput && prevInput.focus) {
                    // Focus the previous input
                    prevInput.focus();
                    
                    // Erase the value *in the state* for the previous input
                    const newOtp = [...otp];
                    newOtp[index - 1] = '';
                    setOtp(newOtp);
                }
            }
        }
    };

    // --- END: NEW/MODIFIED OTP HANDLERS ---


    // Toggles between user login and user signup
    const toggleUserView = () => {
        setIsLoginView(!isLoginView);
        setFullName('');
        setPhone('');
        setOtp(new Array(6).fill(''));
        setStep('credentials');
    };

    // Toggles between user mode and admin mode
    const toggleAuthMode = (mode) => {
        setAuthMode(mode);
        setFullName('');
        setPhone('');
        setPassword('');
        setOtp(new Array(6).fill(''));
        setStep('credentials');
        setIsLoginView(true); // Reset to login view
    };

    // --- RENDER FUNCTIONS ---

    const renderUserForm = () => (
        <>
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
                                    // --- ADDED CHANGES ---
                                    onPaste={handleOtpPaste}
                                    onKeyDown={e => handleOtpKeyDown(e, index)}
                                    // --- END ADDED CHANGES ---
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
                    <p>Don't have an account? <span onClick={toggleUserView}>Sign Up</span></p>
                ) : (
                    <p>Already have an account? <span onClick={toggleUserView}>Login</span></p>
                )}
            </div>
        </>
    );

    const renderAdminForm = () => (
        <form onSubmit={handleAdminLogin}>
            <h2>Admin Login</h2>
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
            </div>
            <div className="form-field">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button className="btn" type="submit">Login</button>
        </form>
    );

    return (
        <div className="auth-wrapper login-background">
            <div className="auth-card">
                
                {authMode === 'user' ? renderUserForm() : renderAdminForm()}

                <div className="auth-switch">
                    {authMode === 'user' ? (
                        <p>Are you an admin? <span onClick={() => toggleAuthMode('admin')}>Admin Login</span></p>
                    ) : (
                        <p>Not an admin? <span onClick={() => toggleAuthMode('user')}>User Login</span></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;