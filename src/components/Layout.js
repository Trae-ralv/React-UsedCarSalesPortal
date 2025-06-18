import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout({ isAuth, setIsAuth }) {
  return (
    <div>
      <Header isAuth={isAuth} setIsAuth={setIsAuth} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;