import React from 'react';
import TopNav from './TopNav';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <TopNav />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;