import React from 'react';
import logo from '../static/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Header({ isAuth, setIsAuth }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsAuth(false);
        localStorage.removeItem('isAuth');
        navigate('/', { replace: true }); // Changed to '/' to match your App.js routes
    };

    return (
        <nav className="navbar navbar-expand-lg shadow-sm p-0">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand ps-4 fw-bolder">
                    <img src={logo} className="App-logo" alt="logo" />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        {isAuth ? (
                            <>
                                <li className="nav-item px-4">
                                    <Link
                                        to="/"
                                        className="nav-link d-flex flex-column align-items-center px-3"
                                    >
                                        <FontAwesomeIcon icon="house" className="fs-5" />
                                        <span className="small mt-1">Home</span>
                                    </Link>
                                </li>
                                <li className="nav-item px-4">
                                    <Link
                                        to="/carlist"
                                        className="nav-link d-flex flex-column align-items-center px-3"
                                    >
                                        <FontAwesomeIcon icon="car" className="fs-5" />
                                        <span className="small mt-1">Car Listing</span>
                                    </Link>
                                </li>
                                <li className="nav-item ps-4 pe-5">
                                    <button
                                        onClick={handleLogout}
                                        className="nav-link d-flex flex-column align-items-center px-3 bg-transparent border-0"
                                    >
                                        <FontAwesomeIcon icon="right-from-bracket" className="fs-5" />
                                        <span className="small mt-1">Logout</span>
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item px-4">
                                    <Link
                                        to="/"
                                        className="nav-link d-flex flex-column align-items-center px-3"
                                    >
                                        <FontAwesomeIcon icon="house" className="fs-5" />
                                        <span className="small mt-1">Home</span>
                                    </Link>
                                </li>
                                <li className="nav-item px-4">
                                    <Link
                                        to="/login"
                                        className="nav-link d-flex flex-column align-items-center px-3"
                                    >
                                        <FontAwesomeIcon icon="right-to-bracket" className="fs-5" />
                                        <span className="small mt-1">Login</span>
                                    </Link>
                                </li>

                                <li className="nav-item ps-4 pe-5">
                                    <Link
                                        to="/register"
                                        className="nav-link d-flex flex-column align-items-center px-3"
                                    >
                                        <FontAwesomeIcon icon="fa-solid fa-user-plus" className="fs-5" />
                                        <span className="small mt-1">Register</span>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;