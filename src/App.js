import React, { useState, useEffect } from 'react';
import CarListing from './components/CarListing';
import Login from './components/Login';
import Layout from './components/Layout';
import AuthNav from './components/AuthNav';
import Home from './components/Home';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';

function App() {
  const [isAuth, setIsAuth] = useState(() => {
    return localStorage.getItem('isAuth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isAuth', isAuth);
  }, [isAuth]);

  return (
    <Routes>
      <Route element={<Layout isAuth={isAuth} setIsAuth={setIsAuth} />}>
        <Route path='/login' element={<Login setIsAuth={setIsAuth} />} />
        <Route path='/register' element={<Register />} />
        <Route path="/carlist" element={<AuthNav isAuth={isAuth}><CarListing /></AuthNav>} />
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;