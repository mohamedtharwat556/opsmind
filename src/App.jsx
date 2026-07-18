import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';
import { useToast } from './contexts/ToastContext';

// Layouts
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';

// Shared
import Landing from './pages/Landing';
import Login from './pages/Login';

// User Pages
import EmployeePortal from './pages/EmployeePortal';
import KnowledgeBase from './pages/KnowledgeBase';
import SOPs from './pages/SOPs';
import Cases from './pages/Cases';
import DocumentsLibrary from './pages/DocumentsLibrary';
import Profile from './pages/Profile';

// Admin Pages
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Departments from './pages/Departments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user.role !== 'المدير العام' && user.role !== 'رئيس قسم الهندسة') {
    return <Navigate to="/user" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      
      {/* User Routes */}
      <Route path="/user" element={<PrivateRoute><UserLayout /></PrivateRoute>}>
        <Route index element={<EmployeePortal />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="sops" element={<SOPs />} />
        <Route path="cases" element={<Cases />} />
        <Route path="documents" element={<DocumentsLibrary />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="departments" element={<Departments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

// ToastContainer wrapper
function ToastWrapper() {
  const { toasts, removeToast } = useToast();
  return <ToastContainer toasts={toasts} removeToast={removeToast} />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <NotificationProvider>
                <AppRoutes />
                <ToastWrapper />
              </NotificationProvider>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
