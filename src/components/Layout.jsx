import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import AIAssistant from './AIAssistant';

const Layout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
      <AIAssistant />
    </div>
  );
};

export default Layout;
