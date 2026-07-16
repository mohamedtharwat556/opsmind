import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import TopNav from './TopNav';

const AdminLayout = () => (
  <div className="app-layout">
    <AdminSidebar />
    <div className="main-content">
      <TopNav />
      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AdminLayout;
