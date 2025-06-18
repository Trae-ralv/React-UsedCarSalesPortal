import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/login.css';

function Login({ setIsAuth }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Using Service to Data Fetching from API
    // const handleLogin = async (e) => {
    //     e.preventDefault(); //prevent default autofill
    //     setError('');

    //     try {
    //         // Fetch users.json from raw GitHub URL
    //         const response = await axios.get(
    //             'https://raw.githubusercontent.com/Trae-ralv/MockDatabase/main/users.json'
    //         );
    //         const users = response.data;

    //         // Validate credentials against fetched users
    //         const user = users.find(
    //             (u) => u.username === username && u.password === password
    //         );

    //         if (user) {
    //             setIsAuth(true);
    //             navigate('/carlist', { replace: true });
    //         } else {
    //             setError('Invalid username or password');
    //         }
    //     } catch (error) {
    //         setError('Failed to fetch user data. Please try again.');
    //         console.error('Error fetching users:', error);
    //     }
    // };

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
                        {/* Register Navigation */}
                        <div className="d-flex justify-content-between align-items-center">
                            <p>
                                Don't have an account?
                                <Link to="/register" className="btn btn-link">
                                    Register
                                </Link>
                            </p>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="sub-container">
                <p className="ps-4">© 2025 XYZ Cars Pte. Ltd. All Rights Reserved</p>
            </div>
        </div>
    );
}

export default Login;