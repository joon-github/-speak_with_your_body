import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div>
      <header>header</header>
      <main>
        <Outlet />
      </main>      
      <footer>footer</footer>
    </div>
  );
};

export default MainLayout;