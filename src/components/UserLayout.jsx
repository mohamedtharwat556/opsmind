import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import TopNav from './TopNav';
import AIAssistant from './AIAssistant';

const UserLayout = () => (
  <div className="app-layout">
    <UserSidebar />
    <div className="main-content">
      <TopNav />
      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
    <AIAssistant />
  </div>
);

export default UserLayout;
