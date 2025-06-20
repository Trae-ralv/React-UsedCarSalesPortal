import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../css/login.css';

function Login({ setIsAuth }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Load Facebook SDK
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: process.env.REACT_APP_FACEBOOK_APP_ID,
                cookie: true,
                xfbml: true,
                version: 'v19.0'
            });
        };
        

        // Check if Facebook JSSDK is found
        if (!document.getElementById('facebook-jssdk')) {
            // create <script>
            const script = document.createElement('script');
            // assign <script> value
            script.id = 'facebook-jssdk';
            script.src = 'https://connect.facebook.net/en_US/sdk.js';

            //assign to in the <head>
            document.head.appendChild(script);
        }
    }, []);// run only once


    const handleLogin = async (e) => {
        // Using Express to handle CRUD
        e.preventDefault();
        try {
            setLoading(true);
            setError('');

            const response = await axios.post('http://localhost:5000/api/users/login', {
                username,
                password
            });

            console.log('Login successful:', response.data);
            setIsAuth(true);
            navigate('/carlist', { replace: true });
        } catch (error) {
            console.error('Login error details:', error.response?.data);
            setError(error.response?.data?.error || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    // Handler for successful Google login
    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            console.log('Google user:', decoded);

            setIsAuth(true);
            navigate('/carlist', { replace: true });
        } catch (error) {
            setError('Google login failed');
            console.error('Google login error:', error);
        }
    };

    // Handler for failed Google login
    const handleGoogleLoginError = () => {
        setError('Google login was unsuccessful. Please try again.');
    };

    const handleFacebookLogin = () => {
        // Check if SDK Loaded
        if (!window.FB) {
            setError('Facebook SDK not loaded. Please try again.');
            return;
        }
        window.FB.login(
            function (response) {
                if (response.authResponse) {
                    //Get Fields from profile
                    window.FB.api('/me', { fields: 'name,email,picture' }, function (profile) {
                        console.log("Facebook:", profile)
                        setIsAuth(true);
                        navigate('/carlist', { replace: true });
                    });
                } else {
                    setError('Facebook login was unsuccessful. Please try again.');
                }
            },
            { scope: 'email,public_profile' }
        );
    };


    return (
        <div className="body-container prevent-select">
            {error && (
                <div className="alert alert-danger text-center alert-float" role="alert">
                    {error}
                </div>
            )}
            <div className="container-fluid content">
                <div className="container login-container">
                    <h2 className="text-center mb-5 mt-3">Login to Your Account</h2>
                    <form onSubmit={handleLogin}>
                        {/* Username Input */}
                        <div className="mb-4">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    name="username"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <label htmlFor="username">Username</label>
                            </div>
                        </div>
                        {/* Password Input */}
                        <div className="mb-4">
                            <div className="form-floating">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                            <div className="form-check mt-3 ms-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="show-password"
                                    checked={showPassword}
                                    onChange={toggleShowPassword}
                                />
                                <label className="form-check-label" htmlFor="show-password">
                                    Show Password
                                </label>
                            </div>
                        </div>
                        {/* Register Link */}
                        <div className="d-flex justify-content-between align-items-center">
                            <p>
                                Don't have an account?
                                <Link to="/register" className="btn btn-link">
                                    Register
                                </Link>
                            </p>
                        </div>
                        <div className='text-center'>
                            <button
                                type="submit"
                                className="btn btn-primary fw-bold w-50 py-2"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>
                    <div className="text-center my-3">
                        <div>or</div>
                        <div className="d-flex justify-content-center mt-2">
                            <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onError={handleGoogleLoginError}
                                useOneTap
                            />
                        </div>
                        <div className="d-flex justify-content-center mt-2">
                            <button
                                type="button"
                                className="btn btn-primary facebook-button"
                                onClick={handleFacebookLogin}
                            >
                                <FontAwesomeIcon icon="fa-brands fa-square-facebook" /> Log in with Facebook
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sub-container">
                <p className="ps-4">© 2025 XYZ Cars Pte. Ltd. All Rights Reserved</p>
            </div>
        </div>
    );
}

export default Login;

