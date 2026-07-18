import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';
import { useToast } from './contexts/ToastContext';
import SkeletonLoader from './components/SkeletonLoader';

// Layouts
const UserLayout = lazy(() => import('./components/UserLayout'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));

// Shared
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));

// User Pages
const EmployeePortal = lazy(() => import('./pages/EmployeePortal'));
const KnowledgeBase = lazy(() => import('./pages/KnowledgeBase'));
const SOPs = lazy(() => import('./pages/SOPs'));
const Cases = lazy(() => import('./pages/Cases'));
const DocumentsLibrary = lazy(() => import('./pages/DocumentsLibrary'));
const Profile = lazy(() => import('./pages/Profile'));

// Admin Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Users'));
const Departments = lazy(() => import('./pages/Departments'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));

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
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><SkeletonLoader count={3} /></div>}>
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
    </Suspense>
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
